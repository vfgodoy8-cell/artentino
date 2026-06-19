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

  // Drag refs — no state to avoid re-renders during drag
  const isDragging = useRef(false)
  const startX = useRef(0)
  const startScrollLeft = useRef(0)
  const hasDragged = useRef(false)

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

  // ── Suppress click after drag (capture phase, before Link receives it) ─
  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const suppressClick = (e: MouseEvent) => {
      if (hasDragged.current) {
        e.preventDefault()
        e.stopPropagation()
        hasDragged.current = false
      }
    }
    el.addEventListener('click', suppressClick, true)
    return () => el.removeEventListener('click', suppressClick, true)
  }, [])

  // ── Drag handlers ──────────────────────────────────────────────────────
  function handleMouseDown(e: React.MouseEvent<HTMLDivElement>) {
    isDragging.current = true
    hasDragged.current = false
    startX.current = e.pageX
    startScrollLeft.current = scrollRef.current?.scrollLeft ?? 0
    if (scrollRef.current) scrollRef.current.style.cursor = 'grabbing'
  }

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!isDragging.current || !scrollRef.current) return
    e.preventDefault()
    const delta = e.pageX - startX.current
    if (Math.abs(delta) > 8) hasDragged.current = true
    scrollRef.current.scrollLeft = startScrollLeft.current - delta
  }

  function handleMouseUp() {
    isDragging.current = false
    if (scrollRef.current) scrollRef.current.style.cursor = 'grab'
  }

  function handleMouseLeave() {
    if (isDragging.current) {
      isDragging.current = false
      if (scrollRef.current) scrollRef.current.style.cursor = 'grab'
    }
  }

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

      {/* Scrollable pills row */}
      <div
        ref={scrollRef}
        className="flex select-none gap-2 overflow-x-auto py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{ cursor: 'grab' }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
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
