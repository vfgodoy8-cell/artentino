'use server'

import { prisma } from '@/lib/prisma'
import { sendEmail, arrepentimientoCustomerEmail, arrepentimientoAdminEmail } from '@/app/lib/email'
import { ADMIN_NOTIFICATION_EMAIL } from '@/app/lib/constants'

type SubmitArrepentimientoInput = {
  orderNumber: string
  email: string
  motivo?: string
}

export async function submitArrepentimiento({ orderNumber, email, motivo }: SubmitArrepentimientoInput) {
  const code = orderNumber?.trim().replace(/^#/, '').toLowerCase()
  const contactEmail = email?.trim()

  if (!code || !contactEmail) {
    return { success: false, error: 'Faltan datos requeridos' }
  }

  try {
    const order = await prisma.order.findFirst({
      where: { id: { endsWith: code } },
      include: { user: { select: { name: true } } },
    })

    if (!order) {
      return { success: false, error: 'No encontramos un pedido con ese número. Revisalo e intentá de nuevo.' }
    }

    const customerName = order.contactName ?? order.user?.name ?? 'Cliente'

    await prisma.arrepentimientoRequest.create({
      data: {
        orderId: order.id,
        contactEmail,
        motivo: motivo?.trim() || null,
      },
    })

    sendEmail({
      to: contactEmail,
      subject: 'Artentino — Recibimos tu solicitud de arrepentimiento',
      html: arrepentimientoCustomerEmail({ name: customerName, orderId: order.id }),
    }).catch(() => {})

    if (ADMIN_NOTIFICATION_EMAIL) {
      sendEmail({
        to: ADMIN_NOTIFICATION_EMAIL,
        subject: 'Artentino — Nueva solicitud de arrepentimiento',
        html: arrepentimientoAdminEmail({
          orderId: order.id,
          customerName,
          customerEmail: contactEmail,
          motivo,
        }),
      }).catch(() => {})
    }

    return { success: true }
  } catch (error) {
    console.error('[arrepentimiento] error al procesar la solicitud:', error)
    return { success: false, error: 'No pudimos procesar tu solicitud. Intentá de nuevo en unos minutos.' }
  }
}
