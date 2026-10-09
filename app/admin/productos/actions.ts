'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { auth } from '@/auth'
import { requireRole } from '@/app/lib/permissions'
import { logAudit } from '@/app/lib/audit'

type DeleteProductResult = { success: boolean; error?: string; archived?: boolean }

// Si el producto tiene OrderItem asociados, el delete real falla con P2003 (FK Restrict
// — OrderItem.product es la única relación hacia Product sin onDelete: Cascade, a
// propósito: no queremos perder el historial de qué se vendió). En ese caso lo archivamos
// en lugar de borrarlo: desaparece del catálogo/búsqueda pero los pedidos existentes
// siguen mostrando su nombre e imagen sin romperse.
export async function deleteProduct(id: string): Promise<DeleteProductResult> {
  const session = await auth()
  try {
    requireRole(session, ['SUPERADMIN'])
  } catch (err) {
    return { success: false, error: (err as Error).message }
  }

  try {
    const orderItemCount = await prisma.orderItem.count({ where: { productId: id } })

    if (orderItemCount === 0) {
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
      return { success: true }
    }

    const product = await prisma.product.update({
      where: { id },
      data: { archivedAt: new Date(), active: false },
    })
    await logAudit({
      userId: session!.user.id,
      userEmail: session!.user.email!,
      action: 'archive',
      entity: 'Product',
      entityId: id,
      detail: { name: product.name, orderItemCount },
    })
    revalidatePath('/admin/productos')
    revalidatePath('/')
    revalidatePath('/catalogo')
    return { success: true, archived: true }
  } catch (err) {
    console.error('[deleteProduct] error:', err)
    return { success: false, error: 'No se pudo eliminar el producto' }
  }
}

export async function restoreProduct(id: string): Promise<DeleteProductResult> {
  const session = await auth()
  try {
    requireRole(session, ['SUPERADMIN'])
  } catch (err) {
    return { success: false, error: (err as Error).message }
  }

  try {
    const product = await prisma.product.update({
      where: { id },
      data: { archivedAt: null, active: true },
    })
    await logAudit({
      userId: session!.user.id,
      userEmail: session!.user.email!,
      action: 'restore',
      entity: 'Product',
      entityId: id,
      detail: { name: product.name },
    })
    revalidatePath('/admin/productos')
    revalidatePath('/')
    revalidatePath('/catalogo')
    return { success: true }
  } catch (err) {
    console.error('[restoreProduct] error:', err)
    return { success: false, error: 'No se pudo restaurar el producto' }
  }
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
