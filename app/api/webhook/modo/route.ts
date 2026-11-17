import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { applyOrderConfirmedEffects } from '@/app/lib/orders/confirm-order'
import { verifyModoWebhook, getModoPaymentData } from '@/app/lib/modo'

// Webhook de MODO. Llegan todos los estados del payment request (CREATED, SCANNED,
// PROCESSING, ACCEPTED, REJECTED); solo ACCEPTED cambia algo acá. Un REJECTED no cancela la
// orden: el comprador puede reintentar con un payment request nuevo sobre la misma orden.
// MODO reintenta (3 veces, 2s/4s/8s) únicamente ante respuestas 5xx — por eso un error al
// procesar un ACCEPTED devuelve 500 y no 200.
export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null
  if (!body) return NextResponse.json({ error: 'Invalid body' }, { status: 400 })

  let payload
  try {
    payload = await verifyModoWebhook(body)
  } catch (err) {
    console.warn('[webhook] modo firma inválida:', err instanceof Error ? err.message : err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  const orderId = payload.message || payload.external_intention_id?.split('-')[0]
  console.log('[webhook] modo evento:', JSON.stringify({ status: payload.status, paymentRequestId: payload.id, orderId }))

  if (payload.status !== 'ACCEPTED' || !orderId) return NextResponse.json({ ok: true })

  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      select: { status: true, total: true, paymentMethod: true },
    })
    if (!order || order.paymentMethod !== 'modo') {
      console.warn('[webhook] modo ACCEPTED para orden inexistente o no-MODO:', orderId)
      return NextResponse.json({ ok: true })
    }
    if (order.status !== 'PENDING') return NextResponse.json({ ok: true })

    // Doble chequeo contra la API de MODO (además de la firma) y del monto cobrado: el
    // amount puede ser mayor que el total si hubo cuotas con interés, nunca menor.
    const data = await getModoPaymentData(payload.id)
    const paidAmount = Number(data.transaction_data?.amount ?? payload.amount ?? 0)
    if (data.status !== 'ACCEPTED' || paidAmount + 0.01 < Number(order.total)) {
      console.error('[webhook] modo pago no coincide con la orden:', JSON.stringify({ orderId, status: data.status, paidAmount, total: Number(order.total) }))
      return NextResponse.json({ ok: true })
    }

    // updateMany condicionado a PENDING: si llegan dos notificaciones en paralelo, solo una
    // confirma y dispara los efectos (Zipnova + mails).
    const { count } = await prisma.order.updateMany({
      where: { id: orderId, status: 'PENDING' },
      data: { status: 'CONFIRMED', paymentReference: payload.id },
    })
    if (count === 1) {
      await applyOrderConfirmedEffects(orderId)
      console.log('[webhook] modo orden confirmada:', orderId)
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[webhook] modo error procesando ACCEPTED:', err instanceof Error ? err.message : err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
