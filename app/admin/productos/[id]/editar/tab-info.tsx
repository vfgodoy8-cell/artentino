'use client'

import { useState, useTransition } from 'react'
import { updateProductInfo, replaceComboP } from './actions'

const MIN_COMBO_ROWS = 10

type ComboRow = { price: string; quantity: string; startDate: string; endDate: string }

type TabInfoProps = {
  product: {
    id: string
    name: string
    stock: number
    categoryId: string
    conditionId: string | null
    description: string | null
    additionalData: string | null
    price: number
    comparePrice: number | null
    cost: number | null
    videoUrl: string | null
    showPrice: boolean
    active: boolean
    sortOrder: number
    height: number | null
    width: number | null
    length: number | null
    weight: number | null
  }
  comboPrices: { id: string; price: number; quantity: number; startDate: string | null; endDate: string | null }[]
  categories: { id: string; name: string }[]
  conditions: { id: string; name: string }[]
}

const input =
  'w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm text-[#1E1E1E] placeholder-gray-300 outline-none transition-colors focus:border-[#0eb1c3] focus:ring-2 focus:ring-[#0eb1c3]/10'

const label = 'mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-400'

function emptyRow(): ComboRow {
  return { price: '', quantity: '', startDate: '', endDate: '' }
}

function buildComboRows(
  saved: TabInfoProps['comboPrices'],
): ComboRow[] {
  const rows: ComboRow[] = saved.map((c) => ({
    price: String(c.price),
    quantity: String(c.quantity),
    startDate: c.startDate ? c.startDate.slice(0, 10) : '',
    endDate: c.endDate ? c.endDate.slice(0, 10) : '',
  }))
  while (rows.length < MIN_COMBO_ROWS) rows.push(emptyRow())
  return rows
}

export default function TabInfo({ product, comboPrices, categories, conditions }: TabInfoProps) {
  const [form, setForm] = useState({
    name: product.name,
    stock: product.stock,
    categoryId: product.categoryId,
    conditionId: product.conditionId ?? '',
    description: product.description ?? '',
    additionalData: product.additionalData ?? '',
    price: product.price,
    comparePrice: product.comparePrice ?? '',
    cost: product.cost ?? '',
    videoUrl: product.videoUrl ?? '',
    showPrice: product.showPrice,
    active: product.active,
    sortOrder: product.sortOrder,
    height: product.height ?? '',
    width: product.width ?? '',
    length: product.length ?? '',
    weight: product.weight ?? '',
  })
  const [comboRows, setComboRows] = useState<ComboRow[]>(() => buildComboRows(comboPrices))
  const [saved, setSaved] = useState(false)
  const [comboSaved, setComboSaved] = useState(false)
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()

  function setField<K extends keyof typeof form>(k: K, v: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [k]: v }))
  }

  function setComboRow(i: number, field: keyof ComboRow, val: string) {
    setComboRows((prev) => prev.map((r, idx) => (idx === i ? { ...r, [field]: val } : r)))
  }

  function addComboRow() {
    setComboRows((prev) => [...prev, emptyRow()])
  }

  function handleSaveInfo() {
    if (!form.name.trim()) { setError('El nombre es requerido'); return }
    if (!form.price || Number(form.price) <= 0) { setError('El precio debe ser mayor a 0'); return }
    setError('')
    startTransition(async () => {
      await updateProductInfo(product.id, {
        name: form.name,
        stock: Number(form.stock),
        categoryId: form.categoryId,
        conditionId: form.conditionId || null,
        description: form.description,
        additionalData: form.additionalData,
        price: Number(form.price),
        comparePrice: form.comparePrice !== '' ? Number(form.comparePrice) : null,
        cost: form.cost !== '' ? Number(form.cost) : null,
        videoUrl: form.videoUrl,
        showPrice: form.showPrice,
        active: form.active,
        sortOrder: Number(form.sortOrder),
        height: form.height !== '' ? Number(form.height) : null,
        width: form.width !== '' ? Number(form.width) : null,
        length: form.length !== '' ? Number(form.length) : null,
        weight: form.weight !== '' ? Number(form.weight) : null,
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    })
  }

  function handleSaveCombos() {
    startTransition(async () => {
      await replaceComboP(
        product.id,
        comboRows.map((r) => ({
          price: Number(r.price),
          quantity: Number(r.quantity),
          startDate: r.startDate,
          endDate: r.endDate,
        })),
      )
      setComboSaved(true)
      setTimeout(() => setComboSaved(false), 2000)
    })
  }

  const sku = product.id.slice(0, 8).toUpperCase()

  return (
    <div className="space-y-6">
      {error && <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>}

      {/* Row 1: SKU + Nombre + Stock */}
      <div className="grid gap-4 sm:grid-cols-4">
        <div>
          <label className={label}>SKU</label>
          <input value={sku} readOnly className={`${input} cursor-default bg-gray-50 font-mono text-gray-400`} />
        </div>
        <div className="sm:col-span-2">
          <label className={label}>Nombre *</label>
          <input value={form.name} onChange={(e) => setField('name', e.target.value)} className={input} placeholder="Nombre del producto" />
        </div>
        <div>
          <label className={label}>Stock general</label>
          <input type="number" value={form.stock} onChange={(e) => setField('stock', Number(e.target.value))} min={0} className={input} />
        </div>
      </div>

      {/* Row 2: Marca + Categoría + Condición */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className={label}>Marca</label>
          <select className={input} disabled>
            <option>Ninguna</option>
          </select>
        </div>
        <div>
          <label className={label}>Categoría *</label>
          <select value={form.categoryId} onChange={(e) => setField('categoryId', e.target.value)} className={input}>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div>
          <label className={label}>Condición</label>
          <select value={form.conditionId} onChange={(e) => setField('conditionId', e.target.value)} className={input}>
            <option value="">— Sin condición —</option>
            {conditions.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
      </div>

      {/* Descripción + Data adicional */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={label}>Descripción</label>
          <textarea value={form.description} onChange={(e) => setField('description', e.target.value)} rows={4} className={input} placeholder="Descripción del producto..." />
        </div>
        <div>
          <label className={label}>Data adicional</label>
          <textarea value={form.additionalData} onChange={(e) => setField('additionalData', e.target.value)} rows={4} className={input} placeholder="Información adicional..." />
        </div>
      </div>

      {/* Precios */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className={label}>Precio * ($)</label>
          <input type="number" value={form.price} onChange={(e) => setField('price', Number(e.target.value))} min={0} className={input} placeholder="0" />
        </div>
        <div>
          <label className={label}>Precio tachado ($)</label>
          <input type="number" value={form.comparePrice} onChange={(e) => setField('comparePrice', e.target.value)} min={0} className={input} placeholder="0" />
        </div>
        <div>
          <label className={label}>Costo ($)</label>
          <input type="number" value={form.cost} onChange={(e) => setField('cost', e.target.value)} min={0} className={input} placeholder="0" />
        </div>
      </div>

      {/* Precios por combo */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <label className={label}>Precios por combo</label>
          <button type="button" onClick={addComboRow} className="text-xs font-bold text-[#0eb1c3] hover:underline">
            + Agregar fila
          </button>
        </div>
        <div className="overflow-hidden rounded-xl border border-gray-100">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                {['Precio ($)', 'Cantidad', 'Fecha inicio', 'Fecha fin'].map((h) => (
                  <th key={h} className="px-3 py-2.5 text-left text-xs font-black uppercase tracking-wider text-gray-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {comboRows.map((row, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="px-3 py-2">
                    <input
                      type="number"
                      value={row.price}
                      onChange={(e) => setComboRow(i, 'price', e.target.value)}
                      placeholder="—"
                      min={0}
                      className="w-full rounded border border-gray-200 px-2 py-1 text-sm focus:border-[#0eb1c3] focus:outline-none"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="number"
                      value={row.quantity}
                      onChange={(e) => setComboRow(i, 'quantity', e.target.value)}
                      placeholder="—"
                      min={1}
                      className="w-full rounded border border-gray-200 px-2 py-1 text-sm focus:border-[#0eb1c3] focus:outline-none"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="date"
                      value={row.startDate}
                      onChange={(e) => setComboRow(i, 'startDate', e.target.value)}
                      className="w-full rounded border border-gray-200 px-2 py-1 text-sm focus:border-[#0eb1c3] focus:outline-none"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="date"
                      value={row.endDate}
                      onChange={(e) => setComboRow(i, 'endDate', e.target.value)}
                      className="w-full rounded border border-gray-200 px-2 py-1 text-sm focus:border-[#0eb1c3] focus:outline-none"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-2 flex items-center gap-3">
          <button
            type="button"
            onClick={handleSaveCombos}
            disabled={isPending}
            className="rounded-lg px-4 py-2 text-xs font-bold text-white disabled:opacity-50"
            style={{ backgroundColor: '#0eb1c3' }}
          >
            {comboSaved ? '✓ Combos guardados' : 'Guardar combos'}
          </button>
        </div>
      </div>

      {/* Opciones adicionales */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className={label}>Grupo descuento</label>
          <select className={input} disabled>
            <option>Ninguno</option>
          </select>
        </div>
        <div>
          <label className={label}>URL de video (YouTube)</label>
          <input value={form.videoUrl} onChange={(e) => setField('videoUrl', e.target.value)} className={input} placeholder="https://youtube.com/..." />
        </div>
        <div />
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        <div>
          <label className={label}>Mostrar precio</label>
          <select value={form.showPrice ? '1' : '0'} onChange={(e) => setField('showPrice', e.target.value === '1')} className={input}>
            <option value="1">Sí</option>
            <option value="0">No</option>
          </select>
        </div>
        <div>
          <label className={label}>Activo</label>
          <select value={form.active ? '1' : '0'} onChange={(e) => setField('active', e.target.value === '1')} className={input}>
            <option value="1">Sí</option>
            <option value="0">No</option>
          </select>
        </div>
        <div>
          <label className={label}>Nº de Orden</label>
          <input type="number" value={form.sortOrder} onChange={(e) => setField('sortOrder', Number(e.target.value))} min={0} className={input} />
        </div>
      </div>

      {/* Medidas */}
      <div>
        <p className="mb-3 text-xs font-black uppercase tracking-wider text-gray-400">Medidas y peso</p>
        <div className="grid gap-4 sm:grid-cols-4">
          <div>
            <label className={label}>Alto (cm)</label>
            <input type="number" value={form.height} onChange={(e) => setField('height', e.target.value)} min={0} step="0.01" className={input} placeholder="—" />
          </div>
          <div>
            <label className={label}>Ancho (cm)</label>
            <input type="number" value={form.width} onChange={(e) => setField('width', e.target.value)} min={0} step="0.01" className={input} placeholder="—" />
          </div>
          <div>
            <label className={label}>Largo (cm)</label>
            <input type="number" value={form.length} onChange={(e) => setField('length', e.target.value)} min={0} step="0.01" className={input} placeholder="—" />
          </div>
          <div>
            <label className={label}>Peso (kg)</label>
            <input type="number" value={form.weight} onChange={(e) => setField('weight', e.target.value)} min={0} step="0.001" className={input} placeholder="—" />
          </div>
        </div>
      </div>

      {/* Save button */}
      <div className="flex items-center gap-4 border-t border-gray-100 pt-4">
        <button
          type="button"
          onClick={handleSaveInfo}
          disabled={isPending}
          className="rounded-xl px-8 py-3 text-sm font-black uppercase tracking-wider text-white transition-opacity disabled:opacity-50"
          style={{ backgroundColor: '#0eb1c3' }}
        >
          {isPending ? 'Guardando...' : saved ? '✓ Guardado' : 'Guardar información'}
        </button>
        {saved && <span className="text-sm text-green-600 font-semibold">Cambios guardados</span>}
      </div>
    </div>
  )
}
