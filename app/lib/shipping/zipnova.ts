/**
 * Adapter de cotización de Zipnova — API v2 "Envíos".
 *   POST https://api.zipnova.com.ar/v2/shipments/quote
 *   Auth: Basic base64(ZIPNOVA_KEY:ZIPNOVA_SECRET)
 *   Body: { account_id, source, declared_value, destination: {city, state, zipcode},
 *           items: [{ weight (g), height/width/length (cm) }] }
 *   Response: { results: [{ service_type, amounts: {price, price_incl_tax}, ... }] }
 */

const ZIPNOVA_ACCOUNT_ID = 19612

export type ZipnovaQuoteItem = {
  weightGrams: number
  heightCm: number
  widthCm: number
  lengthCm: number
  quantity: number
}

export type ZipnovaQuoteParams = {
  destinationCity: string
  destinationState: string
  destinationZipcode?: string
  items: ZipnovaQuoteItem[]
  declaredValue: number
}

export type ZipnovaQuoteResult =
  | { ok: true; price: number; serviceTypeCode: string; etaEstimate?: string }
  | { ok: false; error: string }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function safeJsonParse(text: string): any {
  try {
    return JSON.parse(text)
  } catch {
    return null
  }
}

export async function getZipnovaQuote(params: ZipnovaQuoteParams): Promise<ZipnovaQuoteResult> {
  const key = process.env.ZIPNOVA_KEY
  const secret = process.env.ZIPNOVA_SECRET
  if (!key || !secret) {
    return { ok: false, error: 'Zipnova no configurado' }
  }

  try {
    return await requestRealQuote(params, key, secret)
  } catch (error) {
    console.error('[zipnova] error al cotizar:', error)
    return { ok: false, error: 'No se pudo cotizar el envío con Zipnova' }
  }
}

async function requestRealQuote(
  params: ZipnovaQuoteParams,
  key: string,
  secret: string,
): Promise<ZipnovaQuoteResult> {
  const baseUrl = process.env.ZIPNOVA_BASE_URL || 'https://api.zipnova.com.ar'
  const basicAuth = Buffer.from(`${key}:${secret}`).toString('base64')

  // La API espera un objeto item por cada unidad física (no acepta una key de cantidad agregada).
  const expandedItems = params.items.flatMap((item) =>
    Array.from({ length: item.quantity }, () => ({
      weight: Math.round(item.weightGrams),
      height: Math.round(item.heightCm),
      width: Math.round(item.widthCm),
      length: Math.round(item.lengthCm),
    })),
  )

  const requestBody = {
    account_id: ZIPNOVA_ACCOUNT_ID,
    source: 'artentino-web',
    declared_value: params.declaredValue,
    destination: {
      city: params.destinationCity,
      state: params.destinationState,
      ...(params.destinationZipcode ? { zipcode: params.destinationZipcode } : {}),
    },
    items: expandedItems,
  }

  const res = await fetch(`${baseUrl}/v2/shipments/quote`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Basic ${basicAuth}`,
    },
    body: JSON.stringify(requestBody),
    signal: AbortSignal.timeout(8000),
  })

  // Se lee como texto primero para poder loguear el body crudo en cualquier
  // camino de error, sea 400, otro status, o un 200 con un shape inesperado.
  const rawBody = await res.text()
  const parsedBody = safeJsonParse(rawBody)

  if (res.status === 400) {
    console.error('[zipnova] 400 al cotizar — request:', JSON.stringify(requestBody), '— response:', rawBody)
    const message: string = parsedBody?.message ?? parsedBody?.error ?? ''
    if (/sin saldo|saldo insuficiente|cuenta inactiva|account.*inactive/i.test(message)) {
      return { ok: false, error: 'zipnova_sin_saldo' }
    }
    return { ok: false, error: message || 'Zipnova rechazó la cotización' }
  }

  if (!res.ok) {
    console.error(`[zipnova] respuesta ${res.status} inesperada — request:`, JSON.stringify(requestBody), '— response:', rawBody)
    return { ok: false, error: `Zipnova respondió ${res.status}` }
  }

  if (!parsedBody || !Array.isArray(parsedBody.results)) {
    console.error('[zipnova] respuesta 200 con shape inesperado — request:', JSON.stringify(requestBody), '— response:', rawBody)
    return { ok: false, error: 'Zipnova devolvió una respuesta inesperada' }
  }

  const results: Array<{
    service_type?: string
    amounts?: { price?: number; price_incl_tax?: number }
    delivery_time?: { times?: { total?: { max?: string } } }
  }> = parsedBody.results

  const withPrice = results.filter((r) => typeof r.amounts?.price_incl_tax === 'number')
  if (withPrice.length === 0) {
    console.error('[zipnova] sin opciones con precio — request:', JSON.stringify(requestBody), '— response:', rawBody)
    return { ok: false, error: 'Zipnova no tiene opciones para ese destino' }
  }

  const best = withPrice.reduce((min, r) =>
    (r.amounts!.price_incl_tax as number) < (min.amounts!.price_incl_tax as number) ? r : min,
  )

  return {
    ok: true,
    price: best.amounts!.price_incl_tax as number,
    serviceTypeCode: best.service_type ?? 'unknown',
    etaEstimate: best.delivery_time?.times?.total?.max,
  }
}
