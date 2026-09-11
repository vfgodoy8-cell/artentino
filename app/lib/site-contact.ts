import { prisma } from '@/lib/prisma'

type SiteConfigRow = {
  phone?: string | null
  whatsappNumber?: string | null
  email?: string | null
  addressLine1?: string | null
  addressLine2?: string | null
  businessHours?: string | null
} | null

export type SiteContact = {
  phone: string
  whatsappNumber: string
  whatsappUrl: string
  email: string
  addressLine1: string
  addressLine2: string
  mapsUrl: string
  businessHours: string
}

const DEFAULTS = {
  phone: '+54 9 11 3936 3333',
  whatsappNumber: '5491139363333',
  email: 'info@artentino.com',
  addressLine1: 'Av. Corrientes 5022 — A metros de Scalabrini Ortiz',
  addressLine2: 'CABA CP 1414 (Subte B, Est. Malabia)',
  businessHours: 'Lunes a Viernes 9 a 19hs',
}

// Deriva el objeto de contacto a partir de una fila de SiteConfig ya obtenida —
// evita una segunda consulta en callers que ya la tienen (ej. footer.tsx).
export function deriveSiteContact(siteConfig: SiteConfigRow): SiteContact {
  const phone = siteConfig?.phone ?? DEFAULTS.phone
  const whatsappNumber = siteConfig?.whatsappNumber ?? DEFAULTS.whatsappNumber
  const email = siteConfig?.email ?? DEFAULTS.email
  const addressLine1 = siteConfig?.addressLine1 ?? DEFAULTS.addressLine1
  const addressLine2 = siteConfig?.addressLine2 ?? DEFAULTS.addressLine2
  const businessHours = siteConfig?.businessHours ?? DEFAULTS.businessHours

  return {
    phone,
    whatsappNumber,
    whatsappUrl: `https://wa.me/${whatsappNumber}`,
    email,
    addressLine1,
    addressLine2,
    mapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${addressLine1}, ${addressLine2}`)}`,
    businessHours,
  }
}

export async function getSiteContact(): Promise<SiteContact> {
  const siteConfig = await prisma.siteConfig.findUnique({ where: { id: 'singleton' } })
  return deriveSiteContact(siteConfig)
}
