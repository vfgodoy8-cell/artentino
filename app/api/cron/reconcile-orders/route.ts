import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { applyOrderConfirmedEffects } from '@/app/lib/orders/confirm-order'
import { RECONCILE_MIN_AGE_HOURS, RECONCILE_CANCEL_AGE_HOURS } from '@/app/lib/constants'

const HOUR_MS = 60 * 60 * 1000

type MpPayment = { status: string }

// Red de contención para cuando el webhook de MP no llega a confirmar un pago (timeout,
// error puntual, etc.) — ver diagnóstico del pedido #O528HVJM. Corre una vez al día
// (vercel.ts — el plan Hobby de Vercel no permite crons más frecuentes que diarios):
// - Pedido PENDING con un payment `approved` en MP pero sin procesar acá → lo confirma,
//   con los mismos efectos secundarios que dispara el webhook (Zipnova + mails).
// - Pedido PENDING sin ningún payment en MP y ya viejo (RECONCILE_CANCEL_AGE_HOURS) →
//   se lo da por abandonado y se cancela.
// - Cualquier otro caso (payment pending/in_process/rejected, o todavía no tan viejo)
//   se deja como está para la próxima corrida.
async function searchMpPayments(orderId: string): Promise<MpPayment[]> {
  const url = `https://api.mercadopago.com/v1/payments/search?external_reference=${encodeURIComponent(orderId)}`
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}` },
  })
  if (!res.ok) throw new Error(`MP search respondió ${res.status}`)
  const json: { results?: MpPayment[] } = await res.json()
  return json.results ?? []
}

export async function GET(req: Request) {
  const authHeader = req.headers.get('authorization')
  if (!process.env.CRON_SECRET || authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
  }

  // Debug/test: acotar la corrida a una sola orden en vez de barrer todas las PENDING.
  const onlyOrderId = new URL(req.url).searchParams.get('orderId')

  const now = Date.now()
  const minAgeCutoff = new Date(now - RECONCILE_MIN_AGE_HOURS * HOUR_MS)

  const candidates = await prisma.order.findMany({
    where: {
      status: 'PENDING',
      paymentMethod: 'mercadopago',
      createdAt: { lte: minAgeCutoff },
      ...(onlyOrderId ? { id: onlyOrderId } : {}),
    },
    select: { id: true, createdAt: true },
  })

  let confirmed = 0
  let cancelled = 0
  let untouched = 0
  let errors = 0
  const details: Array<{ orderId: string; result: string }> = []

  for (const order of candidates) {
    try {
      const payments = await searchMpPayments(order.id)
      const approved = payments.find((p) => p.status === 'approved')

      if (approved) {
        await prisma.order.update({ where: { id: order.id }, data: { status: 'CONFIRMED' } })
        await applyOrderConfirmedEffects(order.id)
        confirmed++
        details.push({ orderId: order.id, result: 'confirmed' })
        continue
      }

      const ageMs = now - order.createdAt.getTime()
      if (payments.length === 0 && ageMs >= RECONCILE_CANCEL_AGE_HOURS * HOUR_MS) {
        await prisma.order.update({ where: { id: order.id }, data: { status: 'CANCELLED' } })
        cancelled++
        details.push({ orderId: order.id, result: 'cancelled' })
        continue
      }

      untouched++
      details.push({
        orderId: order.id,
        result: payments.length === 0 ? 'untouched (aun no llega al umbral de cancelacion)' : 'untouched (payment sin aprobar en MP)',
      })
    } catch (err) {
      errors++
      details.push({ orderId: order.id, result: `error: ${String(err)}` })
      console.error(`[reconcile-orders] fallo procesando orden ${order.id}:`, err)
    }
  }

  const summary = { reviewed: candidates.length, confirmed, cancelled, untouched, errors }
  console.log('[reconcile-orders] resumen:', JSON.stringify(summary), JSON.stringify(details))

  return NextResponse.json({ ok: true, ...summary, details })
}
