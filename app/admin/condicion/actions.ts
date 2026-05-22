'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function createCondition(data: { name: string; colorClass: string }) {
  await prisma.condition.create({ data })
  revalidatePath('/admin/condicion')
}

export async function updateCondition(id: string, data: { name?: string; colorClass?: string }) {
  await prisma.condition.update({ where: { id }, data })
  revalidatePath('/admin/condicion')
}

export async function deleteCondition(id: string) {
  await prisma.condition.delete({ where: { id } })
  revalidatePath('/admin/condicion')
}
