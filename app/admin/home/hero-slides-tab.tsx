'use client'

import { useState, useTransition, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createHeroSlide, updateHeroSlide, deleteHeroSlide, moveHeroSlide, updateSiteConfig } from './actions'

type Slide = {
  id: string
  order: number
  imageUrl: string
  imageUrlMobile: string | null
  eyebrowText: string
  title: string
  titleHighlightWord: string | null
  description: string
  isActive: boolean
}

type FormValues = {
  imageUrl: string
  imageUrlMobile: string
  eyebrowText: string
  title: string
  titleHighlightWord: string
  description: string
  isActive: boolean
}

const emptyForm = (): FormValues => ({
  imageUrl: '',
  imageUrlMobile: '',
  eyebrowText: 'Arte · Diseño · Hogar',
  title: '',
  titleHighlightWord: '',
  description: '',
  isActive: true,
})

function slideToForm(s: Slide): FormValues {
  return {
    imageUrl: s.imageUrl,
    imageUrlMobile: s.imageUrlMobile ?? '',
    eyebrowText: s.eyebrowText,
    title: s.title,
    titleHighlightWord: s.titleHighlightWord ?? '',
    description: s.description,
    isActive: s.isActive,
  }
}

export default function HeroSlidesTab({
  initial,
  intervalSeconds: initialInterval,
}: {
  initial: Slide[]
  intervalSeconds: number
}) {
  const router = useRouter()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showNew, setShowNew] = useState(false)
  const [interval, setInterval_] = useState(initialInterval)
  const [isPending, startTransition] = useTransition()

  function run(action: () => Promise<void>) {
    startTransition(async () => {
      await action()
      router.refresh()
    })
  }

  function handleMove(id: string, direction: 'up' | 'down') {
    run(() => moveHeroSlide(id, direction))
  }

  function handleDelete(id: string) {
    if (!confirm('¿Eliminár este slide? Esta acción no se puede deshacer.')) return
    run(() => deleteHeroSlide(id))
  }

  function handleSaveSlide(id: string, values: FormValues) {
    run(async () => {
      await updateHeroSlide(id, {
        imageUrl: values.imageUrl,
        imageUrlMobile: values.imageUrlMobile || null,
        eyebrowText: values.eyebrowText,
        title: values.title,
        titleHighlightWord: values.titleHighlightWord || null,
        description: values.description,
        isActive: values.isActive,
      })
    })
    setEditingId(null)
  }

  function handleCreateSlide(values: FormValues) {
    run(() => createHeroSlide({
      imageUrl: values.imageUrl,
      imageUrlMobile: values.imageUrlMobile || null,
      eyebrowText: values.eyebrowText,
      title: values.title,
      titleHighlightWord: values.titleHighlightWord || null,
      description: values.description,
      isActive: values.isActive,
    }))
    setShowNew(false)
  }

  function handleSaveInterval() {
    run(() => updateSiteConfig({ heroIntervalSeconds: interval }))
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-[#1E1E1E]">Galería del Hero</h2>
          <p className="mt-0.5 text-sm text-[#9ca3af]">
            Slides del carrusel principal. Recomendado: 1920×1000px, JPG/WebP, &lt;500KB.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-[#e5e7eb] bg-white px-4 py-2.5">
          <span className="text-sm font-semibold text-[#1E1E1E]">Auto-rotación</span>
          <input
            type="number"
            min={2}
            max={30}
            value={interval}
            onChange={(e) => setInterval_(Number(e.target.value))}
            className="w-16 rounded-lg border border-[#e5e7eb] px-2 py-1 text-center text-sm font-bold text-[#1E1E1E] focus:outline-none focus:ring-2 focus:ring-[#0eb1c3]"
          />
          <span className="text-sm text-[#9ca3af]">seg</span>
          <button
            onClick={handleSaveInterval}
            disabled={isPending}
            className="rounded-lg bg-[#0eb1c3] px-3 py-1 text-xs font-black uppercase tracking-wide text-white transition-colors hover:bg-[#0a8f9e] disabled:opacity-50"
          >
            Guardar
          </button>
        </div>
      </div>

      {isPending && (
        <div className="mb-4 rounded-lg bg-[#f0fdfc] px-4 py-2 text-sm font-semibold text-[#0eb1c3]">
          Guardando…
        </div>
      )}

      {/* Slides list */}
      <div className="space-y-3">
        {initial.length === 0 && !showNew && (
          <div className="rounded-xl border-2 border-dashed border-[#e5e7eb] py-12 text-center text-sm text-[#9ca3af]">
            No hay slides. Agregá el primero abajo.
          </div>
        )}

        {initial.map((slide, idx) => (
          <div key={slide.id} className="overflow-hidden rounded-xl border border-[#e5e7eb] bg-white">
            {/* Row header */}
            <div className="flex items-center gap-4 p-4">
              {/* Thumbnail */}
              <div className="h-16 w-24 shrink-0 overflow-hidden rounded-lg bg-[#f3f4f6]">
                {slide.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={slide.imageUrl} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <ImagePlaceholderIcon />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate font-bold text-[#1E1E1E]">{slide.title || '(Sin título)'}</p>
                  {!slide.isActive && (
                    <span className="shrink-0 rounded-full bg-[#f3f4f6] px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-[#9ca3af]">
                      Inactivo
                    </span>
                  )}
                </div>
                <p className="truncate text-xs text-[#9ca3af]">{slide.eyebrowText}</p>
                <p className="truncate text-xs text-[#6b7280]">{slide.description}</p>
              </div>

              {/* Actions */}
              <div className="flex shrink-0 items-center gap-1">
                <button
                  onClick={() => handleMove(slide.id, 'up')}
                  disabled={idx === 0 || isPending}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-[#9ca3af] transition-colors hover:bg-[#f3f4f6] hover:text-[#1E1E1E] disabled:cursor-not-allowed disabled:opacity-30"
                  title="Subir"
                >
                  <ChevronUpIcon />
                </button>
                <button
                  onClick={() => handleMove(slide.id, 'down')}
                  disabled={idx === initial.length - 1 || isPending}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-[#9ca3af] transition-colors hover:bg-[#f3f4f6] hover:text-[#1E1E1E] disabled:cursor-not-allowed disabled:opacity-30"
                  title="Bajar"
                >
                  <ChevronDownIcon />
                </button>
                <button
                  onClick={() => setEditingId(editingId === slide.id ? null : slide.id)}
                  className="ml-1 rounded-lg border border-[#e5e7eb] px-3 py-1.5 text-xs font-bold text-[#1E1E1E] transition-colors hover:border-[#0eb1c3] hover:text-[#0eb1c3]"
                >
                  {editingId === slide.id ? 'Cerrar' : 'Editar'}
                </button>
                <button
                  onClick={() => handleDelete(slide.id)}
                  disabled={isPending}
                  className="ml-1 rounded-lg border border-[#fee2e2] px-3 py-1.5 text-xs font-bold text-[#ef4444] transition-colors hover:bg-[#fee2e2] disabled:opacity-50"
                >
                  Eliminar
                </button>
              </div>
            </div>

            {/* Inline edit form */}
            {editingId === slide.id && (
              <div className="border-t border-[#e5e7eb] bg-[#f9fafb] p-5">
                <SlideForm
                  initial={slideToForm(slide)}
                  onSave={(v) => handleSaveSlide(slide.id, v)}
                  onCancel={() => setEditingId(null)}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* New slide form */}
      {showNew ? (
        <div className="mt-3 overflow-hidden rounded-xl border border-[#0eb1c3] bg-white">
          <div className="border-b border-[#e5e7eb] px-5 py-3">
            <p className="font-bold text-[#1E1E1E]">Nuevo slide</p>
          </div>
          <div className="p-5">
            <SlideForm
              initial={emptyForm()}
              onSave={handleCreateSlide}
              onCancel={() => setShowNew(false)}
              isNew
            />
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowNew(true)}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[#e5e7eb] py-4 text-sm font-bold text-[#9ca3af] transition-colors hover:border-[#0eb1c3] hover:text-[#0eb1c3]"
        >
          <PlusIcon />
          Agregar slide
        </button>
      )}
    </div>
  )
}

function SlideForm({
  initial,
  onSave,
  onCancel,
  isNew = false,
}: {
  initial: FormValues
  onSave: (v: FormValues) => void
  onCancel: () => void
  isNew?: boolean
}) {
  const [values, setValues] = useState(initial)
  const [uploading, setUploading] = useState(false)
  const [uploadingMobile, setUploadingMobile] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const fileMobileRef = useRef<HTMLInputElement>(null)

  const set = useCallback((key: keyof FormValues, val: string | boolean) => {
    setValues((v) => ({ ...v, [key]: val }))
  }, [])

  async function uploadImage(file: File, field: 'imageUrl' | 'imageUrlMobile') {
    const setLoading = field === 'imageUrl' ? setUploading : setUploadingMobile
    setLoading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/admin/upload-hero', { method: 'POST', body: fd })
      const data = await res.json()
      if (data.url) setValues((v) => ({ ...v, [field]: data.url }))
    } catch (e) {
      console.error('upload failed', e)
    } finally {
      setLoading(false)
    }
  }

  const canSave = values.imageUrl.trim() && values.title.trim()

  return (
    <div className="space-y-5">
      {/* Images */}
      <div className="grid gap-4 sm:grid-cols-2">
        {/* Desktop image */}
        <div>
          <label className="mb-1 block text-xs font-black uppercase tracking-wider text-[#6b7280]">
            Imagen principal (desktop)
          </label>
          <p className="mb-2 text-[11px] text-[#9ca3af]">
            Recomendado: 1920×1000px — JPG/WebP — &lt;500KB
          </p>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="relative flex h-28 w-full items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-[#e5e7eb] bg-[#f9fafb] transition-colors hover:border-[#0eb1c3]"
          >
            {uploading ? (
              <Spinner />
            ) : values.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={values.imageUrl} alt="" className="h-full w-full object-cover" />
            ) : (
              <div className="flex flex-col items-center gap-1 text-[#9ca3af]">
                <UploadIcon />
                <span className="text-xs font-semibold">Clic para subir</span>
              </div>
            )}
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && uploadImage(e.target.files[0], 'imageUrl')}
          />
          {values.imageUrl && (
            <input
              type="text"
              value={values.imageUrl}
              onChange={(e) => set('imageUrl', e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-[#e5e7eb] px-3 py-1.5 text-[11px] text-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#0eb1c3]"
              placeholder="URL de imagen"
            />
          )}
        </div>

        {/* Mobile image */}
        <div>
          <label className="mb-1 block text-xs font-black uppercase tracking-wider text-[#6b7280]">
            Imagen mobile <span className="font-normal text-[#9ca3af]">(opcional)</span>
          </label>
          <p className="mb-2 text-[11px] text-[#9ca3af]">
            Recomendado: 768×900px — si no se sube, usa la imagen principal
          </p>
          <button
            type="button"
            onClick={() => fileMobileRef.current?.click()}
            className="relative flex h-28 w-full items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-[#e5e7eb] bg-[#f9fafb] transition-colors hover:border-[#0eb1c3]"
          >
            {uploadingMobile ? (
              <Spinner />
            ) : values.imageUrlMobile ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={values.imageUrlMobile} alt="" className="h-full w-full object-cover" />
            ) : (
              <div className="flex flex-col items-center gap-1 text-[#9ca3af]">
                <UploadIcon />
                <span className="text-xs font-semibold">Clic para subir</span>
              </div>
            )}
          </button>
          <input
            ref={fileMobileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && uploadImage(e.target.files[0], 'imageUrlMobile')}
          />
        </div>
      </div>

      {/* Text fields */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-black uppercase tracking-wider text-[#6b7280]">
            Eyebrow
          </label>
          <input
            type="text"
            value={values.eyebrowText}
            onChange={(e) => set('eyebrowText', e.target.value)}
            placeholder="Arte · Diseño · Hogar"
            className="w-full rounded-lg border border-[#e5e7eb] px-3 py-2 text-sm text-[#1E1E1E] focus:outline-none focus:ring-2 focus:ring-[#0eb1c3]"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-black uppercase tracking-wider text-[#6b7280]">
            Palabra destacada <span className="font-normal text-[#0eb1c3]">(teal)</span>
          </label>
          <input
            type="text"
            value={values.titleHighlightWord}
            onChange={(e) => set('titleHighlightWord', e.target.value)}
            placeholder="ej. reflejan"
            className="w-full rounded-lg border border-[#e5e7eb] px-3 py-2 text-sm text-[#1E1E1E] focus:outline-none focus:ring-2 focus:ring-[#0eb1c3]"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-xs font-black uppercase tracking-wider text-[#6b7280]">
          Título *
        </label>
        <input
          type="text"
          value={values.title}
          onChange={(e) => set('title', e.target.value)}
          placeholder="Espacios que reflejan tu estilo"
          className="w-full rounded-lg border border-[#e5e7eb] px-3 py-2 text-sm text-[#1E1E1E] focus:outline-none focus:ring-2 focus:ring-[#0eb1c3]"
        />
        {values.title && values.titleHighlightWord && (
          <p className="mt-1 text-[11px] text-[#6b7280]">
            Preview:{' '}
            {values.title.split(values.titleHighlightWord).map((part, i, arr) =>
              i < arr.length - 1 ? (
                <span key={i}>
                  {part}
                  <span className="font-bold italic text-[#0eb1c3]">{values.titleHighlightWord}</span>
                </span>
              ) : (
                <span key={i}>{part}</span>
              ),
            )}
          </p>
        )}
      </div>

      <div>
        <label className="mb-1 block text-xs font-black uppercase tracking-wider text-[#6b7280]">
          Descripción *
        </label>
        <textarea
          value={values.description}
          onChange={(e) => set('description', e.target.value)}
          rows={3}
          placeholder="Espejos LED, muebles y deco que transforman cada rincón de tu hogar."
          className="w-full resize-none rounded-lg border border-[#e5e7eb] px-3 py-2 text-sm text-[#1E1E1E] focus:outline-none focus:ring-2 focus:ring-[#0eb1c3]"
        />
      </div>

      {/* isActive */}
      <label className="flex cursor-pointer items-center gap-3">
        <div
          onClick={() => set('isActive', !values.isActive)}
          className={`relative h-5 w-9 rounded-full transition-colors ${values.isActive ? 'bg-[#0eb1c3]' : 'bg-[#d1d5db]'}`}
        >
          <span
            className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${values.isActive ? 'translate-x-4' : 'translate-x-0.5'}`}
          />
        </div>
        <span className="text-sm font-semibold text-[#1E1E1E]">Slide activo</span>
      </label>

      {/* Actions */}
      <div className="flex justify-end gap-2 pt-1">
        <button
          onClick={onCancel}
          className="rounded-lg border border-[#e5e7eb] px-4 py-2 text-sm font-bold text-[#6b7280] transition-colors hover:bg-[#f3f4f6]"
        >
          Cancelar
        </button>
        <button
          onClick={() => canSave && onSave(values)}
          disabled={!canSave}
          className="rounded-lg bg-[#0eb1c3] px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-[#0a8f9e] disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isNew ? 'Agregar slide' : 'Guardar cambios'}
        </button>
      </div>
    </div>
  )
}

function Spinner() {
  return (
    <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#e5e7eb] border-t-[#0eb1c3]" />
  )
}

function UploadIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 16 12 12 8 16" /><line x1="12" y1="12" x2="12" y2="21" />
      <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
    </svg>
  )
}

function ImagePlaceholderIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5" strokeLinecap="round">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </svg>
  )
}

function ChevronUpIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="18 15 12 9 6 15" /></svg>
  )
}

function ChevronDownIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="6 9 12 15 18 9" /></svg>
  )
}

function PlusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
  )
}
