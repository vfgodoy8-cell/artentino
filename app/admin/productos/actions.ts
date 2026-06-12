'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function deleteProduct(id: string) {
  await prisma.product.delete({ where: { id } })
  revalidatePath('/admin/productos')
}

export async function updateProductSortOrder(id: string, sortOrder: number) {
  await prisma.product.update({ where: { id }, data: { sortOrder } })
  revalidatePath('/admin/productos')
  revalidatePath('/')
}

export async function updateProductActive(id: string, active: boolean) {
  await prisma.product.update({ where: { id }, data: { active } })
  revalidatePath('/admin/productos')
  revalidatePath('/')
  revalidatePath('/catalogo')
}
