'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

type Subcat = { id: string; name: string; slug: string }
type Category = { id: string; name: string; slug: string; subcategories: Subcat[] }

export default function CategorySidebar({
  categories,
  activeSlug,
}: {
  categories: Category[]
  activeSlug: string | undefined
}) {
  const activeCat = categories.find(
    (c) => c.slug === activeSlug || c.subcategories.some((s) => s.slug === activeSlug),
  )

  const [openGroup, setOpenGroup] = useState<string | null>(activeCat?.slug ?? null)

  useEffect(() => {
    const cat = categories.find(
      (c) => c.slug === activeSlug || c.subcategories.some((s) => s.slug === activeSlug),
    )
    setOpenGroup(cat?.slug ?? null)
  }, [activeSlug, categories])

  return (
    <nav className="sticky top-8 max-h-[calc(100vh-5rem)] overflow-y-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <p className="mb-3 px-3 text-[10px] font-black uppercase tracking-widest text-[#9ca3af]">
        Categorías
      </p>

      {/* Todos */}
      <Link
        href="/catalogo"
        className={`flex items-center rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
          !activeSlug
            ? 'bg-[#0eb1c3] text-white'
            : 'text-[#1E1E1E] hover:bg-[#f3f4f6]'
        }`}
      >
        Todos
      </Link>

      <div className="mt-1 space-y-0.5">
        {categories.map((cat) => {
          const isCatActive = activeSlug === cat.slug
          const hasActiveSub = cat.subcategories.some((s) => s.slug === activeSlug)
          const isGroupHighlighted = isCatActive || hasActiveSub
          const isOpen = openGroup === cat.slug

          return (
            <div key={cat.id}>
              <div className="flex items-center gap-0.5">
                <Link
                  href={`/catalogo?categoria=${cat.slug}`}
                  className={`flex flex-1 items-center rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
                    isGroupHighlighted
                      ? 'text-[#0eb1c3]'
                      : 'text-[#1E1E1E] hover:bg-[#f3f4f6]'
                  }`}
                >
                  {cat.name}
                </Link>
                {cat.subcategories.length > 0 && (
                  <button
                    onClick={() => setOpenGroup(isOpen ? null : cat.slug)}
                    aria-label={`${isOpen ? 'Colapsar' : 'Expandir'} ${cat.name}`}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[#9ca3af] transition-colors hover:bg-[#f3f4f6] hover:text-[#1E1E1E]"
                  >
                    <svg
                      width="11"
                      height="11"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      className={`transition-transform duration-150 ${isOpen ? 'rotate-90' : ''}`}
                    >
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </button>
                )}
              </div>

              {isOpen && cat.subcategories.length > 0 && (
                <div className="ml-3 mt-0.5 space-y-0.5 border-l-2 border-[#f3f4f6] pl-3">
                  {cat.subcategories.map((sub) => {
                    const isSubActive = activeSlug === sub.slug
                    return (
                      <Link
                        key={sub.id}
                        href={`/catalogo?categoria=${sub.slug}`}
                        className={`flex items-center rounded-lg px-2 py-1.5 text-xs font-semibold transition-colors ${
                          isSubActive
                            ? 'bg-[#e0f8fb] text-[#0eb1c3]'
                            : 'text-[#6b7280] hover:bg-[#f3f4f6] hover:text-[#1E1E1E]'
                        }`}
                      >
                        {sub.name}
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </nav>
  )
}
