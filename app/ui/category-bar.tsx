import { Suspense } from 'react'
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
        <Suspense fallback={<div className="py-3 h-[46px]" />}>
          <CategoryBarPills categories={categories} />
        </Suspense>
      </div>
    </div>
  )
}
