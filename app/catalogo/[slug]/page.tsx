import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { serializeProduct } from '@/lib/serialize'
import ProductDetailShell from './product-detail-shell'

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
      stockItems: {
        include: { attribute: true, attributeValue: true },
        orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
      },
      productImages: { orderBy: { createdAt: 'asc' } },
    },
  })

  if (!product) notFound()

  const serialized = serializeProduct(product)
  const price = serialized.price
  const comparePrice = serialized.comparePrice
  const mainImage = product.imageUrl ?? product.productImages[0]?.url ?? null
  const youtubeId = getYouTubeId(product.videoUrl)

  // stockByValueId — attributeValueId → stock, consumed by the client shell
  const stockByValueId: Record<string, number> = {}
  for (const s of product.stockItems) {
    stockByValueId[s.attributeValueId] = s.stock
  }

  // Variant groups — skip hidden (generic) attributes
  const variantGroups: Record<string, { id: string; value: string }[]> = {}
  for (const item of product.stockItems) {
    if (item.attribute.hidden) continue
    const name = item.attribute.name
    if (!variantGroups[name]) variantGroups[name] = []
    if (!variantGroups[name].find((e) => e.id === item.attributeValueId)) {
      variantGroups[name].push({ id: item.attributeValueId, value: item.attributeValue.value })
    }
  }

  // Map attributeValueId → first image URL for that color
  const imagesByColor: Record<string, string> = {}
  for (const img of product.productImages) {
    if (img.attributeValueId && !imagesByColor[img.attributeValueId]) {
      imagesByColor[img.attributeValueId] = img.url
    }
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
    <main className="min-h-dvh bg-white">
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

        {/* Product detail — client shell manages color ↔ stock state */}
        <ProductDetailShell
          defaultImage={mainImage}
          imagesByColor={imagesByColor}
          variantGroups={variantGroups}
          stockByValueId={stockByValueId}
          productName={product.name}
          categoryName={product.category.name}
          productId={product.id}
          price={price}
          comparePrice={comparePrice}
          imageUrl={mainImage}
          comboPrices={comboPrices}
          description={product.description ?? null}
          additionalData={product.additionalData ?? null}
        />

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
