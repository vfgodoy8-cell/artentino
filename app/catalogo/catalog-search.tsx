'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useEffect, useRef, useState, useTransition, type ReactNode } from 'react'

export default function CatalogSearch({
  initialQuery,
  resultCount,
  children,
}: {
  initialQuery: string
  resultCount: number
  children: ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [value, setValue] = useState(initialQuery)
  const [isPending, startTransition] = useTransition()
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  // Sync si la URL cambia desde afuera (ej. al limpiar categoría)
  useEffect(() => {
    setValue(initialQuery)
  }, [initialQuery])

  function pushQuery(q: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (q) {
      params.set('q', q)
    } else {
      params.delete('q')
    }
    const qs = params.toString()
    startTransition(() => {
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
    })
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const next = e.target.value
    setValue(next)
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => pushQuery(next), 300)
  }

  function handleClear() {
    clearTimeout(debounceRef.current)
    setValue('')
    pushQuery('')
  }

  const trimmedQuery = initialQuery.trim()
  const showResultsLine = trimmedQuery.length > 0 && resultCount > 0

  return (
    <>
      <div className="mb-6">
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#9ca3af"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
          <input
            type="search"
            value={value}
            onChange={handleChange}
            placeholder="Buscar productos…"
            aria-label="Buscar productos"
            className="h-12 w-full rounded-full border border-gray-200 pl-11 pr-11 text-sm text-[#1E1E1E] placeholder-gray-400 outline-none transition-[border-color,box-shadow] [&::-webkit-search-cancel-button]:appearance-none focus:border-[#0eb1c3] focus:ring-2 focus:ring-[#0eb1c3]/10"
          />
          {value && (
            <button
              type="button"
              onClick={handleClear}
              aria-label="Limpiar búsqueda"
              className="absolute inset-y-0 right-3 flex items-center px-1 text-xl leading-none text-[#9ca3af] transition-colors hover:text-[#1E1E1E]"
            >
              ×
            </button>
          )}
        </div>

        {showResultsLine && (
          <p className="mt-2 px-1 text-sm text-[#6b7280]">
            {resultCount} {resultCount === 1 ? 'resultado' : 'resultados'} para «{trimmedQuery}»
          </p>
        )}
      </div>

      <div className={`transition-opacity duration-150 ${isPending ? 'opacity-60' : 'opacity-100'}`}>
        {children}
      </div>
    </>
  )
}
