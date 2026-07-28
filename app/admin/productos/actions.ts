'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { auth } from '@/auth'
import { requireRole } from '@/app/lib/permissions'
import { logAudit } from '@/app/lib/audit'

export async function deleteProduct(id: string) {
  const session = await auth()
  requireRole(session, ['SUPERADMIN'])

  const product = await prisma.product.delete({ where: { id } })
  await logAudit({
    userId: session!.user.id,
    userEmail: session!.user.email!,
    action: 'delete',
    entity: 'Product',
    entityId: id,
    detail: { name: product.name },
  })
  revalidatePath('/admin/productos')
}

export async function updateProductSortOrder(id: string, sortOrder: number) {
  await prisma.product.update({ where: { id }, data: { sortOrder } })
  revalidatePath('/admin/productos')
  revalidatePath('/')
}

export async function updateProductActive(id: string, active: boolean) {
  const session = await auth()

  const product = await prisma.product.update({ where: { id }, data: { active } })
  if (session?.user) {
    await logAudit({
      userId: session.user.id,
      userEmail: session.user.email!,
      action: active ? 'activate' : 'deactivate',
      entity: 'Product',
      entityId: id,
      detail: { name: product.name, active },
    })
  }
  revalidatePath('/admin/productos')
  revalidatePath('/')
  revalidatePath('/catalogo')
}
