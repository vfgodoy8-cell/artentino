import { prisma } from '@/lib/prisma'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params
    const category = await prisma.subcategory.findUnique({
      where: { slug },
      include: {
        products: {
          orderBy: { createdAt: 'desc' },
        },
      },
    })
    if (!category) {
      return Response.json({ error: 'Categoría no encontrada' }, { status: 404 })
    }
    return Response.json(category)
  } catch {
    return Response.json({ error: 'Error al obtener la categoría' }, { status: 500 })
  }
}
