'use client'

import { useState, useTransition } from 'react'
import { createCategory, updateCategory, deleteCategories } from './actions'

type Category = { id: string; name: string; slug: string; active: boolean; sortOrder: number }
type EditForm = { name: string; slug: string; active: boolean; sortOrder: number }

function toSlug(s: string) {
  return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-')
}

const EMPTY: EditForm = { name: '', slug: '', active: true, sortOrder: 0 }

export default function CategoriasTable({ initial }: { initial: Category[] }) {
  const [categories, setCategories] = useState(initial)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<EditForm>(EMPTY)
  const [isAdding, setIsAdding] = useState(false)
  const [newForm, setNewForm] = useState<EditForm>(EMPTY)
  const [, startTransition] = useTransition()

  function toggleSelect(id: string) {
    setSelected((prev) => { const next = new Set(prev); next.has(id) ? next.delete(id) : next.add(id); return next })
  }
  function toggleSelectAll() {
    setSelected(selected.size === categories.length ? new Set() : new Set(categories.map((c) => c.id)))
  }
  function startEdit(cat: Category) {
    setEditingId(cat.id)
    setEditForm({ name: cat.name, slug: cat.slug, active: cat.active, sortOrder: cat.sortOrder })
  }
  function saveEdit(id: string) {
    startTransition(async () => {
      await updateCategory(id, editForm)
      setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, ...editForm } : c)))
      setEditingId(null)
    })
  }
  function handleDeleteSelected() {
    if (selected.size === 0) return
    if (!confirm(`¿Eliminar ${selected.size} categoría(s)?`)) return
    const ids = Array.from(selected)
    startTransition(async () => {
      await deleteCategories(ids)
      setCategories((prev) => prev.filter((c) => !ids.includes(c.id)))
      setSelected(new Set())
    })
  }
  function saveNew() {
    if (!newForm.name.trim() || !newForm.slug.trim()) return
    startTransition(async () => {
      await createCategory(newForm)
      setIsAdding(false)
      setNewForm(EMPTY)
    })
  }
  function updateSortOrder(id: string, sortOrder: number) {
    startTransition(async () => {
      await updateCategory(id, { sortOrder })
      setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, sortOrder } : c)))
    })
  }
  function toggleActive(id: string, active: boolean) {
    startTransition(async () => {
      await updateCategory(id, { active })
      setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, active } : c)))
    })
  }

  const allSelected = categories.length > 0 && selected.size === categories.length

  const inp = 'w-full rounded border border-gray-200 px-2 py-1 text-xs focus:border-[#0eb1c3] focus:outline-none'

  return (
    <div>
      <div className="mb-4 flex items-center gap-3">
        <button onClick={() => { setIsAdding(true); setNewForm(EMPTY) }} className="rounded-xl px-5 py-2.5 text-sm font-black uppercase tracking-wider text-white transition-opacity hover:opacity-90" style={{ backgroundColor: '#0eb1c3' }}>
          + Nueva
        </button>
        {selected.size > 0 && (
          <button onClick={handleDeleteSelected} className="rounded-xl border border-red-200 px-5 py-2.5 text-sm font-black uppercase tracking-wider text-red-500 transition-colors hover:bg-red-50">
            Borrar selección ({selected.size})
          </button>
        )}
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="px-4 py-3.5">
                  <input type="checkbox" checked={allSelected} onChange={toggleSelectAll} className="rounded" />
                </th>
                {['ID', 'Nombre', 'Slug', 'Orden', 'Estado', 'Acciones'].map((h) => (
                  <th key={h} className={`px-4 py-3.5 text-xs font-black uppercase tracking-wider text-gray-400 ${h === 'Acciones' ? 'text-right' : 'text-left'}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isAdding && (
                <tr className="bg-[#0eb1c3]/5">
                  <td className="px-4 py-3" />
                  <td className="px-4 py-3 text-xs text-gray-300">nuevo</td>
                  <td className="px-4 py-3">
                    <input autoFocus value={newForm.name} onChange={(e) => { const name = e.target.value; setNewForm((f) => ({ ...f, name, slug: toSlug(name) })) }} placeholder="Nombre" className={inp} />
                  </td>
                  <td className="px-4 py-3">
                    <input value={newForm.slug} onChange={(e) => setNewForm((f) => ({ ...f, slug: e.target.value }))} placeholder="slug" className={`${inp} font-mono`} />
                  </td>
                  <td className="px-4 py-3">
                    <input type="number" value={newForm.sortOrder} onChange={(e) => setNewForm((f) => ({ ...f, sortOrder: Number(e.target.value) }))} className="w-16 rounded border border-gray-200 px-2 py-1 text-center text-xs focus:border-[#0eb1c3] focus:outline-none" />
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => setNewForm((f) => ({ ...f, active: !f.active }))} className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${newForm.active ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                      {newForm.active ? 'Activo' : 'Inactivo'}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={saveNew} className="rounded-lg px-3 py-1.5 text-xs font-bold text-white" style={{ backgroundColor: '#0eb1c3' }}>Guardar</button>
                      <button onClick={() => setIsAdding(false)} className="rounded-lg px-3 py-1.5 text-xs font-bold text-gray-500 hover:bg-gray-100">Cancelar</button>
                    </div>
                  </td>
                </tr>
              )}

              {categories.map((cat) => {
                const isEditing = editingId === cat.id
                return (
                  <tr key={cat.id} className="transition-colors hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <input type="checkbox" checked={selected.has(cat.id)} onChange={() => toggleSelect(cat.id)} className="rounded" />
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-gray-300">{cat.id.slice(0, 6)}</td>
                    <td className="px-4 py-3">
                      {isEditing ? <input value={editForm.name} onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))} className={inp} /> : <span className="font-semibold text-[#1E1E1E]">{cat.name}</span>}
                    </td>
                    <td className="px-4 py-3">
                      {isEditing ? <input value={editForm.slug} onChange={(e) => setEditForm((f) => ({ ...f, slug: e.target.value }))} className={`${inp} font-mono`} /> : <span className="font-mono text-xs text-gray-500">{cat.slug}</span>}
                    </td>
                    <td className="px-4 py-3">
                      {isEditing ? (
                        <input type="number" value={editForm.sortOrder} onChange={(e) => setEditForm((f) => ({ ...f, sortOrder: Number(e.target.value) }))} className="w-16 rounded border border-gray-200 px-2 py-1 text-center text-xs focus:border-[#0eb1c3] focus:outline-none" />
                      ) : (
                        <SortInput value={cat.sortOrder} onSave={(v) => updateSortOrder(cat.id, v)} />
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {isEditing ? (
                        <button onClick={() => setEditForm((f) => ({ ...f, active: !f.active }))} className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${editForm.active ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                          {editForm.active ? 'Activo' : 'Inactivo'}
                        </button>
                      ) : (
                        <button onClick={() => toggleActive(cat.id, !cat.active)} className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase transition-colors ${cat.active ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                          {cat.active ? 'Activo' : 'Inactivo'}
                        </button>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        {isEditing ? (
                          <>
                            <button onClick={() => saveEdit(cat.id)} className="rounded-lg px-3 py-1.5 text-xs font-bold text-white" style={{ backgroundColor: '#0eb1c3' }}>Guardar</button>
                            <button onClick={() => setEditingId(null)} className="rounded-lg px-3 py-1.5 text-xs font-bold text-gray-500 hover:bg-gray-100">Cancelar</button>
                          </>
                        ) : (
                          <button onClick={() => startEdit(cat)} className="rounded-lg px-3 py-1.5 text-xs font-bold text-gray-500 transition-colors hover:bg-gray-100 hover:text-[#1E1E1E]">Editar</button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
              {categories.length === 0 && !isAdding && (
                <tr><td colSpan={7} className="py-16 text-center text-sm text-gray-400">No hay categorías todavía.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function SortInput({ value, onSave }: { value: number; onSave: (v: number) => void }) {
  const [v, setV] = useState(value)
  return (
    <input type="number" value={v} onChange={(e) => setV(Number(e.target.value))} onBlur={() => { if (v !== value) onSave(v) }} className="w-16 rounded border border-gray-200 px-2 py-1 text-center text-xs focus:border-[#0eb1c3] focus:outline-none" />
  )
}
