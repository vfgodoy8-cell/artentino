'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

function toTitleCase(s: string): string {
  return s
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .replace(/\B\w/g, (c) => c.toLowerCase())
}

export async function createAttribute(data: {
  name: string
  filter: boolean
  hidden: boolean
  position: number
  active: boolean
}) {
  await prisma.attribute.create({ data })
  revalidatePath('/admin/atributos')
}

export async function updateAttribute(
  id: string,
  data: Partial<{ name: string; filter: boolean; hidden: boolean; position: number; active: boolean }>,
) {
  await prisma.attribute.update({ where: { id }, data })
  revalidatePath('/admin/atributos')
}

export async function inactivateAttributes(ids: string[]) {
  await prisma.attribute.updateMany({ where: { id: { in: ids } }, data: { active: false } })
  revalidatePath('/admin/atributos')
}

// ─── AttributeValue CRUD ──────────────────────────────────────────────────────

export async function createAttributeValue(
  attributeId: string,
  valueInput: string,
): Promise<{ ok: boolean; error?: string; id?: string; value?: string }> {
  const value = toTitleCase(valueInput)
  if (!value) return { ok: false, error: 'El valor no puede estar vacío' }

  const existing = await prisma.attributeValue.findFirst({
    where: { attributeId, value: { equals: value, mode: 'insensitive' } },
  })
  if (existing) return { ok: false, error: `Ya existe "${existing.value}"` }

  const av = await prisma.attributeValue.create({ data: { attributeId, value } })
  revalidatePath('/admin/atributos')
  return { ok: true, id: av.id, value: av.value }
}

export async function updateAttributeValue(
  id: string,
  attributeId: string,
  valueInput: string,
): Promise<{ ok: boolean; error?: string; value?: string }> {
  const value = toTitleCase(valueInput)
  if (!value) return { ok: false, error: 'El valor no puede estar vacío' }

  const conflict = await prisma.attributeValue.findFirst({
    where: { attributeId, value: { equals: value, mode: 'insensitive' }, NOT: { id } },
  })
  if (conflict) return { ok: false, error: `Ya existe "${conflict.value}"` }

  await prisma.attributeValue.update({ where: { id }, data: { value } })
  revalidatePath('/admin/atributos')
  return { ok: true, value }
}

export async function deleteAttributeValue(
  id: string,
): Promise<{ ok: boolean; error?: string }> {
  const inUse = await prisma.productStock.count({ where: { attributeValueId: id } })
  if (inUse > 0) {
    return {
      ok: false,
      error: `En uso en ${inUse} ítem${inUse > 1 ? 's' : ''} de stock. Eliminá el stock primero.`,
    }
  }
  await prisma.attributeValue.delete({ where: { id } })
  revalidatePath('/admin/atributos')
  return { ok: true }
}
