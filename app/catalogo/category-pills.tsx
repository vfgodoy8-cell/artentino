'use client'

import Link from 'next/link'
import { useRef, useState, useEffect, useCallback } from 'react'

type Category = { id: string; name: string; slug: string }

const ESPEJOS_PREFIX = 'espejos-'

export default function CategoryPills({
  categories,
  activeSlug,
}: {
  categories: Category[]
  activeSlug: string | undefined
}) {
  const espejoCats = categories.filter((c) => c.slug.startsWith(ESPEJOS_PREFIX))
  const looseCats = categories.filter((c) => !c.slug.startsWith(ESPEJOS_PREFIX))
  const isEspejosActive = activeSlug === 'espejos' || !!activeSlug?.startsWith(ESPEJOS_PREFIX)

  const [level, setLevel] = useState<'root' | 'espejos'>(
    activeSlug?.startsWith(ESPEJOS_PREFIX) ? 'espejos' : 'root'
  )

  const scrollRef = useRef<HTMLDivElement>(null)
  const [showLeft, setShowLeft] = useState(false)
  const [showRight, setShowRight] = useState(false)
  const activePillRef = useRef<HTMLElement | null>(null)
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

  // Reset scroll position and recompute fades when level switches
  useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollLeft = 0
    updateFades()
  }, [level, updateFades])

  // Sync level on client-side navigation (activeSlug changes without unmounting)
  useEffect(() => {
    setLevel(activeSlug?.startsWith(ESPEJOS_PREFIX) ? 'espejos' : 'root')
  }, [activeSlug])

  // ── Auto-scroll to active pill ────────────────────────────────────────
  useEffect(() => {
    const behavior = isFirstRender.current ? 'auto' : 'smooth'
    isFirstRender.current = false
    activePillRef.current?.scrollIntoView({ inline: 'center', block: 'nearest', behavior })
  }, [activeSlug, level])

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

  const pillBase =
    'cursor-pointer shrink-0 rounded-full border px-4 py-1.5 text-sm font-semibold transition-all duration-150'
  const pillActive = 'border-[#0eb1c3] bg-[#0eb1c3] text-white'
  const pillIdle =
    'border-gray-200 bg-white text-[#1E1E1E] hover:border-[#0eb1c3] hover:bg-[#0eb1c3] hover:text-white'

  const arrowBase =
    'hidden sm:flex absolute top-1/2 -translate-y-1/2 z-20 h-7 w-7 items-center justify-center rounded-full border bg-white text-lg font-semibold leading-none shadow-sm transition-all duration-150'

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
        className={`${arrowBase} left-1 border-gray-200 text-[#1E1E1E] hover:border-[#0eb1c3] hover:text-[#0eb1c3] ${showLeft ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      >
        ‹
      </button>
      {/* Right arrow */}
      <button
        onClick={handleScrollRight}
        aria-label="Desplazar derecha"
        className={`${arrowBase} right-1 border-gray-200 text-[#1E1E1E] hover:border-[#0eb1c3] hover:text-[#0eb1c3] ${showRight ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      >
        ›
      </button>

      {/* Scrollable pills row */}
      <div
        ref={scrollRef}
        className="flex gap-2 overflow-x-auto py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {level === 'root' ? (
          <>
            {/* Todos */}
            <Link
              href="/catalogo"
              ref={(el) => { if (!activeSlug) activePillRef.current = el }}
              className={`${pillBase} ${!activeSlug ? pillActive : pillIdle}`}
            >
              Todos
            </Link>

            {/* Espejos group pill — body navigates to /catalogo?categoria=espejos, caret enters sub-level */}
            <div
              ref={(el) => { if (isEspejosActive) activePillRef.current = el }}
              className={`shrink-0 flex items-stretch overflow-hidden rounded-full border text-sm font-semibold transition-all duration-150 ${
                isEspejosActive
                  ? 'border-[#0eb1c3] bg-[#0eb1c3] text-white'
                  : 'border-gray-200 bg-white text-[#1E1E1E]'
              }`}
            >
              <Link
                href="/catalogo?categoria=espejos"
                className={`cursor-pointer px-4 py-1.5 transition-colors duration-150 ${
                  isEspejosActive ? 'hover:bg-[#0ca0b0]' : 'hover:bg-[#0eb1c3] hover:text-white'
                }`}
              >
                Espejos
              </Link>
              <button
                onClick={() => setLevel('espejos')}
                aria-label="Ver subcategorías de Espejos"
                className={`cursor-pointer border-l px-2.5 transition-colors duration-150 ${
                  isEspejosActive
                    ? 'border-white/30 hover:bg-[#0ca0b0]'
                    : 'border-gray-200 hover:bg-[#0eb1c3] hover:text-white'
                }`}
              >
                ›
              </button>
            </div>

            {/* Loose categories (everything that is not an espejo) */}
            {looseCats.map((cat) => {
              const isActive = activeSlug === cat.slug
              return (
                <Link
                  key={cat.id}
                  href={`/catalogo?categoria=${cat.slug}`}
                  ref={(el) => { if (isActive) activePillRef.current = el }}
                  className={`${pillBase} ${isActive ? pillActive : pillIdle}`}
                >
                  {cat.name}
                </Link>
              )
            })}
          </>
        ) : (
          <>
            {/* Back to root */}
            <button
              onClick={() => setLevel('root')}
              className={`${pillBase} ${pillIdle} flex items-center gap-1`}
            >
              <span aria-hidden="true">‹</span>
              Volver
            </button>

            {/* Espejos subcategories */}
            {espejoCats.map((cat) => {
              const isActive = activeSlug === cat.slug
              return (
                <Link
                  key={cat.id}
                  href={`/catalogo?categoria=${cat.slug}`}
                  ref={(el) => { if (isActive) activePillRef.current = el }}
                  className={`${pillBase} ${isActive ? pillActive : pillIdle}`}
                >
                  {cat.name}
                </Link>
              )
            })}
          </>
        )}
      </div>
    </div>
  )
}
