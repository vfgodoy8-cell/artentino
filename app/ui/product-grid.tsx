import { prisma } from '@/lib/prisma'
import { serializeProduct } from '@/lib/serialize'
import ProductCard from './product-card'

export default async function ProductGrid() {
  const products = await prisma.product.findMany({
    where: { featured: true },
    include: { category: true },
    orderBy: { createdAt: 'desc' },
    take: 6,
  })

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">

      <div className="mb-8 flex items-end justify-between">
        <div>
          <p
            className="mb-1 text-[11px] font-black uppercase tracking-[0.25em]"
            style={{ color: '#2BBCB0' }}
          >
            Lo más vendido
          </p>
          <h2 className="text-2xl font-black uppercase tracking-wide text-[#1E1E1E] sm:text-3xl">
            Productos destacados
          </h2>
        </div>
        <a
          href="/catalogo"
          className="hidden text-sm font-bold text-[#1E1E1E] underline-offset-4 hover:text-[#2BBCB0] hover:underline sm:block"
        >
          Ver todos →
        </a>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:gap-6">
        {products.map(serializeProduct).map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>

      <div className="mt-8 text-center sm:hidden">
        <a
          href="/catalogo"
          className="inline-flex h-11 items-center rounded-xl border border-gray-200 px-8 text-sm font-bold text-[#1E1E1E] transition-colors hover:border-[#2BBCB0] hover:text-[#2BBCB0]"
        >
          Ver todos los productos
        </a>
      </div>
    </section>
  )
}
