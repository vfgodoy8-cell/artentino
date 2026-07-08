'use client'

import { useState, useTransition, useRef } from 'react'
import { useRouter } from 'next/navigation'
import {
  addProductRelation,
  removeProductRelation,
  updateRelationSortOrder,
  searchProductsForRelation,
} from './actions'

type RelatedProduct = {
  id: string
  sortOrder: number
  relatedProduct: {
    id: string
    name: string
    sku: string | null
    imageUrl: string | null
    price: number
  }
}

type SearchResult = {
  id: string
  name: string
  sku: string | null
  imageUrl: string | null
  price: number
}

function fmt(n: number) {
  return `$${n.toLocaleString('es-AR')}`
}

export default function TabRelacionados({
  productId,
  initial,
  existingIds,
}: {
  productId: string
  initial: RelatedProduct[]
  existingIds: Set<string>
}) {
  const router = useRouter()
  const [relations, setRelations] = useState(initial)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [searching, setSearching] = useState(false)
  const [, startTransition] = useTransition()
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const linked = new Set([...existingIds, ...relations.map((r) => r.relatedProduct.id)])

  function handleQueryChange(e: React.ChangeEvent<HTMLInputElement>) {
    const q = e.target.value
    setQuery(q)
    clearTimeout(debounceRef.current)
    if (!q.trim()) { setResults([]); return }
    setSearching(true)
    debounceRef.current = setTimeout(async () => {
      const res = await searchProductsForRelation(productId, q)
      setResults(res.map((r) => ({ ...r, price: Number(r.price) })))
      setSearching(false)
    }, 350)
  }

  async function handleAdd(product: SearchResult) {
    await addProductRelation(productId, product.id)
    setRelations((prev) => [
      ...prev,
      {
        id: '', // will refresh
        sortOrder: prev.length,
        relatedProduct: product,
      },
    ])
    setQuery('')
    setResults([])
    router.refresh()
  }

  async function handleRemove(id: string) {
    await removeProductRelation(id, productId)
    setRelations((prev) => prev.filter((r) => r.id !== id))
    router.refresh()
  }

  function handleSortOrder(id: string, value: string) {
    const n = parseInt(value, 10)
    if (isNaN(n)) return
    startTransition(async () => {
      await updateRelationSortOrder(id, n, productId)
      setRelations((prev) =>
        prev.map((r) => (r.id === id ? { ...r, sortOrder: n } : r)),
      )
    })
  }

  const sorted = [...relations].sort((a, b) => a.sortOrder - b.sortOrder)

  return (
    <div className="space-y-6">
      {/* Search */}
      <div>
        <label className="mb-1.5 block text-xs font-black uppercase tracking-wider text-gray-400">
          Agregar producto relacionado
        </label>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center">
            {searching ? (
              <svg className="animate-spin" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2.5" strokeLinecap="round">
                <path d="M21 12a9 9 0 1 1-6.22-8.56" />
              </svg>
            ) : (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            )}
          </div>
          <input
            type="text"
            value={query}
            onChange={handleQueryChange}
            placeholder="Buscar por nombre o SKU..."
            className="h-10 w-full rounded-xl border border-gray-200 pl-10 pr-4 text-sm text-[#1E1E1E] placeholder-gray-400 outline-none transition-[border-color,box-shadow] focus:border-[#0eb1c3] focus:ring-2 focus:ring-[#0eb1c3]/10"
          />
        </div>

        {results.length > 0 && (
          <div className="mt-1 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-lg">
            {results.map((r) => {
              const alreadyLinked = linked.has(r.id)
              return (
                <button
                  key={r.id}
                  type="button"
                  disabled={alreadyLinked}
                  onClick={() => handleAdd(r)}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                    {r.imageUrl && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={r.imageUrl} alt={r.name} className="h-full w-full object-cover" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-[#1E1E1E]">{r.name}</p>
                    {r.sku && <p className="font-mono text-[11px] text-gray-400">{r.sku}</p>}
                  </div>
                  <span className="shrink-0 text-sm font-black text-[#1E1E1E]">{fmt(r.price)}</span>
                  {alreadyLinked && (
                    <span className="shrink-0 rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-bold text-gray-400">
                      Ya agregado
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* Linked products table */}
      {sorted.length === 0 ? (
        <p className="text-sm text-gray-400">Este producto no tiene relacionados todavía.</p>
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-100">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="px-4 py-2.5 text-left text-[10px] font-black uppercase tracking-wider text-gray-400">Producto</th>
                <th className="px-4 py-2.5 text-left text-[10px] font-black uppercase tracking-wider text-gray-400">Precio</th>
                <th className="w-24 px-4 py-2.5 text-left text-[10px] font-black uppercase tracking-wider text-gray-400">Orden</th>
                <th className="w-16 px-4 py-2.5" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {sorted.map((rel) => (
                <tr key={rel.id}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                        {rel.relatedProduct.imageUrl && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={rel.relatedProduct.imageUrl} alt={rel.relatedProduct.name} className="h-full w-full object-cover" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-bold text-[#1E1E1E]">{rel.relatedProduct.name}</p>
                        {rel.relatedProduct.sku && (
                          <p className="font-mono text-[11px] text-gray-400">{rel.relatedProduct.sku}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-black text-[#1E1E1E]">
                    {fmt(rel.relatedProduct.price)}
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      defaultValue={rel.sortOrder}
                      min={0}
                      className="h-8 w-16 rounded-lg border border-gray-200 px-2 text-center text-sm outline-none focus:border-[#0eb1c3] focus:ring-2 focus:ring-[#0eb1c3]/10"
                      onBlur={(e) => handleSortOrder(rel.id, e.target.value)}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => handleRemove(rel.id)}
                      className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
                      title="Quitar"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
