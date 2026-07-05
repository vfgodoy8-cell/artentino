'use client'

import Link from 'next/link'
import { useRef, useState, useEffect, useCallback } from 'react'

type Subcat = { id: string; name: string; slug: string }
type Category = { id: string; name: string; slug: string; subcategories: Subcat[] }

export default function CategoryPills({
  categories,
  activeSlug,
}: {
  categories: Category[]
  activeSlug: string | undefined
}) {
  // Detect if activeSlug belongs to a sub-level so we can auto-open that group
  const activeCat = categories.find(
    (c) => c.slug === activeSlug || c.subcategories.some((s) => s.slug === activeSlug),
  )

  const [openGroup, setOpenGroup] = useState<string | null>(activeCat?.slug ?? null)

  const scrollRef = useRef<HTMLDivElement>(null)
  const [showLeft, setShowLeft] = useState(false)
  const [showRight, setShowRight] = useState(false)
  const activePillRef = useRef<HTMLElement | null>(null)
  const isFirstRender = useRef(true)

  const updateFades = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    setShowLeft(el.scrollLeft > 4)
    setShowRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4)
  }, [])

  useEffect(() => {
    updateFades()
    const el = scrollRef.current
    if (!el) return
    el.addEventListener('scroll', updateFades, { passive: true })
    return () => el.removeEventListener('scroll', updateFades)
  }, [updateFades])

  useEffect(() => {
    updateFades()
  }, [openGroup, updateFades])

  // Sync when navigating client-side
  useEffect(() => {
    const cat = categories.find(
      (c) => c.slug === activeSlug || c.subcategories.some((s) => s.slug === activeSlug),
    )
    if (cat) setOpenGroup(cat.slug)
  }, [activeSlug, categories])

  useEffect(() => {
    const behavior = isFirstRender.current ? 'auto' : 'smooth'
    isFirstRender.current = false
    activePillRef.current?.scrollIntoView({ inline: 'center', block: 'nearest', behavior })
  }, [activeSlug, openGroup])

  const pillBase = 'cursor-pointer shrink-0 rounded-full border px-4 py-1.5 text-sm font-semibold transition-all duration-150'
  const pillActive = 'border-[#0eb1c3] bg-[#0eb1c3] text-white'
  const pillIdle = 'border-gray-200 bg-white text-[#1E1E1E] hover:border-[#0eb1c3] hover:bg-[#0eb1c3] hover:text-white'
  const arrowBase = 'hidden sm:flex absolute top-1/2 -translate-y-1/2 z-20 h-7 w-7 items-center justify-center rounded-full border bg-white text-lg font-semibold leading-none shadow-sm transition-all duration-150'

  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-[#ffffff] to-transparent transition-opacity duration-150" style={{ opacity: showLeft ? 1 : 0 }} />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-[#ffffff] to-transparent transition-opacity duration-150" style={{ opacity: showRight ? 1 : 0 }} />

      <button
        onClick={() => scrollRef.current?.scrollBy({ left: -Math.round((scrollRef.current?.clientWidth ?? 0) * 0.75), behavior: 'smooth' })}
        aria-label="Desplazar izquierda"
        className={`${arrowBase} left-1 border-gray-200 text-[#1E1E1E] hover:border-[#0eb1c3] hover:text-[#0eb1c3] ${showLeft ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
      >‹</button>
      <button
        onClick={() => scrollRef.current?.scrollBy({ left: Math.round((scrollRef.current?.clientWidth ?? 0) * 0.75), behavior: 'smooth' })}
        aria-label="Desplazar derecha"
        className={`${arrowBase} right-1 border-gray-200 text-[#1E1E1E] hover:border-[#0eb1c3] hover:text-[#0eb1c3] ${showRight ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
      >›</button>

      <div ref={scrollRef} className="flex gap-2 overflow-x-auto py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">

        {/* Todos */}
        <Link
          href="/catalogo"
          ref={(el) => { if (!activeSlug) activePillRef.current = el }}
          className={`${pillBase} ${!activeSlug ? pillActive : pillIdle}`}
        >
          Todos
        </Link>

        {categories.map((cat) => {
          const isCatActive = activeSlug === cat.slug
          const isGroupOpen = openGroup === cat.slug
          const hasActiveSub = cat.subcategories.some((s) => s.slug === activeSlug)
          const isGroupHighlighted = isCatActive || hasActiveSub

          return (
            <div key={cat.id} className="flex shrink-0 flex-col gap-1">
              {/* Pill del padre — body navega, caret abre subcategorías */}
              <div
                ref={(el) => { if (isGroupHighlighted && !hasActiveSub) activePillRef.current = el }}
                className={`flex shrink-0 items-stretch overflow-hidden rounded-full border text-sm font-semibold transition-all duration-150 ${
                  isGroupHighlighted
                    ? 'border-[#0eb1c3] bg-[#0eb1c3] text-white'
                    : 'border-gray-200 bg-white text-[#1E1E1E]'
                }`}
              >
                <Link
                  href={`/catalogo?categoria=${cat.slug}`}
                  className={`cursor-pointer px-4 py-1.5 transition-colors ${
                    isGroupHighlighted ? 'hover:bg-[#0ca0b0]' : 'hover:bg-[#0eb1c3] hover:text-white'
                  }`}
                >
                  {cat.name}
                </Link>
                {cat.subcategories.length > 0 && (
                  <button
                    onClick={() => setOpenGroup(isGroupOpen ? null : cat.slug)}
                    aria-label={`Ver subcategorías de ${cat.name}`}
                    className={`cursor-pointer border-l px-2.5 transition-colors ${
                      isGroupHighlighted
                        ? 'border-white/30 hover:bg-[#0ca0b0]'
                        : 'border-gray-200 hover:bg-[#0eb1c3] hover:text-white'
                    }`}
                  >
                    <span className={`inline-block transition-transform duration-150 ${isGroupOpen ? 'rotate-90' : ''}`}>›</span>
                  </button>
                )}
              </div>

              {/* Subcategorías — visibles cuando el grupo está abierto */}
              {isGroupOpen && cat.subcategories.length > 0 && (
                <div className="flex gap-1">
                  {cat.subcategories.map((sub) => {
                    const isSubActive = activeSlug === sub.slug
                    return (
                      <Link
                        key={sub.id}
                        href={`/catalogo?categoria=${sub.slug}`}
                        ref={(el) => { if (isSubActive) activePillRef.current = el }}
                        className={`shrink-0 rounded-full border px-3 py-1 text-xs font-semibold transition-all duration-150 ${
                          isSubActive ? 'border-[#0eb1c3] bg-[#0eb1c3] text-white' : 'border-gray-200 bg-white text-[#1E1E1E] hover:border-[#0eb1c3] hover:text-[#0eb1c3]'
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
    </div>
  )
}
