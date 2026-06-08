'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

type Category = { id: string; name: string }

function toSlug(str: string) {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}

const inp =
  'w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-[#1E1E1E] placeholder-gray-300 outline-none transition-colors focus:border-[#0eb1c3] focus:ring-2 focus:ring-[#0eb1c3]/10'

export default function NuevoProductoForm({ categories }: { categories: Category[] }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [slugEdited, setSlugEdited] = useState(false)
  const [form, setForm] = useState({
    name: '',
    slug: '',
    price: '',
    categoryId: categories[0]?.id ?? '',
  })

  function set(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    const name = e.target.value
    setForm((prev) => ({ ...prev, name, slug: slugEdited ? prev.slug : toSlug(name) }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!form.name.trim()) { setError('El nombre es requerido'); return }
    if (!form.slug.trim()) { setError('El slug es requerido'); return }
    if (!form.price || Number(form.price) <= 0) { setError('El precio debe ser mayor a 0'); return }
    if (!form.categoryId) { setError('Seleccioná una categoría'); return }

    setLoading(true)
    try {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          slug: form.slug.trim(),
          price: Number(form.price),
          categoryId: form.categoryId,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Error al crear el producto')
      router.push(`/admin/productos/${data.id}/editar`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border border-gray-100 bg-white p-6">
      {error && <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>}

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-400">Nombre *</label>
          <input type="text" value={form.name} onChange={handleNameChange} className={inp} placeholder="Espejo LED Touch 60cm" />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-400">Slug *</label>
          <input type="text" value={form.slug} onChange={(e) => { setSlugEdited(true); set('slug', e.target.value) }} className={inp} placeholder="espejo-led-touch-60cm" />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-400">Precio * ($)</label>
          <input type="number" value={form.price} onChange={(e) => set('price', e.target.value)} className={inp} placeholder="266000" min="0" />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-400">Categoría *</label>
          <select value={form.categoryId} onChange={(e) => set('categoryId', e.target.value)} className={inp}>
            {categories.map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
          </select>
        </div>
      </div>

      <p className="text-xs text-gray-400">
        Al crear el producto serás redirigido al editor completo para agregar imágenes, stock y más detalles.
      </p>

      <div className="flex gap-3 border-t border-gray-100 pt-5">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 rounded-xl py-3 text-sm font-black uppercase tracking-wider text-white transition-opacity disabled:opacity-50"
          style={{ backgroundColor: '#0eb1c3' }}
        >
          {loading ? 'Creando...' : 'Crear y continuar editando →'}
        </button>
        <Link href="/admin/productos" className="rounded-xl border border-gray-200 px-6 py-3 text-sm font-bold text-gray-500 transition-colors hover:border-[#1E1E1E] hover:text-[#1E1E1E]">
          Cancelar
        </Link>
      </div>
    </form>
  )
}
