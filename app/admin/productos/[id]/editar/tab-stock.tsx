'use client'

import { useState, useTransition, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { addStockVariant, updateProductStockQty, updateProductStockSortOrder, removeProductStock, upsertGenericStock } from './actions'

type AttributeValue = { id: string; value: string }
type Attribute = { id: string; name: string; values: AttributeValue[] }

type StockItem = {
  id: string
  stock: number
  sortOrder: number
  attributeId: string
  attribute: { id: string; name: string; hidden: boolean }
  attributeValueId: string
  attributeValue: { id: string; value: string }
}

export default function TabStock({
  productId,
  attributes: initialAttributes,
  initial,
  imagesByAvId,
}: {
  productId: string
  attributes: Attribute[]
  initial: StockItem[]
  imagesByAvId: Record<string, string>
}) {
  const [items, setItems] = useState(initial)
  const [attributes, setAttributes] = useState(initialAttributes)
  const router = useRouter()

  // ── Attribute combobox ──────────────────────────────────────────────────
  const [attrSearch, setAttrSearch] = useState('')
  const [attrDropdownOpen, setAttrDropdownOpen] = useState(false)
  const [selectedAttr, setSelectedAttr] = useState<Attribute | null>(null)
  const attrRef = useRef<HTMLDivElement>(null)

  const filteredAttrs = attributes.filter((a) =>
    a.name.toLowerCase().includes(attrSearch.toLowerCase()),
  )
  const exactAttrMatch = attributes.find(
    (a) => a.name.toLowerCase() === attrSearch.trim().toLowerCase(),
  )
  const isNewAttr = attrSearch.trim() !== '' && !exactAttrMatch

  function selectAttr(attr: Attribute) {
    setSelectedAttr(attr)
    setAttrSearch(attr.name)
    setAttrDropdownOpen(false)
    setValueSearch('')
    setSelectedValue(null)
  }

  function handleAttrInput(val: string) {
    setAttrSearch(val)
    setSelectedAttr(null)
    setAttrDropdownOpen(true)
    setValueSearch('')
    setSelectedValue(null)
  }

  // ── Value combobox ──────────────────────────────────────────────────────
  const [valueSearch, setValueSearch] = useState('')
  const [valueDropdownOpen, setValueDropdownOpen] = useState(false)
  const [selectedValue, setSelectedValue] = useState<AttributeValue | null>(null)
  const valueRef = useRef<HTMLDivElement>(null)

  // Resolved attribute (either selected from dropdown or matched by name)
  const resolvedAttr = selectedAttr ?? exactAttrMatch ?? null
  const existingValues = resolvedAttr?.values ?? []

  const filteredValues = existingValues.filter((v) =>
    v.value.toLowerCase().includes(valueSearch.toLowerCase()),
  )
  const exactValueMatch = existingValues.find(
    (v) => v.value.toLowerCase() === valueSearch.trim().toLowerCase(),
  )
  const isNewValue = valueSearch.trim() !== '' && !exactValueMatch

  function selectValue(av: AttributeValue) {
    setSelectedValue(av)
    setValueSearch(av.value)
    setValueDropdownOpen(false)
  }

  function handleValueInput(val: string) {
    setValueSearch(val)
    setSelectedValue(null)
    setValueDropdownOpen(true)
  }

  // ── Add variant ─────────────────────────────────────────────────────────
  const [error, setError] = useState('')
  const [, startTransition] = useTransition()

  function handleAdd() {
    if (!attrSearch.trim() || !valueSearch.trim()) {
      setError('Completá el atributo y el valor')
      return
    }
    setError('')

    startTransition(async () => {
      const result = await addStockVariant(productId, attrSearch.trim(), valueSearch.trim())
      if (!result.ok) { setError(result.error ?? 'Error'); return }

      // If attribute is new, add it to local state
      const attrId = result.attributeId!
      const attrName = result.attributeName!
      const avId = result.attributeValueId!
      const avValue = result.value!

      setAttributes((prev) => {
        const existing = prev.find((a) => a.id === attrId)
        if (existing) {
          // Add value if not already present
          if (!existing.values.find((v) => v.id === avId)) {
            return prev.map((a) =>
              a.id === attrId ? { ...a, values: [...a.values, { id: avId, value: avValue }].sort((a, b) => a.value.localeCompare(b.value)) } : a,
            )
          }
          return prev
        }
        return [...prev, { id: attrId, name: attrName, values: [{ id: avId, value: avValue }] }]
      })

      setItems((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          stock: 0,
          sortOrder: 0,
          attributeId: attrId,
          attribute: { id: attrId, name: attrName, hidden: false },
          attributeValueId: avId,
          attributeValue: { id: avId, value: avValue },
        },
      ])

      setAttrSearch('')
      setSelectedAttr(null)
      setValueSearch('')
      setSelectedValue(null)
    })
  }

  function handleRemove(id: string) {
    if (!confirm('¿Eliminar este ítem de stock?')) return
    startTransition(async () => {
      await removeProductStock(id, productId)
      setItems((prev) => prev.filter((s) => s.id !== id))
    })
  }

  // ── Generic stock ───────────────────────────────────────────────────────
  const genericItem = items.find((i) => i.attribute.hidden)
  const [genericQty, setGenericQty] = useState(genericItem?.stock ?? 0)
  const [, startGenericTransition] = useTransition()

  function handleGenericBlur() {
    startGenericTransition(async () => {
      const result = await upsertGenericStock(productId, genericQty)
      if (result.ok && !genericItem) {
        setItems((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            stock: genericQty,
            sortOrder: 0,
            attributeId: result.attributeId!,
            attribute: { id: result.attributeId!, name: 'Genérico', hidden: true },
            attributeValueId: result.attributeValueId!,
            attributeValue: { id: result.attributeValueId!, value: 'único' },
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
            {attrDropdownOpen && (attrSearch.trim() !== '' || filteredAttrs.length > 0) && (
              <div className="absolute z-20 mt-1 w-full overflow-hidden rounded-xl border border-gray-100 bg-white shadow-lg">
                {filteredAttrs.map((a) => (
                  <button
                    key={a.id}
                    type="button"
                    onMouseDown={() => selectAttr(a)}
                    className="flex w-full items-center px-3 py-2.5 text-left text-sm text-[#1E1E1E] hover:bg-gray-50"
                  >
                    {a.name}
                    <span className="ml-auto text-[11px] text-gray-300">{a.values.length} valores</span>
                  </button>
                ))}
                {isNewAttr && (
                  <button
                    type="button"
                    onMouseDown={() => setAttrDropdownOpen(false)}
                    className="flex w-full items-center gap-2 border-t border-gray-100 px-3 py-2.5 text-left text-sm font-semibold text-[#0eb1c3] hover:bg-[#0eb1c3]/5"
                  >
                    <span className="text-base font-black">+</span>
                    Crear &quot;{attrSearch.trim()}&quot;
                  </button>
                )}
                {filteredAttrs.length === 0 && !isNewAttr && (
                  <p className="px-3 py-2.5 text-sm text-gray-400">Sin resultados</p>
                )}
              </div>
            )}
          </div>

          {/* Value combobox */}
          <div className="relative flex-1" ref={valueRef}>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-400">
              Valor
            </label>
            <input
              value={valueSearch}
              onChange={(e) => handleValueInput(e.target.value)}
              onFocus={() => setValueDropdownOpen(true)}
              onBlur={() => setTimeout(() => setValueDropdownOpen(false), 150)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAdd() } }}
              placeholder={resolvedAttr ? `Ej: Rojo, XL…` : 'Elegí un atributo primero'}
              disabled={!attrSearch.trim()}
              className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[#0eb1c3] focus:ring-2 focus:ring-[#0eb1c3]/10 disabled:bg-gray-100 disabled:text-gray-300"
            />
            {valueDropdownOpen && attrSearch.trim() && (filteredValues.length > 0 || isNewValue) && (
              <div className="absolute z-20 mt-1 w-full overflow-hidden rounded-xl border border-gray-100 bg-white shadow-lg">
                {filteredValues.map((v) => (
                  <button
                    key={v.id}
                    type="button"
                    onMouseDown={() => selectValue(v)}
                    className="flex w-full items-center px-3 py-2.5 text-left text-sm text-[#1E1E1E] hover:bg-gray-50"
                  >
                    {v.value}
                  </button>
                ))}
                {isNewValue && (
                  <button
                    type="button"
                    onMouseDown={() => setValueDropdownOpen(false)}
                    className="flex w-full items-center gap-2 border-t border-gray-100 px-3 py-2.5 text-left text-sm font-semibold text-[#0eb1c3] hover:bg-[#0eb1c3]/5"
                  >
                    <span className="text-base font-black">+</span>
                    Crear &quot;{valueSearch.trim()}&quot;
                  </button>
                )}
              </div>
            )}
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

        {isNewAttr && attrSearch.trim() && (
          <p className="mt-2 text-xs text-[#0eb1c3]">
            Se creará el atributo &quot;{attrSearch.trim()}&quot;.
          </p>
        )}
        {isNewValue && valueSearch.trim() && resolvedAttr && (
          <p className="mt-2 text-xs text-[#0eb1c3]">
            Se creará el valor &quot;{valueSearch.trim()}&quot; bajo {resolvedAttr.name} y quedará disponible para otros productos.
          </p>
        )}
        {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
      </div>

      {/* Stock table */}
      <div className="overflow-hidden rounded-xl border border-gray-100 bg-white" id="stock-table">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="w-16 px-3 py-3 text-left text-xs font-black uppercase tracking-wider text-gray-400">Pos</th>
              <th className="w-12 px-3 py-3 text-left text-xs font-black uppercase tracking-wider text-gray-400">Img</th>
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
                imageUrl={imagesByAvId[item.attributeValueId]}
                onUpdate={(id, stock) =>
                  setItems((prev) => prev.map((s) => (s.id === id ? { ...s, stock } : s)))
                }
                onUpdateSortOrder={(id, sortOrder) =>
                  setItems((prev) => prev.map((s) => (s.id === id ? { ...s, sortOrder } : s)))
                }
                onRemove={handleRemove}
              />
            ))}
            {visibleItems.length === 0 && (
              <tr>
                <td colSpan={6} className="py-12 text-center text-sm text-gray-400">
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
  imageUrl,
  onUpdate,
  onUpdateSortOrder,
  onRemove,
}: {
  item: StockItem
  productId: string
  imageUrl?: string
  onUpdate: (id: string, stock: number) => void
  onUpdateSortOrder: (id: string, sortOrder: number) => void
  onRemove: (id: string) => void
}) {
  const [stock, setStock] = useState(item.stock)
  const [sortOrder, setSortOrder] = useState(item.sortOrder)
  const [, startTransition] = useTransition()

  function handleStockBlur() {
    if (stock === item.stock) return
    startTransition(async () => {
      await updateProductStockQty(item.id, stock, productId)
      onUpdate(item.id, stock)
    })
  }

  function handleSortOrderBlur() {
    if (sortOrder === item.sortOrder) return
    startTransition(async () => {
      await updateProductStockSortOrder(item.id, sortOrder, productId)
      onUpdateSortOrder(item.id, sortOrder)
    })
  }

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-3 py-3">
        <input
          type="number"
          value={sortOrder}
          onChange={(e) => setSortOrder(Number(e.target.value))}
          onBlur={handleSortOrderBlur}
          min={0}
          className="w-14 rounded border border-gray-200 px-2 py-1 text-center text-sm focus:border-[#0eb1c3] focus:outline-none"
        />
      </td>
      <td className="px-3 py-3">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={item.attributeValue.value}
            className="h-8 w-8 rounded object-cover"
          />
        ) : (
          <div className="h-8 w-8 rounded bg-gray-100" />
        )}
      </td>
      <td className="px-5 py-3 text-sm text-gray-500">{item.attribute.name}</td>
      <td className="px-5 py-3 font-semibold text-[#1E1E1E]">{item.attributeValue.value}</td>
      <td className="px-5 py-3">
        <input
          type="number"
          value={stock}
          onChange={(e) => setStock(Number(e.target.value))}
          onBlur={handleStockBlur}
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
