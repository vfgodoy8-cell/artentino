'use client'

import { useState } from 'react'
import { CategoryIcon } from '@/app/ui/product-card'
import VariantSelector from './variant-selector'

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
  onColorSelect?: (id: string | null) => void
}

export default function ProductGallery({
  galleryImages,
  variantGroups,
  stockByValueId,
  productName,
  categoryName,
  onColorSelect,
}: Props) {
  const [selectedIds, setSelectedIds] = useState<Record<string, string>>({})
  // null = follow cover/filter logic; set = user explicitly chose a thumbnail
  const [preferredUrl, setPreferredUrl] = useState<string | null>(null)

  // First selected attribute value that is actually used in image tags
  const imageDrivenId =
    Object.values(selectedIds).find((valueId) =>
      valueId && galleryImages.some((img) => img.attributeValueIds.includes(valueId)),
    ) ?? null

  // Visible images: filter by selected imageDriven value, or show all
  // OR semantics: image is visible if its tag set includes the selected value
  const visibleImages = imageDrivenId
    ? galleryImages.filter((img) => img.attributeValueIds.includes(imageDrivenId))
    : galleryImages

  // Cover of the visible set (isCover=true if in set, else first by sortOrder)
  const coverInVisible = visibleImages.find((img) => img.isCover) ?? visibleImages[0] ?? null

  // Active URL: use preferredUrl if it's still visible; otherwise fall back to cover
  const isPreferredVisible =
    preferredUrl !== null && visibleImages.some((img) => img.url === preferredUrl)
  const currentUrl = isPreferredVisible ? preferredUrl : coverInVisible?.url ?? null

  function handleSelect(attrName: string, valueId: string) {
    setSelectedIds((s) => ({ ...s, [attrName]: valueId }))
    setPreferredUrl(null) // reset thumbnail choice on filter change
    onColorSelect?.(valueId || null)
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Main image */}
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-gray-50">
        {currentUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={currentUrl}
            src={currentUrl}
            alt={productName}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <div className="flex h-32 w-32 items-center justify-center rounded-3xl bg-white shadow-sm">
              <CategoryIcon category={categoryName} />
            </div>
          </div>
        )}
      </div>

      {/* Thumbnails — shown only when more than one image is visible */}
      {visibleImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {visibleImages.map((img) => (
            <button
              key={img.id}
              type="button"
              onClick={() => setPreferredUrl(img.url)}
              className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
                img.url === currentUrl
                  ? 'border-[#0eb1c3]'
                  : 'border-gray-100 hover:border-gray-300'
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.url} alt={productName} className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Variant selector */}
      <VariantSelector
        variantGroups={variantGroups}
        stockByValueId={stockByValueId}
        onSelect={handleSelect}
      />
    </div>
  )
}
