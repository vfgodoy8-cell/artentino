import { NextResponse } from 'next/server'
import { MercadoPagoConfig, Payment } from 'mercadopago'
import { prisma } from '@/lib/prisma'
import { sendEmail, purchaseConfirmationEmail, interpolate } from '@/app/lib/email'
import { triggerZipnovaShipmentIfNeeded } from '@/app/lib/shipping/zipnova'

const MP_STATUS_MAP: Record<string, 'CONFIRMED' | 'CANCELLED'> = {
  approved: 'CONFIRMED',
  rejected: 'CANCELLED',
  cancelled: 'CANCELLED',
  refunded: 'CANCELLED',
  charged_back: 'CANCELLED',
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null)
  if (!body) return NextResponse.json({ ok: true })

  const { type, data } = body as { type?: string; data?: { id?: string | number } }

  if (type !== 'payment' || !data?.id) {
    return NextResponse.json({ ok: true })
  }

  try {
    const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN! })
    const paymentClient = new Payment(client)
    const payment = await paymentClient.get({ id: String(data.id) })

    const orderId = payment.external_reference
    const mpStatus = payment.status

    if (!orderId || !mpStatus) return NextResponse.json({ ok: true })

    const newStatus = MP_STATUS_MAP[mpStatus]
    if (!newStatus) return NextResponse.json({ ok: true })

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: { include: { product: { select: { name: true } } } },
        user: { select: { name: true, email: true } },
      },
    })

    if (!order) return NextResponse.json({ ok: true })
    if (order.status === newStatus) return NextResponse.json({ ok: true })

    await prisma.order.update({
      where: { id: orderId },
      data: { status: newStatus },
    })

    if (newStatus === 'CONFIRMED') {
      await triggerZipnovaShipmentIfNeeded(orderId)

      const customerName = order.contactName ?? order.user?.name
      const customerEmail = order.contactEmail ?? order.user?.email

      if (!customerName || !customerEmail) return NextResponse.json({ ok: true })

      const shippingLabel =
        order.shippingMethod === 'pickup'
          ? 'Retiro en tienda — Av. Corrientes 5022, CABA'
          : 'Envío a domicilio'

      const itemsData = order.items.map((i) => ({
        name: i.product.name,
        quantity: i.quantity,
        price: Number(i.price),
      }))

      // Fire-and-forget: look up DB template, fall back to hardcoded HTML
      ;(async () => {
        try {
          const template = await prisma.emailTemplate.findUnique({
            where: { key: 'ORDER_PRE_CONFIRMATION' },
          })

          const html = template
            ? interpolate(template.htmlBody, {
                nombreCliente: customerName,
                itemsHtml: itemsData
                  .map(
                    (item) =>
                      `<tr>
                        <td style="padding:10px 0;color:#1E1E1E;border-bottom:1px solid #eee;">${item.name}</td>
                        <td style="padding:10px 0;color:#888;text-align:center;border-bottom:1px solid #eee;">×${item.quantity}</td>
                        <td style="padding:10px 0;color:#1E1E1E;font-weight:700;text-align:right;border-bottom:1px solid #eee;">$${(item.price * item.quantity).toLocaleString('es-AR')}</td>
                      </tr>`,
                  )
                  .join(''),
                total: Number(order.total).toLocaleString('es-AR'),
                envio: shippingLabel,
              })
            : purchaseConfirmationEmail({
                name: customerName,
                items: itemsData,
                total: Number(order.total),
                shipping: (order.shippingMethod as 'pickup' | 'delivery') ?? 'pickup',
              })

          const subject = template?.subject ?? '¡Gracias por tu compra en Artentino!'

          // Independientes entre sí — si uno falla, el otro tiene que intentar igual.
          await sendEmail({ to: customerEmail, subject, html }).catch((err) => {
            console.error('[webhook] email al cliente falló:', err)
          })

          await sendEmail({
            to: 'info@artentino.com.ar',
            subject: `Nuevo pedido — ${customerName} — $${Number(order.total).toLocaleString('es-AR')}`,
            html,
          }).catch((err) => {
            console.error('[webhook] copia a info@ falló:', err)
          })
        } catch (err) {
          console.error('[webhook] email failed:', err)
        }
      })()
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[webhook] mercadopago error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
