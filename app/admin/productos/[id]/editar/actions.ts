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

// ─── Product stock (schema: Attribute → AttributeValue → ProductStock) ───────

function toTitleCase(s: string): string {
  return s
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .replace(/\B\w/g, (c) => c.toLowerCase())
}

export async function addStockVariant(
  productId: string,
  attributeName: string,
  valueInput: string,
): Promise<{
  ok: boolean
  error?: string
  attributeId?: string
  attributeName?: string
  attributeValueId?: string
  value?: string
}> {
  const attrName = attributeName.trim()
  const value = toTitleCase(valueInput)
  if (!attrName) return { ok: false, error: 'El nombre del atributo es requerido' }
  if (!value) return { ok: false, error: 'El valor no puede estar vacío' }

  // Find-or-create Attribute (case-insensitive, server-side)
  let attribute = await prisma.attribute.findFirst({
    where: { name: { equals: attrName, mode: 'insensitive' } },
  })
  if (!attribute) {
    try {
      attribute = await prisma.attribute.create({ data: { name: attrName } })
    } catch {
      // Race condition: another request created it; fetch it
      attribute = await prisma.attribute.findFirst({
        where: { name: { equals: attrName, mode: 'insensitive' } },
      })
      if (!attribute) return { ok: false, error: 'Error al crear el atributo' }
    }
  }

  // Find-or-create AttributeValue (case-insensitive, normalized to Title Case)
  let av = await prisma.attributeValue.findFirst({
    where: { attributeId: attribute.id, value: { equals: value, mode: 'insensitive' } },
  })
  if (!av) {
    try {
      av = await prisma.attributeValue.create({
        data: { attributeId: attribute.id, value },
      })
    } catch {
      av = await prisma.attributeValue.findFirst({
        where: { attributeId: attribute.id, value: { equals: value, mode: 'insensitive' } },
      })
      if (!av) return { ok: false, error: 'Error al crear el valor' }
    }
  }

  // Create ProductStock linked by FK
  try {
    await prisma.productStock.create({
      data: { productId, attributeId: attribute.id, attributeValueId: av.id, stock: 0 },
    })
  } catch {
    return { ok: false, error: 'Esa variante ya existe para este producto' }
  }

  revalidatePath(`/admin/productos/${productId}/editar`)
  return { ok: true, attributeId: attribute.id, attributeName: attribute.name, attributeValueId: av.id, value: av.value }
}

export async function updateProductStockQty(id: string, stock: number, productId: string) {
  await prisma.productStock.update({ where: { id }, data: { stock } })
  revalidatePath(`/admin/productos/${productId}/editar`)
}

export async function updateProductStockSortOrder(id: string, sortOrder: number, productId: string) {
  await prisma.productStock.update({ where: { id }, data: { sortOrder } })
  revalidatePath(`/admin/productos/${productId}/editar`)
}

export async function removeProductStock(id: string, productId: string) {
  await prisma.productStock.delete({ where: { id } })
  revalidatePath(`/admin/productos/${productId}/editar`)
}

export async function upsertGenericStock(
  productId: string,
  qty: number,
): Promise<{ ok: boolean; attributeId?: string; attributeValueId?: string }> {
  let attr = await prisma.attribute.findFirst({ where: { hidden: true } })
  if (!attr) {
    attr = await prisma.attribute.create({ data: { name: 'Genérico', hidden: true, active: true } })
  }
  let av = await prisma.attributeValue.findFirst({
    where: { attributeId: attr.id, value: { equals: 'único', mode: 'insensitive' } },
  })
  if (!av) {
    av = await prisma.attributeValue.create({ data: { attributeId: attr.id, value: 'único' } })
  }
  await prisma.productStock.upsert({
    where: { productId_attributeValueId: { productId, attributeValueId: av.id } },
    create: { productId, attributeId: attr.id, attributeValueId: av.id, stock: qty },
    update: { stock: qty },
  })
  revalidatePath(`/admin/productos/${productId}/editar`)
  return { ok: true, attributeId: attr.id, attributeValueId: av.id }
}

// ─── Images ──────────────────────────────────────────────────────────────────

export async function deleteProductImage(id: string, productId: string) {
  await prisma.productImage.delete({ where: { id } })
  revalidatePath(`/admin/productos/${productId}/editar`)
}

export async function assignImageColor(
  imageId: string,
  attributeValueId: string | null,
  productId: string,
) {
  await prisma.productImage.update({ where: { id: imageId }, data: { attributeValueId } })
  revalidatePath(`/admin/productos/${productId}/editar`)
}
