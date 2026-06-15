'use client'

import { useState, useRef, useTransition } from 'react'
import Image from 'next/image'
import { deleteProductImage, assignImageColor } from './actions'

type ProductImage = {
  id: string
  url: string
  filename: string
  size: number
  attributeValueId: string | null
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
  const [images, setImages] = useState(initial)
  const [pending, setPending] = useState<PendingFile[]>([])
  const [uploading, setUploading] = useState(false)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [, startTransition] = useTransition()
  const [, startColorTransition] = useTransition()

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
      if (res.ok) uploaded.push(await res.json())
    }
    pending.forEach((p) => URL.revokeObjectURL(p.preview))
    setPending([])
    setImages((prev) => [...prev, ...uploaded])
    setUploading(false)
  }

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
      setSelected((prev) => { const next = new Set(prev); next.delete(id); return next })
    })
  }

  function handleColorChange(imageId: string, attributeValueId: string | null) {
    setImages((prev) =>
      prev.map((img) => (img.id === imageId ? { ...img, attributeValueId } : img)),
    )
    startColorTransition(async () => {
      await assignImageColor(imageId, attributeValueId, productId)
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
        <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleFileSelect} className="hidden" />
        {pending.length > 0 && (
          <>
            <button
              type="button"
              onClick={handleUpload}
              disabled={uploading}
              className="rounded-xl px-5 py-2.5 text-sm font-bold text-white disabled:opacity-50"
              style={{ backgroundColor: '#0eb1c3' }}
            >
              {uploading ? 'Subiendo...' : `Subir ${pending.length} archivo${pending.length > 1 ? 's' : ''}`}
            </button>
            <button
              type="button"
              onClick={() => { pending.forEach((p) => URL.revokeObjectURL(p.preview)); setPending([]) }}
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
              <div key={i} className="group relative aspect-square overflow-hidden rounded-xl border-2 border-dashed border-[#0eb1c3]/40 bg-[#0eb1c3]/5">
                <Image src={p.preview} alt={p.file.name} fill className="object-cover" sizes="160px" />
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

      {/* Uploaded images grid */}
      <div>
        <p className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-400">
          Imágenes subidas ({images.length})
        </p>
        {images.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-200 py-16 text-center text-sm text-gray-400">
            Sin imágenes todavía. Seleccioná archivos y hacé clic en &quot;Subir&quot;.
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
            {images.map((img) => {
              const isSelected = selected.has(img.id)
              const assignedColor = colorValues.find((cv) => cv.id === img.attributeValueId)
              return (
                <div key={img.id} className="flex flex-col gap-1.5">
                  {/* Image card */}
                  <div
                    className={`group relative aspect-square cursor-pointer overflow-hidden rounded-xl border-2 transition-all ${
                      isSelected ? 'border-[#0eb1c3] ring-2 ring-[#0eb1c3]/30' : 'border-gray-100 hover:border-gray-300'
                    }`}
                    onClick={() => toggleSelect(img.id)}
                  >
                    <Image src={img.url} alt={img.filename} fill className="object-cover" sizes="160px" />
                    {/* Checkbox overlay */}
                    <div className={`absolute left-2 top-2 flex h-5 w-5 items-center justify-center rounded-full border-2 bg-white transition-opacity ${isSelected ? 'border-[#0eb1c3] opacity-100' : 'border-gray-300 opacity-0 group-hover:opacity-100'}`}>
                      {isSelected && <div className="h-2.5 w-2.5 rounded-full bg-[#0eb1c3]" />}
                    </div>
                    {/* Delete button */}
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); handleDeleteOne(img.id) }}
                      className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      ✕
                    </button>
                    {/* Bottom overlay: filename + color badge */}
                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 px-1.5 py-1">
                      <p className="truncate text-[10px] text-white">{img.filename}</p>
                      {assignedColor && (
                        <p className="text-[9px] font-black uppercase tracking-wide text-[#0eb1c3]">
                          ● {assignedColor.value}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Color selector — only when product has imageDriven values */}
                  {colorValues.length > 0 && (
                    <select
                      value={img.attributeValueId ?? ''}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => handleColorChange(img.id, e.target.value || null)}
                      className="w-full rounded-lg border border-gray-200 px-2 py-1 text-xs text-[#1E1E1E] focus:border-[#0eb1c3] focus:outline-none"
                    >
                      <option value="">Sin color</option>
                      {colorValues.map((cv) => (
                        <option key={cv.id} value={cv.id}>
                          {cv.value}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
