'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { auth } from '@/auth'
import { requireRole } from '@/app/lib/permissions'
import { logAudit } from '@/app/lib/audit'

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
  imageDriven: boolean
  position: number
  active: boolean
}) {
  const attribute = await prisma.attribute.create({ data })
  const session = await auth()
  if (session?.user) {
    await logAudit({ userId: session.user.id, userEmail: session.user.email!, action: 'create', entity: 'Attribute', entityId: attribute.id, detail: data })
  }
  revalidatePath('/admin/atributos')
}

export async function updateAttribute(
  id: string,
  data: Partial<{ name: string; filter: boolean; hidden: boolean; imageDriven: boolean; position: number; active: boolean }>,
) {
  await prisma.attribute.update({ where: { id }, data })
  const session = await auth()
  if (session?.user) {
    await logAudit({ userId: session.user.id, userEmail: session.user.email!, action: 'update', entity: 'Attribute', entityId: id, detail: data })
  }
  revalidatePath('/admin/atributos')
}

export async function inactivateAttributes(ids: string[]) {
  await prisma.attribute.updateMany({ where: { id: { in: ids } }, data: { active: false } })
  const session = await auth()
  if (session?.user) {
    await logAudit({ userId: session.user.id, userEmail: session.user.email!, action: 'deactivate', entity: 'Attribute', detail: { ids } })
  }
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
  const session = await auth()
  if (session?.user) {
    await logAudit({ userId: session.user.id, userEmail: session.user.email!, action: 'create', entity: 'AttributeValue', entityId: av.id, detail: { value } })
  }
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
  const session = await auth()
  if (session?.user) {
    await logAudit({ userId: session.user.id, userEmail: session.user.email!, action: 'update', entity: 'AttributeValue', entityId: id, detail: { value } })
  }
  revalidatePath('/admin/atributos')
  return { ok: true, value }
}

export async function deleteAttributeValue(
  id: string,
): Promise<{ ok: boolean; error?: string }> {
  const session = await auth()
  try {
    requireRole(session, ['SUPERADMIN'])
  } catch (err) {
    return { ok: false, error: (err as Error).message }
  }

  const inUse = await prisma.productStock.count({ where: { attributeValueId: id } })
  if (inUse > 0) {
    return {
      ok: false,
      error: `En uso en ${inUse} ítem${inUse > 1 ? 's' : ''} de stock. Eliminá el stock primero.`,
    }
  }
  const attributeValue = await prisma.attributeValue.delete({ where: { id } })
  await logAudit({ userId: session!.user.id, userEmail: session!.user.email!, action: 'delete', entity: 'AttributeValue', entityId: id, detail: { value: attributeValue.value } })
  revalidatePath('/admin/atributos')
  return { ok: true }
}
