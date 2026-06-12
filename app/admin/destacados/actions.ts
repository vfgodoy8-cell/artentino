'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function addDestacado(id: string) {
  await prisma.product.update({ where: { id }, data: { featured: true } })
  revalidatePath('/admin/destacados')
  revalidatePath('/')
}

export async function removeDestacado(id: string) {
  await prisma.product.update({ where: { id }, data: { featured: false } })
  revalidatePath('/admin/destacados')
  revalidatePath('/')
}

export async function updateDestacadoOrder(id: string, sortOrder: number) {
  await prisma.product.update({ where: { id }, data: { sortOrder } })
  revalidatePath('/admin/destacados')
  revalidatePath('/')
}
