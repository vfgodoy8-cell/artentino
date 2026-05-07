/**
 * Convierte un producto de Prisma (con Decimal y Date) a un objeto plano serializable
 * para pasar como props a Client Components a través del límite RSC.
 */
export function serializeProduct<
  T extends {
    price: { toString(): string }
    comparePrice: { toString(): string } | null
    createdAt: Date
    updatedAt: Date
    category: {
      createdAt: Date
      updatedAt: Date
      [key: string]: unknown
    }
  },
>(p: T) {
  return {
    ...p,
    price: Number(p.price.toString()),
    comparePrice: p.comparePrice ? Number(p.comparePrice.toString()) : null,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
    category: {
      ...p.category,
      createdAt: p.category.createdAt.toISOString(),
      updatedAt: p.category.updatedAt.toISOString(),
    },
  }
}
