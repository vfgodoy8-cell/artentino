import { prisma } from '@/lib/prisma'

const CABA_PROVINCE_NAME = 'Ciudad Autónoma de Buenos Aires'

/** Localidades de GBA con entrega propia de Artentino — única fuente de verdad, editable en /admin/extension. */
export async function getExpressLocalities(): Promise<string[]> {
  const zone = await prisma.shippingZone.findUnique({ where: { type: 'EXPRESS' } })
  return zone?.localities ?? []
}

/**
 * Minúsculas + sin tildes/diacríticos + sin puntuación — para comparar el nombre que
 * devuelve Georef (acentuado, con puntos: "José C. Paz") contra lo que un admin haya
 * tipeado a mano en /admin/extension (sin ese cuidado: "Jose C Paz").
 */
function normalizeLocalityName(value: string): string {
  return value
    .normalize('NFD')
    .replace(/\p{Mn}/gu, '')
    .replace(/[.,]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase()
}

/**
 * Determina quién ejecuta la entrega a partir de la localidad/provincia reales
 * (de Georef): cualquier dirección en CABA es siempre Express (regla de negocio
 * existente), o si la localidad matchea (normalizada) contra la lista fija de GBA.
 */
export async function resolveShippingProvider(
  localityName: string,
  provinceName: string,
): Promise<'ARTENTINO' | 'ZIPNOVA'> {
  if (normalizeLocalityName(provinceName) === normalizeLocalityName(CABA_PROVINCE_NAME)) {
    return 'ARTENTINO'
  }

  const expressLocalities = await getExpressLocalities()
  const normalizedTarget = normalizeLocalityName(localityName)
  const isExpress = expressLocalities.some((l) => normalizeLocalityName(l) === normalizedTarget)
  return isExpress ? 'ARTENTINO' : 'ZIPNOVA'
}

/** Label para que postventa sepa a quién le corresponde el seguimiento de cada pedido. */
export const SHIPPING_PROVIDER_LABEL: Record<string, string> = {
  PICKUP: 'Retiro en showroom',
  ARTENTINO: 'Envía Artentino',
  ZIPNOVA: 'Envía Zipnova',
}
