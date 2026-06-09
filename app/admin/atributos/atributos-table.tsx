'use client'

import { useState, useTransition } from 'react'
import { createAttribute, updateAttribute, inactivateAttributes } from './actions'

type Attribute = {
  id: string
  name: string
  filter: boolean
  hidden: boolean
  position: number
  active: boolean
}

const EMPTY: Omit<Attribute, 'id'> = { name: '', filter: false, hidden: false, position: 0, active: true }

export default function AtributosTable({ initial }: { initial: Attribute[] }) {
  const [attrs, setAttrs] = useState(initial)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<Omit<Attribute, 'id'>>(EMPTY)
  const [isAdding, setIsAdding] = useState(false)
  const [newForm, setNewForm] = useState<Omit<Attribute, 'id'>>(EMPTY)
  const [search, setSearch] = useState('')
  const [, startTransition] = useTransition()

  const filtered = attrs.filter((a) =>
    a.name.toLowerCase().includes(search.toLowerCase()),
  )

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
    setEditForm({ name: a.name, filter: a.filter, hidden: a.hidden, position: a.position, active: a.active })
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

  function updatePosition(id: string, position: number) {
    startTransition(async () => {
      await updateAttribute(id, { position })
      setAttrs((prev) => prev.map((a) => (a.id === id ? { ...a, position } : a)))
    })
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
                {['ID', 'Nombre', 'Filtro', 'Oculto', 'Posición', 'Estado', 'Acciones'].map((h) => (
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
                    <button
                      onClick={() => setNewForm((f) => ({ ...f, filter: !f.filter }))}
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${newForm.filter ? 'bg-[#0eb1c3]/10 text-[#0eb1c3]' : 'bg-gray-100 text-gray-400'}`}
                    >
                      {newForm.filter ? 'Sí' : 'No'}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => setNewForm((f) => ({ ...f, hidden: !f.hidden }))}
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${newForm.hidden ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-400'}`}
                    >
                      {newForm.hidden ? 'Sí' : 'No'}
                    </button>
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
                    <button
                      onClick={() => setNewForm((f) => ({ ...f, active: !f.active }))}
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${newForm.active ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}
                    >
                      {newForm.active ? 'Activo' : 'Inactivo'}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={saveNew}
                        className="rounded-lg px-3 py-1.5 text-xs font-bold text-white"
                        style={{ backgroundColor: '#0eb1c3' }}
                      >
                        Guardar
                      </button>
                      <button
                        onClick={() => setIsAdding(false)}
                        className="rounded-lg px-3 py-1.5 text-xs font-bold text-gray-500 hover:bg-gray-100"
                      >
                        Cancelar
                      </button>
                    </div>
                  </td>
                </tr>
              )}

              {filtered.map((a) => {
                const isEditing = editingId === a.id
                return (
                  <tr key={a.id} className={`transition-colors hover:bg-gray-50 ${a.hidden ? 'opacity-60' : ''}`}>
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selected.has(a.id)}
                        onChange={() => toggleSelect(a.id)}
                        className="rounded"
                      />
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
                        <button
                          onClick={() => setEditForm((f) => ({ ...f, filter: !f.filter }))}
                          className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${editForm.filter ? 'bg-[#0eb1c3]/10 text-[#0eb1c3]' : 'bg-gray-100 text-gray-400'}`}
                        >
                          {editForm.filter ? 'Sí' : 'No'}
                        </button>
                      ) : (
                        <button
                          onClick={() => toggleFilter(a.id, !a.filter)}
                          className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase transition-colors ${a.filter ? 'bg-[#0eb1c3]/10 text-[#0eb1c3]' : 'bg-gray-100 text-gray-400'}`}
                        >
                          {a.filter ? 'Sí' : 'No'}
                        </button>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {isEditing ? (
                        <button
                          onClick={() => setEditForm((f) => ({ ...f, hidden: !f.hidden }))}
                          className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${editForm.hidden ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-400'}`}
                        >
                          {editForm.hidden ? 'Sí' : 'No'}
                        </button>
                      ) : (
                        <button
                          onClick={() => toggleHidden(a.id, !a.hidden)}
                          className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase transition-colors ${a.hidden ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-400'}`}
                        >
                          {a.hidden ? 'Sí' : 'No'}
                        </button>
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
                        <button
                          onClick={() => setEditForm((f) => ({ ...f, active: !f.active }))}
                          className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${editForm.active ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}
                        >
                          {editForm.active ? 'Activo' : 'Inactivo'}
                        </button>
                      ) : (
                        <button
                          onClick={() => toggleActive(a.id, !a.active)}
                          className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase transition-colors ${a.active ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}
                        >
                          {a.active ? 'Activo' : 'Inactivo'}
                        </button>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        {isEditing ? (
                          <>
                            <button
                              onClick={() => saveEdit(a.id)}
                              className="rounded-lg px-3 py-1.5 text-xs font-bold text-white"
                              style={{ backgroundColor: '#0eb1c3' }}
                            >
                              Guardar
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="rounded-lg px-3 py-1.5 text-xs font-bold text-gray-500 hover:bg-gray-100"
                            >
                              Cancelar
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => startEdit(a)}
                            className="rounded-lg px-3 py-1.5 text-xs font-bold text-gray-500 transition-colors hover:bg-gray-100 hover:text-[#1E1E1E]"
                          >
                            Editar
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}

              {filtered.length === 0 && !isAdding && (
                <tr>
                  <td colSpan={8} className="py-16 text-center text-sm text-gray-400">
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
