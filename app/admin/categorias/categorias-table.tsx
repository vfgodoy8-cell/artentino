'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import {
  createCategory, updateCategory, deleteCategory,
  createSubcategory, updateSubcategory, deleteSubcategory,
} from './actions'

type Subcat = { id: string; name: string; slug: string; order: number; categoryId: string }
type Cat = { id: string; name: string; slug: string; order: number; isSpecial: boolean; subcategories: Subcat[] }

function toSlug(s: string) {
  return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-')
}

const inp = 'w-full rounded border border-[#e5e7eb] px-2 py-1 text-xs focus:border-[#0eb1c3] focus:outline-none'

export default function CategoriasTable({ initial }: { initial: Cat[] }) {
  const [cats, setCats] = useState(initial)
  const router = useRouter()
  const [, startT] = useTransition()

  function refresh() {
    startT(() => { router.refresh() })
  }

  return (
    <div className="space-y-4">
      {cats.map((cat) => (
        <CategoryRow key={cat.id} cat={cat} onRefresh={refresh} />
      ))}

      <AddCategoryRow onRefresh={refresh} />
    </div>
  )
}

// ─── Fila de categoría padre ─────────────────────────────────────────────────

function CategoryRow({ cat, onRefresh }: { cat: Cat; onRefresh: () => void }) {
  const [open, setOpen] = useState(true)
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ name: cat.name, slug: cat.slug, order: cat.order })
  const [addingSubcat, setAddingSubcat] = useState(false)
  const [, startT] = useTransition()

  function save() {
    startT(async () => {
      await updateCategory(cat.id, form)
      setEditing(false)
      onRefresh()
    })
  }

  function remove() {
    if (!confirm(`¿Eliminar el grupo "${cat.name}"? Solo es posible si no tiene subcategorías.`)) return
    startT(async () => {
      await deleteCategory(cat.id)
      onRefresh()
    })
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-[#e5e7eb] bg-white">
      {/* Cabecera del grupo */}
      <div className="flex items-center gap-3 border-b border-[#f3f4f6] bg-[#f9fafb] px-5 py-3">
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex h-6 w-6 shrink-0 items-center justify-center rounded text-[#9ca3af] transition-colors hover:text-[#1E1E1E]"
          aria-label={open ? 'Colapsar' : 'Expandir'}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className={`transition-transform ${open ? 'rotate-90' : ''}`}>
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>

        {editing ? (
          <div className="flex flex-1 items-center gap-2">
            <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className={`${inp} flex-1`} placeholder="Nombre" />
            <input value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))} className={`${inp} w-40 font-mono`} placeholder="slug" />
            <input type="number" value={form.order} onChange={(e) => setForm((f) => ({ ...f, order: Number(e.target.value) }))} className="w-14 rounded border border-[#e5e7eb] px-2 py-1 text-center text-xs focus:border-[#0eb1c3] focus:outline-none" />
            <button onClick={save} className="rounded-lg bg-[#0eb1c3] px-3 py-1 text-xs font-bold text-white">Guardar</button>
            <button onClick={() => setEditing(false)} className="rounded-lg px-3 py-1 text-xs font-bold text-[#6b7280] hover:bg-[#f3f4f6]">Cancelar</button>
          </div>
        ) : (
          <div className="flex flex-1 items-center gap-3">
            <span className="font-black text-[#1E1E1E]">{cat.name}</span>
            <span className="font-mono text-xs text-[#9ca3af]">{cat.slug}</span>
            {cat.isSpecial && (
              <span className="rounded-full bg-[#0eb1c3]/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#0eb1c3]">Especial</span>
            )}
            <span className="ml-auto text-xs text-[#9ca3af]">{cat.subcategories.length} subcategorías</span>
          </div>
        )}

        {!editing && (
          <div className="flex items-center gap-1">
            {!cat.isSpecial && (
              <>
                <button onClick={() => setEditing(true)} className="rounded-lg px-2.5 py-1 text-xs font-semibold text-[#6b7280] hover:bg-[#f3f4f6] hover:text-[#1E1E1E]">Editar</button>
                <button onClick={remove} className="rounded-lg px-2.5 py-1 text-xs font-semibold text-[#ef4444] hover:bg-red-50">Borrar</button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Subcategorías */}
      {open && (
        <div>
          {cat.subcategories.length === 0 && !addingSubcat && (
            <p className="px-8 py-3 text-xs text-[#9ca3af] italic">Sin subcategorías</p>
          )}

          {cat.subcategories.map((sub) => (
            <SubcatRow key={sub.id} sub={sub} onRefresh={onRefresh} />
          ))}

          {addingSubcat ? (
            <AddSubcatRow categoryId={cat.id} onRefresh={onRefresh} onCancel={() => setAddingSubcat(false)} />
          ) : !cat.isSpecial && (
            <button
              onClick={() => setAddingSubcat(true)}
              className="flex w-full items-center gap-2 border-t border-[#f3f4f6] px-8 py-2.5 text-xs font-bold text-[#0eb1c3] transition-colors hover:bg-[#f0fdfc]"
            >
              + Agregar subcategoría
            </button>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Fila de subcategoría ─────────────────────────────────────────────────────

function SubcatRow({ sub, onRefresh }: { sub: Subcat; onRefresh: () => void }) {
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ name: sub.name, slug: sub.slug, order: sub.order })
  const [, startT] = useTransition()

  function save() {
    startT(async () => {
      await updateSubcategory(sub.id, form)
      setEditing(false)
      onRefresh()
    })
  }

  function remove() {
    if (!confirm(`¿Eliminar "${sub.name}"? Solo si no tiene productos asignados.`)) return
    startT(async () => {
      await deleteSubcategory(sub.id)
      onRefresh()
    })
  }

  return (
    <div className="flex items-center gap-3 border-t border-[#f3f4f6] px-8 py-2.5 transition-colors hover:bg-[#f9fafb]">
      {editing ? (
        <>
          <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className={`${inp} flex-1`} />
          <input value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))} className={`${inp} w-40 font-mono`} />
          <input type="number" value={form.order} onChange={(e) => setForm((f) => ({ ...f, order: Number(e.target.value) }))} className="w-14 rounded border border-[#e5e7eb] px-2 py-1 text-center text-xs" />
          <button onClick={save} className="rounded-lg bg-[#0eb1c3] px-3 py-1 text-xs font-bold text-white">Guardar</button>
          <button onClick={() => setEditing(false)} className="rounded-lg px-3 py-1 text-xs font-semibold text-[#6b7280] hover:bg-[#f3f4f6]">Cancelar</button>
        </>
      ) : (
        <>
          <span className="flex-1 text-sm font-semibold text-[#1E1E1E]">{sub.name}</span>
          <span className="font-mono text-xs text-[#9ca3af]">{sub.slug}</span>
          <span className="w-8 text-center text-xs text-[#9ca3af]">{sub.order}</span>
          <button onClick={() => setEditing(true)} className="rounded-lg px-2.5 py-1 text-xs font-semibold text-[#6b7280] hover:bg-[#f3f4f6] hover:text-[#1E1E1E]">Editar</button>
          <button onClick={remove} className="rounded-lg px-2.5 py-1 text-xs font-semibold text-[#ef4444] hover:bg-red-50">Borrar</button>
        </>
      )}
    </div>
  )
}

// ─── Agregar subcategoría inline ──────────────────────────────────────────────

function AddSubcatRow({ categoryId, onRefresh, onCancel }: { categoryId: string; onRefresh: () => void; onCancel: () => void }) {
  const [form, setForm] = useState({ name: '', slug: '', order: 0 })
  const [, startT] = useTransition()

  function save() {
    if (!form.name.trim() || !form.slug.trim()) return
    startT(async () => {
      await createSubcategory({ ...form, categoryId })
      onRefresh()
      onCancel()
    })
  }

  return (
    <div className="flex items-center gap-3 border-t border-[#f3f4f6] bg-[#f0fdfc] px-8 py-2.5">
      <input
        autoFocus
        value={form.name}
        onChange={(e) => { const name = e.target.value; setForm((f) => ({ ...f, name, slug: f.slug || toSlug(name) })) }}
        placeholder="Nombre"
        className={`${inp} flex-1`}
      />
      <input value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))} placeholder="slug" className={`${inp} w-40 font-mono`} />
      <input type="number" value={form.order} onChange={(e) => setForm((f) => ({ ...f, order: Number(e.target.value) }))} className="w-14 rounded border border-[#e5e7eb] px-2 py-1 text-center text-xs" />
      <button onClick={save} className="rounded-lg bg-[#0eb1c3] px-3 py-1 text-xs font-bold text-white">Guardar</button>
      <button onClick={onCancel} className="rounded-lg px-3 py-1 text-xs font-semibold text-[#6b7280] hover:bg-[#f3f4f6]">Cancelar</button>
    </div>
  )
}

// ─── Agregar categoría padre ──────────────────────────────────────────────────

function AddCategoryRow({ onRefresh }: { onRefresh: () => void }) {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ name: '', slug: '', order: 0 })
  const [, startT] = useTransition()

  function save() {
    if (!form.name.trim() || !form.slug.trim()) return
    startT(async () => {
      await createCategory(form)
      onRefresh()
      setOpen(false)
      setForm({ name: '', slug: '', order: 0 })
    })
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-[#e5e7eb] py-3 text-sm font-bold text-[#9ca3af] transition-colors hover:border-[#0eb1c3] hover:text-[#0eb1c3]"
      >
        + Nuevo grupo de categorías
      </button>
    )
  }

  return (
    <div className="flex items-center gap-3 rounded-2xl border-2 border-[#0eb1c3] bg-[#f0fdfc] px-5 py-3">
      <input
        autoFocus
        value={form.name}
        onChange={(e) => { const name = e.target.value; setForm((f) => ({ ...f, name, slug: f.slug || toSlug(name) })) }}
        placeholder="Nombre del grupo"
        className={`${inp} flex-1`}
      />
      <input value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))} placeholder="slug" className={`${inp} w-40 font-mono`} />
      <input type="number" value={form.order} onChange={(e) => setForm((f) => ({ ...f, order: Number(e.target.value) }))} className="w-14 rounded border border-[#e5e7eb] px-2 py-1 text-center text-xs" />
      <button onClick={save} className="rounded-lg bg-[#0eb1c3] px-4 py-1.5 text-xs font-bold text-white">Crear grupo</button>
      <button onClick={() => setOpen(false)} className="rounded-lg px-3 py-1.5 text-xs font-semibold text-[#6b7280] hover:bg-white">Cancelar</button>
    </div>
  )
}
