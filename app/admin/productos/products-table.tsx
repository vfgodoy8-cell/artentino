'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { deleteProduct } from './actions'

type Product = {
  id: string
  name: string
  price: number
  stock: number
  featured: boolean
  category: { name: string }
}

function fmt(n: number) {
  return `$${n.toLocaleString('es-AR')}`
}

export default function ProductsTable({ products }: { products: Product[] }) {
  const router = useRouter()

  if (products.length === 0) {
    return (
      <div className="py-16 text-center text-sm text-gray-400">
        No hay productos todavía.
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
            {['Nombre', 'Categoría', 'Precio', 'Stock', 'Destacado', 'Acciones'].map((h) => (
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
          {products.map((product) => (
            <tr key={product.id} className="transition-colors hover:bg-gray-50">
              <td className="px-5 py-4 font-semibold text-[#1E1E1E]">{product.name}</td>
              <td className="px-5 py-4 text-gray-500">{product.category.name}</td>
              <td className="px-5 py-4 font-bold text-[#1E1E1E]">{fmt(product.price)}</td>
              <td className="px-5 py-4 text-gray-500">{product.stock}</td>
              <td className="px-5 py-4">
                <span
                  className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${
                    product.featured
                      ? 'bg-[#2BBCB0]/10 text-[#2BBCB0]'
                      : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  {product.featured ? 'Sí' : 'No'}
                </span>
              </td>
              <td className="px-5 py-4">
                <div className="flex items-center justify-end gap-1">
                  <Link
                    href={`/admin/productos/${product.id}/editar`}
                    className="rounded-lg px-3 py-1.5 text-xs font-bold text-gray-500 transition-colors hover:bg-gray-100 hover:text-[#1E1E1E]"
                  >
                    Editar
                  </Link>
                  <button
                    onClick={() => handleDelete(product.id, product.name)}
                    className="rounded-lg px-3 py-1.5 text-xs font-bold text-red-400 transition-colors hover:bg-red-50 hover:text-red-600"
                  >
                    Eliminar
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
