'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'

type Slide = {
  id: string
  imageUrl: string
  imageUrlMobile: string | null
  eyebrowText: string
  title: string
  titleHighlightWord: string | null
  description: string
}

type Badge = {
  id: string
  order: number
  category: { name: string; slug: string }
  customLabel: string | null
  customSubtitle: string
  icon: string
}

const benefits = [
  {
    label: 'Envíos',
    desc: 'a todo el país',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="3" width="15" height="13" />
        <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
        <circle cx="5.5" cy="18.5" r="2.5" />
        <circle cx="18.5" cy="18.5" r="2.5" />
      </svg>
    ),
  },
  {
    label: 'Calidad',
    desc: 'premium',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <circle cx="12" cy="8" r="6" />
        <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
      </svg>
    ),
  },
  {
    label: 'Cuotas',
    desc: 'sin interés',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <rect x="1" y="4" width="22" height="16" rx="2" />
        <line x1="1" y1="10" x2="23" y2="10" />
      </svg>
    ),
  },
  {
    label: 'Asesoramiento',
    desc: 'personalizado',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
]

function renderTitle(title: string, highlight: string | null) {
  if (!highlight || !title.includes(highlight)) return <>{title}</>
  const parts = title.split(highlight)
  return (
    <>
      {parts.map((part, i) =>
        i < parts.length - 1 ? (
          <span key={i}>
            {part}
            <span className="italic text-[#0eb1c3]">{highlight}</span>
          </span>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  )
}

export default function HeroCarousel({
  slides,
  badges,
  intervalSeconds,
}: {
  slides: Slide[]
  badges: Badge[]
  intervalSeconds: number
}) {
  const [currentIdx, setCurrentIdx] = useState(0)
  const [visible, setVisible] = useState(true)
  const [resetKey, setResetKey] = useState(0)
  const idxRef = useRef(0)
  const visTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  const goTo = useCallback((idx: number) => {
    idxRef.current = idx
    setVisible(false)
    clearTimeout(visTimerRef.current)
    visTimerRef.current = setTimeout(() => {
      setCurrentIdx(idx)
      setVisible(true)
    }, 350)
  }, [])

  function handleManual(idx: number) {
    goTo(idx)
    setResetKey((k) => k + 1)
  }

  // Auto-advance
  useEffect(() => {
    if (slides.length <= 1) return
    const id = setInterval(() => {
      goTo((idxRef.current + 1) % slides.length)
    }, intervalSeconds * 1000)
    return () => clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slides.length, intervalSeconds, resetKey])

  // Cleanup on unmount
  useEffect(() => () => clearTimeout(visTimerRef.current), [])

  if (slides.length === 0) {
    return <HeroFallback badges={badges} />
  }

  const slide = slides[currentIdx]

  return (
    <section className="relative -mt-16 min-h-[calc(90vh+4rem)] overflow-hidden bg-[#f2f0ed]">
      {/* Background image — fades with slide */}
      <div
        className="absolute inset-0"
        style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.4s ease-in-out' }}
      >
        <picture>
          {slide.imageUrlMobile && (
            <source media="(max-width: 640px)" srcSet={slide.imageUrlMobile} />
          )}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={slide.imageUrl}
            alt=""
            aria-hidden="true"
            className="h-full w-full object-cover object-left lg:object-[60%_center]"
          />
        </picture>
      </div>

      {/* Static overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/[0.97] via-white/75 to-transparent lg:via-white/55" />
      <div className="pointer-events-none absolute -bottom-28 -left-28 z-[1] h-[460px] w-[460px] rounded-full bg-[#0eb1c3] opacity-[0.07] blur-[90px]" />
      <div className="pointer-events-none absolute right-0 top-24 z-10 opacity-75">
        <DotsGrid />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/[0.15]" />

      {/* Text content — fades with slide */}
      <div
        className="relative z-10 flex min-h-[calc(90vh+4rem)] items-center"
        style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.4s ease-in-out' }}
      >
        <div className="flex flex-col justify-center px-8 py-20 sm:px-12 lg:max-w-[52%] lg:py-24 lg:pl-14 lg:pr-8">
          {/* Eyebrow */}
          <div className="mb-5 text-[11px] font-black uppercase tracking-[0.3em] text-[#0eb1c3]">
            {slide.eyebrowText}
          </div>

          {/* Headline */}
          <h1 className="mb-6 text-6xl font-black leading-[1.02] tracking-[-0.03em] text-[#1E1E1E] lg:text-[76px]">
            {renderTitle(slide.title, slide.titleHighlightWord)}
          </h1>

          {/* Subtitle */}
          <p className="mb-8 max-w-[380px] text-[15px] leading-[1.65] text-[#6b7280]">
            {slide.description}
          </p>

          {/* CTA */}
          <div className="mb-10">
            <Link
              href="/catalogo"
              className="inline-flex h-12 items-center justify-center rounded-[10px] bg-[#0eb1c3] px-7 text-xs font-black uppercase tracking-[0.12em] text-white transition-colors hover:bg-[#0a8f9e]"
            >
              Ver catálogo
            </Link>
          </div>

          {/* Benefits */}
          <div className="flex flex-wrap gap-5">
            {benefits.map((b) => (
              <div key={b.label} className="flex items-center gap-2">
                <div className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-lg bg-[#f0fdfc] text-[#0eb1c3]">
                  {b.icon}
                </div>
                <div className="flex flex-col gap-px">
                  <span className="text-[9px] font-black uppercase leading-none tracking-[0.12em] text-[#1E1E1E]">
                    {b.label}
                  </span>
                  <span className="text-[9px] leading-[1.3] text-[#9ca3af]">{b.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Prev/Next arrows */}
      {slides.length > 1 && (
        <>
          <button
            onClick={() => handleManual((currentIdx - 1 + slides.length) % slides.length)}
            aria-label="Slide anterior"
            className="absolute left-4 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-[#1E1E1E] shadow-md backdrop-blur-sm transition-all hover:bg-white hover:shadow-lg"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6" /></svg>
          </button>
          <button
            onClick={() => handleManual((currentIdx + 1) % slides.length)}
            aria-label="Siguiente slide"
            className="absolute right-4 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-[#1E1E1E] shadow-md backdrop-blur-sm transition-all hover:bg-white hover:shadow-lg"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6" /></svg>
          </button>

          {/* Dot indicators */}
          <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 items-center gap-1.5">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => handleManual(i)}
                aria-label={`Ir al slide ${i + 1}`}
                className={`rounded-full transition-all duration-300 ${
                  i === currentIdx ? 'h-2 w-6 bg-[#0eb1c3]' : 'h-2 w-2 bg-white/60 hover:bg-white/90'
                }`}
              />
            ))}
          </div>
        </>
      )}

      {/* Floating badges */}
      {badges.length > 0 && (
        <div className="absolute bottom-8 right-6 z-20 flex flex-col gap-2.5">
          {badges.map((badge, i) => (
            <BadgeCard key={badge.id} badge={badge} isTeal={i === 1} />
          ))}
        </div>
      )}
    </section>
  )
}

function BadgeCard({ badge, isTeal }: { badge: Badge; isTeal: boolean }) {
  const label = badge.customLabel || badge.category.name
  const href = `/catalogo?categoria=${badge.category.slug}`

  return (
    <Link
      href={href}
      className={`flex min-w-[210px] items-center gap-3 rounded-xl px-4 py-3 shadow-[0_4px_20px_rgba(0,0,0,0.15)] transition-shadow hover:shadow-[0_6px_28px_rgba(0,0,0,0.2)] ${
        isTeal ? 'bg-[#0eb1c3]' : 'bg-white'
      }`}
    >
      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${
          isTeal ? 'bg-white/20' : 'bg-[#f3f4f6]'
        }`}
      >
        <BadgeIcon icon={badge.icon} teal={!isTeal} />
      </div>
      <div className="flex flex-col gap-0.5">
        <span
          className={`text-[12px] font-black uppercase tracking-[0.05em] ${
            isTeal ? 'text-white' : 'text-[#1E1E1E]'
          }`}
        >
          {label}
        </span>
        <span
          className={`text-[11px] leading-[1.3] ${isTeal ? 'text-white/80' : 'text-[#6b7280]'}`}
        >
          {badge.customSubtitle}
        </span>
      </div>
    </Link>
  )
}

function BadgeIcon({ icon, teal }: { icon: string; teal: boolean }) {
  const stroke = teal ? '#0eb1c3' : 'rgba(255,255,255,0.85)'
  const props = {
    width: 22,
    height: 22,
    viewBox: '0 0 24 24',
    fill: 'none' as const,
    stroke,
    strokeWidth: 1.5,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  }
  switch (icon) {
    case 'mirror':
      return (
        <svg {...props}>
          <ellipse cx="12" cy="11" rx="6" ry="7.5" />
          <line x1="12" y1="18.5" x2="12" y2="22" />
          <line x1="9" y1="22" x2="15" y2="22" />
          <circle cx="12" cy="3.2" r="0.8" fill={teal ? '#0eb1c3' : 'rgba(255,255,255,0.85)'} stroke="none" />
        </svg>
      )
    case 'sofa':
      return (
        <svg {...props}>
          <rect x="5" y="6" width="14" height="8" rx="2" />
          <rect x="3" y="10" width="3" height="6" rx="1" />
          <rect x="18" y="10" width="3" height="6" rx="1" />
          <line x1="7" y1="14" x2="7" y2="18" />
          <line x1="17" y1="14" x2="17" y2="18" />
        </svg>
      )
    case 'lamp':
      return (
        <svg {...props}>
          <line x1="12" y1="2" x2="12" y2="22" />
          <path d="M5 12l7-10 7 10" />
          <line x1="8" y1="22" x2="16" y2="22" />
        </svg>
      )
    case 'vase':
      return (
        <svg {...props}>
          <path d="M9 2h6l1 4a8 8 0 0 1-8 0L9 2z" />
          <path d="M8 6c-2 3-2 9 4 14M16 6c2 3 2 9-4 14" />
          <line x1="7" y1="20" x2="17" y2="20" />
        </svg>
      )
    case 'star':
    default:
      return (
        <svg {...props}>
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      )
  }
}

// Fallback when no slides in DB
function HeroFallback({ badges }: { badges: Badge[] }) {
  return (
    <section className="relative -mt-16 min-h-[calc(90vh+4rem)] overflow-hidden bg-[#f2f0ed]">
      <div className="absolute inset-0 bg-gradient-to-r from-white/[0.97] via-white/75 to-transparent" />
      <div className="relative z-10 flex min-h-[calc(90vh+4rem)] items-center">
        <div className="flex flex-col justify-center px-8 py-20 sm:px-12 lg:max-w-[52%] lg:pl-14">
          <div className="mb-5 text-[11px] font-black uppercase tracking-[0.3em] text-[#0eb1c3]">
            Arte · Diseño · Hogar
          </div>
          <h1 className="mb-6 text-6xl font-black leading-[1.02] tracking-[-0.03em] text-[#1E1E1E] lg:text-[76px]">
            Espacios que{' '}
            <span className="italic text-[#0eb1c3]">reflejan</span>{' '}
            tu estilo
          </h1>
          <p className="mb-8 max-w-[380px] text-[15px] leading-[1.65] text-[#6b7280]">
            Espejos LED, muebles y deco que transforman cada rincón de tu hogar.
          </p>
          <Link
            href="/catalogo"
            className="inline-flex h-12 w-fit items-center justify-center rounded-[10px] bg-[#0eb1c3] px-7 text-xs font-black uppercase tracking-[0.12em] text-white transition-colors hover:bg-[#0a8f9e]"
          >
            Ver catálogo
          </Link>
        </div>
      </div>
      {badges.length > 0 && (
        <div className="absolute bottom-8 right-6 z-20 flex flex-col gap-2.5">
          {badges.map((badge, i) => (
            <BadgeCard key={badge.id} badge={badge} isTeal={i === 1} />
          ))}
        </div>
      )}
    </section>
  )
}

function DotsGrid() {
  return (
    <svg width="110" height="130" viewBox="0 0 110 130" fill="none" aria-hidden="true">
      <defs>
        <pattern id="hero-dots" x="0" y="0" width="14" height="14" patternUnits="userSpaceOnUse">
          <circle cx="3" cy="3" r="1.6" fill="#0eb1c3" opacity="0.5" />
        </pattern>
      </defs>
      <rect width="110" height="130" fill="url(#hero-dots)" />
    </svg>
  )
}
