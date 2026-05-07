import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' },
    })
    return Response.json(categories)
  } catch {
    return Response.json({ error: 'Error al obtener categorías' }, { status: 500 })
  }
}
