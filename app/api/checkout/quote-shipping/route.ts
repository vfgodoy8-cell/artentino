import { NextResponse } from 'next/server'
import { isExpressLocality, resolveProvinceForLocality } from '@/app/lib/shipping-zones'
import { getZipnovaQuote } from '@/app/lib/shipping/zipnova'

// Peso genérico de referencia — hasta que el checkout sume peso real por producto
const DEFAULT_WEIGHT_KG = 3

export async function POST(req: Request) {
  const { locality } = await req.json()

  if (!locality) {
    return NextResponse.json({ ok: false, error: 'Falta la localidad' }, { status: 400 })
  }

  const isExpress = await isExpressLocality(locality)
  const provider = isExpress ? 'ARTENTINO' : 'ZIPNOVA'

  const quote = await getZipnovaQuote({
    destinationLocality: locality,
    destinationProvince: resolveProvinceForLocality(locality),
    weightKg: DEFAULT_WEIGHT_KG,
  })

  if (!quote.ok) {
    return NextResponse.json({ ok: false, error: quote.error })
  }

  return NextResponse.json({ ok: true, provider, price: quote.price, etaDays: quote.etaDays })
}
