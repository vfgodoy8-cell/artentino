'use client'

import { useState, useEffect, useRef } from 'react'
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
  const touchStartX = useRef<number | null>(null)

  // Reset thumbnail choice + video when selected color changes
  useEffect(() => {
    setPreferredUrl(null)
    setIsVideoActive(false)
  }, [selectedColorId])

  // Priority when a variant is selected: (1) images tagged for it,
  // (2) generic/untagged images as fallback, (3) full gallery as last resort.
  const taggedForSelected = selectedColorId
    ? galleryImages.filter((img) => img.attributeValueIds.includes(selectedColorId))
    : []
  const genericImages = galleryImages.filter((img) => img.attributeValueIds.length === 0)

  const visibleImages = !selectedColorId
    ? galleryImages
    : taggedForSelected.length > 0
      ? taggedForSelected
      : genericImages.length > 0
        ? genericImages
        : galleryImages

  const coverInVisible = visibleImages.find((img) => img.isCover) ?? visibleImages[0] ?? null
  const isPreferredVisible =
    preferredUrl !== null && visibleImages.some((img) => img.url === preferredUrl)
  const currentUrl = isPreferredVisible ? preferredUrl : coverInVisible?.url ?? null

  // All navigable items: images + optional video at end
  const totalItems = visibleImages.length + (youtubeId ? 1 : 0)
  const showArrows = totalItems > 1
  const showThumbnails = totalItems > 1

  // Compute current index for arrow navigation
  const activeIdx = isVideoActive
    ? visibleImages.length
    : visibleImages.findIndex((img) => img.url === currentUrl)

  function goToIdx(idx: number) {
    const wrapped = ((idx % totalItems) + totalItems) % totalItems
    if (youtubeId && wrapped === visibleImages.length) {
      setIsVideoActive(true)
      setPreferredUrl(null)
    } else {
      setIsVideoActive(false)
      setPreferredUrl(visibleImages[wrapped].url)
    }
  }

  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return
    const dx = e.changedTouches[0].clientX - touchStartX.current
    touchStartX.current = null
    if (Math.abs(dx) < 50) return
    goToIdx(activeIdx + (dx < 0 ? 1 : -1))
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Main image or video */}
      <div
        className="relative aspect-square overflow-hidden rounded-2xl bg-gray-50"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
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
            className="h-full w-full animate-gallery-fade object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <div className="flex h-32 w-32 items-center justify-center rounded-3xl bg-white shadow-sm">
              <CategoryIcon category={categoryName} />
            </div>
          </div>
        )}

        {/* Prev / Next arrows */}
        {showArrows && (
          <>
            <button
              type="button"
              aria-label="Imagen anterior"
              onClick={() => goToIdx(activeIdx - 1)}
              className="absolute left-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 shadow-sm backdrop-blur-sm transition-opacity duration-200 hover:bg-white"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1E1E1E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <button
              type="button"
              aria-label="Imagen siguiente"
              onClick={() => goToIdx(activeIdx + 1)}
              className="absolute right-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 shadow-sm backdrop-blur-sm transition-opacity duration-200 hover:bg-white"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1E1E1E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </>
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
              className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 transition-colors duration-200 ${
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
              className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-lg border-2 bg-[#1E1E1E] transition-colors duration-200 ${
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
