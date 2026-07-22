import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { sendEmail, arrepentimientoCustomerEmail, arrepentimientoAdminEmail } from '@/app/lib/email'
import { ADMIN_NOTIFICATION_EMAIL } from '@/app/lib/constants'
import { isWithinArrepentimientoWindow } from '@/app/lib/arrepentimiento'

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const { orderId, motivo } = await req.json()
  if (!orderId) {
    return NextResponse.json({ error: 'Falta el pedido' }, { status: 400 })
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { user: { select: { name: true, email: true } } },
  })

  if (!order || order.userId !== session.user.id) {
    return NextResponse.json({ error: 'Pedido no encontrado' }, { status: 404 })
  }

  if (!isWithinArrepentimientoWindow(order.deliveredAt)) {
    return NextResponse.json(
      { error: 'El plazo para ejercer el derecho de arrepentimiento ya venció' },
      { status: 400 },
    )
  }

  const existing = await prisma.arrepentimientoRequest.findFirst({ where: { orderId } })
  if (existing) {
    return NextResponse.json({ error: 'Ya existe una solicitud para este pedido' }, { status: 400 })
  }

  await prisma.arrepentimientoRequest.create({
    data: {
      orderId,
      userId: session.user.id,
      motivo: motivo?.trim() || null,
    },
  })

  sendEmail({
    to: order.user.email,
    subject: 'Artentino — Recibimos tu solicitud de arrepentimiento',
    html: arrepentimientoCustomerEmail({ name: order.user.name, orderId }),
  }).catch(() => {})

  if (ADMIN_NOTIFICATION_EMAIL) {
    sendEmail({
      to: ADMIN_NOTIFICATION_EMAIL,
      subject: 'Artentino — Nueva solicitud de arrepentimiento',
      html: arrepentimientoAdminEmail({
        orderId,
        customerName: order.user.name,
        customerEmail: order.user.email,
        motivo,
      }),
    }).catch(() => {})
  }

  return NextResponse.json({ success: true })
}
