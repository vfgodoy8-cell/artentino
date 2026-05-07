import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { serializeProduct } from '@/lib/serialize'
import ProductsTable from './products-table'

const PER_PAGE = 10

type Props = {
  searchParams: Promise<{ page?: string }>
}

export default async function AdminProductos({ searchParams }: Props) {
  const { page: pageParam } = await searchParams
  const page = Math.max(1, Number(pageParam) || 1)
  const skip = (page - 1) * PER_PAGE

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      include: { category: true },
      orderBy: { createdAt: 'desc' },
      skip,
      take: PER_PAGE,
    }),
    prisma.product.count(),
  ])

  const totalPages = Math.ceil(total / PER_PAGE)
  const serializedProducts = products.map(serializeProduct)

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-[#1E1E1E]">Productos</h1>
          <p className="mt-1 text-sm text-gray-400">{total} producto{total !== 1 ? 's' : ''} en total</p>
        </div>
        <Link
          href="/admin/productos/nuevo"
          className="rounded-xl px-5 py-2.5 text-sm font-black uppercase tracking-wider text-white transition-opacity hover:opacity-90"
          style={{ backgroundColor: '#0eb1c3' }}
        >
          + Nuevo producto
        </Link>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white">
        <ProductsTable products={serializedProducts} />
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-3">
          {page > 1 && (
            <Link
              href={`/admin/productos?page=${page - 1}`}
              className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-bold text-[#1E1E1E] transition-colors hover:border-[#0eb1c3] hover:text-[#0eb1c3]"
            >
              ← Anterior
            </Link>
          )}
          <span className="text-sm text-gray-400">
            Página {page} de {totalPages}
          </span>
          {page < totalPages && (
            <Link
              href={`/admin/productos?page=${page + 1}`}
              className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-bold text-[#1E1E1E] transition-colors hover:border-[#0eb1c3] hover:text-[#0eb1c3]"
            >
              Siguiente →
            </Link>
          )}
        </div>
      )}
    </div>
  )
}
