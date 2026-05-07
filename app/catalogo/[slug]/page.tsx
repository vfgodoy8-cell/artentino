import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { serializeProduct } from '@/lib/serialize'
import { CategoryIcon } from '@/app/ui/product-card'

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
    include: { category: true },
  })

  if (!product) notFound()

  const serialized = serializeProduct(product)
  const price = serialized.price

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-2 text-sm text-gray-400">
          <Link href="/" className="transition-colors hover:text-[#2BBCB0]">Inicio</Link>
          <span>/</span>
          <Link href="/catalogo" className="transition-colors hover:text-[#2BBCB0]">Catálogo</Link>
          <span>/</span>
          <Link
            href={`/catalogo?categoria=${product.category.slug}`}
            className="transition-colors hover:text-[#2BBCB0]"
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
              style={{ backgroundColor: '#2BBCB0' }}
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

            {/* Divider */}
            <div className="my-6 border-t border-gray-100" />

            {/* Description */}
            {product.description && (
              <p className="leading-relaxed text-[#555]">{product.description}</p>
            )}

            {/* Stock */}
            <div className="mt-6 flex items-center gap-2">
              <span
                className={`h-2 w-2 rounded-full ${product.stock > 0 ? 'bg-green-400' : 'bg-red-400'}`}
              />
              <span className="text-sm text-gray-500">
                {product.stock > 0
                  ? `${product.stock} unidades disponibles`
                  : 'Sin stock'}
              </span>
            </div>

            {/* CTA */}
            <button
              disabled={product.stock === 0}
              className="mt-8 w-full rounded-2xl py-4 text-sm font-black uppercase tracking-widest text-white transition-opacity disabled:opacity-40"
              style={{ backgroundColor: '#2BBCB0' }}
            >
              Agregar al carrito
            </button>

            {/* Back link */}
            <Link
              href="/catalogo"
              className="mt-4 text-center text-sm font-semibold text-gray-400 transition-colors hover:text-[#2BBCB0]"
            >
              ← Volver al catálogo
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
