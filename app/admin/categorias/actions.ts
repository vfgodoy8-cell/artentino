'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { auth } from '@/auth'
import { requireRole } from '@/app/lib/permissions'
import { logAudit } from '@/app/lib/audit'

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
    const session = await auth()
    if (session?.user) {
      await logAudit({ userId: session.user.id, userEmail: session.user.email!, action: 'create', entity: 'Category', entityId: category.id, detail: data })
    }
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
    const session = await auth()
    if (session?.user) {
      await logAudit({ userId: session.user.id, userEmail: session.user.email!, action: 'update', entity: 'Category', entityId: id, detail: data })
    }
    revalidatePath('/admin/categorias')
    revalidatePath('/')
    revalidatePath('/catalogo')
    return { success: true, data: category }
  } catch (err) {
    return { success: false, error: errorMessage(err, 'No se pudo guardar la categoría.') }
  }
}

export async function deleteCategory(id: string): Promise<ActionResult<null>> {
  const session = await auth()
  try {
    requireRole(session, ['SUPERADMIN'])
  } catch (err) {
    return { success: false, error: (err as Error).message }
  }

  try {
    const category = await prisma.category.delete({ where: { id } })
    await logAudit({ userId: session!.user.id, userEmail: session!.user.email!, action: 'delete', entity: 'Category', entityId: id, detail: { name: category.name } })
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
    const session = await auth()
    if (session?.user) {
      await logAudit({ userId: session.user.id, userEmail: session.user.email!, action: 'create', entity: 'Subcategory', entityId: subcategory.id, detail: data })
    }
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
    const session = await auth()
    if (session?.user) {
      await logAudit({ userId: session.user.id, userEmail: session.user.email!, action: 'update', entity: 'Subcategory', entityId: id, detail: data })
    }
    revalidatePath('/admin/categorias')
    revalidatePath('/catalogo')
    return { success: true, data: subcategory }
  } catch (err) {
    return { success: false, error: errorMessage(err, 'No se pudo guardar la subcategoría.') }
  }
}

export async function deleteSubcategory(id: string): Promise<ActionResult<null>> {
  const session = await auth()
  try {
    requireRole(session, ['SUPERADMIN'])
  } catch (err) {
    return { success: false, error: (err as Error).message }
  }

  try {
    const subcategory = await prisma.subcategory.delete({ where: { id } })
    await logAudit({ userId: session!.user.id, userEmail: session!.user.email!, action: 'delete', entity: 'Subcategory', entityId: id, detail: { name: subcategory.name } })
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

// Mueve una subcategoría a otro grupo, insertándola en `newOrder` dentro del
// grupo destino, y recompacta el orden del grupo origen para no dejar huecos.
// El origen/destino se recalculan siempre desde la DB (no se confía en listas
// del cliente) para evitar corromper el orden ante estado desactualizado.
export async function moveSubcategory(
  subcategoryId: string,
  newCategoryId: string,
  newOrder: number,
): Promise<ActionResult<{ id: string }>> {
  try {
    const sub = await prisma.subcategory.findUnique({
      where: { id: subcategoryId },
      select: { categoryId: true },
    })
    if (!sub) return { success: false, error: 'La subcategoría ya no existe — puede que ya se haya eliminado.' }

    const oldCategoryId = sub.categoryId

    if (oldCategoryId === newCategoryId) {
      await prisma.subcategory.update({ where: { id: subcategoryId }, data: { order: newOrder } })
      revalidatePath('/admin/categorias')
      revalidatePath('/catalogo')
      return { success: true, data: { id: subcategoryId } }
    }

    const [oldSiblings, newSiblings] = await Promise.all([
      prisma.subcategory.findMany({
        where: { categoryId: oldCategoryId, NOT: { id: subcategoryId } },
        orderBy: { order: 'asc' },
        select: { id: true },
      }),
      prisma.subcategory.findMany({
        where: { categoryId: newCategoryId, NOT: { id: subcategoryId } },
        orderBy: { order: 'asc' },
        select: { id: true },
      }),
    ])

    const clampedIndex = Math.max(0, Math.min(newOrder, newSiblings.length))
    const newGroupIds = newSiblings.map((s) => s.id)
    newGroupIds.splice(clampedIndex, 0, subcategoryId)

    await prisma.$transaction([
      ...newGroupIds.map((id, index) =>
        id === subcategoryId
          ? prisma.subcategory.update({ where: { id }, data: { categoryId: newCategoryId, order: index } })
          : prisma.subcategory.update({ where: { id }, data: { order: index } }),
      ),
      ...oldSiblings.map((s, index) =>
        prisma.subcategory.update({ where: { id: s.id }, data: { order: index } }),
      ),
    ])

    revalidatePath('/admin/categorias')
    revalidatePath('/catalogo')
    return { success: true, data: { id: subcategoryId } }
  } catch (err) {
    return { success: false, error: errorMessage(err, 'No se pudo mover la subcategoría.') }
  }
}
