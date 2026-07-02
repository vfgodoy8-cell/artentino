'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { updateHeroBadge } from './actions'

type Badge = {
  id: string
  order: number
  categoryId: string
  customLabel: string | null
  customSubtitle: string
  icon: string
  isActive: boolean
  category: { id: string; name: string; slug: string }
}

type Category = {
  id: string
  name: string
  slug: string
}

const ICON_OPTIONS = [
  { value: 'mirror', label: 'Espejo' },
  { value: 'sofa', label: 'Sillón / Mueble' },
  { value: 'lamp', label: 'Lámpara' },
  { value: 'vase', label: 'Florero / Deco' },
  { value: 'star', label: 'Estrella / Destacado' },
]

export default function HeroBadgesTab({
  initial,
  categories,
}: {
  initial: Badge[]
  categories: Category[]
}) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  function handleSave(order: number, data: { categoryId: string; customLabel: string; customSubtitle: string; icon: string }) {
    startTransition(async () => {
      await updateHeroBadge(order, {
        categoryId: data.categoryId,
        customLabel: data.customLabel || null,
        customSubtitle: data.customSubtitle,
        icon: data.icon,
      })
      router.refresh()
    })
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-black text-[#1E1E1E]">Botones destacados</h2>
        <p className="mt-0.5 text-sm text-[#9ca3af]">
          Exactamente 2 botones flotantes en la esquina inferior derecha del hero. El primero es blanco, el segundo teal.
        </p>
      </div>

      {isPending && (
        <div className="mb-4 rounded-lg bg-[#f0fdfc] px-4 py-2 text-sm font-semibold text-[#0eb1c3]">
          Guardando…
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {[0, 1].map((order) => {
          const badge = initial.find((b) => b.order === order)
          return (
            <BadgeSlotForm
              key={order}
              order={order}
              badge={badge ?? null}
              categories={categories}
              onSave={(data) => handleSave(order, data)}
              isPending={isPending}
            />
          )
        })}
      </div>
    </div>
  )
}

function BadgeSlotForm({
  order,
  badge,
  categories,
  onSave,
  isPending,
}: {
  order: number
  badge: Badge | null
  categories: Category[]
  onSave: (data: { categoryId: string; customLabel: string; customSubtitle: string; icon: string }) => void
  isPending: boolean
}) {
  const [categoryId, setCategoryId] = useState(badge?.categoryId ?? '')
  const [customLabel, setCustomLabel] = useState(badge?.customLabel ?? '')
  const [customSubtitle, setCustomSubtitle] = useState(badge?.customSubtitle ?? '')
  const [icon, setIcon] = useState(badge?.icon ?? 'star')

  const isTeal = order === 1
  const canSave = categoryId && customSubtitle

  return (
    <div className="overflow-hidden rounded-xl border border-[#e5e7eb] bg-white">
      {/* Header */}
      <div className={`flex items-center gap-3 px-5 py-3 ${isTeal ? 'bg-[#0eb1c3]' : 'bg-[#f3f4f6]'}`}>
        <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${isTeal ? 'bg-white/20' : 'bg-white'}`}>
          <BadgeIconPreview icon={icon} teal={isTeal} />
        </div>
        <span className={`text-xs font-black uppercase tracking-wider ${isTeal ? 'text-white' : 'text-[#1E1E1E]'}`}>
          Botón {order + 1} — {isTeal ? 'Teal' : 'Blanco'}
        </span>
      </div>

      <div className="space-y-4 p-5">
        {/* Category */}
        <div>
          <label className="mb-1 block text-xs font-black uppercase tracking-wider text-[#6b7280]">
            Categoría *
          </label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full rounded-lg border border-[#e5e7eb] px-3 py-2 text-sm text-[#1E1E1E] focus:outline-none focus:ring-2 focus:ring-[#0eb1c3]"
          >
            <option value="">— Seleccioná una categoría —</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          {categoryId && (
            <p className="mt-1 text-[11px] text-[#9ca3af]">
              Link: /catalogo?categoria={categories.find((c) => c.id === categoryId)?.slug}
            </p>
          )}
        </div>

        {/* Custom label */}
        <div>
          <label className="mb-1 block text-xs font-black uppercase tracking-wider text-[#6b7280]">
            Etiqueta <span className="font-normal text-[#9ca3af]">(si se deja vacío usa el nombre de la categoría)</span>
          </label>
          <input
            type="text"
            value={customLabel}
            onChange={(e) => setCustomLabel(e.target.value)}
            placeholder={categories.find((c) => c.id === categoryId)?.name ?? 'Nombre del botón'}
            className="w-full rounded-lg border border-[#e5e7eb] px-3 py-2 text-sm text-[#1E1E1E] focus:outline-none focus:ring-2 focus:ring-[#0eb1c3]"
          />
        </div>

        {/* Subtitle */}
        <div>
          <label className="mb-1 block text-xs font-black uppercase tracking-wider text-[#6b7280]">
            Subtítulo *
          </label>
          <input
            type="text"
            value={customSubtitle}
            onChange={(e) => setCustomSubtitle(e.target.value)}
            placeholder="Redondos, rectangulares y a medida"
            className="w-full rounded-lg border border-[#e5e7eb] px-3 py-2 text-sm text-[#1E1E1E] focus:outline-none focus:ring-2 focus:ring-[#0eb1c3]"
          />
        </div>

        {/* Icon picker */}
        <div>
          <label className="mb-2 block text-xs font-black uppercase tracking-wider text-[#6b7280]">
            Ícono
          </label>
          <div className="flex flex-wrap gap-2">
            {ICON_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setIcon(opt.value)}
                className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-semibold transition-colors ${
                  icon === opt.value
                    ? 'border-[#0eb1c3] bg-[#f0fdfc] text-[#0eb1c3]'
                    : 'border-[#e5e7eb] text-[#6b7280] hover:border-[#0eb1c3] hover:text-[#0eb1c3]'
                }`}
              >
                <BadgeIconPreview icon={opt.value} teal />
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Save */}
        <button
          onClick={() => canSave && onSave({ categoryId, customLabel, customSubtitle, icon })}
          disabled={!canSave || isPending}
          className="w-full rounded-lg bg-[#0eb1c3] py-2 text-sm font-bold text-white transition-colors hover:bg-[#0a8f9e] disabled:cursor-not-allowed disabled:opacity-40"
        >
          Guardar botón {order + 1}
        </button>
      </div>
    </div>
  )
}

function BadgeIconPreview({ icon, teal }: { icon: string; teal?: boolean }) {
  const stroke = teal ? '#0eb1c3' : '#6b7280'
  const props = {
    width: 18,
    height: 18,
    viewBox: '0 0 24 24',
    fill: 'none' as const,
    stroke,
    strokeWidth: 1.5,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  }
  switch (icon) {
    case 'mirror':
      return (
        <svg {...props}>
          <ellipse cx="12" cy="11" rx="6" ry="7.5" />
          <line x1="12" y1="18.5" x2="12" y2="22" />
          <line x1="9" y1="22" x2="15" y2="22" />
        </svg>
      )
    case 'sofa':
      return (
        <svg {...props}>
          <rect x="5" y="6" width="14" height="8" rx="2" />
          <rect x="3" y="10" width="3" height="6" rx="1" />
          <rect x="18" y="10" width="3" height="6" rx="1" />
          <line x1="7" y1="14" x2="7" y2="18" />
          <line x1="17" y1="14" x2="17" y2="18" />
        </svg>
      )
    case 'lamp':
      return (
        <svg {...props}>
          <line x1="12" y1="2" x2="12" y2="22" />
          <path d="M5 12l7-10 7 10" />
          <line x1="8" y1="22" x2="16" y2="22" />
        </svg>
      )
    case 'vase':
      return (
        <svg {...props}>
          <path d="M9 2h6l1 4a8 8 0 0 1-8 0L9 2z" />
          <path d="M8 6c-2 3-2 9 4 14M16 6c2 3 2 9-4 14" />
          <line x1="7" y1="20" x2="17" y2="20" />
        </svg>
      )
    case 'star':
    default:
      return (
        <svg {...props}>
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      )
  }
}
