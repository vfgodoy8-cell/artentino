'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { updateSiteConfig } from './actions'

export default function MarqueeSection({
  initialEnabled,
  initialItems,
}: {
  initialEnabled: boolean
  initialItems: string[]
}) {
  const [enabled, setEnabled] = useState(initialEnabled)
  const [items, setItems] = useState(initialItems.length > 0 ? initialItems : [''])
  const [saved, setSaved] = useState(false)
  const [, startT] = useTransition()
  const router = useRouter()

  function persist(nextEnabled: boolean, nextItems: string[]) {
    startT(async () => {
      await updateSiteConfig({
        marqueeEnabled: nextEnabled,
        marqueeItems: nextItems.map((i) => i.trim()).filter(Boolean),
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
      router.refresh()
    })
  }

  function handleToggle() {
    const next = !enabled
    setEnabled(next)
    persist(next, items)
  }

  function handleItemChange(i: number, value: string) {
    setItems((prev) => prev.map((it, idx) => (idx === i ? value : it)))
  }

  function handleAdd() {
    setItems((prev) => [...prev, ''])
  }

  function handleRemove(i: number) {
    setItems((prev) => prev.filter((_, idx) => idx !== i))
  }

  function handleMove(i: number, direction: 'up' | 'down') {
    setItems((prev) => {
      const target = direction === 'up' ? i - 1 : i + 1
      if (target < 0 || target >= prev.length) return prev
      const next = [...prev]
      ;[next[i], next[target]] = [next[target], next[i]]
      return next
    })
  }

  function handleSave() {
    persist(enabled, items)
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-black text-[#1E1E1E]">Barra de anuncios (marquee)</h2>
          <p className="mt-1 text-sm text-[#9ca3af]">
            Textos que rotan en la barra superior del sitio, arriba del header.
          </p>
        </div>
        <button
          onClick={handleToggle}
          className={`inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors ${
            enabled ? 'bg-[#0eb1c3]' : 'bg-gray-200'
          }`}
          aria-pressed={enabled}
        >
          <span
            className={`h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
              enabled ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      <div className="max-w-2xl space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <input
              type="text"
              value={item}
              onChange={(e) => handleItemChange(i, e.target.value)}
              className="flex-1 rounded-xl border border-[#e5e7eb] px-4 py-2.5 text-sm text-[#1E1E1E] focus:border-[#0eb1c3] focus:outline-none"
              placeholder="Ej: ENVÍOS A TODO EL PAÍS"
            />
            <button
              onClick={() => handleMove(i, 'up')}
              disabled={i === 0}
              className="rounded-lg px-2 py-1.5 text-gray-400 hover:bg-gray-100 disabled:opacity-30"
              aria-label="Mover arriba"
            >
              ↑
            </button>
            <button
              onClick={() => handleMove(i, 'down')}
              disabled={i === items.length - 1}
              className="rounded-lg px-2 py-1.5 text-gray-400 hover:bg-gray-100 disabled:opacity-30"
              aria-label="Mover abajo"
            >
              ↓
            </button>
            <button
              onClick={() => handleRemove(i)}
              className="rounded-lg px-2 py-1.5 text-red-400 hover:bg-red-50"
              aria-label="Eliminar"
            >
              ✕
            </button>
          </div>
        ))}

        <button onClick={handleAdd} className="text-sm font-bold text-[#0eb1c3] hover:underline">
          + Agregar texto
        </button>

        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={handleSave}
            className="rounded-xl px-5 py-2 text-sm font-bold text-white transition-colors"
            style={{ backgroundColor: saved ? '#1E1E1E' : '#0eb1c3' }}
          >
            {saved ? '¡Guardado!' : 'Guardar'}
          </button>
        </div>
      </div>
    </div>
  )
}
