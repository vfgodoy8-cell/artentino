import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      where: { archivedAt: null },
      include: { category: true, comboPrices: { orderBy: { quantity: 'asc' } } },
      orderBy: { createdAt: 'desc' },
    })
    return Response.json(products)
  } catch {
    return Response.json({ error: 'Error al obtener productos' }, { status: 500 })
  }
}
