import { prisma } from '@/lib/prisma'

export const CABA_LOCALITY = 'CABA'
export const OTHER_COUNTRY_LOCALITY = 'Resto del país'

/** Localidades de GBA con entrega propia de Artentino — única fuente de verdad, editable en /admin/extension. */
export async function getExpressLocalities(): Promise<string[]> {
  const zone = await prisma.shippingZone.findUnique({ where: { type: 'EXPRESS' } })
  return zone?.localities ?? []
}

/** CABA o alguna de las localidades de GBA de la lista Express. */
export async function isExpressLocality(locality: string): Promise<boolean> {
  if (locality === CABA_LOCALITY) return true
  const localities = await getExpressLocalities()
  return localities.includes(locality)
}

/** Provincia que corresponde a cada opción del dropdown cerrado del checkout. */
export function resolveProvinceForLocality(locality: string): string {
  if (locality === CABA_LOCALITY) return 'CABA'
  if (locality === OTHER_COUNTRY_LOCALITY) return ''
  return 'Buenos Aires'
}

/** Label para que postventa sepa a quién le corresponde el seguimiento de cada pedido. */
export const SHIPPING_PROVIDER_LABEL: Record<string, string> = {
  PICKUP: 'Retiro en showroom',
  ARTENTINO: 'Envía Artentino',
  ZIPNOVA: 'Envía Zipnova',
}
