import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import EditForm from './edit-form'

function dec(d: { toString(): string } | null) {
  return d != null ? Number(d.toString()) : null
}

type Props = { params: Promise<{ id: string }> }

export default async function EditarProductoPage({ params }: Props) {
  const { id } = await params

  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      comboPrices: { orderBy: { quantity: 'asc' } },
      stockItems: {
        include: { attribute: true, attributeValue: true },
        orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
      },
      productImages: {
        orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
        include: { imageAttributeValues: { select: { attributeValueId: true } } },
      },
      relations: {
        orderBy: { sortOrder: 'asc' },
        select: {
          id: true,
          sortOrder: true,
          relatedProduct: {
            select: { id: true, name: true, sku: true, imageUrl: true, price: true },
          },
        },
      },
    },
  })

  if (!product) notFound()

  const [categories, attributes] = await Promise.all([
    prisma.category.findMany({
      where: { isSpecial: false },
      orderBy: { order: 'asc' },
      select: {
        id: true,
        name: true,
        subcategories: { orderBy: { order: 'asc' }, select: { id: true, name: true } },
      },
    }),
    prisma.attribute.findMany({
      where: { active: true, hidden: false },
      orderBy: { position: 'asc' },
      select: {
        id: true,
        name: true,
        values: { select: { id: true, value: true }, orderBy: { value: 'asc' } },
      },
    }),
  ])

  const serializedProduct = {
    id: product.id,
    sku: product.sku ?? id.slice(0, 8).toUpperCase(),
    slug: product.slug,
    name: product.name,
    categoryId: product.categoryId,
    description: product.description,
    additionalData: product.additionalData,
    price: dec(product.price)!,
    comparePrice: dec(product.comparePrice),
    cost: dec(product.cost),
    videoUrl: product.videoUrl,
    active: product.active,
    height: dec(product.height),
    width: dec(product.width),
    length: dec(product.length),
    weight: dec(product.weight),
  }

  const serializedCombos = product.comboPrices.map((c) => ({
    id: c.id,
    price: dec(c.price)!,
    quantity: c.quantity,
    startDate: c.startDate?.toISOString().slice(0, 10) ?? null,
    endDate: c.endDate?.toISOString().slice(0, 10) ?? null,
  }))

  const serializedStocks = product.stockItems.map((s) => ({
    id: s.id,
    stock: s.stock,
    sortOrder: s.sortOrder,
    attributeId: s.attributeId,
    attribute: { id: s.attribute.id, name: s.attribute.name, hidden: s.attribute.hidden },
    attributeValueId: s.attributeValueId,
    attributeValue: { id: s.attributeValue.id, value: s.attributeValue.value },
  }))

  const serializedImages = product.productImages.map((img) => ({
    id: img.id,
    url: img.url,
    filename: img.filename,
    size: img.size,
    sortOrder: img.sortOrder,
    isCover: img.isCover,
    attributeValueIds: img.imageAttributeValues.map((jv) => jv.attributeValueId),
  }))

  // attributeValueId → first image URL for that color (first by sortOrder)
  const imagesByAvId: Record<string, string> = {}
  for (const img of product.productImages) {
    for (const jv of img.imageAttributeValues) {
      if (!imagesByAvId[jv.attributeValueId]) {
        imagesByAvId[jv.attributeValueId] = img.url
      }
    }
  }

  // AttributeValues of imageDriven attributes that this product has in stock
  const seenAvIds = new Set<string>()
  const colorValues: { id: string; value: string; attributeName: string }[] = []
  for (const s of product.stockItems) {
    if (s.attribute.imageDriven && !s.attribute.hidden && !seenAvIds.has(s.attributeValueId)) {
      colorValues.push({
        id: s.attributeValue.id,
        value: s.attributeValue.value,
        attributeName: s.attribute.name,
      })
      seenAvIds.add(s.attributeValueId)
    }
  }

  return (
    <div className="mx-auto max-w-5xl p-8">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <Link
            href="/admin/productos"
            className="mb-2 inline-block text-sm font-semibold text-gray-400 transition-colors hover:text-[#0eb1c3]"
          >
            ← Volver a productos
          </Link>
          <h1 className="text-2xl font-black text-[#1E1E1E]">{product.name}</h1>
          <p className="mt-0.5 font-mono text-xs text-gray-400">SKU: {serializedProduct.sku}</p>
        </div>
        <span
          className={`mt-1 inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase ${
            product.active ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
          }`}
        >
          {product.active ? 'Activo' : 'Inactivo'}
        </span>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-6">
        <EditForm
          product={serializedProduct}
          comboPrices={serializedCombos}
          categories={categories}
          attributes={attributes}
          productStocks={serializedStocks}
          productImages={serializedImages}
          imagesByAvId={imagesByAvId}
          colorValues={colorValues}
          relations={product.relations.map((r) => ({
            id: r.id,
            sortOrder: r.sortOrder,
            relatedProduct: {
              id: r.relatedProduct.id,
              name: r.relatedProduct.name,
              sku: r.relatedProduct.sku,
              imageUrl: r.relatedProduct.imageUrl,
              price: Number(r.relatedProduct.price),
            },
          }))}
        />
      </div>
    </div>
  )
}
