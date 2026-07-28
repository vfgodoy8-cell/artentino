/**
 * Adapter de cotización de Zipnova. Sin credenciales todavía — armado para que
 * conectar la API real cuando lleguen sea solo completar ZIPNOVA_API_KEY (y
 * ZIPNOVA_ACCOUNT_ID) en el entorno, sin tocar el resto del checkout.
 *
 * Referencia (doc pública de Zipnova, API v2 "Envíos"):
 *   POST https://api.zipnova.com.ar/v2/shipments/quote
 *   Auth: Basic base64(API_TOKEN:API_SECRET)
 *   Body: { account_id, source, declared_value, destination: {city, state, zipcode},
 *           items: [{ weight (g), height/width/length (cm), description }],
 *           type_packaging: 'dynamic', sort_by: 'price' }
 *   Response: { all_results: [{ selectable, carrier, amounts: {price, price_incl_tax}, ... }] }
 */

export type ZipnovaQuoteParams = {
  destinationLocality: string
  destinationProvince: string
  weightKg: number
  dimensions?: { height: number; width: number; length: number }
}

export type ZipnovaQuoteResult =
  | { ok: true; price: number; etaDays: string }
  | { ok: false; error: string }

export async function getZipnovaQuote(params: ZipnovaQuoteParams): Promise<ZipnovaQuoteResult> {
  const apiKey = process.env.ZIPNOVA_API_KEY
  if (!apiKey) {
    return { ok: false, error: 'Zipnova no configurado' }
  }

  try {
    return await requestRealQuote(params, apiKey)
  } catch (error) {
    console.error('[zipnova] error al cotizar:', error)
    return { ok: false, error: 'No se pudo cotizar el envío con Zipnova' }
  }
}

// ─── Request real — separado para no mezclar la lógica de gating con el   ───
// ─── armado de la llamada HTTP. TODO: confirmar account_id / auth exacta  ───
// ─── una vez que lleguen las credenciales reales (ver ZIPNOVA_ACCOUNT_ID). ───
async function requestRealQuote(
  params: ZipnovaQuoteParams,
  apiKey: string,
): Promise<ZipnovaQuoteResult> {
  const accountId = process.env.ZIPNOVA_ACCOUNT_ID
  if (!accountId) {
    return { ok: false, error: 'Zipnova no configurado' }
  }

  const baseUrl = process.env.ZIPNOVA_BASE_URL || 'https://api.zipnova.com.ar'
  const res = await fetch(`${baseUrl}/v2/shipments/quote`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      // TODO: confirmar si Zipnova usa Basic (token:secret) u otro esquema con
      // la API key que finalmente nos den — placeholder Bearer por ahora.
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      account_id: Number(accountId),
      source: 'artentino-web',
      declared_value: 0,
      destination: {
        city: params.destinationLocality,
        state: params.destinationProvince,
      },
      items: [
        {
          weight: Math.round(params.weightKg * 1000),
          height: params.dimensions?.height ?? 30,
          width: params.dimensions?.width ?? 30,
          length: params.dimensions?.length ?? 30,
          description: 'Producto Artentino',
        },
      ],
      type_packaging: 'dynamic',
      sort_by: 'price',
    }),
    signal: AbortSignal.timeout(8000),
  })

  if (!res.ok) {
    return { ok: false, error: `Zipnova respondió ${res.status}` }
  }

  const data = await res.json()
  const allResults: Array<{
    selectable: boolean
    amounts: { price: number }
    delivery_time?: { times?: { total?: { max?: string } } }
  }> = data.all_results ?? []

  const best = allResults.find((r) => r.selectable) ?? allResults[0]
  if (!best) {
    return { ok: false, error: 'Zipnova no tiene opciones para ese destino' }
  }

  return {
    ok: true,
    price: best.amounts.price,
    etaDays: best.delivery_time?.times?.total?.max ?? '',
  }
}
