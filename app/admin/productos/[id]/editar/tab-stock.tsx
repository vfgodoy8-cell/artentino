'use client'

import { useState, useTransition } from 'react'
import { addProductStock, updateProductStockQty, removeProductStock } from './actions'

type AttributeGroup = {
  id: string
  name: string
  values: { id: string; value: string }[]
}

type StockItem = {
  id: string
  stock: number
  sortOrder: number
  attributeValueId: string
  attributeValue: {
    id: string
    value: string
    attribute: { id: string; name: string }
  }
}

export default function TabStock({
  productId,
  attributes,
  initial,
}: {
  productId: string
  attributes: AttributeGroup[]
  initial: StockItem[]
}) {
  const [items, setItems] = useState(initial)
  const [selectedAttrId, setSelectedAttrId] = useState(attributes[0]?.id ?? '')
  const [valueInput, setValueInput] = useState('')
  const [sortOrderInput, setSortOrderInput] = useState(0)
  const [error, setError] = useState('')
  const [, startTransition] = useTransition()

  const selectedAttr = attributes.find((a) => a.id === selectedAttrId)

  function handleAdd() {
    if (!selectedAttrId || !valueInput.trim()) {
      setError('Seleccioná un atributo e ingresá un valor')
      return
    }
    setError('')
    startTransition(async () => {
      const result = await addProductStock(productId, selectedAttrId, valueInput.trim(), sortOrderInput)
      if (!result.ok) {
        setError(result.error ?? 'Error al agregar')
        return
      }
      setValueInput('')
      setSortOrderInput(0)
    })
  }

  function handleRemove(id: string) {
    if (!confirm('¿Eliminar este stock?')) return
    startTransition(async () => {
      await removeProductStock(id, productId)
      setItems((prev) => prev.filter((s) => s.id !== id))
    })
  }

  return (
    <div className="space-y-6">
      {/* Selector */}
      <div className="flex items-end gap-3">
        <div className="flex-1">
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-400">
            Atributo
          </label>
          <select
            value={selectedAttrId}
            onChange={(e) => { setSelectedAttrId(e.target.value); setValueInput('') }}
            className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[#0eb1c3] focus:ring-2 focus:ring-[#0eb1c3]/10"
          >
            {attributes.length === 0 && <option value="">— Sin atributos —</option>}
            {attributes.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
          </select>
        </div>
        <div className="flex-1">
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-400">
            Valor
            {selectedAttr && selectedAttr.values.length > 0 && (
              <span className="ml-1 normal-case font-normal text-gray-300">
                ({selectedAttr.values.map((v) => v.value).join(', ')})
              </span>
            )}
          </label>
          <input
            value={valueInput}
            onChange={(e) => setValueInput(e.target.value)}
            placeholder="Ej: M, L, XL, Rojo..."
            className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[#0eb1c3] focus:ring-2 focus:ring-[#0eb1c3]/10"
          />
        </div>
        <div className="w-28">
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-400">
            Orden
          </label>
          <input
            type="number"
            value={sortOrderInput}
            onChange={(e) => setSortOrderInput(Number(e.target.value))}
            min={0}
            className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[#0eb1c3] focus:ring-2 focus:ring-[#0eb1c3]/10"
          />
        </div>
        <button
          type="button"
          onClick={handleAdd}
          className="shrink-0 rounded-xl px-5 py-2.5 text-sm font-black uppercase tracking-wider text-white transition-opacity hover:opacity-90"
          style={{ backgroundColor: '#0eb1c3' }}
        >
          Agregar
        </button>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      {/* Tabla de stock */}
      <div className="overflow-hidden rounded-xl border border-gray-100 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="px-5 py-3 text-left text-xs font-black uppercase tracking-wider text-gray-400">Atributo</th>
              <th className="px-5 py-3 text-left text-xs font-black uppercase tracking-wider text-gray-400">Stock</th>
              <th className="px-5 py-3 text-right text-xs font-black uppercase tracking-wider text-gray-400">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {items
              .sort((a, b) => a.sortOrder - b.sortOrder)
              .map((item) => (
                <StockRow
                  key={item.id}
                  item={item}
                  productId={productId}
                  onUpdate={(id, stock) =>
                    setItems((prev) => prev.map((s) => (s.id === id ? { ...s, stock } : s)))
                  }
                  onRemove={handleRemove}
                />
              ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={3} className="py-12 text-center text-sm text-gray-400">
                  Sin items de stock definidos.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function StockRow({
  item,
  productId,
  onUpdate,
  onRemove,
}: {
  item: StockItem
  productId: string
  onUpdate: (id: string, stock: number) => void
  onRemove: (id: string) => void
}) {
  const [stock, setStock] = useState(item.stock)
  const [, startTransition] = useTransition()

  function handleBlur() {
    if (stock === item.stock) return
    startTransition(async () => {
      await updateProductStockQty(item.id, stock, productId)
      onUpdate(item.id, stock)
    })
  }

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-5 py-3">
        <span className="text-gray-400">{item.attributeValue.attribute.name}: </span>
        <span className="font-semibold text-[#1E1E1E]">{item.attributeValue.value}</span>
      </td>
      <td className="px-5 py-3">
        <input
          type="number"
          value={stock}
          onChange={(e) => setStock(Number(e.target.value))}
          onBlur={handleBlur}
          min={0}
          className="w-24 rounded border border-gray-200 px-2 py-1 text-sm focus:border-[#0eb1c3] focus:outline-none"
        />
      </td>
      <td className="px-5 py-3 text-right">
        <button
          onClick={() => onRemove(item.id)}
          className="rounded-lg px-3 py-1.5 text-xs font-bold text-red-400 transition-colors hover:bg-red-50 hover:text-red-600"
        >
          Eliminar
        </button>
      </td>
    </tr>
  )
}
