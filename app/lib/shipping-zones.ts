import { prisma } from '@/lib/prisma'

/**
 * Provincia y localidad ahora vienen de selección estructurada (combo/autocomplete),
 * no de texto libre — por eso alcanza con comparar exacto, sin normalizar acentos/casing.
 */
export async function isExpressLocality(province: string, city: string): Promise<boolean> {
  if (province === 'CABA') return true
  if (province !== 'Buenos Aires') return false

  const zone = await prisma.shippingZone.findUnique({ where: { type: 'EXPRESS' } })
  if (!zone) return false
  return zone.localities.includes(city)
}
