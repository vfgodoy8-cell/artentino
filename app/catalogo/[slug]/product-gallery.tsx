'use client'

import { useState, useEffect } from 'react'
import { CategoryIcon } from '@/app/ui/product-card'

type GalleryImage = {
  id: string
  url: string
  sortOrder: number
  isCover: boolean
  attributeValueIds: string[]
}

type Props = {
  galleryImages: GalleryImage[]
  productName: string
  categoryName: string
  selectedColorId: string | null
  youtubeId: string | null
}

export default function ProductGallery({
  galleryImages,
  productName,
  categoryName,
  selectedColorId,
  youtubeId,
}: Props) {
  const [preferredUrl, setPreferredUrl] = useState<string | null>(null)
  const [isVideoActive, setIsVideoActive] = useState(false)

  // Reset thumbnail choice + video when selected color changes
  useEffect(() => {
    setPreferredUrl(null)
    setIsVideoActive(false)
  }, [selectedColorId])

  // imageDriven: use selectedColorId to filter images if it appears in any image tags
  const imageDrivenId =
    selectedColorId &&
    galleryImages.some((img) => img.attributeValueIds.includes(selectedColorId))
      ? selectedColorId
      : null

  const visibleImages = imageDrivenId
    ? galleryImages.filter((img) => img.attributeValueIds.includes(imageDrivenId))
    : galleryImages

  const coverInVisible = visibleImages.find((img) => img.isCover) ?? visibleImages[0] ?? null
  const isPreferredVisible =
    preferredUrl !== null && visibleImages.some((img) => img.url === preferredUrl)
  const currentUrl = isPreferredVisible ? preferredUrl : coverInVisible?.url ?? null

  const showThumbnails = visibleImages.length > 1 || youtubeId !== null

  return (
    <div className="flex flex-col gap-4">
      {/* Main image or video */}
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-gray-50">
        {isVideoActive && youtubeId ? (
          <iframe
            src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1`}
            title={`Video de ${productName}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="h-full w-full"
          />
        ) : currentUrl ? (
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

      {/* Thumbnails */}
      {showThumbnails && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {visibleImages.map((img) => (
            <button
              key={img.id}
              type="button"
              onClick={() => {
                setPreferredUrl(img.url)
                setIsVideoActive(false)
              }}
              className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
                !isVideoActive && img.url === currentUrl
                  ? 'border-[#0eb1c3]'
                  : 'border-gray-100 hover:border-gray-300'
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.url} alt={productName} className="h-full w-full object-cover" />
            </button>
          ))}

          {/* Video thumbnail — last item */}
          {youtubeId && (
            <button
              type="button"
              onClick={() => {
                setIsVideoActive(true)
                setPreferredUrl(null)
              }}
              aria-label="Ver video del producto"
              className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-lg border-2 bg-[#1E1E1E] transition-all ${
                isVideoActive ? 'border-[#0eb1c3]' : 'border-gray-100 hover:border-gray-300'
              }`}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                <path d="M8 5v14l11-7z" />
              </svg>
            </button>
          )}
        </div>
      )}
    </div>
  )
}
