'use client'

import { useState, useTransition } from 'react'
import { addProductAttributeValue, removeProductAttribute } from './actions'

type AttributeGroup = {
  id: string
  name: string
  values: { id: string; value: string }[]
}

type AssignedAttribute = {
  id: string
  attributeValueId: string
  attributeValue: {
    id: string
    value: string
    attribute: { id: string; name: string }
  }
}

export default function TabAtributos({
  productId,
  attributes,
  initial,
}: {
  productId: string
  attributes: AttributeGroup[]
  initial: AssignedAttribute[]
}) {
  const [assigned, setAssigned] = useState(initial)
  const [selectedAttrId, setSelectedAttrId] = useState(attributes[0]?.id ?? '')
  const [valueInput, setValueInput] = useState('')
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
      const result = await addProductAttributeValue(productId, selectedAttrId, valueInput.trim())
      if (!result.ok) {
        setError(result.error ?? 'Error al agregar')
        return
      }
      setValueInput('')
    })
  }

  function handleRemove(id: string) {
    if (!confirm('¿Quitar este atributo del producto?')) return
    startTransition(async () => {
      await removeProductAttribute(id, productId)
      setAssigned((prev) => prev.filter((a) => a.id !== id))
    })
  }

  return (
    <div className="space-y-6">
      {/* Selector */}
      <div className="flex items-end gap-3">
        <div className="flex-1">
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-400">
            Grupo de atributo
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
                (existentes: {selectedAttr.values.map((v) => v.value).join(', ')})
              </span>
            )}
          </label>
          <input
            value={valueInput}
            onChange={(e) => setValueInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAdd() } }}
            placeholder="Ej: Rojo, XL, Floral..."
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

      {/* Tabla de atributos asignados */}
      <div className="overflow-hidden rounded-xl border border-gray-100 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="px-5 py-3 text-left text-xs font-black uppercase tracking-wider text-gray-400">Grupo</th>
              <th className="px-5 py-3 text-left text-xs font-black uppercase tracking-wider text-gray-400">Valor</th>
              <th className="px-5 py-3 text-right text-xs font-black uppercase tracking-wider text-gray-400">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {assigned.map((a) => (
              <tr key={a.id} className="hover:bg-gray-50">
                <td className="px-5 py-3 text-gray-500">{a.attributeValue.attribute.name}</td>
                <td className="px-5 py-3 font-semibold text-[#1E1E1E]">{a.attributeValue.value}</td>
                <td className="px-5 py-3 text-right">
                  <button
                    onClick={() => handleRemove(a.id)}
                    className="rounded-lg px-3 py-1.5 text-xs font-bold text-red-400 transition-colors hover:bg-red-50 hover:text-red-600"
                  >
                    Quitar
                  </button>
                </td>
              </tr>
            ))}
            {assigned.length === 0 && (
              <tr>
                <td colSpan={3} className="py-12 text-center text-sm text-gray-400">
                  Sin atributos asignados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
