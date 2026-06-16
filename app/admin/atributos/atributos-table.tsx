'use client'

import { useState, useTransition } from 'react'
import {
  createAttribute,
  updateAttribute,
  inactivateAttributes,
  createAttributeValue,
  updateAttributeValue,
  deleteAttributeValue,
} from './actions'

type AttributeValueItem = { id: string; value: string; stockCount: number; imageCount: number }

type Attribute = {
  id: string
  name: string
  filter: boolean
  hidden: boolean
  imageDriven: boolean
  position: number
  active: boolean
  values: AttributeValueItem[]
}

const EMPTY: Omit<Attribute, 'id' | 'values'> = { name: '', filter: false, hidden: false, imageDriven: false, position: 0, active: true }

export default function AtributosTable({ initial }: { initial: Attribute[] }) {
  const [attrs, setAttrs] = useState(initial)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<Omit<Attribute, 'id' | 'values'>>(EMPTY)
  const [isAdding, setIsAdding] = useState(false)
  const [newForm, setNewForm] = useState<Omit<Attribute, 'id' | 'values'>>(EMPTY)
  const [search, setSearch] = useState('')
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())
  const [, startTransition] = useTransition()

  const filtered = attrs.filter((a) =>
    a.name.toLowerCase().includes(search.toLowerCase()),
  )

  function toggleExpand(id: string) {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function toggleSelect(id: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function toggleSelectAll() {
    setSelected(selected.size === filtered.length ? new Set() : new Set(filtered.map((a) => a.id)))
  }

  function startEdit(a: Attribute) {
    setEditingId(a.id)
    setEditForm({ name: a.name, filter: a.filter, hidden: a.hidden, imageDriven: a.imageDriven, position: a.position, active: a.active })
  }

  function saveEdit(id: string) {
    if (!editForm.name.trim()) return
    startTransition(async () => {
      await updateAttribute(id, editForm)
      setAttrs((prev) => prev.map((a) => (a.id === id ? { ...a, ...editForm } : a)))
      setEditingId(null)
    })
  }

  function saveNew() {
    if (!newForm.name.trim()) return
    startTransition(async () => {
      await createAttribute(newForm)
      setIsAdding(false)
      setNewForm(EMPTY)
    })
  }

  function handleInactivateSelected() {
    if (selected.size === 0) return
    const ids = Array.from(selected)
    startTransition(async () => {
      await inactivateAttributes(ids)
      setAttrs((prev) => prev.map((a) => (ids.includes(a.id) ? { ...a, active: false } : a)))
      setSelected(new Set())
    })
  }

  function toggleActive(id: string, active: boolean) {
    startTransition(async () => {
      await updateAttribute(id, { active })
      setAttrs((prev) => prev.map((a) => (a.id === id ? { ...a, active } : a)))
    })
  }

  function toggleFilter(id: string, filter: boolean) {
    startTransition(async () => {
      await updateAttribute(id, { filter })
      setAttrs((prev) => prev.map((a) => (a.id === id ? { ...a, filter } : a)))
    })
  }

  function toggleHidden(id: string, hidden: boolean) {
    startTransition(async () => {
      await updateAttribute(id, { hidden })
      setAttrs((prev) => prev.map((a) => (a.id === id ? { ...a, hidden } : a)))
    })
  }

  function toggleImageDriven(id: string, imageDriven: boolean) {
    startTransition(async () => {
      await updateAttribute(id, { imageDriven })
      setAttrs((prev) => prev.map((a) => (a.id === id ? { ...a, imageDriven } : a)))
    })
  }

  function updatePosition(id: string, position: number) {
    startTransition(async () => {
      await updateAttribute(id, { position })
      setAttrs((prev) => prev.map((a) => (a.id === id ? { ...a, position } : a)))
    })
  }

  // Value mutations — update local state without full page reload
  function handleValueCreated(attrId: string, av: AttributeValueItem) {
    setAttrs((prev) =>
      prev.map((a) =>
        a.id === attrId
          ? { ...a, values: [...a.values, av].sort((x, y) => x.value.localeCompare(y.value)) }
          : a,
      ),
    )
  }

  function handleValueUpdated(attrId: string, id: string, newValue: string) {
    setAttrs((prev) =>
      prev.map((a) =>
        a.id === attrId
          ? {
              ...a,
              values: a.values
                .map((v) => (v.id === id ? { ...v, value: newValue } : v))
                .sort((x, y) => x.value.localeCompare(y.value)),
            }
          : a,
      ),
    )
  }

  function handleValueDeleted(attrId: string, id: string) {
    setAttrs((prev) =>
      prev.map((a) =>
        a.id === attrId ? { ...a, values: a.values.filter((v) => v.id !== id) } : a,
      ),
    )
  }

  const allSelected = filtered.length > 0 && selected.size === filtered.length

  return (
    <div>
      <div className="mb-4 flex items-center gap-3">
        <button
          onClick={() => { setIsAdding(true); setNewForm(EMPTY) }}
          className="rounded-xl px-5 py-2.5 text-sm font-black uppercase tracking-wider text-white transition-opacity hover:opacity-90"
          style={{ backgroundColor: '#0eb1c3' }}
        >
          + Nuevo
        </button>
        {selected.size > 0 && (
          <button
            onClick={handleInactivateSelected}
            className="rounded-xl border border-amber-200 px-5 py-2.5 text-sm font-black uppercase tracking-wider text-amber-600 transition-colors hover:bg-amber-50"
          >
            Inactivar selección ({selected.size})
          </button>
        )}
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar atributo..."
          className="ml-auto rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#0eb1c3] focus:ring-2 focus:ring-[#0eb1c3]/10"
        />
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="px-4 py-3.5">
                  <input type="checkbox" checked={allSelected} onChange={toggleSelectAll} className="rounded" />
                </th>
                {['ID', 'Nombre', 'Filtro', 'Oculto', 'Img', 'Posición', 'Estado', 'Acciones'].map((h) => (
                  <th
                    key={h}
                    className={`px-4 py-3.5 text-xs font-black uppercase tracking-wider text-gray-400 ${h === 'Acciones' ? 'text-right' : 'text-left'}`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isAdding && (
                <tr className="bg-[#0eb1c3]/5">
                  <td className="px-4 py-3" />
                  <td className="px-4 py-3 font-mono text-xs text-gray-300">nuevo</td>
                  <td className="px-4 py-3">
                    <input
                      autoFocus
                      value={newForm.name}
                      onChange={(e) => setNewForm((f) => ({ ...f, name: e.target.value }))}
                      placeholder="Ej: Color"
                      className="w-full rounded border border-gray-200 px-2 py-1 text-xs focus:border-[#0eb1c3] focus:outline-none"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <ToggleButton active={newForm.filter} activeClass="bg-[#0eb1c3]/10 text-[#0eb1c3]" onClick={() => setNewForm((f) => ({ ...f, filter: !f.filter }))}>
                      {newForm.filter ? 'Sí' : 'No'}
                    </ToggleButton>
                  </td>
                  <td className="px-4 py-3">
                    <ToggleButton active={newForm.hidden} activeClass="bg-purple-100 text-purple-600" onClick={() => setNewForm((f) => ({ ...f, hidden: !f.hidden }))}>
                      {newForm.hidden ? 'Sí' : 'No'}
                    </ToggleButton>
                  </td>
                  <td className="px-4 py-3">
                    <ToggleButton active={newForm.imageDriven} activeClass="bg-amber-100 text-amber-600" onClick={() => setNewForm((f) => ({ ...f, imageDriven: !f.imageDriven }))}>
                      {newForm.imageDriven ? 'Sí' : 'No'}
                    </ToggleButton>
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      value={newForm.position}
                      onChange={(e) => setNewForm((f) => ({ ...f, position: Number(e.target.value) }))}
                      className="w-16 rounded border border-gray-200 px-2 py-1 text-center text-xs focus:border-[#0eb1c3] focus:outline-none"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <ToggleButton active={newForm.active} activeClass="bg-green-100 text-green-600" onClick={() => setNewForm((f) => ({ ...f, active: !f.active }))}>
                      {newForm.active ? 'Activo' : 'Inactivo'}
                    </ToggleButton>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={saveNew} className="rounded-lg px-3 py-1.5 text-xs font-bold text-white" style={{ backgroundColor: '#0eb1c3' }}>Guardar</button>
                      <button onClick={() => setIsAdding(false)} className="rounded-lg px-3 py-1.5 text-xs font-bold text-gray-500 hover:bg-gray-100">Cancelar</button>
                    </div>
                  </td>
                </tr>
              )}

              {filtered.map((a) => {
                const isEditing = editingId === a.id
                const isExpanded = expandedIds.has(a.id)
                return (
                  <>
                    <tr key={a.id} className={`transition-colors hover:bg-gray-50 ${a.hidden ? 'opacity-60' : ''}`}>
                      <td className="px-4 py-3">
                        <input type="checkbox" checked={selected.has(a.id)} onChange={() => toggleSelect(a.id)} className="rounded" />
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-gray-300">{a.id.slice(0, 6)}</td>
                      <td className="px-4 py-3">
                        {isEditing ? (
                          <input
                            autoFocus
                            value={editForm.name}
                            onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))}
                            className="w-full rounded border border-gray-200 px-2 py-1 text-xs focus:border-[#0eb1c3] focus:outline-none"
                          />
                        ) : (
                          <span className="font-semibold text-[#1E1E1E]">{a.name}</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {isEditing ? (
                          <ToggleButton active={editForm.filter} activeClass="bg-[#0eb1c3]/10 text-[#0eb1c3]" onClick={() => setEditForm((f) => ({ ...f, filter: !f.filter }))}>
                            {editForm.filter ? 'Sí' : 'No'}
                          </ToggleButton>
                        ) : (
                          <ToggleButton active={a.filter} activeClass="bg-[#0eb1c3]/10 text-[#0eb1c3]" onClick={() => toggleFilter(a.id, !a.filter)}>
                            {a.filter ? 'Sí' : 'No'}
                          </ToggleButton>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {isEditing ? (
                          <ToggleButton active={editForm.hidden} activeClass="bg-purple-100 text-purple-600" onClick={() => setEditForm((f) => ({ ...f, hidden: !f.hidden }))}>
                            {editForm.hidden ? 'Sí' : 'No'}
                          </ToggleButton>
                        ) : (
                          <ToggleButton active={a.hidden} activeClass="bg-purple-100 text-purple-600" onClick={() => toggleHidden(a.id, !a.hidden)}>
                            {a.hidden ? 'Sí' : 'No'}
                          </ToggleButton>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {isEditing ? (
                          <ToggleButton active={editForm.imageDriven} activeClass="bg-amber-100 text-amber-600" onClick={() => setEditForm((f) => ({ ...f, imageDriven: !f.imageDriven }))}>
                            {editForm.imageDriven ? 'Sí' : 'No'}
                          </ToggleButton>
                        ) : (
                          <ToggleButton active={a.imageDriven} activeClass="bg-amber-100 text-amber-600" onClick={() => toggleImageDriven(a.id, !a.imageDriven)}>
                            {a.imageDriven ? 'Sí' : 'No'}
                          </ToggleButton>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {isEditing ? (
                          <input
                            type="number"
                            value={editForm.position}
                            onChange={(e) => setEditForm((f) => ({ ...f, position: Number(e.target.value) }))}
                            className="w-16 rounded border border-gray-200 px-2 py-1 text-center text-xs focus:border-[#0eb1c3] focus:outline-none"
                          />
                        ) : (
                          <PosInput value={a.position} onSave={(v) => updatePosition(a.id, v)} />
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {isEditing ? (
                          <ToggleButton active={editForm.active} activeClass="bg-green-100 text-green-600" onClick={() => setEditForm((f) => ({ ...f, active: !f.active }))}>
                            {editForm.active ? 'Activo' : 'Inactivo'}
                          </ToggleButton>
                        ) : (
                          <ToggleButton active={a.active} activeClass="bg-green-100 text-green-600" onClick={() => toggleActive(a.id, !a.active)}>
                            {a.active ? 'Activo' : 'Inactivo'}
                          </ToggleButton>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          {isEditing ? (
                            <>
                              <button onClick={() => saveEdit(a.id)} className="rounded-lg px-3 py-1.5 text-xs font-bold text-white" style={{ backgroundColor: '#0eb1c3' }}>Guardar</button>
                              <button onClick={() => setEditingId(null)} className="rounded-lg px-3 py-1.5 text-xs font-bold text-gray-500 hover:bg-gray-100">Cancelar</button>
                            </>
                          ) : (
                            <>
                              <button onClick={() => startEdit(a)} className="rounded-lg px-3 py-1.5 text-xs font-bold text-gray-500 transition-colors hover:bg-gray-100 hover:text-[#1E1E1E]">Editar</button>
                              <button
                                onClick={() => toggleExpand(a.id)}
                                className={`flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-bold transition-colors ${isExpanded ? 'bg-[#0eb1c3]/10 text-[#0eb1c3]' : 'text-gray-400 hover:bg-gray-100 hover:text-[#1E1E1E]'}`}
                              >
                                <span>{a.values.length}</span>
                                <ChevronIcon open={isExpanded} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>

                    {isExpanded && (
                      <tr key={`${a.id}-values`}>
                        <td colSpan={9} className="border-t border-[#0eb1c3]/10 bg-[#f0fdfc] px-6 py-4">
                          <ValuesPanel
                            attributeId={a.id}
                            attributeName={a.name}
                            values={a.values}
                            onCreated={(av) => handleValueCreated(a.id, av)}
                            onUpdated={(id, val) => handleValueUpdated(a.id, id, val)}
                            onDeleted={(id) => handleValueDeleted(a.id, id)}
                          />
                        </td>
                      </tr>
                    )}
                  </>
                )
              })}

              {filtered.length === 0 && !isAdding && (
                <tr>
                  <td colSpan={9} className="py-16 text-center text-sm text-gray-400">
                    {search ? 'Sin resultados para esa búsqueda.' : 'No hay atributos todavía.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// ─── ValuesPanel ──────────────────────────────────────────────────────────────

function ValuesPanel({
  attributeId,
  attributeName,
  values: initialValues,
  onCreated,
  onUpdated,
  onDeleted,
}: {
  attributeId: string
  attributeName: string
  values: AttributeValueItem[]
  onCreated: (av: AttributeValueItem) => void
  onUpdated: (id: string, value: string) => void
  onDeleted: (id: string) => void
}) {
  const [values, setValues] = useState(initialValues)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editInput, setEditInput] = useState('')
  const [newInput, setNewInput] = useState('')
  const [error, setError] = useState('')
  const [, startTransition] = useTransition()

  function startEditValue(v: AttributeValueItem) {
    setEditingId(v.id)
    setEditInput(v.value)
    setError('')
  }

  function saveEditValue(v: AttributeValueItem) {
    if (!editInput.trim()) return
    startTransition(async () => {
      const result = await updateAttributeValue(v.id, attributeId, editInput)
      if (!result.ok) { setError(result.error ?? 'Error'); return }
      const updated = result.value!
      setValues((prev) =>
        prev.map((x) => (x.id === v.id ? { ...x, value: updated } : x))
            .sort((a, b) => a.value.localeCompare(b.value)),
      )
      onUpdated(v.id, updated)
      setEditingId(null)
      setError('')
    })
  }

  function handleDelete(v: AttributeValueItem) {
    const imageNote = v.imageCount > 0
      ? ` ${v.imageCount} imagen${v.imageCount > 1 ? 'es' : ''} quedarán como generales.`
      : ''
    if (!confirm(`¿Eliminar el valor "${v.value}"?${imageNote}`)) return
    startTransition(async () => {
      const result = await deleteAttributeValue(v.id)
      if (!result.ok) { setError(result.error ?? 'Error'); return }
      setValues((prev) => prev.filter((x) => x.id !== v.id))
      onDeleted(v.id)
      setError('')
    })
  }

  function handleCreate() {
    if (!newInput.trim()) return
    startTransition(async () => {
      const result = await createAttributeValue(attributeId, newInput)
      if (!result.ok) { setError(result.error ?? 'Error'); return }
      const av: AttributeValueItem = { id: result.id!, value: result.value!, stockCount: 0, imageCount: 0 }
      setValues((prev) => [...prev, av].sort((a, b) => a.value.localeCompare(b.value)))
      onCreated(av)
      setNewInput('')
      setError('')
    })
  }

  return (
    <div>
      <p className="mb-3 text-[10px] font-black uppercase tracking-widest text-[#0eb1c3]">
        Valores de {attributeName}
      </p>

      {values.length === 0 && (
        <p className="mb-3 text-xs text-gray-400">Sin valores todavía.</p>
      )}

      {values.length > 0 && (
        <div className="mb-3 overflow-hidden rounded-xl border border-[#0eb1c3]/15 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="px-4 py-2 text-left text-[10px] font-black uppercase tracking-wider text-gray-400">Valor</th>
                <th className="px-4 py-2 text-left text-[10px] font-black uppercase tracking-wider text-gray-400">En uso</th>
                <th className="px-4 py-2 text-right text-[10px] font-black uppercase tracking-wider text-gray-400">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {values.map((v) => (
                <tr key={v.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2">
                    {editingId === v.id ? (
                      <input
                        autoFocus
                        value={editInput}
                        onChange={(e) => setEditInput(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') saveEditValue(v); if (e.key === 'Escape') setEditingId(null) }}
                        className="rounded border border-gray-200 px-2 py-1 text-xs focus:border-[#0eb1c3] focus:outline-none"
                      />
                    ) : (
                      <span className="font-semibold text-[#1E1E1E]">{v.value}</span>
                    )}
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex items-center gap-1.5">
                      {v.stockCount > 0 && (
                        <span className="rounded-full bg-[#0eb1c3]/10 px-2 py-0.5 text-[10px] font-bold text-[#0eb1c3]">
                          {v.stockCount} stock
                        </span>
                      )}
                      {v.imageCount > 0 && (
                        <span className="rounded-full bg-purple-50 px-2 py-0.5 text-[10px] font-bold text-purple-400">
                          {v.imageCount} img
                        </span>
                      )}
                      {v.stockCount === 0 && v.imageCount === 0 && (
                        <span className="text-xs text-gray-300">—</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex items-center justify-end gap-1">
                      {editingId === v.id ? (
                        <>
                          <button onClick={() => saveEditValue(v)} className="rounded-lg px-2.5 py-1 text-[11px] font-bold text-white" style={{ backgroundColor: '#0eb1c3' }}>Guardar</button>
                          <button onClick={() => { setEditingId(null); setError('') }} className="rounded-lg px-2.5 py-1 text-[11px] font-bold text-gray-500 hover:bg-gray-100">Cancelar</button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => startEditValue(v)} className="rounded-lg px-2.5 py-1 text-[11px] font-bold text-gray-400 hover:bg-gray-100 hover:text-[#1E1E1E]">Renombrar</button>
                          <button
                            onClick={() => handleDelete(v)}
                            disabled={v.stockCount > 0}
                            title={v.stockCount > 0 ? `En uso en ${v.stockCount} ítem(s) de stock` : 'Eliminar'}
                            className="rounded-lg px-2.5 py-1 text-[11px] font-bold text-red-400 transition-colors hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-30"
                          >
                            Eliminar
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add value */}
      <div className="flex items-center gap-2">
        <input
          value={newInput}
          onChange={(e) => setNewInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleCreate() } }}
          placeholder="Nuevo valor (ej: Azul)..."
          className="rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#0eb1c3] focus:ring-2 focus:ring-[#0eb1c3]/10"
        />
        <button
          onClick={handleCreate}
          disabled={!newInput.trim()}
          className="rounded-xl px-4 py-2 text-sm font-black uppercase tracking-wider text-white transition-opacity hover:opacity-90 disabled:opacity-40"
          style={{ backgroundColor: '#0eb1c3' }}
        >
          + Agregar
        </button>
      </div>

      {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
    </div>
  )
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function ToggleButton({
  active,
  activeClass,
  onClick,
  children,
}: {
  active: boolean
  activeClass: string
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase transition-colors ${active ? activeClass : 'bg-gray-100 text-gray-400'}`}
    >
      {children}
    </button>
  )
}

function PosInput({ value, onSave }: { value: number; onSave: (v: number) => void }) {
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

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      className={`transition-transform duration-150 ${open ? 'rotate-180' : ''}`}
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  )
}
