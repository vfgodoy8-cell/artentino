'use client'

import { useState } from 'react'

type VariantEntry = { id: string; value: string }

type Props = {
  variantGroups: Record<string, VariantEntry[]>
  stockByValueId?: Record<string, number>
  onSelect?: (attrName: string, valueId: string) => void
}

export default function VariantSelector({ variantGroups, stockByValueId, onSelect }: Props) {
  const [selectedIds, setSelectedIds] = useState<Record<string, string>>({})
  const entries = Object.entries(variantGroups)
  if (entries.length === 0) return null

  return (
    <div className="flex flex-col gap-3">
      {entries.map(([attr, values]) => {
        const selectedId = selectedIds[attr] ?? ''
        const selectedEntry = values.find((v) => v.id === selectedId)
        return (
          <div key={attr}>
            <p className="mb-1.5 text-xs font-black uppercase tracking-wider text-gray-400">
              {attr}
              {selectedEntry && (
                <span className="ml-1.5 font-semibold normal-case tracking-normal text-[#1E1E1E]">
                  — {selectedEntry.value}
                </span>
              )}
            </p>
            <div className="flex flex-wrap gap-2">
              {values.map((v) => {
                const isSelected = selectedId === v.id
                const stock = stockByValueId?.[v.id] ?? null
                const isOutOfStock = stock !== null && stock === 0
                return (
                  <button
                    key={v.id}
                    type="button"
                    disabled={isOutOfStock}
                    onClick={() => {
                      const newId = isSelected ? '' : v.id
                      setSelectedIds((s) => ({ ...s, [attr]: newId }))
                      onSelect?.(attr, newId)
                    }}
                    title={isOutOfStock ? 'Sin stock' : undefined}
                    className={`rounded-full border px-3 py-1 text-xs font-semibold transition-all ${
                      isOutOfStock
                        ? 'cursor-not-allowed border-gray-100 bg-gray-50 text-gray-300 line-through'
                        : isSelected
                          ? 'border-[#0eb1c3] bg-[#0eb1c3] text-white'
                          : 'border-gray-200 text-[#1E1E1E] hover:border-[#0eb1c3] hover:text-[#0eb1c3]'
                    }`}
                  >
                    {v.value}
                  </button>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
