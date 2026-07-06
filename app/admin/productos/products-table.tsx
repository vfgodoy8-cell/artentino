'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { deleteProduct, updateProductSortOrder, updateProductActive } from './actions'

type Product = {
  id: string
  sku: string | null
  name: string
  imageUrl: string | null
  price: number
  cost: number | null
  wholesalePrice: number | null
  featured: boolean
  active: boolean
  sortOrder: number
  category: { name: string }
}

function fmt(n: number) {
  return `$${n.toLocaleString('es-AR')}`
}

export default function ProductsTable({ products, searchTerm }: { products: Product[]; searchTerm?: string }) {
  const router = useRouter()

  if (products.length === 0) {
    return (
      <div className="py-16 text-center text-sm text-gray-400">
        {searchTerm
          ? <>No se encontraron productos para <span className="font-bold text-[#1E1E1E]">&ldquo;{searchTerm}&rdquo;</span>.</>
          : 'No hay productos todavía.'}
      </div>
    )
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`¿Eliminar "${name}"? Esta acción no se puede deshacer.`)) return
    await deleteProduct(id)
    router.refresh()
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50">
            {[
              { label: '', align: 'left' },
              { label: 'SKU', align: 'left' },
              { label: 'Nombre', align: 'left' },
              { label: 'Categoría', align: 'left' },
              { label: 'Costo', align: 'left' },
              { label: 'Mayorista', align: 'left' },
              { label: 'Precio', align: 'left' },
              { label: 'Activo', align: 'left' },
              { label: 'Orden', align: 'left' },
              { label: 'Acciones', align: 'right' },
            ].map(({ label, align }) => (
              <th key={label} className={`px-3 py-3.5 text-xs font-black uppercase tracking-wider text-gray-400 text-${align}`}>
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {products.map((product) => (
            <ProductRow key={product.id} product={product} onDelete={handleDelete} />
          ))}
        </tbody>
      </table>
    </div>
  )
}

function ProductRow({
  product,
  onDelete,
}: {
  product: Product
  onDelete: (id: string, name: string) => Promise<void>
}) {
  const [sortOrder, setSortOrder] = useState(product.sortOrder)
  const [active, setActive] = useState(product.active)
  const [, startTransition] = useTransition()

  function handleSortBlur() {
    if (sortOrder === product.sortOrder) return
    startTransition(async () => { await updateProductSortOrder(product.id, sortOrder) })
  }

  function handleToggleActive() {
    const next = !active
    setActive(next)
    startTransition(async () => { await updateProductActive(product.id, next) })
  }

  const sku = product.sku ?? product.id.slice(0, 8).toUpperCase()

  return (
    <tr className="transition-colors hover:bg-gray-50">
      <td className="px-3 py-3">
        {product.imageUrl ? (
          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-gray-100">
            <Image src={product.imageUrl} alt={product.name} fill className="object-cover" sizes="48px" />
          </div>
        ) : (
          <div className="h-12 w-12 shrink-0 rounded-lg bg-gray-100" />
        )}
      </td>
      <td className="px-3 py-3 font-mono text-xs text-gray-400">{sku}</td>
      <td className="px-3 py-3 font-semibold text-[#1E1E1E]">{product.name}</td>
      <td className="px-3 py-3 text-gray-500">{product.category.name}</td>
      <td className="px-3 py-3 text-gray-500">
        {product.cost != null ? fmt(product.cost) : <span className="text-gray-300">—</span>}
      </td>
      <td className="px-3 py-3 text-gray-500">
        {product.wholesalePrice != null ? fmt(product.wholesalePrice) : <span className="text-gray-300">—</span>}
      </td>
      <td className="px-3 py-3 font-bold text-[#1E1E1E]">{fmt(product.price)}</td>
      <td className="px-3 py-3">
        <button
          onClick={handleToggleActive}
          className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase transition-colors ${
            active ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
          }`}
        >
          {active ? 'Activo' : 'Inactivo'}
        </button>
      </td>
      <td className="px-3 py-3">
        <input
          type="number"
          value={sortOrder}
          onChange={(e) => setSortOrder(Number(e.target.value))}
          onBlur={handleSortBlur}
          className="w-16 rounded border border-gray-200 px-2 py-1 text-center text-xs focus:border-[#0eb1c3] focus:outline-none"
        />
      </td>
      <td className="px-3 py-3">
        <div className="flex items-center justify-end gap-1">
          <Link href={`/admin/productos/${product.id}/editar`} className="rounded-lg px-3 py-1.5 text-xs font-bold text-gray-500 transition-colors hover:bg-gray-100 hover:text-[#1E1E1E]">
            Editar
          </Link>
          <button onClick={() => onDelete(product.id, product.name)} className="rounded-lg px-3 py-1.5 text-xs font-bold text-red-400 transition-colors hover:bg-red-50 hover:text-red-600">
            Eliminar
          </button>
        </div>
      </td>
    </tr>
  )
}
