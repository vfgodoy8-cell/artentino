import { prisma } from '@/lib/prisma'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params
    const product = await prisma.product.findUnique({
      where: { slug },
      include: { category: true, comboPrices: { orderBy: { quantity: 'asc' } } },
    })
    if (!product) {
      return Response.json({ error: 'Producto no encontrado' }, { status: 404 })
    }
    return Response.json(product)
  } catch {
    return Response.json({ error: 'Error al obtener el producto' }, { status: 500 })
  }
}
