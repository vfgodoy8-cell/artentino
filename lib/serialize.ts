/**
 * Convierte un producto de Prisma (con Decimal y Date) a un objeto plano serializable
 * para pasar como props a Client Components a través del límite RSC.
 */
export function serializeProduct<
  T extends {
    price: { toString(): string }
    comparePrice: { toString(): string } | null
    cost?: { toString(): string } | null
    wholesalePrice?: { toString(): string } | null
    createdAt: Date
    updatedAt: Date
    category: {
      createdAt: Date
      updatedAt: Date
      [key: string]: unknown
    }
    comboPrices?: Array<{ id: string; quantity: number; price: { toString(): string }; [key: string]: unknown }>
  },
>(p: T) {
  return {
    ...p,
    price: Number(p.price.toString()),
    comparePrice: p.comparePrice ? Number(p.comparePrice.toString()) : null,
    cost: p.cost != null ? Number(p.cost.toString()) : null,
    wholesalePrice: p.wholesalePrice != null ? Number(p.wholesalePrice.toString()) : null,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
    category: {
      ...p.category,
      createdAt: p.category.createdAt.toISOString(),
      updatedAt: p.category.updatedAt.toISOString(),
    },
    ...(p.comboPrices && {
      comboPrices: p.comboPrices.map((c) => ({
        ...c,
        price: Number(c.price.toString()),
      })),
    }),
  }
}
