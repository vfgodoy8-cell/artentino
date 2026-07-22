import { prisma } from '@/lib/prisma'

function normalize(s: string) {
  return s.trim().toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
}

export async function isExpressLocality(locality: string): Promise<boolean> {
  const zone = await prisma.shippingZone.findUnique({ where: { type: 'EXPRESS' } })
  if (!zone) return false
  const target = normalize(locality)
  return zone.localities.some((l) => normalize(l) === target)
}
