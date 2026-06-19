import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { serializeProduct } from '@/lib/serialize'
import ProductCard from '@/app/ui/product-card'
import CategoryPills from './category-pills'

type Props = {
  searchParams: Promise<{ categoria?: string }>
}

export default async function CatalogoPage({ searchParams }: Props) {
  const { categoria } = await searchParams

  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      where: {
        active: true,
        ...(categoria ? { category: { slug: categoria } } : {}),
      },
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.category.findMany({ orderBy: { name: 'asc' } }),
  ])

  const activeCategory = categories.find((c) => c.slug === categoria)

  return (
    <main className="min-h-dvh bg-white">

      {/* Atmospheric header */}
      <div className="relative h-[200px] overflow-hidden">
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
            {activeCategory ? activeCategory.name : 'Catálogo'}
          </h1>
          <p className="mt-1.5 text-sm text-[#9ca3af]">
            {products.length} {products.length === 1 ? 'producto' : 'productos'}
          </p>
        </div>
      </div>

      {/* Category filter pills — client island (scroll + fades) */}
      <div className="border-b border-gray-100 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <CategoryPills categories={categories} activeSlug={categoria} />
        </div>
      </div>

      {/* Products grid */}
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {products.length === 0 ? (
          <div className="py-24 text-center">
            <p className="text-lg font-bold text-[#1E1E1E]">No hay productos en esta categoría</p>
            <Link
              href="/catalogo"
              className="mt-4 inline-block text-sm font-semibold underline underline-offset-4"
              style={{ color: '#0eb1c3' }}
            >
              Ver todos los productos
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
            {products.map(serializeProduct).map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
