'use client'

import { useState, useTransition } from 'react'
import Image from 'next/image'
import { addDestacado, removeDestacado, updateDestacadoOrder } from './actions'

type Featured = {
  id: string
  name: string
  price: number
  imageUrl: string | null
  sortOrder: number
}

type SearchResult = {
  id: string
  name: string
  price: number
  imageUrl: string | null
}

function fmt(n: number) {
  return `$${n.toLocaleString('es-AR')}`
}

export default function DestacadosClient({ initial }: { initial: Featured[] }) {
  const [featured, setFeatured] = useState(initial)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [searching, setSearching] = useState(false)
  const [, startTransition] = useTransition()

  async function handleSearch(q: string) {
    setQuery(q)
    if (q.length < 2) { setResults([]); return }
    setSearching(true)
    try {
      const res = await fetch(`/api/admin/products/search?q=${encodeURIComponent(q)}`)
      const data = await res.json()
      setResults(data)
    } finally {
      setSearching(false)
    }
  }

  function handleAdd(product: SearchResult) {
    if (featured.some((f) => f.id === product.id)) return
    startTransition(async () => {
      await addDestacado(product.id)
      setFeatured((prev) => [...prev, { ...product, sortOrder: prev.length }])
      setResults((prev) => prev.filter((r) => r.id !== product.id))
      setQuery('')
    })
  }

  function handleRemove(id: string, name: string) {
    if (!confirm(`¿Quitar "${name}" de destacados?`)) return
    startTransition(async () => {
      await removeDestacado(id)
      setFeatured((prev) => prev.filter((f) => f.id !== id))
    })
  }

  function handleOrderChange(id: string, sortOrder: number) {
    startTransition(async () => {
      await updateDestacadoOrder(id, sortOrder)
      setFeatured((prev) => prev.map((f) => (f.id === id ? { ...f, sortOrder } : f)))
    })
  }

  const sorted = [...featured].sort((a, b) => a.sortOrder - b.sortOrder)

  return (
    <div className="space-y-8">
      {/* Buscador */}
      <div>
        <h2 className="mb-3 text-sm font-black uppercase tracking-wider text-gray-400">
          Agregar producto
        </h2>
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Buscar por nombre (mínimo 2 caracteres)..."
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-[#0eb1c3] focus:outline-none"
          />
          {searching && (
            <span className="absolute right-4 top-3.5 text-xs text-gray-400">Buscando...</span>
          )}
        </div>

        {results.length > 0 && (
          <div className="mt-2 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
            {results.map((product) => (
              <div
                key={product.id}
                className="flex items-center justify-between gap-3 border-b border-gray-50 px-4 py-3 last:border-0"
              >
                <div className="flex items-center gap-3">
                  {product.imageUrl ? (
                    <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-gray-100">
                      <Image src={product.imageUrl} alt={product.name} fill className="object-cover" sizes="40px" />
                    </div>
                  ) : (
                    <div className="h-10 w-10 shrink-0 rounded-lg bg-gray-100" />
                  )}
                  <div>
                    <p className="text-sm font-semibold text-[#1E1E1E]">{product.name}</p>
                    <p className="text-xs text-gray-400">{fmt(product.price)}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleAdd(product)}
                  className="shrink-0 rounded-lg px-3 py-1.5 text-xs font-bold text-white transition-opacity hover:opacity-90"
                  style={{ backgroundColor: '#0eb1c3' }}
                >
                  Agregar
                </button>
              </div>
            ))}
          </div>
        )}

        {query.length >= 2 && !searching && results.length === 0 && (
          <p className="mt-2 text-sm text-gray-400">Sin resultados para &quot;{query}&quot;.</p>
        )}
      </div>

      {/* Lista de destacados */}
      <div>
        <h2 className="mb-3 text-sm font-black uppercase tracking-wider text-gray-400">
          Productos destacados ({featured.length})
        </h2>

        {sorted.length === 0 ? (
          <div className="rounded-2xl border border-gray-100 bg-white py-16 text-center text-sm text-gray-400">
            No hay productos destacados todavía.
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  {['', 'Nombre', 'Precio', 'Orden', 'Acciones'].map((h) => (
                    <th
                      key={h}
                      className={`px-5 py-3.5 text-xs font-black uppercase tracking-wider text-gray-400 ${h === 'Acciones' ? 'text-right' : 'text-left'}`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {sorted.map((f) => (
                  <tr key={f.id} className="transition-colors hover:bg-gray-50">
                    <td className="px-5 py-3">
                      {f.imageUrl ? (
                        <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-gray-100">
                          <Image src={f.imageUrl} alt={f.name} fill className="object-cover" sizes="40px" />
                        </div>
                      ) : (
                        <div className="h-10 w-10 shrink-0 rounded-lg bg-gray-100" />
                      )}
                    </td>
                    <td className="px-5 py-3 font-semibold text-[#1E1E1E]">{f.name}</td>
                    <td className="px-5 py-3 text-gray-500">{fmt(f.price)}</td>
                    <td className="px-5 py-3">
                      <OrderInput
                        value={f.sortOrder}
                        onSave={(v) => handleOrderChange(f.id, v)}
                      />
                    </td>
                    <td className="px-5 py-3 text-right">
                      <button
                        onClick={() => handleRemove(f.id, f.name)}
                        className="rounded-lg px-3 py-1.5 text-xs font-bold text-red-400 transition-colors hover:bg-red-50 hover:text-red-600"
                      >
                        Quitar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

function OrderInput({ value, onSave }: { value: number; onSave: (v: number) => void }) {
  const [v, setV] = useState(value)
  return (
    <input
      type="number"
      value={v}
      onChange={(e) => setV(Number(e.target.value))}
      onBlur={() => { if (v !== value) onSave(v) }}
      className="w-16 rounded border border-gray-200 px-2 py-1 text-center text-xs focus:border-[#0eb1c3] focus:outline-none"
    />
  )
}
