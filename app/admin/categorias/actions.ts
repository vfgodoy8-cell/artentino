'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function createCategory(data: {
  name: string
  slug: string
  active: boolean
  wholesaleActive: boolean
  sortOrder: number
}) {
  await prisma.category.create({ data })
  revalidatePath('/admin/categorias')
}

export async function updateCategory(
  id: string,
  data: Partial<{
    name: string
    slug: string
    active: boolean
    wholesaleActive: boolean
    sortOrder: number
  }>,
) {
  await prisma.category.update({ where: { id }, data })
  revalidatePath('/admin/categorias')
}

export async function deleteCategories(ids: string[]) {
  await prisma.category.deleteMany({ where: { id: { in: ids } } })
  revalidatePath('/admin/categorias')
}
