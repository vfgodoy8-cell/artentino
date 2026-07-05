import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { serializeProduct } from '@/lib/serialize'
import ProductCard from '@/app/ui/product-card'
import CategoryPills from './category-pills'
import CategorySidebar from './category-sidebar'

type Props = {
  searchParams: Promise<{ categoria?: string }>
}

export default async function CatalogoPage({ searchParams }: Props) {
  const { categoria } = await searchParams

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
      include: { category: true },
      orderBy: categoria === 'todos' || !categoria
        ? [{ name: 'asc' }]
        : [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
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
            {products.length} {products.length === 1 ? 'producto' : 'productos'}
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

            {/* Mobile: horizontal pills */}
            <div className="mb-6 lg:hidden">
              <CategoryPills categories={categories} activeSlug={categoria} />
            </div>

            {/* Products grid */}
            {products.length === 0 ? (
              <div className="py-24 text-center">
                <p className="text-lg font-bold text-[#1E1E1E]">No hay productos en esta categoría</p>
                <Link
                  href="/catalogo"
                  className="mt-4 inline-block text-sm font-semibold text-[#0eb1c3] underline underline-offset-4"
                >
                  Ver todos los productos
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 lg:gap-6">
                {products.map(serializeProduct).map((product) => (
                  <ProductCard key={product.id} {...product} />
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </main>
  )
}
