import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import NuevoProductoForm from './form'

export default async function NuevoProductoPage() {
  const categories = await prisma.subcategory.findMany({
    orderBy: [{ category: { order: 'asc' } }, { order: 'asc' }],
    select: { id: true, name: true },
  })

  return (
    <div className="mx-auto max-w-2xl p-8">
      <div className="mb-6">
        <Link
          href="/admin/productos"
          className="mb-4 inline-block text-sm font-semibold text-gray-400 transition-colors hover:text-[#0eb1c3]"
        >
          ← Volver a productos
        </Link>
        <h1 className="text-2xl font-black text-[#1E1E1E]">Nuevo producto</h1>
      </div>

      <NuevoProductoForm categories={categories} />
    </div>
  )
}
