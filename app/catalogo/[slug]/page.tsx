import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { serializeProduct } from '@/lib/serialize'
import { CategoryIcon } from '@/app/ui/product-card'
import AddToCartButton from '@/app/ui/add-to-cart-button'

function fmt(n: number) {
  return `$${n.toLocaleString('es-AR')}`
}

type Props = {
  params: Promise<{ slug: string }>
}

export default async function ProductoPage({ params }: Props) {
  const { slug } = await params

  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
      comboPrices: { orderBy: { quantity: 'asc' } },
      stockItems: true,
    },
  })

  if (!product) notFound()

  const serialized = serializeProduct(product)
  const price = serialized.price
  const totalStock = product.stockItems.reduce((sum, s) => sum + s.stock, 0)

  // Filter to combos that are currently valid by date
  const now = new Date()
  const comboPrices = product.comboPrices
    .filter((c) => {
      if (c.startDate && c.startDate > now) return false
      if (c.endDate && c.endDate < now) return false
      return true
    })
    .map((c) => ({
      id: c.id,
      quantity: c.quantity,
      price: Number(c.price.toString()),
      startDate: c.startDate?.toISOString() ?? null,
      endDate: c.endDate?.toISOString() ?? null,
    }))

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-2 text-sm text-gray-400">
          <Link href="/" className="transition-colors hover:text-[#0eb1c3]">Inicio</Link>
          <span>/</span>
          <Link href="/catalogo" className="transition-colors hover:text-[#0eb1c3]">Catálogo</Link>
          <span>/</span>
          <Link
            href={`/catalogo?categoria=${product.category.slug}`}
            className="transition-colors hover:text-[#0eb1c3]"
          >
            {product.category.name}
          </Link>
          <span>/</span>
          <span className="text-[#1E1E1E]">{product.name}</span>
        </nav>

        {/* Product layout */}
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">

          {/* Left: image */}
          <div className="aspect-square overflow-hidden rounded-2xl bg-gray-50">
            {product.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={product.imageUrl}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <div className="flex h-32 w-32 items-center justify-center rounded-3xl bg-white shadow-sm">
                  <CategoryIcon category={product.category.name} />
                </div>
              </div>
            )}
          </div>

          {/* Right: details */}
          <div className="flex flex-col">

            {/* Category badge */}
            <span
              className="mb-4 inline-flex w-fit rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white"
              style={{ backgroundColor: '#0eb1c3' }}
            >
              {product.category.name}
            </span>

            {/* Name */}
            <h1 className="text-2xl font-black leading-tight text-[#1E1E1E] sm:text-3xl lg:text-4xl">
              {product.name}
            </h1>

            {/* Price */}
            <div className="mt-6">
              <p className="text-4xl font-black leading-none text-[#1E1E1E]">
                {fmt(price)}
              </p>
              <p className="mt-2 text-sm text-gray-400">
                6x {fmt(Math.round(price / 6))} sin interés
              </p>
            </div>

            {/* Volume pricing table */}
            {comboPrices.length > 0 && (
              <div className="mt-5 overflow-hidden rounded-xl border border-[#0eb1c3]/30 bg-[#f0fbfc]">
                <div className="border-b border-[#0eb1c3]/20 px-4 py-2.5">
                  <p className="text-xs font-black uppercase tracking-wider text-[#0eb1c3]">
                    Precios por volumen
                  </p>
                </div>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#0eb1c3]/10">
                      <th className="px-4 py-2 text-left text-[10px] font-black uppercase tracking-wider text-gray-400">Cantidad</th>
                      <th className="px-4 py-2 text-left text-[10px] font-black uppercase tracking-wider text-gray-400">Precio unitario</th>
                      <th className="px-4 py-2 text-left text-[10px] font-black uppercase tracking-wider text-gray-400">Ahorrás</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#0eb1c3]/10">
                    {comboPrices.map((c) => {
                      const pct = Math.round((1 - c.price / price) * 100)
                      return (
                        <tr key={c.id}>
                          <td className="px-4 py-2.5 font-bold text-[#1E1E1E]">{c.quantity}+ unidades</td>
                          <td className="px-4 py-2.5 font-black text-[#1E1E1E]">{fmt(c.price)}</td>
                          <td className="px-4 py-2.5">
                            <span className="rounded-full bg-[#0eb1c3] px-2.5 py-0.5 text-xs font-black text-white">
                              {pct}% off
                            </span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* Divider */}
            <div className="my-6 border-t border-gray-100" />

            {/* Description */}
            {product.description && (
              <p className="leading-relaxed text-[#555]">{product.description}</p>
            )}

            {/* Stock */}
            <div className="mt-6 flex items-center gap-2">
              <span
                className={`h-2 w-2 rounded-full ${totalStock > 0 ? 'bg-[#4ade80]' : 'bg-[#f87171]'}`}
              />
              <span className="text-sm text-gray-500">
                {totalStock > 0
                  ? `${totalStock} unidades disponibles`
                  : 'Sin stock'}
              </span>
            </div>

            {/* CTA */}
            <AddToCartButton
              productId={product.id}
              name={product.name}
              price={price}
              imageUrl={product.imageUrl}
              comboPrices={comboPrices}
              disabled={totalStock === 0}
              size="lg"
            />

            {/* Back link */}
            <Link
              href="/catalogo"
              className="mt-4 text-center text-sm font-semibold text-gray-400 transition-colors hover:text-[#0eb1c3]"
            >
              ← Volver al catálogo
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
