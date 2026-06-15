'use client'

import { useState } from 'react'
import { CategoryIcon } from '@/app/ui/product-card'
import VariantSelector from './variant-selector'

type VariantEntry = { id: string; value: string }

type Props = {
  defaultImage: string | null
  imagesByColor: Record<string, string>
  variantGroups: Record<string, VariantEntry[]>
  productName: string
  categoryName: string
}

export default function ProductGallery({
  defaultImage,
  imagesByColor,
  variantGroups,
  productName,
  categoryName,
}: Props) {
  const [selectedIds, setSelectedIds] = useState<Record<string, string>>({})

  // First selected value that has a color image wins; otherwise fall back to defaultImage
  let currentImage = defaultImage
  for (const valueId of Object.values(selectedIds)) {
    if (valueId && imagesByColor[valueId]) {
      currentImage = imagesByColor[valueId]
      break
    }
  }

  function handleSelect(attrName: string, valueId: string) {
    setSelectedIds((s) => ({ ...s, [attrName]: valueId }))
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Main image */}
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-gray-50">
        {currentImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={currentImage}
            src={currentImage}
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

      {/* Variant selector */}
      <VariantSelector variantGroups={variantGroups} onSelect={handleSelect} />
    </div>
  )
}
