'use client'

import { useState, useRef, useTransition } from 'react'
import Image from 'next/image'
import { deleteProductImage } from './actions'

type ProductImage = {
  id: string
  url: string
  filename: string
  size: number
}

type PendingFile = {
  file: File
  preview: string
  selected: boolean
}

export default function TabImagenes({
  productId,
  initial,
}: {
  productId: string
  initial: ProductImage[]
}) {
  const [images, setImages] = useState(initial)
  const [pending, setPending] = useState<PendingFile[]>([])
  const [uploading, setUploading] = useState(false)
  const [selectedUploaded, setSelectedUploaded] = useState<Set<string>>(new Set())
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [, startTransition] = useTransition()

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    const newPending: PendingFile[] = files.map((f) => ({
      file: f,
      preview: URL.createObjectURL(f),
      selected: false,
    }))
    setPending((prev) => [...prev, ...newPending])
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  function togglePendingSelect(i: number) {
    setPending((prev) => prev.map((p, idx) => (idx === i ? { ...p, selected: !p.selected } : p)))
  }

  function handleCancelUpload() {
    pending.forEach((p) => URL.revokeObjectURL(p.preview))
    setPending([])
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
        const img = await res.json()
        uploaded.push(img)
      }
    }

    pending.forEach((p) => URL.revokeObjectURL(p.preview))
    setPending([])
    setImages((prev) => [...prev, ...uploaded])
    setUploading(false)
  }

  function toggleUploadedSelect(id: string) {
    setSelectedUploaded((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function handleDeleteSelected() {
    if (selectedUploaded.size === 0) return
    if (!confirm(`¿Eliminar ${selectedUploaded.size} imagen(es)?`)) return
    const ids = Array.from(selectedUploaded)
    startTransition(async () => {
      for (const id of ids) {
        await deleteProductImage(id, productId)
      }
      setImages((prev) => prev.filter((img) => !ids.includes(img.id)))
      setSelectedUploaded(new Set())
    })
  }

  function handleDeleteOne(id: string, filename: string) {
    if (!confirm(`¿Eliminar "${filename}"?`)) return
    startTransition(async () => {
      await deleteProductImage(id, productId)
      setImages((prev) => prev.filter((img) => img.id !== id))
      setSelectedUploaded((prev) => { const next = new Set(prev); next.delete(id); return next })
    })
  }

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-bold text-gray-600 transition-colors hover:border-[#0eb1c3] hover:text-[#0eb1c3]"
        >
          Agregar
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
              {uploading ? `Subiendo...` : `Subir (${pending.length})`}
            </button>
            <button
              type="button"
              onClick={handleCancelUpload}
              disabled={uploading}
              className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-bold text-gray-500 hover:border-red-300 hover:text-red-500 disabled:opacity-50"
            >
              Cancelar subida
            </button>
          </>
        )}
        {selectedUploaded.size > 0 && (
          <button
            type="button"
            onClick={handleDeleteSelected}
            className="rounded-xl border border-red-200 px-5 py-2.5 text-sm font-bold text-red-500 transition-colors hover:bg-red-50"
          >
            Borrar ({selectedUploaded.size})
          </button>
        )}
      </div>

      {/* Pending files (not yet uploaded) */}
      {pending.length > 0 && (
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-wider text-gray-400">
            Pendientes de subida ({pending.length})
          </p>
          <div className="space-y-2">
            {pending.map((p, i) => (
              <div key={i} className="flex items-center gap-3 rounded-xl border border-dashed border-[#0eb1c3]/40 bg-[#0eb1c3]/5 p-3">
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-gray-100">
                  <Image src={p.preview} alt={p.file.name} fill className="object-cover" sizes="80px" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-[#1E1E1E]">{p.file.name}</p>
                  <p className="text-xs text-gray-400">{Math.round(p.file.size / 1024)} KB</p>
                </div>
                <button
                  type="button"
                  onClick={() => setPending((prev) => { URL.revokeObjectURL(p.preview); return prev.filter((_, idx) => idx !== i) })}
                  className="shrink-0 rounded-lg px-3 py-1.5 text-xs font-bold text-red-400 hover:bg-red-50 hover:text-red-600"
                >
                  Quitar
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Uploaded images */}
      <div>
        <p className="mb-2 text-xs font-bold uppercase tracking-wider text-gray-400">
          Imágenes subidas ({images.length})
        </p>
        {images.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-200 py-16 text-center text-sm text-gray-400">
            Sin imágenes todavía. Agregá archivos y hacé clic en &quot;Subir&quot;.
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-gray-100 bg-white">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="px-4 py-3" />
                  <th className="px-4 py-3 text-left text-xs font-black uppercase tracking-wider text-gray-400">Imagen</th>
                  <th className="px-4 py-3 text-left text-xs font-black uppercase tracking-wider text-gray-400">Archivo</th>
                  <th className="px-4 py-3 text-left text-xs font-black uppercase tracking-wider text-gray-400">Tamaño</th>
                  <th className="px-4 py-3 text-right text-xs font-black uppercase tracking-wider text-gray-400">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {images.map((img) => (
                  <tr key={img.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedUploaded.has(img.id)}
                        onChange={() => toggleUploadedSelect(img.id)}
                        className="rounded"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="relative h-20 w-20 overflow-hidden rounded-lg border border-gray-100">
                        <Image src={img.url} alt={img.filename} fill className="object-cover" sizes="80px" />
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="max-w-xs truncate text-sm text-[#1E1E1E]">{img.filename}</p>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">{img.size} KB</td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => handleDeleteOne(img.id, img.filename)}
                        className="rounded-lg px-3 py-1.5 text-xs font-bold text-red-400 transition-colors hover:bg-red-50 hover:text-red-600"
                      >
                        Borrar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
