'use client'

import { useState, useTransition } from 'react'
import { createCondition, updateCondition, deleteCondition } from './actions'

type Condition = {
  id: string
  name: string
  colorClass: string
}

export default function CondicionTable({ initial }: { initial: Condition[] }) {
  const [conditions, setConditions] = useState(initial)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState({ name: '', colorClass: '' })
  const [isAdding, setIsAdding] = useState(false)
  const [newForm, setNewForm] = useState({ name: '', colorClass: '' })
  const [, startTransition] = useTransition()

  function startEdit(c: Condition) {
    setEditingId(c.id)
    setEditForm({ name: c.name, colorClass: c.colorClass })
  }

  function saveEdit(id: string) {
    if (!editForm.name.trim()) return
    startTransition(async () => {
      await updateCondition(id, editForm)
      setConditions((prev) => prev.map((c) => (c.id === id ? { ...c, ...editForm } : c)))
      setEditingId(null)
    })
  }

  function handleDelete(id: string, name: string) {
    if (!confirm(`¿Eliminar "${name}"?`)) return
    startTransition(async () => {
      await deleteCondition(id)
      setConditions((prev) => prev.filter((c) => c.id !== id))
    })
  }

  function saveNew() {
    if (!newForm.name.trim()) return
    startTransition(async () => {
      await createCondition(newForm)
      setIsAdding(false)
      setNewForm({ name: '', colorClass: '' })
    })
  }

  return (
    <div>
      <div className="mb-4">
        <button
          onClick={() => { setIsAdding(true); setNewForm({ name: '', colorClass: '' }) }}
          className="rounded-xl px-5 py-2.5 text-sm font-black uppercase tracking-wider text-white transition-opacity hover:opacity-90"
          style={{ backgroundColor: '#0eb1c3' }}
        >
          + Nueva condición
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              {['ID', 'Nombre', 'Color Clase', 'Acciones'].map((h) => (
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
            {isAdding && (
              <tr className="bg-[#0eb1c3]/5">
                <td className="px-5 py-3 font-mono text-xs text-gray-300">nuevo</td>
                <td className="px-5 py-3">
                  <input
                    autoFocus
                    value={newForm.name}
                    onChange={(e) => setNewForm((f) => ({ ...f, name: e.target.value }))}
                    placeholder="Ej: Nuevo"
                    className="w-full rounded border border-gray-200 px-2 py-1 text-xs focus:border-[#0eb1c3] focus:outline-none"
                  />
                </td>
                <td className="px-5 py-3">
                  <input
                    value={newForm.colorClass}
                    onChange={(e) => setNewForm((f) => ({ ...f, colorClass: e.target.value }))}
                    placeholder="Ej: bg-green-500 text-white"
                    className="w-full rounded border border-gray-200 px-2 py-1 font-mono text-xs focus:border-[#0eb1c3] focus:outline-none"
                  />
                </td>
                <td className="px-5 py-3">
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

            {conditions.map((c) => {
              const isEditing = editingId === c.id
              return (
                <tr key={c.id} className="transition-colors hover:bg-gray-50">
                  <td className="px-5 py-3 font-mono text-xs text-gray-300">{c.id.slice(0, 6)}</td>
                  <td className="px-5 py-3">
                    {isEditing ? (
                      <input
                        autoFocus
                        value={editForm.name}
                        onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))}
                        className="w-full rounded border border-gray-200 px-2 py-1 text-xs focus:border-[#0eb1c3] focus:outline-none"
                      />
                    ) : (
                      <span className="font-semibold text-[#1E1E1E]">{c.name}</span>
                    )}
                  </td>
                  <td className="px-5 py-3">
                    {isEditing ? (
                      <input
                        value={editForm.colorClass}
                        onChange={(e) => setEditForm((f) => ({ ...f, colorClass: e.target.value }))}
                        className="w-full rounded border border-gray-200 px-2 py-1 font-mono text-xs focus:border-[#0eb1c3] focus:outline-none"
                      />
                    ) : (
                      <span className="font-mono text-xs text-gray-500">{c.colorClass || <span className="text-gray-300">—</span>}</span>
                    )}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-1">
                      {isEditing ? (
                        <>
                          <button
                            onClick={() => saveEdit(c.id)}
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
                        <>
                          <button
                            onClick={() => startEdit(c)}
                            className="rounded-lg px-3 py-1.5 text-xs font-bold text-gray-500 transition-colors hover:bg-gray-100 hover:text-[#1E1E1E]"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleDelete(c.id, c.name)}
                            className="rounded-lg px-3 py-1.5 text-xs font-bold text-red-400 transition-colors hover:bg-red-50 hover:text-red-600"
                          >
                            Eliminar
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              )
            })}

            {conditions.length === 0 && !isAdding && (
              <tr>
                <td colSpan={4} className="py-16 text-center text-sm text-gray-400">
                  No hay condiciones todavía.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
