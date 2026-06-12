import { NextResponse } from 'next/server'
import { MercadoPagoConfig, Payment } from 'mercadopago'
import { prisma } from '@/lib/prisma'
import { sendEmail, purchaseConfirmationEmail } from '@/app/lib/email'

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
    // Idempotency: skip if already in target status
    if (order.status === newStatus) return NextResponse.json({ ok: true })

    await prisma.order.update({
      where: { id: orderId },
      data: { status: newStatus },
    })

    if (newStatus === 'CONFIRMED') {
      sendEmail({
        to: order.user.email,
        subject: '¡Gracias por tu compra en Artentino!',
        html: purchaseConfirmationEmail({
          name: order.user.name,
          items: order.items.map((i) => ({
            name: i.product.name,
            quantity: i.quantity,
            price: Number(i.price),
          })),
          total: Number(order.total),
          shipping: (order.shippingMethod as 'pickup' | 'delivery') ?? 'pickup',
        }),
      }).catch((err) => console.error('[webhook] email failed:', err))
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[webhook] mercadopago error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
