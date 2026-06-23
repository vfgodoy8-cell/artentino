'use client'

import { useState } from 'react'
import Link from 'next/link'
import ProductGallery from './product-gallery'
import ProductActions from './product-actions'
import { type ComboPrice } from '@/app/context/cart-context'

type GalleryImage = {
  id: string
  url: string
  sortOrder: number
  isCover: boolean
  attributeValueIds: string[]
}

type VariantEntry = { id: string; value: string }

type Props = {
  galleryImages: GalleryImage[]
  variantGroups: Record<string, VariantEntry[]>
  stockByValueId: Record<string, number>
  productName: string
  categoryName: string
  productId: string
  price: number
  comparePrice: number | null
  imageUrl: string | null
  comboPrices: ComboPrice[]
  description: string | null
  additionalData: string | null
}

function fmt(n: number) {
  return `$${n.toLocaleString('es-AR')}`
}

export default function ProductDetailShell({
  galleryImages,
  variantGroups,
  stockByValueId,
  productName,
  categoryName,
  productId,
  price,
  comparePrice,
  imageUrl,
  comboPrices,
  description,
  additionalData,
}: Props) {
  const [selectedColorId, setSelectedColorId] = useState<string | null>(null)
  const [colorResetKey, setColorResetKey] = useState(0)

  const hasColorVariants = Object.keys(variantGroups).length > 0
  const totalStock = Object.values(stockByValueId).reduce((a, b) => a + b, 0)
  const currentStock = selectedColorId !== null ? (stockByValueId[selectedColorId] ?? 0) : null
  const effectiveStock = hasColorVariants ? currentStock : totalStock

  const disabledReason: 'no-color' | 'no-stock' | null = hasColorVariants
    ? selectedColorId === null
      ? 'no-color'
      : (currentStock ?? 0) === 0
        ? 'no-stock'
        : null
    : totalStock === 0
      ? 'no-stock'
      : null

  const disabled = disabledReason !== null
  const maxQty = (effectiveStock ?? 0) > 0 ? (effectiveStock ?? 0) : 1

  return (
    <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
      {/* Left: gallery + variant selector */}
      <ProductGallery
        key={colorResetKey}
        galleryImages={galleryImages}
        variantGroups={variantGroups}
        stockByValueId={stockByValueId}
        productName={productName}
        categoryName={categoryName}
        onColorSelect={setSelectedColorId}
      />

      {/* Right: details */}
      <div className="flex flex-col">
        {/* Category badge */}
        <span
          className="mb-4 inline-flex w-fit rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white"
          style={{ backgroundColor: '#0eb1c3' }}
        >
          {categoryName}
        </span>

        {/* Name */}
        <h1 className="text-2xl font-black leading-tight text-[#1E1E1E] sm:text-3xl lg:text-4xl">
          {productName}
        </h1>

        {/* Price */}
        <div className="mt-6">
          {comparePrice !== null && comparePrice > price && (
            <p className="mb-1 text-sm font-semibold text-gray-400 line-through">
              {fmt(comparePrice)}
            </p>
          )}
          <p className="text-4xl font-black leading-none text-[#1E1E1E]">{fmt(price)}</p>
          <p className="mt-2 text-sm text-gray-400">6x {fmt(Math.round(price / 6))} sin interés</p>
        </div>

        {/* Qty selector + add to cart */}
        <ProductActions
          productId={productId}
          name={productName}
          price={price}
          imageUrl={imageUrl}
          comboPrices={comboPrices}
          disabled={disabled}
          disabledReason={disabledReason}
          maxQty={maxQty}
          selectedColorId={selectedColorId}
          onClearColor={() => {
              setSelectedColorId(null)
              setColorResetKey((k) => k + 1)
            }}
        />

        {/* Divider */}
        <div className="my-6 border-t border-gray-100" />

        {/* Description */}
        {description && (
          <div className="rounded-xl bg-gray-50 px-4 py-4">
            <p className="mb-1.5 text-[10px] font-black uppercase tracking-widest text-gray-400">
              Descripción
            </p>
            <p className="text-lg leading-relaxed text-[#1E1E1E]">{description}</p>
          </div>
        )}

        {/* Additional data */}
        {additionalData && (
          <div className="mt-3 rounded-xl bg-gray-50 px-4 py-4">
            <p className="mb-1.5 text-[10px] font-black uppercase tracking-widest text-gray-400">
              Información adicional
            </p>
            <p className="leading-relaxed text-gray-500">{additionalData}</p>
          </div>
        )}

        {/* Stock display — reactive to color selection */}
        <div className="mt-6 flex items-center gap-2" data-testid="stock-info">
          {hasColorVariants && selectedColorId === null ? (
            <span className="text-sm text-gray-400">
              Elegí un color para ver el stock disponible
            </span>
          ) : (
            <>
              <span
                className={`h-2 w-2 rounded-full ${
                  (effectiveStock ?? 0) > 0 ? 'bg-[#4ade80]' : 'bg-[#f87171]'
                }`}
              />
              <span className="text-sm text-gray-500">
                {(effectiveStock ?? 0) > 0
                  ? `${effectiveStock} unidades disponibles`
                  : 'Sin stock'}
              </span>
            </>
          )}
        </div>

        {/* Back link */}
        <Link
          href="/catalogo"
          className="mt-6 text-center text-sm font-semibold text-[#0eb1c3] transition-colors hover:underline"
        >
          ← Volver al catálogo
        </Link>
      </div>
    </div>
  )
}
