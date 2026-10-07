import { prisma } from '@/lib/prisma'
import { getSearchWords, matchesName, matchesSearch } from '@/app/lib/product-search'

const MIN_QUERY_LENGTH = 2
const MAX_ITEMS = 6

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const q = searchParams.get('q') ?? ''
  const trimmed = q.trim()

  if (trimmed.length < MIN_QUERY_LENGTH) {
    return Response.json({ total: 0, items: [] })
  }

  try {
    const products = await prisma.product.findMany({
      where: { active: true },
      select: {
        id: true,
        name: true,
        slug: true,
        sku: true,
        imageUrl: true,
        price: true,
        category: { select: { name: true, category: { select: { name: true } } } },
      },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    })

    const words = getSearchWords(trimmed)
    const matched = products.filter((p) => matchesSearch(p, words))

    // Los que matchean por nombre van primero; el resto (match solo por SKU/categoría) después.
    const nameMatches = matched.filter((p) => matchesName(p, words))
    const otherMatches = matched.filter((p) => !matchesName(p, words))
    const ordered = [...nameMatches, ...otherMatches]

    const items = ordered.slice(0, MAX_ITEMS).map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      imageUrl: p.imageUrl,
      price: Number(p.price),
      subcategoria: p.category.name,
    }))

    return Response.json({ total: ordered.length, items })
  } catch (error) {
    console.error('[api/buscar] error:', error)
    return Response.json({ error: 'No se pudo completar la búsqueda' }, { status: 500 })
  }
}
