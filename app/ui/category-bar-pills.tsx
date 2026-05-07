'use client'

import { useState } from 'react'

type Props = {
  categories: string[]
}

export default function CategoryBarPills({ categories }: Props) {
  const [active, setActive] = useState('Todos')

  return (
    <div className="scrollbar-hide flex gap-2 overflow-x-auto py-3">
      {categories.map((cat) => {
        const isActive = active === cat
        return (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className={`shrink-0 rounded-full border px-4 py-1.5 text-sm font-semibold transition-all duration-150 ${
              isActive
                ? 'border-[#0eb1c3] bg-[#0eb1c3] text-white'
                : 'border-gray-200 bg-white text-[#1E1E1E] hover:border-[#0eb1c3] hover:bg-[#0eb1c3] hover:text-white'
            }`}
          >
            {cat}
          </button>
        )
      })}
    </div>
  )
}
