'use client'

import { useState } from 'react'

type Props = {
  variantGroups: Record<string, string[]>
}

export default function VariantSelector({ variantGroups }: Props) {
  const [selected, setSelected] = useState<Record<string, string>>({})
  const entries = Object.entries(variantGroups)
  if (entries.length === 0) return null

  return (
    <div className="flex flex-col gap-3">
      {entries.map(([attr, values]) => (
        <div key={attr}>
          <p className="mb-1.5 text-xs font-black uppercase tracking-wider text-gray-400">
            {attr}
            {selected[attr] && (
              <span className="ml-1.5 font-semibold normal-case tracking-normal text-[#1E1E1E]">
                — {selected[attr]}
              </span>
            )}
          </p>
          <div className="flex flex-wrap gap-2">
            {values.map((v) => {
              const isSelected = selected[attr] === v
              return (
                <button
                  key={v}
                  type="button"
                  onClick={() =>
                    setSelected((s) => ({ ...s, [attr]: isSelected ? '' : v }))
                  }
                  className={`rounded-full border px-3 py-1 text-xs font-semibold transition-all ${
                    isSelected
                      ? 'border-[#0eb1c3] bg-[#0eb1c3] text-white'
                      : 'border-gray-200 text-[#1E1E1E] hover:border-[#0eb1c3] hover:text-[#0eb1c3]'
                  }`}
                >
                  {v}
                </button>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
