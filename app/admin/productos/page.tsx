import Link from 'next/link'
import { Suspense } from 'react'
import { prisma } from '@/lib/prisma'
import { serializeProduct } from '@/lib/serialize'
import ProductsTable from './products-table'
import SearchInput from './search-input'

const PER_PAGE = 10

type Props = {
  searchParams: Promise<{ page?: string; estado?: string; q?: string }>
}

export default async function AdminProductos({ searchParams }: Props) {
  const { page: pageParam, estado, q } = await searchParams
  const page = Math.max(1, Number(pageParam) || 1)
  const skip = (page - 1) * PER_PAGE
  const search = q?.trim() ?? ''

  const estadoFilter =
    estado === 'activos' ? { active: true }
    : estado === 'inactivos' ? { active: false }
    : {}

  const searchFilter = search
    ? {
        OR: [
          { name: { contains: search, mode: 'insensitive' as const } },
          { sku: { contains: search, mode: 'insensitive' as const } },
        ],
      }
    : {}

  const where = { ...estadoFilter, ...searchFilter }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { category: true },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
      skip,
      take: PER_PAGE,
    }),
    prisma.product.count({ where }),
  ])

  const totalPages = Math.ceil(total / PER_PAGE)
  const serializedProducts = products.map(serializeProduct)

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-[#1E1E1E]">Productos</h1>
          <p className="mt-1 text-sm text-gray-400">{total} producto{total !== 1 ? 's' : ''}</p>
        </div>
        <Link
          href="/admin/productos/nuevo"
          className="rounded-xl px-5 py-2.5 text-sm font-black uppercase tracking-wider text-white transition-opacity hover:opacity-90"
          style={{ backgroundColor: '#0eb1c3' }}
        >
          + Nuevo producto
        </Link>
      </div>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex gap-2">
          {([
            { label: 'Todos', value: '' },
            { label: 'Activos', value: 'activos' },
            { label: 'Inactivos', value: 'inactivos' },
          ] as const).map(({ label, value }) => {
            const isActive = (estado ?? '') === value
            const href = new URLSearchParams({
              ...(value ? { estado: value } : {}),
              ...(search ? { q: search } : {}),
            }).toString()
            return (
              <Link
                key={value}
                href={`/admin/productos${href ? `?${href}` : ''}`}
                className={`rounded-lg px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${
                  isActive
                    ? 'bg-[#0eb1c3] text-white'
                    : 'border border-gray-200 bg-white text-gray-500 hover:border-[#0eb1c3] hover:text-[#0eb1c3]'
                }`}
              >
                {label}
              </Link>
            )
          })}
        </div>

        <div className="sm:ml-auto sm:w-72">
          <Suspense>
            <SearchInput />
          </Suspense>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white">
        <ProductsTable products={serializedProducts} searchTerm={search} />
      </div>

      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-3">
          {page > 1 && (
            <Link
              href={`/admin/productos?page=${page - 1}${estado ? `&estado=${estado}` : ''}${search ? `&q=${encodeURIComponent(search)}` : ''}`}
              className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-bold text-[#1E1E1E] transition-colors hover:border-[#0eb1c3] hover:text-[#0eb1c3]"
            >
              ← Anterior
            </Link>
          )}
          <span className="text-sm text-gray-400">Página {page} de {totalPages}</span>
          {page < totalPages && (
            <Link
              href={`/admin/productos?page=${page + 1}${estado ? `&estado=${estado}` : ''}${search ? `&q=${encodeURIComponent(search)}` : ''}`}
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
