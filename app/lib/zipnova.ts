const ZIPNOVA_BASE_URL = 'https://api.zipnova.com.ar/v2'

function isMockMode() {
  return process.env.ZIPNOVA_MOCK_MODE === 'true'
}

function authHeader() {
  const token = process.env.ZIPNOVA_API_TOKEN
  const secret = process.env.ZIPNOVA_API_SECRET
  if (!token || !secret) {
    throw new Error('Zipnova: faltan ZIPNOVA_API_TOKEN / ZIPNOVA_API_SECRET')
  }
  return `Basic ${Buffer.from(`${token}:${secret}`).toString('base64')}`
}

type ZipnovaPackage = {
  weight: number // gramos (10 a 10.000.000)
  height: number // cm (1 a 5000)
  width: number // cm (1 a 5000)
  length: number // cm (1 a 5000)
}

type ZipnovaQuoteParams = {
  city: string
  province?: string
  zip?: string
  declaredValue: number
  packages: ZipnovaPackage[]
}

export type ZipnovaQuoteResult = {
  carrierName: string
  price: number
  priceInclTax: number
  estimatedDeliveryDays: number | null
}

export type ZipnovaShipmentParams = ZipnovaQuoteParams & {
  externalId: string
  destinationName: string
  destinationDocument: string
  destinationEmail: string
  destinationPhone: string
  destinationStreet?: string
  destinationStreetNumber?: string
}

export type ZipnovaShipmentResult = {
  id: string
  tracking: string | null
  status: string
}

export async function getZipnovaQuote(params: ZipnovaQuoteParams): Promise<ZipnovaQuoteResult> {
  if (isMockMode()) return getMockQuote(params)

  const accountId = process.env.ZIPNOVA_ACCOUNT_ID
  if (!accountId) throw new Error('Zipnova: falta ZIPNOVA_ACCOUNT_ID')

  const res = await fetch(`${ZIPNOVA_BASE_URL}/shipments/quote`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: authHeader(),
    },
    body: JSON.stringify({
      account_id: Number(accountId),
      source: 'artentino-web',
      declared_value: params.declaredValue,
      destination: { city: params.city, state: params.province, zipcode: params.zip },
      // `items` (recomendado por la doc) en vez de `packages` — evita tener que declarar
      // classification_id, que es obligatorio si se manda `packages` sin sku/container_id.
      items: params.packages.map((p) => ({
        weight: p.weight,
        height: p.height,
        width: p.width,
        length: p.length,
        description: 'Producto Artentino',
      })),
      type_packaging: 'dynamic',
      sort_by: 'price',
    }),
  })

  if (!res.ok) {
    const body = await res.text().catch(() => '')
    throw new Error(`Zipnova quote error: ${res.status} ${body}`)
  }

  const data = await res.json()
  const allResults: Array<{
    selectable: boolean
    carrier?: { name?: string }
    amounts: { price: number; price_incl_tax: number }
  }> = data.all_results ?? []

  const best = allResults.find((r) => r.selectable) ?? allResults[0]
  if (!best) throw new Error('Zipnova: no hay opciones de envío disponibles para este destino')

  return {
    carrierName: best.carrier?.name ?? 'Zipnova',
    price: best.amounts.price,
    priceInclTax: best.amounts.price_incl_tax,
    estimatedDeliveryDays: null,
  }
}

export async function createZipnovaShipment(params: ZipnovaShipmentParams): Promise<ZipnovaShipmentResult> {
  if (isMockMode()) return getMockShipment()

  const accountId = process.env.ZIPNOVA_ACCOUNT_ID
  if (!accountId) throw new Error('Zipnova: falta ZIPNOVA_ACCOUNT_ID')

  const res = await fetch(`${ZIPNOVA_BASE_URL}/shipments`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: authHeader(),
    },
    body: JSON.stringify({
      account_id: Number(accountId),
      service_type: 'standard',
      external_id: params.externalId,
      origin_id: 'auto',
      declared_value: params.declaredValue,
      destination: {
        name: params.destinationName,
        document: params.destinationDocument,
        email: params.destinationEmail,
        phone: params.destinationPhone,
        street: params.destinationStreet,
        street_number: params.destinationStreetNumber,
        city: params.city,
        state: params.province,
        zipcode: params.zip,
      },
      packages: params.packages,
    }),
  })

  if (!res.ok) throw new Error(`Zipnova create shipment error: ${res.status}`)

  const data = await res.json()
  return {
    id: String(data.id),
    tracking: data.tracking ?? null,
    status: data.status,
  }
}

// ─── Mock mode — sin credenciales reales todavía (ZIPNOVA_MOCK_MODE=true) ─────

function getMockQuote(params: ZipnovaQuoteParams): ZipnovaQuoteResult {
  const totalWeightKg = params.packages.reduce((sum, p) => sum + p.weight, 0) / 1000
  const price = Math.round(3500 + 800 * Math.max(totalWeightKg, 1))
  return {
    carrierName: 'Zipnova (mock)',
    price,
    priceInclTax: price,
    estimatedDeliveryDays: 3,
  }
}

function getMockShipment(): ZipnovaShipmentResult {
  return {
    id: `mock-${Date.now()}`,
    tracking: `MOCKTRACK${Math.floor(Math.random() * 1_000_000)}`,
    status: 'pending',
  }
}
