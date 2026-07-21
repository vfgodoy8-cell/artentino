'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { sendEmail, orderStatusUpdateEmail } from '@/app/lib/email'

const VALID_STATUSES = ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'] as const
type OrderStatus = (typeof VALID_STATUSES)[number]

export async function updateOrderStatus(orderId: string, status: string) {
  if (!VALID_STATUSES.includes(status as OrderStatus)) {
    throw new Error('Estado inválido')
  }

  const order = await prisma.order.update({
    where: { id: orderId },
    data: { status: status as OrderStatus },
    include: { user: { select: { name: true, email: true } } },
  })

  revalidatePath('/admin/pedidos')
  revalidatePath(`/admin/pedidos/${orderId}`)

  if (status === 'SHIPPED' || status === 'DELIVERED') {
    try {
      const result = await sendEmail({
        to: order.user.email,
        subject: status === 'SHIPPED' ? 'Artentino — Tu pedido está en camino' : 'Artentino — Tu pedido fue entregado',
        html: orderStatusUpdateEmail({ name: order.user.name, orderId: order.id, status }),
      })
      if (result?.error) {
        console.error('[updateOrderStatus] resend error:', result.error)
        return { success: true, error: 'No se pudo enviar el email de notificación' }
      }
    } catch (error) {
      console.error('[updateOrderStatus] fallo al enviar email de notificación:', error)
      return { success: true, error: 'No se pudo enviar el email de notificación' }
    }
  }

  return { success: true }
}
