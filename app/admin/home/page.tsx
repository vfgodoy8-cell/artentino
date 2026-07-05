import { prisma } from '@/lib/prisma'
import HeroSlidesTab from './hero-slides-tab'
import HeroBadgesTab from './hero-badges-tab'
import FooterTextSection from './footer-text-section'

export const dynamic = 'force-dynamic'

export default async function AdminHomePage() {
  const [rawSlides, rawBadges, siteConfig, categories] = await Promise.all([
    prisma.heroSlide.findMany({
      orderBy: { order: 'asc' },
      select: {
        id: true,
        order: true,
        imageUrl: true,
        imageUrlMobile: true,
        eyebrowText: true,
        title: true,
        titleHighlightWord: true,
        description: true,
        isActive: true,
      },
    }),
    prisma.heroBadge.findMany({
      orderBy: { order: 'asc' },
      select: {
        id: true,
        order: true,
        categoryId: true,
        customLabel: true,
        customSubtitle: true,
        icon: true,
        isActive: true,
        category: { select: { id: true, name: true, slug: true } },
      },
    }),
    prisma.siteConfig.findUnique({ where: { id: 'singleton' } }),
    prisma.category.findMany({
      where: { isSpecial: false },
      orderBy: { order: 'asc' },
      select: { id: true, name: true, slug: true },
    }),
  ])

  const intervalSeconds = siteConfig?.heroIntervalSeconds ?? 6

  return (
    <div className="p-8">
      <div className="mb-10">
        <h1 className="text-2xl font-black text-[#1E1E1E]">Hero / Home</h1>
        <p className="mt-1 text-sm text-[#9ca3af]">
          Gestioná el carrusel del hero y los botones destacados de la página principal.
        </p>
      </div>

      <div className="space-y-12">
        <HeroSlidesTab initial={rawSlides} intervalSeconds={intervalSeconds} />
        <div className="border-t border-[#e5e7eb]" />
        <HeroBadgesTab initial={rawBadges} categories={categories} />
        <div className="border-t border-[#e5e7eb]" />
        <FooterTextSection initial={siteConfig?.footerText ?? ''} />
      </div>
    </div>
  )
}
