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
      attributes: {
        include: { attributeValue: { include: { attribute: true } } },
        orderBy: { createdAt: 'asc' },
      },
      stockItems: {
        include: { attributeValue: { include: { attribute: true } } },
        orderBy: { sortOrder: 'asc' },
      },
      productImages: { orderBy: { createdAt: 'asc' } },
    },
  })

  if (!product) notFound()

  const [categories, conditions, attributes] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: 'asc' }, select: { id: true, name: true } }),
    prisma.condition.findMany({ orderBy: { name: 'asc' }, select: { id: true, name: true } }),
    prisma.attribute.findMany({
      where: { active: true },
      orderBy: { position: 'asc' },
      include: { values: { orderBy: { value: 'asc' } } },
    }),
  ])

  const serializedProduct = {
    id: product.id,
    name: product.name,
    stock: product.stock,
    categoryId: product.categoryId,
    conditionId: product.conditionId,
    description: product.description,
    additionalData: product.additionalData,
    price: dec(product.price)!,
    comparePrice: dec(product.comparePrice),
    cost: dec(product.cost),
    videoUrl: product.videoUrl,
    showPrice: product.showPrice,
    active: product.active,
    sortOrder: product.sortOrder,
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

  const serializedAttributes = attributes.map((a) => ({
    id: a.id,
    name: a.name,
    values: a.values.map((v) => ({ id: v.id, value: v.value })),
  }))

  const serializedProductAttributes = product.attributes.map((pa) => ({
    id: pa.id,
    attributeValueId: pa.attributeValueId,
    attributeValue: {
      id: pa.attributeValue.id,
      value: pa.attributeValue.value,
      attribute: { id: pa.attributeValue.attribute.id, name: pa.attributeValue.attribute.name },
    },
  }))

  const serializedStocks = product.stockItems.map((s) => ({
    id: s.id,
    stock: s.stock,
    sortOrder: s.sortOrder,
    attributeValueId: s.attributeValueId,
    attributeValue: {
      id: s.attributeValue.id,
      value: s.attributeValue.value,
      attribute: { id: s.attributeValue.attribute.id, name: s.attributeValue.attribute.name },
    },
  }))

  const serializedImages = product.productImages.map((img) => ({
    id: img.id,
    url: img.url,
    filename: img.filename,
    size: img.size,
  }))

  const sku = id.slice(0, 8).toUpperCase()

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
          <p className="mt-0.5 font-mono text-xs text-gray-400">SKU: {sku}</p>
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
          conditions={conditions}
          attributes={serializedAttributes}
          productAttributes={serializedProductAttributes}
          productStocks={serializedStocks}
          productImages={serializedImages}
        />
      </div>
    </div>
  )
}
