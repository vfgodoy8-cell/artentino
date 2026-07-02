import { prisma } from '@/lib/prisma'
import HeroCarousel from './hero-carousel'

export default async function Hero() {
  const [slides, badges, siteConfig] = await Promise.all([
    prisma.heroSlide.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
      select: {
        id: true,
        imageUrl: true,
        imageUrlMobile: true,
        eyebrowText: true,
        title: true,
        titleHighlightWord: true,
        description: true,
      },
    }),
    prisma.heroBadge.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
      select: {
        id: true,
        order: true,
        customLabel: true,
        customSubtitle: true,
        icon: true,
        category: { select: { name: true, slug: true } },
      },
    }),
    prisma.siteConfig.findUnique({ where: { id: 'singleton' } }),
  ])

  return (
    <HeroCarousel
      slides={slides}
      badges={badges}
      intervalSeconds={siteConfig?.heroIntervalSeconds ?? 6}
    />
  )
}
