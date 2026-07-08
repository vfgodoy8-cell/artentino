'use server'

import { prisma } from '@/lib/prisma'

export async function getFirstRelatedProduct(productId: string) {
  const relation = await prisma.productRelation.findFirst({
    where: { productId },
    orderBy: { sortOrder: 'asc' },
    select: {
      relatedProduct: {
        select: { id: true, name: true, imageUrl: true, price: true, slug: true },
      },
    },
  })
  if (!relation) return null
  return {
    id: relation.relatedProduct.id,
    name: relation.relatedProduct.name,
    imageUrl: relation.relatedProduct.imageUrl,
    price: Number(relation.relatedProduct.price),
    slug: relation.relatedProduct.slug,
  }
}
