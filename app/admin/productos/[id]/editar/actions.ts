'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

// ─── Product info ────────────────────────────────────────────────────────────

export async function updateProductInfo(
  id: string,
  data: {
    name: string
    stock: number
    categoryId: string
    conditionId: string | null
    description: string
    additionalData: string
    price: number
    comparePrice: number | null
    cost: number | null
    videoUrl: string
    showPrice: boolean
    active: boolean
    sortOrder: number
    height: number | null
    width: number | null
    length: number | null
    weight: number | null
  },
) {
  await prisma.product.update({
    where: { id },
    data: {
      name: data.name,
      stock: data.stock,
      categoryId: data.categoryId,
      conditionId: data.conditionId || null,
      description: data.description || null,
      additionalData: data.additionalData || null,
      price: data.price,
      comparePrice: data.comparePrice,
      cost: data.cost,
      videoUrl: data.videoUrl || null,
      showPrice: data.showPrice,
      active: data.active,
      sortOrder: data.sortOrder,
      height: data.height,
      width: data.width,
      length: data.length,
      weight: data.weight,
    },
  })
  revalidatePath('/admin/productos')
  revalidatePath(`/admin/productos/${id}/editar`)
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

// ─── Product attributes ──────────────────────────────────────────────────────

export async function addProductAttributeValue(
  productId: string,
  attributeId: string,
  value: string,
): Promise<{ ok: boolean; error?: string }> {
  value = value.trim()
  if (!value) return { ok: false, error: 'El valor no puede estar vacío' }

  let attrValue = await prisma.attributeValue.findFirst({
    where: { attributeId, value },
  })
  if (!attrValue) {
    attrValue = await prisma.attributeValue.create({ data: { attributeId, value } })
  }

  try {
    await prisma.productAttribute.create({
      data: { productId, attributeValueId: attrValue.id },
    })
  } catch {
    return { ok: false, error: 'Ese valor ya está asignado a este producto' }
  }

  revalidatePath(`/admin/productos/${productId}/editar`)
  return { ok: true }
}

export async function removeProductAttribute(id: string, productId: string) {
  await prisma.productAttribute.delete({ where: { id } })
  revalidatePath(`/admin/productos/${productId}/editar`)
}

// ─── Product stock ───────────────────────────────────────────────────────────

export async function addProductStock(
  productId: string,
  attributeId: string,
  value: string,
  sortOrder: number,
): Promise<{ ok: boolean; error?: string }> {
  value = value.trim()
  if (!value) return { ok: false, error: 'El valor no puede estar vacío' }

  let attrValue = await prisma.attributeValue.findFirst({
    where: { attributeId, value },
  })
  if (!attrValue) {
    attrValue = await prisma.attributeValue.create({ data: { attributeId, value } })
  }

  try {
    await prisma.productStock.create({
      data: { productId, attributeValueId: attrValue.id, stock: 0, sortOrder },
    })
  } catch {
    return { ok: false, error: 'Ese atributo ya tiene stock definido para este producto' }
  }

  revalidatePath(`/admin/productos/${productId}/editar`)
  return { ok: true }
}

export async function updateProductStockQty(id: string, stock: number, productId: string) {
  await prisma.productStock.update({ where: { id }, data: { stock } })
  revalidatePath(`/admin/productos/${productId}/editar`)
}

export async function removeProductStock(id: string, productId: string) {
  await prisma.productStock.delete({ where: { id } })
  revalidatePath(`/admin/productos/${productId}/editar`)
}

// ─── Images ──────────────────────────────────────────────────────────────────

export async function deleteProductImage(id: string, productId: string) {
  await prisma.productImage.delete({ where: { id } })
  revalidatePath(`/admin/productos/${productId}/editar`)
}
