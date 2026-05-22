import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q') ?? ''
  if (q.length < 2) return NextResponse.json([])

  const products = await prisma.product.findMany({
    where: {
      name: { contains: q, mode: 'insensitive' },
      featured: false,
    },
    select: { id: true, name: true, price: true, imageUrl: true },
    take: 10,
    orderBy: { name: 'asc' },
  })

  const result = products.map((p) => ({
    ...p,
    price: Number(p.price.toString()),
  }))

  return NextResponse.json(result)
}
