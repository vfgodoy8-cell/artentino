'use client'

import { useState } from 'react'
import Link from 'next/link'
import ProductGallery from './product-gallery'
import ProductActions from './product-actions'
import { type ComboPrice } from '@/app/context/cart-context'
import { CASH_DISCOUNT, CASH_DISCOUNT_PCT } from '@/app/lib/constants'

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
  youtubeId: string | null
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
  youtubeId,
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
    <>
      {/* Two-column product detail */}
      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        {/* Left: gallery */}
        <ProductGallery
          key={colorResetKey}
          galleryImages={galleryImages}
          productName={productName}
          categoryName={categoryName}
          selectedColorId={selectedColorId}
          youtubeId={youtubeId}
        />

        {/* Right: info + actions */}
        <div className="flex flex-col">
          {/* Category badge */}
          <span
            className="mb-4 inline-flex w-fit rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white"
            style={{ backgroundColor: '#0eb1c3' }}
          >
            {categoryName}
          </span>

          {/* Name */}
          <h1 className="text-2xl font-bold leading-tight text-[#1E1E1E] sm:text-3xl lg:text-4xl">
            {productName}
          </h1>

          {/* Price */}
          <div className="mt-6">
            <div className="flex flex-col items-start gap-y-3 sm:flex-row sm:items-end sm:gap-x-6">
              {/* Cash / transfer price */}
              <div>
                <p className="mb-1 text-sm font-black uppercase tracking-widest text-[#0eb1c3]">
                  Pagando efectivo o transferencia
                </p>
                <div className="flex items-center gap-3">
                  <p className="text-5xl font-black leading-none text-[#0eb1c3]">
                    {fmt(Math.round(price * (1 - CASH_DISCOUNT)))}
                  </p>
                  <span className="rounded-full bg-[#0eb1c3] px-2.5 py-0.5 text-xs font-black text-white">
                    {CASH_DISCOUNT_PCT}% OFF
                  </span>
                </div>
              </div>
              {/* List price */}
              <div>
                <p className="mb-1 text-[10px] font-black uppercase tracking-wider text-gray-400">
                  Precio de lista
                </p>
                <p className="text-2xl font-bold leading-none text-gray-400">
                  {fmt(price)}
                </p>
              </div>
            </div>
            <p className="mt-2 text-sm text-gray-400">
              6x {fmt(Math.round(price / 6))} sin interés
            </p>
          </div>

          {/* Actions: combos + qty + variant selector + add to cart */}
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
            variantGroups={variantGroups}
            stockByValueId={stockByValueId}
            onColorSelect={setSelectedColorId}
            colorResetKey={colorResetKey}
          />

          {/* Divider */}
          <div className="my-6 border-t border-gray-100" />

          {/* Stock indicator */}
          <div className="flex items-center gap-2" data-testid="stock-info">
            {hasColorVariants && selectedColorId === null ? (
              <span className="text-sm text-gray-400">
                Elegí una variante para ver el stock disponible
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

      {/* Description — full width below the two-column grid */}
      {(description || additionalData) && (
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {description && (
            <div className="rounded-xl bg-gray-50 px-5 py-5">
              <p className="mb-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
                Descripción
              </p>
              <p className="text-lg leading-relaxed text-[#1E1E1E]">{description}</p>
            </div>
          )}
          {additionalData && (
            <div className="rounded-xl bg-gray-50 px-5 py-5">
              <p className="mb-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
                Información adicional
              </p>
              <p className="leading-relaxed text-gray-500">{additionalData}</p>
            </div>
          )}
        </div>
      )}
    </>
  )
}
