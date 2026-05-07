import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, slug, description, price, comparePrice, stock, categoryId, featured } = body

    if (!name || !slug || price === undefined || !categoryId) {
      return Response.json({ error: 'Faltan campos requeridos: name, slug, price, categoryId' }, { status: 400 })
    }

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description: description ?? null,
        price,
        comparePrice: comparePrice ?? null,
        stock: stock ?? 0,
        categoryId,
        featured: featured ?? false,
      },
      include: { category: true },
    })

    return Response.json(product, { status: 201 })
  } catch (err: unknown) {
    if (
      err &&
      typeof err === 'object' &&
      'code' in err &&
      (err as { code: string }).code === 'P2002'
    ) {
      return Response.json({ error: 'Ya existe un producto con ese slug' }, { status: 409 })
    }
    return Response.json({ error: 'Error al crear el producto' }, { status: 500 })
  }
}
