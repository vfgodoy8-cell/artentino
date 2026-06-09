'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'

const VALID_STATUSES = ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'] as const
type OrderStatus = (typeof VALID_STATUSES)[number]

export async function updateOrderStatus(orderId: string, status: string) {
  if (!VALID_STATUSES.includes(status as OrderStatus)) {
    throw new Error('Estado inválido')
  }
  await prisma.order.update({
    where: { id: orderId },
    data: { status: status as OrderStatus },
  })
  revalidatePath('/admin/pedidos')
  revalidatePath(`/admin/pedidos/${orderId}`)
}
