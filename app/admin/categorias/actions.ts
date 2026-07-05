'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

// ─── Category (padre) ─────────────────────────────────────────────────────────

export async function createCategory(data: { name: string; slug: string; order: number }) {
  await prisma.category.create({ data })
  revalidatePath('/admin/categorias')
  revalidatePath('/')
  revalidatePath('/catalogo')
}

export async function updateCategory(id: string, data: Partial<{ name: string; slug: string; order: number }>) {
  await prisma.category.update({ where: { id }, data })
  revalidatePath('/admin/categorias')
  revalidatePath('/')
  revalidatePath('/catalogo')
}

export async function deleteCategory(id: string) {
  await prisma.category.delete({ where: { id } })
  revalidatePath('/admin/categorias')
  revalidatePath('/')
  revalidatePath('/catalogo')
}

// ─── Subcategory (hijo) ───────────────────────────────────────────────────────

export async function createSubcategory(data: { name: string; slug: string; order: number; categoryId: string }) {
  await prisma.subcategory.create({ data })
  revalidatePath('/admin/categorias')
  revalidatePath('/catalogo')
}

export async function updateSubcategory(
  id: string,
  data: Partial<{ name: string; slug: string; order: number; categoryId: string }>,
) {
  await prisma.subcategory.update({ where: { id }, data })
  revalidatePath('/admin/categorias')
  revalidatePath('/catalogo')
}

export async function deleteSubcategory(id: string) {
  await prisma.subcategory.delete({ where: { id } })
  revalidatePath('/admin/categorias')
  revalidatePath('/catalogo')
}
