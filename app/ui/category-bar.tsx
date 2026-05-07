'use client'

import { useState } from 'react'

const categories = [
  'Todos',
  'Espejos LED',
  'Lámparas',
  'Muebles',
  'Tazas',
  'Botellas',
  'Mate',
  'Vasos Térmicos',
  'Sillones',
  'Mesas',
  'Outlet',
  'Bultos Oferta',
]

export default function CategoryBar() {
  const [active, setActive] = useState('Todos')

  return (
    <div className="border-b border-gray-100 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="scrollbar-hide flex gap-2 overflow-x-auto py-3">
          {categories.map((cat) => {
            const isActive = active === cat
            return (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className={`shrink-0 rounded-full border px-4 py-1.5 text-sm font-semibold transition-all duration-150 ${
                  isActive
                    ? 'border-[#2BBCB0] bg-[#2BBCB0] text-white'
                    : 'border-gray-200 bg-white text-[#1E1E1E] hover:border-[#2BBCB0] hover:bg-[#2BBCB0] hover:text-white'
                }`}
              >
                {cat}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
