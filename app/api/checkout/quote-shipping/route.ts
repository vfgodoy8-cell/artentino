import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { isExpressLocality } from '@/app/lib/shipping-zones'
import { getZipnovaQuote } from '@/app/lib/zipnova'

// Paquete genérico de referencia (30x30x30 cm, 3kg) — hasta que el checkout sume peso/dimensiones reales por producto
const DEFAULT_PACKAGE = { weight: 3000, height: 30, width: 30, length: 30 }

export async function POST(req: Request) {
  const { city, province, zip, declaredValue } = await req.json()

  if (!city || !province) {
    return NextResponse.json({ error: 'Falta la localidad o la provincia' }, { status: 400 })
  }

  const [isExpress, siteConfig] = await Promise.all([
    isExpressLocality(province, city),
    prisma.siteConfig.findUnique({ where: { id: 'singleton' } }),
  ])

  let quote
  try {
    quote = await getZipnovaQuote({
      city,
      province,
      zip,
      declaredValue: declaredValue ?? 0,
      packages: [DEFAULT_PACKAGE],
    })
  } catch (error) {
    console.error('[quote-shipping] error cotizando con Zipnova:', error)
    return NextResponse.json({ error: 'No se pudo cotizar el envío' }, { status: 502 })
  }

  const expressEnabled = siteConfig?.expressShippingEnabled ?? true
  const zipnovaEnabled = siteConfig?.zipnovaShippingEnabled ?? true

  const options: { courier: 'ARTENTINO_EXPRESS' | 'ZIPNOVA'; label: string; amount: number }[] = []
  if (isExpress && expressEnabled) {
    options.push({ courier: 'ARTENTINO_EXPRESS', label: 'Envío Express (Artentino)', amount: quote.price })
  }
  if (zipnovaEnabled) {
    options.push({ courier: 'ZIPNOVA', label: 'Envío Zipnova', amount: quote.price })
  }

  return NextResponse.json({ isExpress, options })
}
