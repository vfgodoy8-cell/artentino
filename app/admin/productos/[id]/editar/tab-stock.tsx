'use client'

import { useState, useTransition, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { addProductStock, createAttributeAndStock, updateProductStockQty, removeProductStock, upsertGenericStock } from './actions'

type Attribute = { id: string; name: string }

type StockItem = {
  id: string
  stock: number
  attributeId: string
  attribute: { id: string; name: string; hidden: boolean }
  value: string
}

export default function TabStock({
  productId,
  attributes: initialAttributes,
  initial,
}: {
  productId: string
  attributes: Attribute[]
  initial: StockItem[]
}) {
  const [items, setItems] = useState(initial)
  const [attributes, setAttributes] = useState(initialAttributes)
  const router = useRouter()

  // Add-row state
  const [attrSearch, setAttrSearch] = useState('')
  const [attrDropdownOpen, setAttrDropdownOpen] = useState(false)
  const [selectedAttr, setSelectedAttr] = useState<Attribute | null>(null)
  const [valueInput, setValueInput] = useState('')
  const [error, setError] = useState('')
  const [, startTransition] = useTransition()
  const attrRef = useRef<HTMLDivElement>(null)

  const filtered = attributes.filter((a) =>
    a.name.toLowerCase().includes(attrSearch.toLowerCase()),
  )
  const exactMatch = attributes.find(
    (a) => a.name.toLowerCase() === attrSearch.trim().toLowerCase(),
  )
  const isNew = attrSearch.trim() !== '' && !exactMatch

  function selectAttr(attr: Attribute) {
    setSelectedAttr(attr)
    setAttrSearch(attr.name)
    setAttrDropdownOpen(false)
  }

  function handleAttrInput(val: string) {
    setAttrSearch(val)
    setSelectedAttr(null)
    setAttrDropdownOpen(true)
  }

  function handleAdd() {
    if (!attrSearch.trim() || !valueInput.trim()) {
      setError('Completá el atributo y el valor')
      return
    }
    setError('')

    if (isNew) {
      startTransition(async () => {
        const result = await createAttributeAndStock(productId, attrSearch.trim(), valueInput.trim())
        if (!result.ok) { setError(result.error ?? 'Error'); return }
        const newAttr = { id: result.attributeId!, name: result.attributeName! }
        setAttributes((prev) => [...prev, newAttr])
        setItems((prev) => [
          ...prev,
          { id: crypto.randomUUID(), stock: 0, attributeId: newAttr.id, attribute: { ...newAttr, hidden: false }, value: valueInput.trim() },
        ])
        setAttrSearch('')
        setSelectedAttr(null)
        setValueInput('')
      })
    } else {
      const attr = selectedAttr ?? exactMatch!
      startTransition(async () => {
        const result = await addProductStock(productId, attr.id, valueInput.trim())
        if (!result.ok) { setError(result.error ?? 'Error'); return }
        setItems((prev) => [
          ...prev,
          { id: crypto.randomUUID(), stock: 0, attributeId: attr.id, attribute: { ...attr, hidden: false }, value: valueInput.trim() },
        ])
        setAttrSearch('')
        setSelectedAttr(null)
        setValueInput('')
      })
    }
  }

  function handleRemove(id: string) {
    if (!confirm('¿Eliminar este ítem de stock?')) return
    startTransition(async () => {
      await removeProductStock(id, productId)
      setItems((prev) => prev.filter((s) => s.id !== id))
    })
  }

  const genericItem = items.find((i) => i.attribute.hidden)
  const [genericQty, setGenericQty] = useState(genericItem?.stock ?? 0)
  const [, startGenericTransition] = useTransition()

  function handleGenericBlur() {
    startGenericTransition(async () => {
      const result = await upsertGenericStock(productId, genericQty)
      if (result.ok && !genericItem) {
        // reflect new generic item in state so totalStock is accurate
        setItems((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            stock: genericQty,
            attributeId: result.attributeId!,
            attribute: { id: result.attributeId!, name: 'Genérico', hidden: true },
            value: 'único',
          },
        ])
      } else if (result.ok && genericItem) {
        setItems((prev) => prev.map((s) => s.id === genericItem.id ? { ...s, stock: genericQty } : s))
      }
    })
  }

  const visibleItems = items.filter((i) => !i.attribute.hidden)

  return (
    <div className="space-y-6">

      {/* Stock sin variante */}
      <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
        <p className="mb-1 text-xs font-black uppercase tracking-wider text-gray-400">Stock sin variante</p>
        <p className="mb-3 text-xs text-gray-400">Para productos sin color, talle u otra variante.</p>
        <div className="flex items-center gap-3">
          <label className="text-sm text-gray-500">Unidades disponibles:</label>
          <input
            type="number"
            value={genericQty}
            onChange={(e) => setGenericQty(Number(e.target.value))}
            onBlur={handleGenericBlur}
            min={0}
            className="w-24 rounded border border-gray-200 px-2 py-1 text-sm focus:border-[#0eb1c3] focus:outline-none"
          />
        </div>
      </div>

      {/* Add variant row */}
      <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
        <p className="mb-3 text-xs font-black uppercase tracking-wider text-gray-400">Agregar variante</p>
        <div className="flex items-end gap-3">
          {/* Attribute combobox */}
          <div className="relative flex-1" ref={attrRef}>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-400">
              Atributo
            </label>
            <input
              value={attrSearch}
              onChange={(e) => handleAttrInput(e.target.value)}
              onFocus={() => setAttrDropdownOpen(true)}
              onBlur={() => setTimeout(() => setAttrDropdownOpen(false), 150)}
              placeholder="Buscar o crear atributo..."
              className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[#0eb1c3] focus:ring-2 focus:ring-[#0eb1c3]/10"
            />
            {attrDropdownOpen && (attrSearch.trim() !== '' || filtered.length > 0) && (
              <div className="absolute z-20 mt-1 w-full overflow-hidden rounded-xl border border-gray-100 bg-white shadow-lg">
                {filtered.map((a) => (
                  <button
                    key={a.id}
                    type="button"
                    onMouseDown={() => selectAttr(a)}
                    className="flex w-full items-center px-3 py-2.5 text-left text-sm text-[#1E1E1E] hover:bg-gray-50"
                  >
                    {a.name}
                  </button>
                ))}
                {isNew && (
                  <button
                    type="button"
                    onMouseDown={() => {
                      setAttrDropdownOpen(false)
                    }}
                    className="flex w-full items-center gap-2 border-t border-gray-100 px-3 py-2.5 text-left text-sm font-semibold text-[#0eb1c3] hover:bg-[#0eb1c3]/5"
                  >
                    <span className="text-base font-black">+</span>
                    Crear &quot;{attrSearch.trim()}&quot;
                  </button>
                )}
                {filtered.length === 0 && !isNew && (
                  <p className="px-3 py-2.5 text-sm text-gray-400">Sin resultados</p>
                )}
              </div>
            )}
          </div>

          {/* Value */}
          <div className="flex-1">
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-400">
              Valor
            </label>
            <input
              value={valueInput}
              onChange={(e) => setValueInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAdd() } }}
              placeholder="Ej: Rojo, XL, 1L..."
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
        {isNew && attrSearch.trim() && (
          <p className="mt-2 text-xs text-[#0eb1c3]">
            Se creará el atributo &quot;{attrSearch.trim()}&quot; en la tabla general.
          </p>
        )}
        {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
      </div>

      {/* Stock table — only visible (non-hidden) items */}
      <div className="overflow-hidden rounded-xl border border-gray-100 bg-white" id="stock-table">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="px-5 py-3 text-left text-xs font-black uppercase tracking-wider text-gray-400">Atributo</th>
              <th className="px-5 py-3 text-left text-xs font-black uppercase tracking-wider text-gray-400">Valor</th>
              <th className="px-5 py-3 text-left text-xs font-black uppercase tracking-wider text-gray-400">Stock</th>
              <th className="px-5 py-3 text-right text-xs font-black uppercase tracking-wider text-gray-400">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {visibleItems.map((item) => (
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
            {visibleItems.length === 0 && (
              <tr>
                <td colSpan={4} className="py-12 text-center text-sm text-gray-400">
                  Sin variantes. Agregá la primera arriba.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Guardar */}
      <div className="flex items-center gap-4 border-t border-gray-100 pt-4">
        <button
          type="button"
          onClick={() => router.push('/admin/productos')}
          className="rounded-xl px-8 py-3 text-sm font-black uppercase tracking-wider text-white transition-opacity hover:opacity-90"
          style={{ backgroundColor: '#0eb1c3' }}
        >
          Guardar cambios
        </button>
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
      <td className="px-5 py-3 text-sm text-gray-500">{item.attribute.name}</td>
      <td className="px-5 py-3 font-semibold text-[#1E1E1E]">{item.value}</td>
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
