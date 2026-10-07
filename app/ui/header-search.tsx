'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useEffect, useId, useRef, useState } from 'react'
import { cloudinaryThumb } from '@/app/lib/cloudinary'
import { CASH_DISCOUNT } from '@/app/lib/constants'

type SearchItem = {
  id: string
  name: string
  slug: string
  imageUrl: string | null
  price: number
  subcategoria: string
}

type SearchResponse = { total: number; items: SearchItem[] } | { error: string }

const MIN_QUERY_LENGTH = 2
const DEBOUNCE_MS = 250
const ROUTER_DEBOUNCE_MS = 300

function fmt(n: number) {
  return `$${n.toLocaleString('es-AR')}`
}

export default function HeaderSearch() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const onCatalogPage = pathname === '/catalogo'
  const qParam = searchParams.get('q') ?? ''

  const [query, setQuery] = useState('')
  const [results, setResults] = useState<{ total: number; items: SearchItem[] } | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [panelOpen, setPanelOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const [mdExpanded, setMdExpanded] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const containerRef = useRef<HTMLDivElement>(null)
  const desktopInputRef = useRef<HTMLInputElement>(null)
  const mobileInputRef = useRef<HTMLInputElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const routerDebounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const abortRef = useRef<AbortController | null>(null)
  const wasOnCatalogRef = useRef(onCatalogPage)
  const listboxId = useId()

  const trimmed = query.trim()

  // En /catalogo, el input del header espeja el ?q= de la página (y viceversa).
  useEffect(() => {
    if (onCatalogPage) setQuery(qParam)
  }, [qParam, onCatalogPage])

  // Al salir de /catalogo, el buscador del header vuelve a estar vacío.
  useEffect(() => {
    if (wasOnCatalogRef.current && !onCatalogPage) setQuery('')
    wasOnCatalogRef.current = onCatalogPage
  }, [onCatalogPage])

  function closeAll() {
    setPanelOpen(false)
    setActiveIndex(-1)
    setMobileOpen(false)
    if (!trimmed) setMdExpanded(false)
  }

  // Cierra al navegar.
  useEffect(() => {
    closeAll()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  // Clic afuera.
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        closeAll()
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trimmed])

  // Escape.
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key !== 'Escape') return
      if (!panelOpen && !mdExpanded && !mobileOpen) return
      e.preventDefault()
      setQuery('')
      setResults(null)
      setPanelOpen(false)
      setMdExpanded(false)
      setMobileOpen(false)
      setActiveIndex(-1)
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [panelOpen, mdExpanded, mobileOpen])

  useEffect(() => {
    if (mdExpanded) desktopInputRef.current?.focus()
  }, [mdExpanded])

  useEffect(() => {
    if (mobileOpen) mobileInputRef.current?.focus()
  }, [mobileOpen])

  // Bloquea el scroll de fondo mientras el overlay mobile está abierto.
  useEffect(() => {
    if (!mobileOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [mobileOpen])

  async function runSearch(q: string) {
    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller
    setError(null)
    try {
      const res = await fetch(`/api/buscar?q=${encodeURIComponent(q)}`, { signal: controller.signal })
      const data: SearchResponse = await res.json()
      if (!res.ok || 'error' in data) throw new Error('error' in data ? data.error : 'bad response')
      setResults(data)
    } catch (err) {
      if ((err as Error).name === 'AbortError') return
      setError('No pudimos cargar los resultados.')
      setResults(null)
    } finally {
      setLoading(false)
    }
  }

  function pushCatalogQuery(next: string) {
    clearTimeout(routerDebounceRef.current)
    routerDebounceRef.current = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString())
      if (next.trim()) {
        params.set('q', next.trim())
      } else {
        params.delete('q')
      }
      const qs = params.toString()
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
    }, ROUTER_DEBOUNCE_MS)
  }

  // Dispara /api/buscar (fuera de /catalogo, que maneja su propia grilla).
  useEffect(() => {
    if (onCatalogPage) return
    setActiveIndex(-1)
    clearTimeout(debounceRef.current)
    if (trimmed.length < MIN_QUERY_LENGTH) {
      abortRef.current?.abort()
      setLoading(false)
      setResults(null)
      setError(null)
      setPanelOpen(false)
      return
    }
    setPanelOpen(true)
    setLoading(true)
    debounceRef.current = setTimeout(() => runSearch(trimmed), DEBOUNCE_MS)
    return () => clearTimeout(debounceRef.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trimmed, onCatalogPage])

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const next = e.target.value
    setQuery(next)
    if (onCatalogPage) pushCatalogQuery(next)
  }

  function handleClear() {
    setQuery('')
    setResults(null)
    setPanelOpen(false)
    setActiveIndex(-1)
    if (onCatalogPage) pushCatalogQuery('')
  }

  function goToProduct(item: SearchItem) {
    closeAll()
    setQuery('')
    router.push(`/catalogo/${item.slug}`)
  }

  function goToCatalogResults() {
    if (trimmed.length < MIN_QUERY_LENGTH) return
    closeAll()
    router.push(`/catalogo?q=${encodeURIComponent(trimmed)}`)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (onCatalogPage) return
      if (activeIndex >= 0 && results && activeIndex < results.items.length) {
        goToProduct(results.items[activeIndex])
      } else {
        goToCatalogResults()
      }
      return
    }
    if (!panelOpen || onCatalogPage) return
    const itemCount = results?.items.length ?? 0
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex((i) => Math.min(i + 1, itemCount > 0 ? itemCount : -1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex((i) => Math.max(i - 1, -1))
    }
  }

  const activeOptionId = activeIndex >= 0 ? `${listboxId}-option-${activeIndex}` : undefined

  function renderResultsBody() {
    if (loading) {
      return (
        <div className="space-y-3 p-4">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex animate-pulse items-center gap-3">
              <div className="h-12 w-12 shrink-0 rounded-lg bg-gray-100" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-3/4 rounded bg-gray-100" />
                <div className="h-3 w-1/3 rounded bg-gray-100" />
              </div>
            </div>
          ))}
        </div>
      )
    }

    if (error) {
      return <p className="p-4 text-sm text-gray-500">{error}</p>
    }

    if (!results || results.items.length === 0) {
      return (
        <div className="p-4">
          <p className="text-sm text-[#1E1E1E]">No encontramos productos para «{trimmed}»</p>
          <Link
            href="/catalogo"
            onClick={closeAll}
            className="mt-2 inline-block text-sm font-semibold text-[#0eb1c3] underline underline-offset-4"
          >
            Ver todo el catálogo
          </Link>
        </div>
      )
    }

    return (
      <>
        <ul role="listbox" id={listboxId} className="max-h-[60vh] overflow-y-auto py-1 md:max-h-96">
          {results.items.map((item, idx) => {
            const cashPrice = Math.round(item.price * (1 - CASH_DISCOUNT))
            return (
              <li key={item.id} role="presentation">
                <Link
                  id={`${listboxId}-option-${idx}`}
                  role="option"
                  aria-selected={activeIndex === idx}
                  href={`/catalogo/${item.slug}`}
                  onClick={() => goToProduct(item)}
                  onMouseEnter={() => setActiveIndex(idx)}
                  className={`flex items-center gap-3 px-4 py-2.5 transition-colors ${
                    activeIndex === idx ? 'bg-[#f0fbfc]' : 'hover:bg-gray-50'
                  }`}
                >
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[#f5f3f0]">
                    {item.imageUrl ? (
                      <Image
                        src={cloudinaryThumb(item.imageUrl)}
                        alt=""
                        width={48}
                        height={48}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <PlaceholderIcon />
                    )}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="line-clamp-2 block text-sm font-bold leading-snug text-[#1E1E1E]">
                      {item.name}
                    </span>
                    <span className="mt-0.5 block text-xs text-[#9ca3af]">{item.subcategoria}</span>
                  </span>
                  <span className="shrink-0 text-sm font-black text-[#0eb1c3]">{fmt(cashPrice)}</span>
                </Link>
              </li>
            )
          })}
        </ul>
        <Link
          id={`${listboxId}-option-${results.items.length}`}
          role="option"
          aria-selected={activeIndex === results.items.length}
          href={`/catalogo?q=${encodeURIComponent(trimmed)}`}
          onClick={() => goToCatalogResults()}
          onMouseEnter={() => setActiveIndex(results.items.length)}
          className={`block border-t border-gray-100 px-4 py-3 text-center text-sm font-bold text-[#0eb1c3] transition-colors ${
            activeIndex === results.items.length ? 'bg-[#f0fbfc]' : 'hover:bg-gray-50'
          }`}
        >
          {results.total === 1 ? `Ver el ${results.total} resultado` : `Ver los ${results.total} resultados`}
        </Link>
      </>
    )
  }

  const showFloating = mdExpanded // md: panel flotante solo cuando está expandido
  const inputWrapperClass = showFloating
    ? 'absolute right-0 top-0 w-72 sm:w-80 lg:static lg:w-44 xl:w-56'
    : 'hidden lg:block lg:w-44 xl:w-56'

  return (
    <div ref={containerRef} className="relative">
      {/* Mobile trigger — visible solo <768 */}
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        aria-label="Buscar productos"
        className="flex h-11 w-11 items-center justify-center text-[#1E1E1E] transition-colors hover:text-[#0eb1c3] md:hidden"
      >
        <SearchIcon />
      </button>

      {/* md: ícono — colapsado, sin ancho propio en el flex */}
      {!mdExpanded && (
        <button
          type="button"
          onClick={() => setMdExpanded(true)}
          aria-label="Buscar productos"
          className="absolute right-0 top-1/2 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-[#1E1E1E] transition-colors hover:text-[#0eb1c3] md:flex lg:hidden"
        >
          <SearchIcon />
        </button>
      )}

      {/* md expandido / lg+ input inline */}
      <div className={inputWrapperClass}>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center">
            <SearchIcon small />
          </div>
          <input
            ref={desktopInputRef}
            type="search"
            role="combobox"
            aria-expanded={panelOpen}
            aria-controls={listboxId}
            aria-activedescendant={activeOptionId}
            autoComplete="off"
            value={query}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onFocus={() => {
              if (!onCatalogPage && trimmed.length >= MIN_QUERY_LENGTH) setPanelOpen(true)
            }}
            placeholder="Buscar productos…"
            aria-label="Buscar productos"
            className="h-9 w-full rounded-full border border-gray-200 pl-9 pr-8 text-sm text-[#1E1E1E] placeholder-gray-400 outline-none transition-[border-color,box-shadow] [&::-webkit-search-cancel-button]:appearance-none focus:border-[#0eb1c3] focus:ring-2 focus:ring-[#0eb1c3]/10"
          />
          {query && (
            <button
              type="button"
              onClick={handleClear}
              aria-label="Limpiar búsqueda"
              className="absolute inset-y-0 right-2 flex items-center px-1 text-lg leading-none text-[#9ca3af] transition-colors hover:text-[#1E1E1E]"
            >
              ×
            </button>
          )}
        </div>

        {!onCatalogPage && panelOpen && (
          <div className="absolute right-0 top-full z-50 mt-2 w-80 max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl sm:w-96">
            {renderResultsBody()}
          </div>
        )}
      </div>

      {/* Overlay fullscreen — mobile */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[70] flex flex-col bg-white md:hidden">
          <div className="flex items-center gap-2 border-b border-gray-100 px-4 py-3">
            <div className="relative flex-1">
              <div className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center">
                <SearchIcon small />
              </div>
              <input
                ref={mobileInputRef}
                type="search"
                autoComplete="off"
                value={query}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                placeholder="Buscar productos…"
                aria-label="Buscar productos"
                className="h-11 w-full rounded-full border border-gray-200 pl-9 pr-9 text-sm text-[#1E1E1E] placeholder-gray-400 outline-none [&::-webkit-search-cancel-button]:appearance-none focus:border-[#0eb1c3] focus:ring-2 focus:ring-[#0eb1c3]/10"
              />
              {query && (
                <button
                  type="button"
                  onClick={handleClear}
                  aria-label="Limpiar búsqueda"
                  className="absolute inset-y-0 right-2 flex items-center px-1 text-lg leading-none text-[#9ca3af]"
                >
                  ×
                </button>
              )}
            </div>
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              aria-label="Cerrar búsqueda"
              className="flex h-11 w-11 shrink-0 items-center justify-center text-[#1E1E1E]"
            >
              ✕
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            {onCatalogPage ? (
              <p className="p-4 text-sm text-gray-400">Escribí para filtrar el catálogo.</p>
            ) : trimmed.length < MIN_QUERY_LENGTH ? null : (
              renderResultsBody()
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function SearchIcon({ small }: { small?: boolean }) {
  const size = small ? 15 : 18
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  )
}

function PlaceholderIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </svg>
  )
}
