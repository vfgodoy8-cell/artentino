'use client'

import Link from 'next/link'
import { useRef, useState, useEffect, useCallback } from 'react'

type Category = { id: string; name: string; slug: string }

export default function CategoryPills({
  categories,
  activeSlug,
}: {
  categories: Category[]
  activeSlug: string | undefined
}) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [showLeft, setShowLeft] = useState(false)
  const [showRight, setShowRight] = useState(false)

  // Active pill ref for auto-scroll
  const activePillRef = useRef<HTMLAnchorElement | null>(null)
  const isFirstRender = useRef(true)

  // ── Fades ─────────────────────────────────────────────────────────────
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

  // ── Auto-scroll to active pill ────────────────────────────────────────
  useEffect(() => {
    const behavior = isFirstRender.current ? 'auto' : 'smooth'
    isFirstRender.current = false
    activePillRef.current?.scrollIntoView({ inline: 'center', block: 'nearest', behavior })
  }, [activeSlug])

  // ── Arrow scroll handlers ─────────────────────────────────────────────
  function handleScrollLeft() {
    const el = scrollRef.current
    if (!el) return
    el.scrollBy({ left: -Math.round(el.clientWidth * 0.75), behavior: 'smooth' })
  }

  function handleScrollRight() {
    const el = scrollRef.current
    if (!el) return
    el.scrollBy({ left: Math.round(el.clientWidth * 0.75), behavior: 'smooth' })
  }

  const arrowBase = 'hidden sm:flex absolute top-1/2 -translate-y-1/2 z-20 h-7 w-7 items-center justify-center rounded-full border bg-white text-lg font-semibold leading-none shadow-sm transition-all duration-150'
  const arrowVisible = 'opacity-100 pointer-events-auto'
  const arrowHidden = 'opacity-0 pointer-events-none'

  return (
    <div className="relative">
      {/* Left fade */}
      <div
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-[#ffffff] to-transparent transition-opacity duration-150"
        style={{ opacity: showLeft ? 1 : 0 }}
      />
      {/* Right fade */}
      <div
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-[#ffffff] to-transparent transition-opacity duration-150"
        style={{ opacity: showRight ? 1 : 0 }}
      />

      {/* Left arrow */}
      <button
        onClick={handleScrollLeft}
        aria-label="Desplazar izquierda"
        className={`${arrowBase} left-1 border-gray-200 text-[#1E1E1E] hover:border-[#0eb1c3] hover:text-[#0eb1c3] ${showLeft ? arrowVisible : arrowHidden}`}
      >
        ‹
      </button>
      {/* Right arrow */}
      <button
        onClick={handleScrollRight}
        aria-label="Desplazar derecha"
        className={`${arrowBase} right-1 border-gray-200 text-[#1E1E1E] hover:border-[#0eb1c3] hover:text-[#0eb1c3] ${showRight ? arrowVisible : arrowHidden}`}
      >
        ›
      </button>

      {/* Scrollable pills row */}
      <div
        ref={scrollRef}
        className="flex gap-2 overflow-x-auto py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <Link
          href="/catalogo"
          ref={(el) => { if (!activeSlug) activePillRef.current = el }}
          className={`cursor-pointer shrink-0 rounded-full border px-4 py-1.5 text-sm font-semibold transition-all duration-150 ${
            !activeSlug
              ? 'border-[#0eb1c3] bg-[#0eb1c3] text-white'
              : 'border-gray-200 bg-white text-[#1E1E1E] hover:border-[#0eb1c3] hover:bg-[#0eb1c3] hover:text-white'
          }`}
        >
          Todos
        </Link>

        {categories.map((cat) => {
          const isActive = activeSlug === cat.slug
          return (
            <Link
              key={cat.id}
              href={`/catalogo?categoria=${cat.slug}`}
              ref={(el) => { if (isActive) activePillRef.current = el }}
              className={`cursor-pointer shrink-0 rounded-full border px-4 py-1.5 text-sm font-semibold transition-all duration-150 ${
                isActive
                  ? 'border-[#0eb1c3] bg-[#0eb1c3] text-white'
                  : 'border-gray-200 bg-white text-[#1E1E1E] hover:border-[#0eb1c3] hover:bg-[#0eb1c3] hover:text-white'
              }`}
            >
              {cat.name}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
