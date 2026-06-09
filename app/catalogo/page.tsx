import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { serializeProduct } from '@/lib/serialize'
import ProductCard from '@/app/ui/product-card'

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
    <main className="min-h-screen bg-white">

      {/* Page header */}
      <div className="border-b border-gray-100">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <p
            className="mb-1 text-[11px] font-black uppercase tracking-[0.25em]"
            style={{ color: '#0eb1c3' }}
          >
            Artentino
          </p>
          <h1 className="text-3xl font-black uppercase tracking-wide text-[#1E1E1E] sm:text-4xl">
            {activeCategory ? activeCategory.name : 'Catálogo'}
          </h1>
          <p className="mt-1 text-sm text-gray-400">
            {products.length} {products.length === 1 ? 'producto' : 'productos'}
          </p>
        </div>
      </div>

      {/* Category filter pills */}
      <div className="border-b border-gray-100 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="scrollbar-hide flex gap-2 overflow-x-auto py-3">

            <Link
              href="/catalogo"
              className={`shrink-0 rounded-full border px-4 py-1.5 text-sm font-semibold transition-all duration-150 ${
                !categoria
                  ? 'border-[#0eb1c3] bg-[#0eb1c3] text-white'
                  : 'border-gray-200 bg-white text-[#1E1E1E] hover:border-[#0eb1c3] hover:bg-[#0eb1c3] hover:text-white'
              }`}
            >
              Todos
            </Link>

            {categories.map((cat) => {
              const isActive = categoria === cat.slug
              return (
                <Link
                  key={cat.id}
                  href={`/catalogo?categoria=${cat.slug}`}
                  className={`shrink-0 rounded-full border px-4 py-1.5 text-sm font-semibold transition-all duration-150 ${
                    isActive
                      ? 'border-[#0eb1c3] bg-[#0eb1c3] text-white'
                      : 'border-gray-200 bg-white text-[#1E1E1E] hover:border-[#0eb1c3] hover:bg-[#0eb1c3] hover:text-white'
                  }`}
                >
                  {cat.name}
                </Link>
              )
            })}
          </div>
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
