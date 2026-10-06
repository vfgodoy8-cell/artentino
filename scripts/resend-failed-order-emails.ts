// Reenvía los mails de pedido que se perdieron mientras el dominio artentino.com.ar
// estuvo sin verificar en Resend (POST /emails devolvía 403).
//
// Uso:
//   npx tsx scripts/resend-failed-order-emails.ts --from 2026-10-05T00:00:00-03:00 --to 2026-10-06T15:26:00-03:00
//   npx tsx scripts/resend-failed-order-emails.ts --from ... --to ... --send
//
// Sin --send: dry-run (solo lectura, no manda nada).
// Con --send: manda el mail correspondiente a cada pedido elegible, con pausa entre envíos,
//             y al terminar manda UN resumen a info@artentino.com.
import 'dotenv/config'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../app/generated/prisma/client'
import { sendEmail, pickupCashEmail } from '../app/lib/email'
import { buildOrderConfirmationEmail } from '../app/lib/orders/confirm-order'
import { getSiteContact } from '../app/lib/site-contact'
import { CASH_DISCOUNT_PCT } from '../app/lib/constants'

const connectionString = process.env.DATABASE_URL
if (!connectionString) throw new Error('DATABASE_URL is not set')

const pool = new Pool({ connectionString })
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) })

const SEND_DELAY_MS = 600 // Resend free/trial: ~2 req/seg

type Args = { from: Date; to: Date; send: boolean }

function parseArgs(): Args {
  const argv = process.argv.slice(2)
  const get = (flag: string) => {
    const idx = argv.indexOf(flag)
    return idx === -1 ? undefined : argv[idx + 1]
  }

  const fromRaw = get('--from')
  const toRaw = get('--to')
  const send = argv.includes('--send')

  if (!fromRaw || !toRaw) {
    throw new Error('Uso: --from <ISO con zona horaria> --to <ISO con zona horaria> [--send]')
  }

  const from = new Date(fromRaw)
  const to = new Date(toRaw)
  if (Number.isNaN(from.getTime())) throw new Error(`--from inválido: ${fromRaw}`)
  if (Number.isNaN(to.getTime())) throw new Error(`--to inválido: ${toRaw}`)

  return { from, to, send }
}

type PlannedEmail = {
  orderId: string
  createdAt: Date
  status: string
  paymentMethod: string | null
  to: string
  total: number
  kind: 'cash-transfer' | 'mercadopago-confirmed' | 'skip'
  reason?: string
  subject?: string
  html?: string
}

async function planEmailForOrder(order: Awaited<ReturnType<typeof fetchOrders>>[number]): Promise<PlannedEmail> {
  const base = {
    orderId: order.id,
    createdAt: order.createdAt,
    status: order.status,
    paymentMethod: order.paymentMethod,
    to: order.contactEmail ?? order.user?.email ?? '',
    total: Number(order.total),
  }

  if (!order.contactEmail) {
    return { ...base, kind: 'skip', reason: 'sin contactEmail' }
  }

  if (order.paymentMethod === 'cash' || order.paymentMethod === 'transfer') {
    const contact = await getSiteContact()
    const html = pickupCashEmail({
      name: order.contactName ?? order.contactEmail,
      items: order.items.map((i) => ({
        name: i.product.name,
        quantity: i.quantity,
        price: Number(i.price),
        variantName: i.attributeValue?.value,
      })),
      total: Number(order.total),
      discountPct: CASH_DISCOUNT_PCT,
      paymentMethod: order.paymentMethod,
      shipping: (order.shippingMethod as 'pickup' | 'delivery') ?? 'pickup',
      pickupAddress: contact.addressLine1,
    })
    return {
      ...base,
      kind: 'cash-transfer',
      subject: 'Artentino — Pedido registrado',
      html,
    }
  }

  // MercadoPago: solo reenviar si el pedido efectivamente se confirmó.
  if (order.status === 'PENDING' || order.status === 'CANCELLED') {
    return { ...base, kind: 'skip', reason: `mercadopago en estado ${order.status}` }
  }

  const emailContent = await buildOrderConfirmationEmail(order)
  if (!emailContent) {
    return { ...base, kind: 'skip', reason: 'sin nombre de cliente' }
  }

  return {
    ...base,
    kind: 'mercadopago-confirmed',
    subject: emailContent.subject,
    html: emailContent.html,
  }
}

async function fetchOrders(from: Date, to: Date) {
  return prisma.order.findMany({
    where: { createdAt: { gte: from, lte: to } },
    orderBy: { createdAt: 'asc' },
    include: {
      items: {
        include: {
          product: { select: { name: true } },
          attributeValue: { select: { value: true } },
        },
      },
      user: { select: { name: true, email: true } },
    },
  })
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function main() {
  const { from, to, send } = parseArgs()

  console.log(`Ventana: ${from.toISOString()} → ${to.toISOString()}`)
  console.log(send ? 'Modo: ENVÍO REAL' : 'Modo: dry-run (no se manda nada)')
  console.log('')

  const orders = await fetchOrders(from, to)
  console.log(`Pedidos encontrados en la ventana: ${orders.length}`)
  console.log('')

  const planned: PlannedEmail[] = []
  for (const order of orders) {
    planned.push(await planEmailForOrder(order))
  }

  for (const p of planned) {
    const fecha = p.createdAt.toISOString()
    const resumen = `[${p.orderId}] ${fecha} · estado=${p.status} · medio=${p.paymentMethod ?? '(sin definir)'} · email=${p.to || '(sin email)'} · total=$${p.total.toLocaleString('es-AR')}`
    if (p.kind === 'skip') {
      console.log(`${resumen} → SKIP (${p.reason})`)
    } else {
      console.log(`${resumen} → ${p.kind === 'cash-transfer' ? 'mail "Pedido registrado"' : 'mail de confirmación de compra'} (asunto: "${p.subject}")`)
    }
  }

  const toSend = planned.filter((p) => p.kind !== 'skip')
  console.log('')
  console.log(`A reenviar: ${toSend.length} / Saltados: ${planned.length - toSend.length}`)

  if (!send) {
    console.log('')
    console.log('Dry-run: no se envió nada. Corré de nuevo con --send para enviar.')
    return
  }

  const ok: PlannedEmail[] = []
  const failed: Array<{ email: PlannedEmail; error: unknown }> = []

  for (const p of toSend) {
    if (!p.html || !p.subject) continue
    try {
      await sendEmail({ to: p.to, subject: p.subject, html: p.html })
      console.log(`[resend-failed-order-emails] OK ${p.orderId} → ${p.to}`)
      ok.push(p)
    } catch (error) {
      // sendEmail ya loguea el detalle (statusCode/mensaje de Resend) antes de tirar.
      console.error(`[resend-failed-order-emails] FALLÓ ${p.orderId} → ${p.to}:`, error)
      failed.push({ email: p, error })
    }
    await sleep(SEND_DELAY_MS)
  }

  console.log('')
  console.log(`Enviados OK: ${ok.length} / Fallidos: ${failed.length}`)
  if (failed.length > 0) {
    console.log('Detalle de fallidos:')
    for (const f of failed) {
      console.log(`  [${f.email.orderId}] ${f.email.to}: ${JSON.stringify(f.error)}`)
    }
  }

  if (ok.length > 0 || failed.length > 0) {
    const summaryRows = planned
      .map((p) => {
        const estadoEnvio =
          p.kind === 'skip' ? `omitido (${p.reason})` : ok.includes(p) ? 'enviado' : failed.some((f) => f.email === p) ? 'falló' : 'no procesado'
        return `<tr>
          <td style="padding:6px 8px;border-bottom:1px solid #eee;">${p.orderId}</td>
          <td style="padding:6px 8px;border-bottom:1px solid #eee;">${p.createdAt.toISOString()}</td>
          <td style="padding:6px 8px;border-bottom:1px solid #eee;">${p.to || '-'}</td>
          <td style="padding:6px 8px;border-bottom:1px solid #eee;">$${p.total.toLocaleString('es-AR')}</td>
          <td style="padding:6px 8px;border-bottom:1px solid #eee;">${estadoEnvio}</td>
        </tr>`
      })
      .join('')

    const summaryHtml = `<!DOCTYPE html><html lang="es"><body style="font-family:sans-serif;">
      <h2>Reenvío de mails de pedidos — ventana ${from.toISOString()} a ${to.toISOString()}</h2>
      <p>Enviados OK: ${ok.length} · Fallidos: ${failed.length} · Omitidos: ${planned.length - toSend.length}</p>
      <table style="border-collapse:collapse;width:100%;">
        <thead>
          <tr>
            <th style="text-align:left;padding:6px 8px;border-bottom:2px solid #ccc;">Pedido</th>
            <th style="text-align:left;padding:6px 8px;border-bottom:2px solid #ccc;">Fecha</th>
            <th style="text-align:left;padding:6px 8px;border-bottom:2px solid #ccc;">Email</th>
            <th style="text-align:left;padding:6px 8px;border-bottom:2px solid #ccc;">Total</th>
            <th style="text-align:left;padding:6px 8px;border-bottom:2px solid #ccc;">Resultado</th>
          </tr>
        </thead>
        <tbody>${summaryRows}</tbody>
      </table>
    </body></html>`

    try {
      await sendEmail({
        to: 'info@artentino.com',
        subject: `Reenvío de mails de pedidos — ${ok.length} OK / ${failed.length} fallidos`,
        html: summaryHtml,
      })
      console.log('Resumen enviado a info@artentino.com')
    } catch (error) {
      console.error('[resend-failed-order-emails] el resumen a info@ falló:', error)
    }
  }
}

main()
  .catch((err) => {
    console.error(err)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())
