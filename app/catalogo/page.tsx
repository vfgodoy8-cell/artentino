import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { serializeProduct } from '@/lib/serialize'
import { normalizeText } from '@/app/lib/normalize-text'
import ProductCard from '@/app/ui/product-card'
import CategoryPills from './category-pills'
import CategorySidebar from './category-sidebar'
import CatalogSearch from './catalog-search'

type Props = {
  searchParams: Promise<{ categoria?: string; q?: string }>
}

export default async function CatalogoPage({ searchParams }: Props) {
  const { categoria, q } = await searchParams

  // Determinar si el slug es de categoría padre o subcategoría
  const parentCategory = categoria
    ? await prisma.category.findUnique({ where: { slug: categoria } })
    : null

  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      where: {
        active: true,
        ...(categoria
          ? parentCategory
            ? { category: { category: { slug: categoria } } }
            : { category: { slug: categoria } }
          : {}),
      },
      include: { category: { include: { category: true } } },
      orderBy: categoria
        ? [{ sortOrder: 'asc' }, { createdAt: 'desc' }]
        : [
            { category: { category: { order: 'asc' } } },
            { category: { order: 'asc' } },
            { sortOrder: 'asc' },
            { createdAt: 'desc' },
          ],
    }),
    prisma.category.findMany({
      where: { isSpecial: false },
      orderBy: { order: 'asc' },
      select: {
        id: true,
        name: true,
        slug: true,
        subcategories: {
          orderBy: { order: 'asc' },
          select: { id: true, name: true, slug: true },
        },
      },
    }),
  ])

  const headingTitle = parentCategory
    ? parentCategory.name
    : categoria
      ? products[0]?.category?.name ?? 'Catálogo'
      : 'Catálogo'

  const trimmedQuery = q?.trim() ?? ''
  const queryWords = trimmedQuery ? normalizeText(trimmedQuery).split(/\s+/).filter(Boolean) : []

  const filteredProducts = queryWords.length === 0
    ? products
    : products.filter((p) => {
        const haystack = normalizeText(
          [p.name, p.sku ?? '', p.category.name, p.category.category?.name ?? ''].join(' '),
        )
        return queryWords.every((word) => haystack.includes(word))
      })

  return (
    <main className="min-h-dvh bg-white">

      {/* Atmospheric header — full width */}
      <div className="relative h-[180px] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/hero-product.jpg"
          alt="Catálogo Artentino"
          className="h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white/[0.98] via-white/70 to-white/10" />
        <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-10 lg:px-16">
          <p className="mb-2 text-[10px] font-black uppercase tracking-[0.3em] text-[#0eb1c3]">
            Artentino
          </p>
          <h1 className="text-balance text-3xl font-black tracking-[-0.02em] text-[#1E1E1E] sm:text-4xl">
            {headingTitle}
          </h1>
          <p className="mt-1.5 text-sm text-[#9ca3af]">
            {filteredProducts.length} {filteredProducts.length === 1 ? 'producto' : 'productos'}
          </p>
        </div>
      </div>

      {/* Sidebar + grid layout */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex gap-10">

          {/* Sidebar — desktop only */}
          <aside className="hidden w-52 shrink-0 lg:block">
            <CategorySidebar categories={categories} activeSlug={categoria} />
          </aside>

          <div className="min-w-0 flex-1">

            <CatalogSearch initialQuery={q ?? ''} resultCount={filteredProducts.length}>

              {/* Mobile: horizontal pills */}
              <div className="mb-6 lg:hidden">
                <CategoryPills categories={categories} activeSlug={categoria} />
              </div>

              {/* Products grid */}
              {filteredProducts.length === 0 ? (
                <div className="py-24 text-center">
                  <p className="text-lg font-bold text-[#1E1E1E]">
                    {trimmedQuery
                      ? `No encontramos productos para «${trimmedQuery}»`
                      : 'No hay productos en esta categoría'}
                  </p>
                  <Link
                    href={trimmedQuery && categoria ? `/catalogo?q=${encodeURIComponent(trimmedQuery)}` : '/catalogo'}
                    className="mt-4 inline-block text-sm font-semibold text-[#0eb1c3] underline underline-offset-4"
                  >
                    {trimmedQuery && categoria ? 'Buscar en todo el catálogo' : 'Ver todos los productos'}
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 lg:gap-6">
                  {filteredProducts.map(serializeProduct).map((product) => (
                    <ProductCard key={product.id} {...product} />
                  ))}
                </div>
              )}

            </CatalogSearch>
          </div>

        </div>
      </div>
    </main>
  )
}
