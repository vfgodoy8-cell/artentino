'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'

export async function updateExpressLocalities(localities: string[]) {
  const clean = [...new Set(localities.map((l) => l.trim()).filter(Boolean))]
  await prisma.shippingZone.update({
    where: { type: 'EXPRESS' },
    data: { localities: clean },
  })
  revalidatePath('/admin/extension')
  revalidatePath('/checkout')
}

export async function updateShippingToggle(field: 'expressShippingEnabled' | 'zipnovaShippingEnabled', enabled: boolean) {
  await prisma.siteConfig.upsert({
    where: { id: 'singleton' },
    update: { [field]: enabled },
    create: { id: 'singleton', [field]: enabled },
  })
  revalidatePath('/admin/extension')
  revalidatePath('/checkout')
}
