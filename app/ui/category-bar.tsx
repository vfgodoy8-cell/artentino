import { prisma } from '@/lib/prisma'
import CategoryBarPills from './category-bar-pills'

export default async function CategoryBar() {
  const dbCategories = await prisma.category.findMany({ orderBy: { name: 'asc' } })
  const categories = [
    { name: 'Todos', slug: null },
    ...dbCategories.map((c) => ({ name: c.name, slug: c.slug })),
  ]

  return (
    <div className="border-b border-gray-100 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <CategoryBarPills categories={categories} />
      </div>
    </div>
  )
}
