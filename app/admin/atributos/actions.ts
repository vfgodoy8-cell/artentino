'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

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
