import { prisma } from '@/lib/prisma'
import CategoriasTable from './categorias-table'

export default async function AdminCategorias() {
  const categories = await prisma.category.findMany({
    // isSpecial asc primero: garantiza que "Todos" quede siempre al final,
    // sin depender de que su campo order numérico sea mayor que el resto.
    orderBy: [{ isSpecial: 'asc' }, { order: 'asc' }],
    select: {
      id: true,
      name: true,
      slug: true,
      order: true,
      isSpecial: true,
      subcategories: {
        orderBy: { order: 'asc' },
        select: { id: true, name: true, slug: true, order: true, categoryId: true },
      },
    },
  })

  const total = categories.reduce((acc, c) => acc + c.subcategories.length, 0)

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-[#1E1E1E]">Categorías</h1>
        <p className="mt-1 text-sm text-[#9ca3af]">
          {categories.length} grupos · {total} subcategoría{total !== 1 ? 's' : ''}
        </p>
      </div>
      <CategoriasTable initial={categories} />
    </div>
  )
}
