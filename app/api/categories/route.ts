import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      where: { isSpecial: false },
      orderBy: { order: 'asc' },
      include: { subcategories: { orderBy: { order: 'asc' } } },
    })
    return Response.json(categories)
  } catch {
    return Response.json({ error: 'Error al obtener categorías' }, { status: 500 })
  }
}
