import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { serializeProduct } from '@/lib/serialize'
import { CategoryIcon } from '@/app/ui/product-card'
import VariantSelector from './variant-selector'
import ProductActions from './product-actions'

function fmt(n: number) {
  return `$${n.toLocaleString('es-AR')}`
}

function getYouTubeId(url: string | null): string | null {
  if (!url) return null
  const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([A-Za-z0-9_-]{11})/)
  return m ? m[1] : null
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
      stockItems: { include: { attribute: true } },
      productImages: { orderBy: { createdAt: 'asc' } },
    },
  })

  if (!product) notFound()

  const serialized = serializeProduct(product)
  const price = serialized.price
  const comparePrice = serialized.comparePrice
  const totalStock = product.stockItems.reduce((sum, s) => sum + s.stock, 0)
  const mainImage = product.imageUrl ?? product.productImages[0]?.url ?? null
  const youtubeId = getYouTubeId(product.videoUrl)

  // Group stock variants — skip hidden (generic) attributes
  const variantGroups: Record<string, string[]> = {}
  for (const item of product.stockItems) {
    if (item.attribute.hidden) continue
    const name = item.attribute.name
    if (!variantGroups[name]) variantGroups[name] = []
    if (!variantGroups[name].includes(item.value)) variantGroups[name].push(item.value)
  }

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

          {/* Left: image + color/variant selector */}
          <div className="flex flex-col gap-4">
            <div className="relative aspect-square overflow-hidden rounded-2xl bg-gray-50">
              {mainImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={mainImage}
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

            {/* Interactive variant/color selector */}
            <VariantSelector variantGroups={variantGroups} />
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
              {comparePrice && comparePrice > price && (
                <p className="mb-1 text-sm font-semibold text-gray-400 line-through">
                  {fmt(comparePrice)}
                </p>
              )}
              <p className="text-4xl font-black leading-none text-[#1E1E1E]">
                {fmt(price)}
              </p>
              <p className="mt-2 text-sm text-gray-400">
                6x {fmt(Math.round(price / 6))} sin interés
              </p>
            </div>

            {/* Combo table + qty selector + add to cart */}
            <ProductActions
              productId={product.id}
              name={product.name}
              price={price}
              imageUrl={mainImage}
              comboPrices={comboPrices}
              disabled={totalStock === 0}
            />

            {/* Divider */}
            <div className="my-6 border-t border-gray-100" />

            {/* Description — 2pt bigger font */}
            {product.description && (
              <div className="rounded-xl bg-gray-50 px-4 py-4">
                <p className="mb-1.5 text-[10px] font-black uppercase tracking-widest text-gray-400">Descripción</p>
                <p className="text-lg leading-relaxed text-[#1E1E1E]">{product.description}</p>
              </div>
            )}

            {/* Additional data */}
            {product.additionalData && (
              <div className="mt-3 rounded-xl bg-gray-50 px-4 py-4">
                <p className="mb-1.5 text-[10px] font-black uppercase tracking-widest text-gray-400">Información adicional</p>
                <p className="leading-relaxed text-gray-500">{product.additionalData}</p>
              </div>
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

            {/* Back link */}
            <Link
              href="/catalogo"
              className="mt-6 text-center text-sm font-semibold text-gray-400 transition-colors hover:text-[#0eb1c3]"
            >
              ← Volver al catálogo
            </Link>
          </div>
        </div>

        {/* YouTube embed */}
        {youtubeId && (
          <div className="mt-12">
            <p className="mb-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Video del producto</p>
            <div className="aspect-video w-full overflow-hidden rounded-2xl bg-gray-100">
              <iframe
                src={`https://www.youtube.com/embed/${youtubeId}`}
                title={`Video de ${product.name}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="h-full w-full"
              />
            </div>
          </div>
        )}

      </div>
    </main>
  )
}
