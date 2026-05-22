import { prisma } from '@/lib/prisma'
import CategoriasTable from './categorias-table'

export default async function AdminCategorias() {
  const categories = await prisma.category.findMany({
    orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
    select: {
      id: true,
      name: true,
      slug: true,
      active: true,
      wholesaleActive: true,
      sortOrder: true,
    },
  })

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-[#1E1E1E]">Categorías</h1>
        <p className="mt-1 text-sm text-gray-400">{categories.length} categoría{categories.length !== 1 ? 's' : ''}</p>
      </div>
      <CategoriasTable initial={categories} />
    </div>
  )
}
