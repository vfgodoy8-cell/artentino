'use client'

import { useState, useRef, useTransition } from 'react'
import Image from 'next/image'
import {
  deleteProductImage,
  updateImageSortOrder,
  setCoverImage,
  setImageAttributeValues,
} from './actions'

type ProductImage = {
  id: string
  url: string
  filename: string
  size: number
  sortOrder: number
  isCover: boolean
  attributeValueIds: string[]
}
type PendingFile = { file: File; preview: string }

export default function TabImagenes({
  productId,
  initial,
  colorValues,
}: {
  productId: string
  initial: ProductImage[]
  colorValues: { id: string; value: string }[]
}) {
  const [images, setImages] = useState(() =>
    [...initial].sort((a, b) => a.sortOrder - b.sortOrder),
  )
  const [pending, setPending] = useState<PendingFile[]>([])
  const [uploading, setUploading] = useState(false)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [, startTransition] = useTransition()

  // ── File select ────────────────────────────────────────────────────────
  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    setPending((prev) => [
      ...prev,
      ...files.map((f) => ({ file: f, preview: URL.createObjectURL(f) })),
    ])
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  function removePending(i: number) {
    setPending((prev) => {
      URL.revokeObjectURL(prev[i].preview)
      return prev.filter((_, idx) => idx !== i)
    })
  }

  async function handleUpload() {
    if (pending.length === 0) return
    setUploading(true)
    const uploaded: ProductImage[] = []
    for (const p of pending) {
      const formData = new FormData()
      formData.append('file', p.file)
      formData.append('productId', productId)
      const res = await fetch('/api/admin/upload', { method: 'POST', body: formData })
      if (res.ok) {
        const raw = await res.json()
        uploaded.push({ ...raw, attributeValueIds: [] })
      }
    }
    pending.forEach((p) => URL.revokeObjectURL(p.preview))
    setPending([])
    setImages((prev) => [...prev, ...uploaded])
    setUploading(false)
  }

  // ── Multi-select for batch delete ──────────────────────────────────────
  function toggleSelect(id: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function handleDeleteSelected() {
    if (selected.size === 0) return
    if (!confirm(`¿Eliminar ${selected.size} imagen(es)?`)) return
    const ids = Array.from(selected)
    startTransition(async () => {
      for (const id of ids) await deleteProductImage(id, productId)
      setImages((prev) => prev.filter((img) => !ids.includes(img.id)))
      setSelected(new Set())
    })
  }

  function handleDeleteOne(id: string) {
    if (!confirm('¿Eliminar esta imagen?')) return
    startTransition(async () => {
      await deleteProductImage(id, productId)
      setImages((prev) => prev.filter((img) => img.id !== id))
      setSelected((prev) => {
        const next = new Set(prev)
        next.delete(id)
        return next
      })
    })
  }

  // ── Cover (radio behavior) ─────────────────────────────────────────────
  function handleCover(imageId: string) {
    if (images.find((img) => img.id === imageId)?.isCover) return
    setImages((prev) => prev.map((img) => ({ ...img, isCover: img.id === imageId })))
    startTransition(async () => {
      await setCoverImage(productId, imageId)
    })
  }

  // ── sortOrder callback (called from ImageCard on blur) ─────────────────
  function handleSortOrderUpdate(imageId: string, sortOrder: number) {
    setImages((prev) => prev.map((img) => (img.id === imageId ? { ...img, sortOrder } : img)))
  }

  // ── Color chips ────────────────────────────────────────────────────────
  function handleChipToggle(imageId: string, colorValueId: string) {
    const img = images.find((i) => i.id === imageId)!
    const has = img.attributeValueIds.includes(colorValueId)
    const newIds = has
      ? img.attributeValueIds.filter((id) => id !== colorValueId)
      : [...img.attributeValueIds, colorValueId]

    setImages((prev) =>
      prev.map((i) => (i.id === imageId ? { ...i, attributeValueIds: newIds } : i)),
    )
    startTransition(async () => {
      await setImageAttributeValues(imageId, newIds, productId)
    })
  }

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-bold text-gray-600 transition-colors hover:border-[#0eb1c3] hover:text-[#0eb1c3]"
        >
          + Seleccionar archivos
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />
        {pending.length > 0 && (
          <>
            <button
              type="button"
              onClick={handleUpload}
              disabled={uploading}
              className="rounded-xl px-5 py-2.5 text-sm font-bold text-white disabled:opacity-50"
              style={{ backgroundColor: '#0eb1c3' }}
            >
              {uploading
                ? 'Subiendo...'
                : `Subir ${pending.length} archivo${pending.length > 1 ? 's' : ''}`}
            </button>
            <button
              type="button"
              onClick={() => {
                pending.forEach((p) => URL.revokeObjectURL(p.preview))
                setPending([])
              }}
              disabled={uploading}
              className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-bold text-gray-500 hover:border-red-300 hover:text-red-500 disabled:opacity-50"
            >
              Cancelar
            </button>
          </>
        )}
        {selected.size > 0 && (
          <button
            type="button"
            onClick={handleDeleteSelected}
            className="rounded-xl border border-red-200 px-5 py-2.5 text-sm font-bold text-red-500 transition-colors hover:bg-red-50"
          >
            Borrar selección ({selected.size})
          </button>
        )}
      </div>

      {/* Pending preview */}
      {pending.length > 0 && (
        <div>
          <p className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-400">
            Pendientes de subida ({pending.length})
          </p>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
            {pending.map((p, i) => (
              <div
                key={i}
                className="group relative aspect-square overflow-hidden rounded-xl border-2 border-dashed border-[#0eb1c3]/40 bg-[#0eb1c3]/5"
              >
                <Image
                  src={p.preview}
                  alt={p.file.name}
                  fill
                  className="object-cover"
                  sizes="160px"
                />
                <button
                  type="button"
                  onClick={() => removePending(i)}
                  className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100"
                >
                  ✕
                </button>
                <div className="absolute bottom-0 left-0 right-0 bg-black/50 px-1.5 py-1">
                  <p className="truncate text-[10px] text-white">{p.file.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Uploaded images grid — ordered by sortOrder */}
      <div>
        <p className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-400">
          Imágenes subidas ({images.length})
        </p>
        {images.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-200 py-16 text-center text-sm text-gray-400">
            Sin imágenes todavía. Seleccioná archivos y hacé clic en &quot;Subir&quot;.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {images.map((img) => (
              <ImageCard
                key={img.id}
                img={img}
                productId={productId}
                isSelected={selected.has(img.id)}
                colorValues={colorValues}
                onToggleSelect={() => toggleSelect(img.id)}
                onDeleteOne={() => handleDeleteOne(img.id)}
                onCover={() => handleCover(img.id)}
                onSortOrderUpdate={(so) => handleSortOrderUpdate(img.id, so)}
                onChipToggle={(cvId) => handleChipToggle(img.id, cvId)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function ImageCard({
  img,
  productId,
  isSelected,
  colorValues,
  onToggleSelect,
  onDeleteOne,
  onCover,
  onSortOrderUpdate,
  onChipToggle,
}: {
  img: ProductImage
  productId: string
  isSelected: boolean
  colorValues: { id: string; value: string }[]
  onToggleSelect: () => void
  onDeleteOne: () => void
  onCover: () => void
  onSortOrderUpdate: (sortOrder: number) => void
  onChipToggle: (colorValueId: string) => void
}) {
  const [sortOrder, setSortOrder] = useState(img.sortOrder)
  const [, startTransition] = useTransition()

  function handleSortOrderBlur() {
    if (sortOrder === img.sortOrder) return
    startTransition(async () => {
      await updateImageSortOrder(img.id, sortOrder, productId)
      onSortOrderUpdate(sortOrder)
    })
  }

  return (
    <div className="flex flex-col gap-2">
      {/* Image thumbnail */}
      <div
        className={`group relative aspect-square cursor-pointer overflow-hidden rounded-xl border-2 transition-all ${
          isSelected
            ? 'border-[#0eb1c3] ring-2 ring-[#0eb1c3]/30'
            : 'border-gray-100 hover:border-gray-300'
        }`}
        onClick={onToggleSelect}
      >
        <Image src={img.url} alt={img.filename} fill className="object-cover" sizes="220px" />

        {/* Portada badge */}
        {img.isCover && (
          <div className="absolute left-2 top-2 z-10 rounded-full bg-[#0eb1c3] px-2 py-0.5 text-[9px] font-black uppercase tracking-wide text-white shadow">
            Portada
          </div>
        )}

        {/* Selection indicator */}
        <div
          className={`absolute right-8 top-2 z-10 flex h-5 w-5 items-center justify-center rounded-full border-2 bg-white transition-opacity ${
            isSelected
              ? 'border-[#0eb1c3] opacity-100'
              : 'border-gray-300 opacity-0 group-hover:opacity-100'
          }`}
        >
          {isSelected && <div className="h-2.5 w-2.5 rounded-full bg-[#0eb1c3]" />}
        </div>

        {/* Delete button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onDeleteOne()
          }}
          className="absolute right-1 top-1 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100"
        >
          ✕
        </button>

        {/* Filename overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-black/50 px-1.5 py-1">
          <p className="truncate text-[10px] text-white">{img.filename}</p>
        </div>
      </div>

      {/* Pos + Portada controls */}
      <div className="flex items-center gap-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Pos</span>
        <input
          type="number"
          value={sortOrder}
          onChange={(e) => setSortOrder(Number(e.target.value))}
          onBlur={handleSortOrderBlur}
          onClick={(e) => e.stopPropagation()}
          min={0}
          className="w-14 rounded border border-gray-200 px-2 py-1 text-center text-xs focus:border-[#0eb1c3] focus:outline-none"
        />
        <label
          className="ml-auto flex cursor-pointer items-center gap-1.5 text-[11px] text-gray-500"
          onClick={(e) => e.stopPropagation()}
        >
          <input
            type="checkbox"
            checked={img.isCover}
            onChange={onCover}
            className="accent-[#0eb1c3]"
          />
          Portada
        </label>
      </div>

      {/* Color chips — only when product has imageDriven values */}
      {colorValues.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {colorValues.map((cv) => {
            const active = img.attributeValueIds.includes(cv.id)
            return (
              <button
                key={cv.id}
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  onChipToggle(cv.id)
                }}
                className={`rounded-full px-2 py-0.5 text-[10px] font-bold transition-colors ${
                  active
                    ? 'bg-[#0eb1c3] text-white'
                    : 'border border-gray-200 bg-white text-gray-400 hover:border-[#0eb1c3] hover:text-[#0eb1c3]'
                }`}
              >
                {cv.value}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
