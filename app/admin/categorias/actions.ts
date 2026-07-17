'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

type ActionResult<T> = { success: true; data: T } | { success: false; error: string }

function errorMessage(err: unknown, fallback: string): string {
  if (err && typeof err === 'object' && 'code' in err) {
    const code = (err as { code: string }).code
    if (code === 'P2002') return 'Ya existe un registro con ese slug.'
    if (code === 'P2025') return 'El registro ya no existe — puede que ya se haya eliminado.'
    if (code === 'P2003') return fallback
  }
  return fallback
}

// ─── Category (padre) ─────────────────────────────────────────────────────────

export async function createCategory(
  data: { name: string; slug: string; order: number },
): Promise<ActionResult<{ id: string }>> {
  try {
    const category = await prisma.category.create({ data })
    revalidatePath('/admin/categorias')
    revalidatePath('/')
    revalidatePath('/catalogo')
    return { success: true, data: category }
  } catch (err) {
    return { success: false, error: errorMessage(err, 'No se pudo crear la categoría.') }
  }
}

export async function updateCategory(
  id: string,
  data: Partial<{ name: string; slug: string; order: number }>,
): Promise<ActionResult<{ id: string }>> {
  try {
    const category = await prisma.category.update({ where: { id }, data })
    revalidatePath('/admin/categorias')
    revalidatePath('/')
    revalidatePath('/catalogo')
    return { success: true, data: category }
  } catch (err) {
    return { success: false, error: errorMessage(err, 'No se pudo guardar la categoría.') }
  }
}

export async function deleteCategory(id: string): Promise<ActionResult<null>> {
  try {
    await prisma.category.delete({ where: { id } })
    revalidatePath('/admin/categorias')
    revalidatePath('/')
    revalidatePath('/catalogo')
    return { success: true, data: null }
  } catch (err) {
    return {
      success: false,
      error: errorMessage(err, 'No se pudo eliminar: el grupo todavía tiene subcategorías.'),
    }
  }
}

export async function reorderCategories(orderedIds: string[]) {
  await prisma.$transaction(
    orderedIds.map((id, index) =>
      prisma.category.update({ where: { id }, data: { order: index } }),
    ),
  )
  revalidatePath('/admin/categorias')
  revalidatePath('/')
  revalidatePath('/catalogo')
}

// ─── Subcategory (hijo) ───────────────────────────────────────────────────────

export async function createSubcategory(
  data: { name: string; slug: string; order: number; categoryId: string },
): Promise<ActionResult<{ id: string }>> {
  try {
    const subcategory = await prisma.subcategory.create({ data })
    revalidatePath('/admin/categorias')
    revalidatePath('/catalogo')
    return { success: true, data: subcategory }
  } catch (err) {
    return { success: false, error: errorMessage(err, 'No se pudo crear la subcategoría.') }
  }
}

export async function updateSubcategory(
  id: string,
  data: Partial<{ name: string; slug: string; order: number; categoryId: string }>,
): Promise<ActionResult<{ id: string }>> {
  try {
    const subcategory = await prisma.subcategory.update({ where: { id }, data })
    revalidatePath('/admin/categorias')
    revalidatePath('/catalogo')
    return { success: true, data: subcategory }
  } catch (err) {
    return { success: false, error: errorMessage(err, 'No se pudo guardar la subcategoría.') }
  }
}

export async function deleteSubcategory(id: string): Promise<ActionResult<null>> {
  try {
    await prisma.subcategory.delete({ where: { id } })
    revalidatePath('/admin/categorias')
    revalidatePath('/catalogo')
    return { success: true, data: null }
  } catch (err) {
    return {
      success: false,
      error: errorMessage(err, 'No se pudo eliminar: todavía tiene productos asignados.'),
    }
  }
}

export async function reorderSubcategories(categoryId: string, orderedIds: string[]) {
  await prisma.$transaction(
    orderedIds.map((id, index) =>
      prisma.subcategory.updateMany({ where: { id, categoryId }, data: { order: index } }),
    ),
  )
  revalidatePath('/admin/categorias')
  revalidatePath('/catalogo')
}
