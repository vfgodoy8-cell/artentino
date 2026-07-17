'use client'

import { useState, useTransition, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  DndContext, PointerSensor, TouchSensor, useSensor, useSensors, closestCenter,
  type DragEndEvent,
} from '@dnd-kit/core'
import { SortableContext, useSortable, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import {
  createCategory, updateCategory, deleteCategory, reorderCategories,
  createSubcategory, updateSubcategory, deleteSubcategory, reorderSubcategories,
} from './actions'

type Subcat = { id: string; name: string; slug: string; order: number; categoryId: string }
type Cat = { id: string; name: string; slug: string; order: number; isSpecial: boolean; subcategories: Subcat[] }

function toSlug(s: string) {
  return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-')
}

function GripIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
      <circle cx="8" cy="6" r="1.6" /><circle cx="16" cy="6" r="1.6" />
      <circle cx="8" cy="12" r="1.6" /><circle cx="16" cy="12" r="1.6" />
      <circle cx="8" cy="18" r="1.6" /><circle cx="16" cy="18" r="1.6" />
    </svg>
  )
}

// ─── Toasts ───────────────────────────────────────────────────────────────────

type Toast = { id: number; message: string; variant: 'success' | 'error' }
type PushToast = (message: string, variant: 'success' | 'error') => void

function ToastContainer({ toasts, onDismiss }: { toasts: Toast[]; onDismiss: (id: number) => void }) {
  return (
    <div className="pointer-events-none fixed bottom-6 right-6 z-[10000] flex flex-col gap-2">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onDismiss={() => onDismiss(t.id)} />
      ))}
    </div>
  )
}

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: () => void }) {
  return (
    <div
      role="status"
      className="animate-toast-corner-in pointer-events-auto flex max-w-sm items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-white shadow-lg"
      style={{ backgroundColor: toast.variant === 'success' ? '#1E1E1E' : '#ef4444' }}
      onClick={onDismiss}
    >
      {toast.message}
    </div>
  )
}

// Sin w-full a propósito: combinado con flex-1 (usado en los campos "Nombre")
// el ancho colapsa a ~18px (solo padding/border) — flex-1 ya se basta solo.
const inp = 'min-w-0 rounded border border-[#e5e7eb] px-2 py-1 text-xs focus:border-[#0eb1c3] focus:outline-none'

// Evita que gestores de contraseñas (1Password, LastPass, Bitwarden) o el
// autofill del navegador intercepten estos inputs de texto libre.
const noAutofill = {
  autoComplete: 'off',
  'data-1p-ignore': 'true',
  'data-lpignore': 'true',
  'data-bwignore': 'true',
  'data-form-type': 'other',
} as const

let toastIdCounter = 0

export default function CategoriasTable({ initial }: { initial: Cat[] }) {
  const [cats, setCats] = useState(initial)
  const [prevInitial, setPrevInitial] = useState(initial)
  if (initial !== prevInitial) {
    setPrevInitial(initial)
    setCats(initial)
  }

  const [toasts, setToasts] = useState<Toast[]>([])
  const pushToast: PushToast = (message, variant) => {
    const id = ++toastIdCounter
    setToasts((prev) => [...prev, { id, message, variant }])
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3000)
  }
  function dismissToast(id: number) {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  const router = useRouter()
  const [, startT] = useTransition()

  function refresh() {
    startT(() => { router.refresh() })
  }

  // "Todos" (isSpecial) queda siempre al final y no participa del drag-and-drop.
  const draggableCats = cats.filter((c) => !c.isSpecial)
  const specialCats = cats.filter((c) => c.isSpecial)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } }),
  )

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = draggableCats.findIndex((c) => c.id === active.id)
    const newIndex = draggableCats.findIndex((c) => c.id === over.id)
    const reordered = arrayMove(draggableCats, oldIndex, newIndex)
    setCats([...reordered, ...specialCats])
    startT(async () => {
      await reorderCategories(reordered.map((c) => c.id))
      refresh()
    })
  }

  return (
    <div className="space-y-4">
      <DndContext id="categorias-dnd" sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={draggableCats.map((c) => c.id)} strategy={verticalListSortingStrategy}>
          {draggableCats.map((cat) => (
            <CategoryRow key={cat.id} cat={cat} onRefresh={refresh} draggable pushToast={pushToast} />
          ))}
        </SortableContext>
      </DndContext>

      {specialCats.map((cat) => (
        <CategoryRow key={cat.id} cat={cat} onRefresh={refresh} draggable={false} pushToast={pushToast} />
      ))}

      <AddCategoryRow onRefresh={refresh} pushToast={pushToast} />

      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  )
}

// ─── Fila de categoría padre ─────────────────────────────────────────────────

function CategoryRow({
  cat,
  onRefresh,
  draggable,
  pushToast,
}: {
  cat: Cat
  onRefresh: () => void
  draggable: boolean
  pushToast: PushToast
}) {
  const [open, setOpen] = useState(true)
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ name: cat.name, slug: cat.slug, order: cat.order })
  const [addingSubcat, setAddingSubcat] = useState(false)
  const [isPending, startT] = useTransition()
  const scrollRef = useRef<HTMLDivElement>(null)

  const [subcats, setSubcats] = useState(cat.subcategories)
  const [prevSubcategories, setPrevSubcategories] = useState(cat.subcategories)
  if (cat.subcategories !== prevSubcategories) {
    setPrevSubcategories(cat.subcategories)
    setSubcats(cat.subcategories)
  }

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: cat.id,
    disabled: !draggable,
  })
  const setRefs = (el: HTMLDivElement | null) => { setNodeRef(el); scrollRef.current = el }

  const subSensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } }),
  )

  function handleSubDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = subcats.findIndex((s) => s.id === active.id)
    const newIndex = subcats.findIndex((s) => s.id === over.id)
    const reordered = arrayMove(subcats, oldIndex, newIndex)
    setSubcats(reordered)
    startT(async () => {
      await reorderSubcategories(cat.id, reordered.map((s) => s.id))
      onRefresh()
    })
  }

  useEffect(() => {
    if (editing) scrollRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [editing])

  function save() {
    startT(async () => {
      const result = await updateCategory(cat.id, form)
      if (!result.success) { pushToast(result.error, 'error'); return }
      setEditing(false)
      onRefresh()
      pushToast('Cambios guardados', 'success')
    })
  }

  function remove() {
    if (!confirm(`¿Eliminar el grupo "${cat.name}"? Solo es posible si no tiene subcategorías.`)) return
    startT(async () => {
      const result = await deleteCategory(cat.id)
      if (!result.success) { pushToast(result.error, 'error'); return }
      onRefresh()
      pushToast('Categoría eliminada', 'success')
    })
  }

  return (
    <div
      ref={setRefs}
      style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 }}
      className="overflow-hidden rounded-2xl border border-[#e5e7eb] bg-white"
    >
      {/* Cabecera del grupo */}
      <div className="flex items-center gap-3 border-b border-[#f3f4f6] bg-[#f9fafb] px-5 py-3">
        {draggable && (
          <button
            {...attributes}
            {...listeners}
            className="flex h-6 w-6 shrink-0 cursor-grab items-center justify-center rounded text-[#9ca3af] transition-colors hover:text-[#1E1E1E] active:cursor-grabbing"
            aria-label="Arrastrar para reordenar"
          >
            <GripIcon />
          </button>
        )}
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
            <input {...noAutofill} value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className={`${inp} flex-1`} placeholder="Nombre" />
            <input {...noAutofill} value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))} className={`${inp} w-40 font-mono`} placeholder="slug" />
            <input type="number" value={form.order} onChange={(e) => setForm((f) => ({ ...f, order: Number(e.target.value) }))} className="w-14 rounded border border-[#e5e7eb] px-2 py-1 text-center text-xs focus:border-[#0eb1c3] focus:outline-none" />
            <button onClick={save} disabled={isPending} className="rounded-lg bg-[#0eb1c3] px-3 py-1 text-xs font-bold text-white disabled:opacity-50">
              {isPending ? 'Guardando...' : 'Guardar'}
            </button>
            <button onClick={() => setEditing(false)} disabled={isPending} className="rounded-lg px-3 py-1 text-xs font-bold text-[#6b7280] hover:bg-[#f3f4f6] disabled:opacity-50">Cancelar</button>
          </div>
        ) : (
          <div className="flex flex-1 items-center gap-3">
            <span className="font-black text-[#1E1E1E]">{cat.name}</span>
            <span className="font-mono text-xs text-[#9ca3af]">{cat.slug}</span>
            {cat.isSpecial && (
              <span className="rounded-full bg-[#0eb1c3]/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#0eb1c3]">Especial</span>
            )}
            <span className="ml-auto text-xs text-[#9ca3af]">{subcats.length} subcategorías</span>
          </div>
        )}

        {!editing && (
          <div className="flex items-center gap-1">
            {!cat.isSpecial && (
              <>
                <button onClick={() => setEditing(true)} disabled={isPending} className="rounded-lg px-2.5 py-1 text-xs font-semibold text-[#6b7280] hover:bg-[#f3f4f6] hover:text-[#1E1E1E] disabled:opacity-50">Editar</button>
                <button onClick={remove} disabled={isPending} className="rounded-lg px-2.5 py-1 text-xs font-semibold text-[#ef4444] hover:bg-red-50 disabled:opacity-50">
                  {isPending ? 'Borrando...' : 'Borrar'}
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Subcategorías */}
      {open && (
        <div>
          {subcats.length === 0 && !addingSubcat && (
            <p className="px-8 py-3 text-xs text-[#9ca3af] italic">Sin subcategorías</p>
          )}

          <DndContext id={`subcats-dnd-${cat.id}`} sensors={subSensors} collisionDetection={closestCenter} onDragEnd={handleSubDragEnd}>
            <SortableContext items={subcats.map((s) => s.id)} strategy={verticalListSortingStrategy}>
              {subcats.map((sub) => (
                <SubcatRow key={sub.id} sub={sub} onRefresh={onRefresh} pushToast={pushToast} />
              ))}
            </SortableContext>
          </DndContext>

          {addingSubcat ? (
            <AddSubcatRow categoryId={cat.id} onRefresh={onRefresh} onCancel={() => setAddingSubcat(false)} pushToast={pushToast} />
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

function SubcatRow({
  sub,
  onRefresh,
  pushToast,
}: {
  sub: Subcat
  onRefresh: () => void
  pushToast: PushToast
}) {
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ name: sub.name, slug: sub.slug, order: sub.order })
  const [isPending, startT] = useTransition()
  const scrollRef = useRef<HTMLDivElement>(null)

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: sub.id })
  const setRefs = (el: HTMLDivElement | null) => { setNodeRef(el); scrollRef.current = el }

  useEffect(() => {
    if (editing) scrollRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [editing])

  function save() {
    startT(async () => {
      const result = await updateSubcategory(sub.id, form)
      if (!result.success) { pushToast(result.error, 'error'); return }
      setEditing(false)
      onRefresh()
      pushToast('Cambios guardados', 'success')
    })
  }

  function remove() {
    if (!confirm(`¿Eliminar "${sub.name}"? Solo si no tiene productos asignados.`)) return
    startT(async () => {
      const result = await deleteSubcategory(sub.id)
      if (!result.success) { pushToast(result.error, 'error'); return }
      onRefresh()
      pushToast('Subcategoría eliminada', 'success')
    })
  }

  return (
    <div
      ref={setRefs}
      style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 }}
      className="flex items-center gap-3 border-t border-[#f3f4f6] px-8 py-2.5 transition-colors hover:bg-[#f9fafb]"
    >
      <button
        {...attributes}
        {...listeners}
        className="flex h-5 w-5 shrink-0 cursor-grab items-center justify-center rounded text-[#9ca3af] transition-colors hover:text-[#1E1E1E] active:cursor-grabbing"
        aria-label="Arrastrar para reordenar"
      >
        <GripIcon />
      </button>
      {editing ? (
        <>
          <input {...noAutofill} value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className={`${inp} flex-1`} />
          <input {...noAutofill} value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))} className={`${inp} w-40 font-mono`} />
          <input type="number" value={form.order} onChange={(e) => setForm((f) => ({ ...f, order: Number(e.target.value) }))} className="w-14 rounded border border-[#e5e7eb] px-2 py-1 text-center text-xs" />
          <button onClick={save} disabled={isPending} className="rounded-lg bg-[#0eb1c3] px-3 py-1 text-xs font-bold text-white disabled:opacity-50">
            {isPending ? 'Guardando...' : 'Guardar'}
          </button>
          <button onClick={() => setEditing(false)} disabled={isPending} className="rounded-lg px-3 py-1 text-xs font-semibold text-[#6b7280] hover:bg-[#f3f4f6] disabled:opacity-50">Cancelar</button>
        </>
      ) : (
        <>
          <span className="flex-1 text-sm font-semibold text-[#1E1E1E]">{sub.name}</span>
          <span className="font-mono text-xs text-[#9ca3af]">{sub.slug}</span>
          <span className="w-8 text-center text-xs text-[#9ca3af]">{sub.order}</span>
          <button onClick={() => setEditing(true)} disabled={isPending} className="rounded-lg px-2.5 py-1 text-xs font-semibold text-[#6b7280] hover:bg-[#f3f4f6] hover:text-[#1E1E1E] disabled:opacity-50">Editar</button>
          <button onClick={remove} disabled={isPending} className="rounded-lg px-2.5 py-1 text-xs font-semibold text-[#ef4444] hover:bg-red-50 disabled:opacity-50">
            {isPending ? 'Borrando...' : 'Borrar'}
          </button>
        </>
      )}
    </div>
  )
}

// ─── Agregar subcategoría inline ──────────────────────────────────────────────

function AddSubcatRow({
  categoryId,
  onRefresh,
  onCancel,
  pushToast,
}: {
  categoryId: string
  onRefresh: () => void
  onCancel: () => void
  pushToast: PushToast
}) {
  const [form, setForm] = useState({ name: '', slug: '', order: 0 })
  const [isPending, startT] = useTransition()
  const rowRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    rowRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [])

  function save() {
    if (!form.name.trim() || !form.slug.trim()) return
    startT(async () => {
      const result = await createSubcategory({ ...form, categoryId })
      if (!result.success) { pushToast(result.error, 'error'); return }
      onRefresh()
      onCancel()
      pushToast('Subcategoría creada', 'success')
    })
  }

  return (
    <div ref={rowRef} className="flex items-center gap-3 border-t border-[#f3f4f6] bg-[#f0fdfc] px-8 py-2.5">
      <input
        {...noAutofill}
        autoFocus
        value={form.name}
        onChange={(e) => { const name = e.target.value; setForm((f) => ({ ...f, name, slug: f.slug || toSlug(name) })) }}
        placeholder="Nombre"
        className={`${inp} flex-1`}
        disabled={isPending}
      />
      <input {...noAutofill} value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))} placeholder="slug" className={`${inp} w-40 font-mono`} disabled={isPending} />
      <input type="number" value={form.order} onChange={(e) => setForm((f) => ({ ...f, order: Number(e.target.value) }))} className="w-14 rounded border border-[#e5e7eb] px-2 py-1 text-center text-xs" disabled={isPending} />
      <button onClick={save} disabled={isPending} className="rounded-lg bg-[#0eb1c3] px-3 py-1 text-xs font-bold text-white disabled:opacity-50">
        {isPending ? 'Guardando...' : 'Guardar'}
      </button>
      <button onClick={onCancel} disabled={isPending} className="rounded-lg px-3 py-1 text-xs font-semibold text-[#6b7280] hover:bg-[#f3f4f6] disabled:opacity-50">Cancelar</button>
    </div>
  )
}

// ─── Agregar categoría padre ──────────────────────────────────────────────────

function AddCategoryRow({ onRefresh, pushToast }: { onRefresh: () => void; pushToast: PushToast }) {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ name: '', slug: '', order: 0 })
  const [isPending, startT] = useTransition()
  const rowRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (open) rowRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [open])

  function save() {
    if (!form.name.trim() || !form.slug.trim()) return
    startT(async () => {
      const result = await createCategory(form)
      if (!result.success) { pushToast(result.error, 'error'); return }
      onRefresh()
      setOpen(false)
      setForm({ name: '', slug: '', order: 0 })
      pushToast('Categoría creada', 'success')
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
    <div ref={rowRef} className="flex items-center gap-3 rounded-2xl border-2 border-[#0eb1c3] bg-[#f0fdfc] px-5 py-3">
      <input
        {...noAutofill}
        autoFocus
        value={form.name}
        onChange={(e) => { const name = e.target.value; setForm((f) => ({ ...f, name, slug: f.slug || toSlug(name) })) }}
        placeholder="Nombre del grupo"
        className={`${inp} flex-1`}
        disabled={isPending}
      />
      <input {...noAutofill} value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))} placeholder="slug" className={`${inp} w-40 font-mono`} disabled={isPending} />
      <input type="number" value={form.order} onChange={(e) => setForm((f) => ({ ...f, order: Number(e.target.value) }))} className="w-14 rounded border border-[#e5e7eb] px-2 py-1 text-center text-xs" disabled={isPending} />
      <button onClick={save} disabled={isPending} className="rounded-lg bg-[#0eb1c3] px-4 py-1.5 text-xs font-bold text-white disabled:opacity-50">
        {isPending ? 'Creando...' : 'Crear grupo'}
      </button>
      <button onClick={() => setOpen(false)} disabled={isPending} className="rounded-lg px-3 py-1.5 text-xs font-semibold text-[#6b7280] hover:bg-white disabled:opacity-50">Cancelar</button>
    </div>
  )
}
