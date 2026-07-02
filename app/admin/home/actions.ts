'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

type SlideData = {
  imageUrl: string
  imageUrlMobile?: string | null
  eyebrowText: string
  title: string
  titleHighlightWord?: string | null
  description: string
  isActive: boolean
}

export async function createHeroSlide(data: SlideData) {
  const { _max } = await prisma.heroSlide.aggregate({ _max: { order: true } })
  await prisma.heroSlide.create({
    data: { ...data, order: (_max.order ?? -1) + 1 },
  })
  revalidatePath('/admin/home')
  revalidatePath('/')
}

export async function updateHeroSlide(id: string, data: SlideData) {
  await prisma.heroSlide.update({ where: { id }, data })
  revalidatePath('/admin/home')
  revalidatePath('/')
}

export async function deleteHeroSlide(id: string) {
  await prisma.heroSlide.delete({ where: { id } })
  revalidatePath('/admin/home')
  revalidatePath('/')
}

export async function moveHeroSlide(id: string, direction: 'up' | 'down') {
  const slide = await prisma.heroSlide.findUnique({ where: { id }, select: { order: true } })
  if (!slide) return

  const neighbor = await prisma.heroSlide.findFirst({
    where: { order: direction === 'up' ? { lt: slide.order } : { gt: slide.order } },
    orderBy: { order: direction === 'up' ? 'desc' : 'asc' },
    select: { id: true, order: true },
  })
  if (!neighbor) return

  await prisma.$transaction([
    prisma.heroSlide.update({ where: { id }, data: { order: neighbor.order } }),
    prisma.heroSlide.update({ where: { id: neighbor.id }, data: { order: slide.order } }),
  ])

  revalidatePath('/admin/home')
  revalidatePath('/')
}

type BadgeData = {
  categoryId: string
  customLabel?: string | null
  customSubtitle: string
  icon: string
}

export async function updateHeroBadge(order: number, data: BadgeData) {
  await prisma.heroBadge.update({ where: { order }, data })
  revalidatePath('/admin/home')
  revalidatePath('/')
}

export async function updateSiteConfig(heroIntervalSeconds: number) {
  await prisma.siteConfig.upsert({
    where: { id: 'singleton' },
    update: { heroIntervalSeconds },
    create: { id: 'singleton', heroIntervalSeconds },
  })
  revalidatePath('/admin/home')
  revalidatePath('/')
}
