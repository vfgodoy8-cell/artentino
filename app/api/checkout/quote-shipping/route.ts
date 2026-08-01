import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { CABA_LOCALITY, OTHER_COUNTRY_LOCALITY, isExpressLocality } from '@/app/lib/shipping-zones'
import { getZipnovaQuote, type ZipnovaQuoteItem } from '@/app/lib/shipping/zipnova'

// Fallback cuando el producto no tiene peso/dimensiones cargados en el admin.
const DEFAULT_WEIGHT_GRAMS = 3000
const DEFAULT_DIMENSION_CM = 30

type QuoteCartItem = {
  productId: string
  price: number
  quantity: number
}

export async function POST(req: Request) {
  const { locality, city, province, zip, items } = (await req.json()) as {
    locality?: string
    city?: string
    province?: string
    zip?: string
    items?: QuoteCartItem[]
  }

  if (!locality) {
    return NextResponse.json({ ok: false, error: 'Falta la localidad' }, { status: 400 })
  }

  if (!items?.length) {
    return NextResponse.json({ ok: false, error: 'Faltan los productos del carrito' }, { status: 400 })
  }

  if (locality === OTHER_COUNTRY_LOCALITY && (!city || !province)) {
    return NextResponse.json({ ok: false, error: 'Faltan ciudad y provincia para el destino' }, { status: 400 })
  }

  const isExpress = await isExpressLocality(locality)
  const provider = isExpress ? 'ARTENTINO' : 'ZIPNOVA'

  const products = await prisma.product.findMany({
    where: { id: { in: items.map((i) => i.productId) } },
    select: { id: true, height: true, width: true, length: true, weight: true },
  })
  const productMap = new Map(products.map((p) => [p.id, p]))

  const quoteItems: ZipnovaQuoteItem[] = items.map((item) => {
    const product = productMap.get(item.productId)
    return {
      weightGrams: product?.weight ? Math.round(Number(product.weight) * 1000) : DEFAULT_WEIGHT_GRAMS,
      heightCm: product?.height ? Number(product.height) : DEFAULT_DIMENSION_CM,
      widthCm: product?.width ? Number(product.width) : DEFAULT_DIMENSION_CM,
      lengthCm: product?.length ? Number(product.length) : DEFAULT_DIMENSION_CM,
      quantity: item.quantity,
    }
  })

  const declaredValue = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  // "Resto del país" no es una localidad real de Zipnova — usa la ciudad/provincia
  // que cargó el usuario. Para CABA/GBA, la localidad elegida en el dropdown es la ciudad real.
  const destinationCity = locality === OTHER_COUNTRY_LOCALITY ? city! : locality
  const destinationState =
    locality === OTHER_COUNTRY_LOCALITY ? province! : locality === CABA_LOCALITY ? 'Capital Federal' : 'Buenos Aires'

  const quote = await getZipnovaQuote({
    destinationCity,
    destinationState,
    destinationZipcode: zip,
    items: quoteItems,
    declaredValue,
  })

  if (!quote.ok) {
    return NextResponse.json({ ok: false, error: quote.error })
  }

  return NextResponse.json({ ok: true, provider, price: quote.price, etaEstimate: quote.etaEstimate })
}
