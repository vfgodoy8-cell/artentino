'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

// ─── Product info ────────────────────────────────────────────────────────────

export async function updateProductInfo(
  id: string,
  data: {
    name: string
    categoryId: string
    description: string
    additionalData: string
    price: number
    comparePrice: number | null
    cost: number | null
    videoUrl: string
    active: boolean
    height: number | null
    width: number | null
    length: number | null
    weight: number | null
  },
  slug: string,
) {
  await prisma.product.update({
    where: { id },
    data: {
      name: data.name,
      categoryId: data.categoryId,
      description: data.description || null,
      additionalData: data.additionalData || null,
      price: data.price,
      comparePrice: data.comparePrice,
      cost: data.cost,
      videoUrl: data.videoUrl || null,
      active: data.active,
      height: data.height,
      width: data.width,
      length: data.length,
      weight: data.weight,
    },
  })
  revalidatePath('/admin/productos')
  revalidatePath(`/admin/productos/${id}/editar`)
  revalidatePath('/')
  revalidatePath('/catalogo')
  revalidatePath(`/catalogo/${slug}`)
}

// ─── Combo prices ────────────────────────────────────────────────────────────

export async function replaceComboP(
  productId: string,
  rows: { price: number; quantity: number; startDate: string; endDate: string }[],
) {
  await prisma.productComboPrice.deleteMany({ where: { productId } })
  const valid = rows.filter((r) => r.price > 0 && r.quantity > 0)
  if (valid.length > 0) {
    await prisma.productComboPrice.createMany({
      data: valid.map((r) => ({
        productId,
        price: r.price,
        quantity: r.quantity,
        startDate: r.startDate ? new Date(r.startDate) : null,
        endDate: r.endDate ? new Date(r.endDate) : null,
      })),
    })
  }
  revalidatePath(`/admin/productos/${productId}/editar`)
}

// ─── Product stock (new schema: attributeId + value text) ────────────────────

export async function addProductStock(
  productId: string,
  attributeId: string,
  value: string,
): Promise<{ ok: boolean; error?: string }> {
  value = value.trim()
  if (!value) return { ok: false, error: 'El valor no puede estar vacío' }

  try {
    await prisma.productStock.create({
      data: { productId, attributeId, value, stock: 0 },
    })
  } catch {
    return { ok: false, error: 'Esa combinación ya existe para este producto' }
  }

  revalidatePath(`/admin/productos/${productId}/editar`)
  return { ok: true }
}

export async function createAttributeAndStock(
  productId: string,
  attributeName: string,
  value: string,
): Promise<{ ok: boolean; error?: string; attributeId?: string; attributeName?: string }> {
  attributeName = attributeName.trim()
  value = value.trim()
  if (!attributeName) return { ok: false, error: 'El nombre del atributo es requerido' }
  if (!value) return { ok: false, error: 'El valor no puede estar vacío' }

  const attribute = await prisma.attribute.create({ data: { name: attributeName } })

  try {
    await prisma.productStock.create({
      data: { productId, attributeId: attribute.id, value, stock: 0 },
    })
  } catch {
    return { ok: false, error: 'Error al crear el stock' }
  }

  revalidatePath(`/admin/productos/${productId}/editar`)
  return { ok: true, attributeId: attribute.id, attributeName: attribute.name }
}

export async function updateProductStockQty(id: string, stock: number, productId: string) {
  await prisma.productStock.update({ where: { id }, data: { stock } })
  revalidatePath(`/admin/productos/${productId}/editar`)
}

export async function removeProductStock(id: string, productId: string) {
  await prisma.productStock.delete({ where: { id } })
  revalidatePath(`/admin/productos/${productId}/editar`)
}

export async function upsertGenericStock(
  productId: string,
  qty: number,
): Promise<{ ok: boolean; attributeId?: string }> {
  let attr = await prisma.attribute.findFirst({ where: { hidden: true } })
  if (!attr) {
    attr = await prisma.attribute.create({ data: { name: 'Genérico', hidden: true, active: true } })
  }
  await prisma.productStock.upsert({
    where: { productId_attributeId_value: { productId, attributeId: attr.id, value: 'único' } },
    create: { productId, attributeId: attr.id, value: 'único', stock: qty },
    update: { stock: qty },
  })
  revalidatePath(`/admin/productos/${productId}/editar`)
  return { ok: true, attributeId: attr.id }
}

// ─── Images ──────────────────────────────────────────────────────────────────

export async function deleteProductImage(id: string, productId: string) {
  await prisma.productImage.delete({ where: { id } })
  revalidatePath(`/admin/productos/${productId}/editar`)
}
