'use client'

import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

export default function SearchInput() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const [value, setValue] = useState(searchParams.get('q') ?? '')
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  // Sync value if URL changes externally (e.g., clicking a filter tab)
  useEffect(() => {
    setValue(searchParams.get('q') ?? '')
  }, [searchParams])

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const q = e.target.value
    setValue(q)
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString())
      if (q) {
        params.set('q', q)
      } else {
        params.delete('q')
      }
      params.delete('page')
      router.replace(`${pathname}?${params.toString()}`)
    }, 350)
  }

  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center">
        <svg
          width="15"
          height="15"
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
        type="text"
        value={value}
        onChange={handleChange}
        placeholder="Buscar por nombre o SKU..."
        className="h-10 w-full rounded-xl border border-gray-200 pl-10 pr-4 text-sm text-[#1E1E1E] placeholder-gray-400 outline-none transition-[border-color,box-shadow] focus:border-[#0eb1c3] focus:ring-2 focus:ring-[#0eb1c3]/10"
      />
    </div>
  )
}
