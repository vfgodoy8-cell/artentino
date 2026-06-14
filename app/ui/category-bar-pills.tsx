'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

type Category = { name: string; slug: string | null }

type Props = {
  categories: Category[]
}

export default function CategoryBarPills({ categories }: Props) {
  const router = useRouter()
  const [active, setActive] = useState('Todos')

  return (
    <div className="scrollbar-hide flex gap-2 overflow-x-auto py-3">
      {categories.map((cat) => {
        const isActive = active === cat.name
        return (
          <button
            key={cat.name}
            onClick={() => {
              setActive(cat.name)
              router.push(cat.slug ? `/catalogo?categoria=${cat.slug}` : '/catalogo')
            }}
            className={`shrink-0 rounded-full border px-4 py-1.5 text-sm font-semibold transition-all duration-150 ${
              isActive
                ? 'border-[#0eb1c3] bg-[#0eb1c3] text-white'
                : 'border-gray-200 bg-white text-[#1E1E1E] hover:border-[#0eb1c3] hover:bg-[#0eb1c3] hover:text-white'
            }`}
          >
            {cat.name}
          </button>
        )
      })}
    </div>
  )
}
