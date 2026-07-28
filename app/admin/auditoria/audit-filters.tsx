'use client'

import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function AuditFilters() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const [usuario, setUsuario] = useState(searchParams.get('usuario') ?? '')
  const [accion, setAccion] = useState(searchParams.get('accion') ?? '')
  const [desde, setDesde] = useState(searchParams.get('desde') ?? '')
  const [hasta, setHasta] = useState(searchParams.get('hasta') ?? '')

  useEffect(() => {
    setUsuario(searchParams.get('usuario') ?? '')
    setAccion(searchParams.get('accion') ?? '')
    setDesde(searchParams.get('desde') ?? '')
    setHasta(searchParams.get('hasta') ?? '')
  }, [searchParams])

  function applyFilters(next: { usuario: string; accion: string; desde: string; hasta: string }) {
    const params = new URLSearchParams()
    if (next.usuario) params.set('usuario', next.usuario)
    if (next.accion) params.set('accion', next.accion)
    if (next.desde) params.set('desde', next.desde)
    if (next.hasta) params.set('hasta', next.hasta)
    router.replace(`${pathname}?${params.toString()}`)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    applyFilters({ usuario, accion, desde, hasta })
  }

  function handleClear() {
    setUsuario('')
    setAccion('')
    setDesde('')
    setHasta('')
    router.replace(pathname)
  }

  const inputClass = 'rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-[#1E1E1E] outline-none focus:border-[#0eb1c3]'

  return (
    <form onSubmit={handleSubmit} className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-5">
      <input
        type="text"
        value={usuario}
        onChange={(e) => setUsuario(e.target.value)}
        placeholder="Usuario (email)"
        className={inputClass}
      />
      <input
        type="text"
        value={accion}
        onChange={(e) => setAccion(e.target.value)}
        placeholder="Acción (ej: delete)"
        className={inputClass}
      />
      <input type="date" value={desde} onChange={(e) => setDesde(e.target.value)} className={inputClass} />
      <input type="date" value={hasta} onChange={(e) => setHasta(e.target.value)} className={inputClass} />
      <div className="flex gap-2">
        <button
          type="submit"
          className="flex-1 rounded-xl py-2.5 text-sm font-bold text-white transition-opacity hover:opacity-90"
          style={{ backgroundColor: '#0eb1c3' }}
        >
          Filtrar
        </button>
        <button
          type="button"
          onClick={handleClear}
          className="rounded-xl border border-gray-200 px-3 py-2.5 text-sm font-semibold text-gray-500 hover:bg-gray-50"
        >
          Limpiar
        </button>
      </div>
    </form>
  )
}
