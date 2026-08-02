/**
 * Adapter de cotización de Zipnova — API v2 "Envíos".
 *   POST https://api.zipnova.com.ar/v2/shipments/quote
 *   Auth: Basic base64(ZIPNOVA_KEY:ZIPNOVA_SECRET)
 *   Body: { account_id, source, declared_value, destination: {city, state, zipcode},
 *           items: [{ weight (g), height/width/length (cm) }] }
 *   Response: { results: { [service_type_code]: { selectable, service_type: {code, name},
 *               amounts: {price, price_incl_tax}, delivery_time: {estimated_delivery, ...} } },
 *               all_results: [...] } — results es un objeto indexado por código, no un array.
 */

import { prisma } from '@/lib/prisma'

const ZIPNOVA_ACCOUNT_ID = 19612
// Fallback cuando el producto no tiene peso/dimensiones cargados en el admin (mismo criterio que los callers de cotización).
const DEFAULT_WEIGHT_GRAMS = 3000
const DEFAULT_DIMENSION_CM = 30

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

// Compartido entre cotización y creación de envío — la API espera un objeto item por cada
// unidad física (no acepta una key de cantidad agregada).
function expandQuoteItems(items: ZipnovaQuoteItem[]) {
  return items.flatMap((item) =>
    Array.from({ length: item.quantity }, () => ({
      weight: Math.round(item.weightGrams),
      height: Math.round(item.heightCm),
      width: Math.round(item.widthCm),
      length: Math.round(item.lengthCm),
    })),
  )
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

  const expandedItems = expandQuoteItems(params.items)

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

  // `results` es un objeto indexado por service_type.code (ej: { standard_delivery: {...} }),
  // no un array — `all_results` sí es array, pero incluye opciones no seleccionables.
  if (!parsedBody || typeof parsedBody.results !== 'object' || parsedBody.results === null || Array.isArray(parsedBody.results)) {
    console.error('[zipnova] respuesta 200 con shape inesperado — request:', JSON.stringify(requestBody), '— response:', rawBody)
    return { ok: false, error: 'Zipnova devolvió una respuesta inesperada' }
  }

  const results: Record<string, {
    selectable?: boolean
    service_type?: { code?: string; name?: string }
    amounts?: { price?: number; price_incl_tax?: number }
    delivery_time?: { estimated_delivery?: string; times?: { total?: { max?: string } } }
  }> = parsedBody.results

  const selectable = Object.values(results).filter(
    (r) => r.selectable === true && typeof r.amounts?.price_incl_tax === 'number',
  )

  if (selectable.length === 0) {
    console.error('[zipnova] sin opciones seleccionables — request:', JSON.stringify(requestBody), '— response:', rawBody)
    return { ok: false, error: 'sin_opciones_disponibles' }
  }

  const best = selectable.reduce((min, r) =>
    (r.amounts!.price_incl_tax as number) < (min.amounts!.price_incl_tax as number) ? r : min,
  )

  return {
    ok: true,
    price: best.amounts!.price_incl_tax as number,
    serviceTypeCode: best.service_type?.code ?? 'unknown',
    etaEstimate: best.delivery_time?.estimated_delivery ?? best.delivery_time?.times?.total?.max,
  }
}

// ─── Creación de envío ──────────────────────────────────────────────────────

type ZipnovaShippingAddress = {
  street?: string
  streetNumber?: string
  locality?: string
  province?: string
  zip?: string
}

export type ZipnovaShipmentOrderItem = {
  quantity: number
  product: {
    weight: number | null
    height: number | null
    width: number | null
    length: number | null
  }
}

export type ZipnovaShipmentOrder = {
  id: string
  total: number
  contactName: string | null
  contactDocument: string | null
  contactEmail: string | null
  contactPhone: string | null
  zipnovaServiceTypeCode: string | null
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  shippingAddress: any
  items: ZipnovaShipmentOrderItem[]
}

export type ZipnovaShipmentResult =
  | { ok: true; shipmentId: number; status?: string; statusName?: string }
  | { ok: false; error: string }

export async function createZipnovaShipment(order: ZipnovaShipmentOrder): Promise<ZipnovaShipmentResult> {
  const originId = process.env.ZIPNOVA_ORIGIN_ID
  if (!originId) {
    return { ok: false, error: 'ZIPNOVA_ORIGIN_ID no configurada' }
  }

  if (!order.contactDocument) {
    return { ok: false, error: 'Falta DNI del destinatario' }
  }

  if (!order.zipnovaServiceTypeCode) {
    return { ok: false, error: 'Falta el service_type cotizado del pedido' }
  }

  const address = (order.shippingAddress ?? {}) as ZipnovaShippingAddress
  if (!address.locality || !address.province) {
    return { ok: false, error: 'Falta la dirección de envío del pedido' }
  }

  const key = process.env.ZIPNOVA_KEY
  const secret = process.env.ZIPNOVA_SECRET
  if (!key || !secret) {
    return { ok: false, error: 'Zipnova no configurado' }
  }

  try {
    return await requestShipmentCreation(order, address, originId, key, secret)
  } catch (error) {
    console.error('[zipnova] error al crear envío:', error)
    return { ok: false, error: 'No se pudo crear el envío con Zipnova' }
  }
}

async function requestShipmentCreation(
  order: ZipnovaShipmentOrder,
  address: ZipnovaShippingAddress,
  originId: string,
  key: string,
  secret: string,
): Promise<ZipnovaShipmentResult> {
  const baseUrl = process.env.ZIPNOVA_BASE_URL || 'https://api.zipnova.com.ar'
  const basicAuth = Buffer.from(`${key}:${secret}`).toString('base64')

  const quoteItems: ZipnovaQuoteItem[] = order.items.map((item) => ({
    weightGrams: item.product.weight ? Math.round(item.product.weight) : DEFAULT_WEIGHT_GRAMS,
    heightCm: item.product.height ? item.product.height : DEFAULT_DIMENSION_CM,
    widthCm: item.product.width ? item.product.width : DEFAULT_DIMENSION_CM,
    lengthCm: item.product.length ? item.product.length : DEFAULT_DIMENSION_CM,
    quantity: item.quantity,
  }))

  const requestBody = {
    account_id: ZIPNOVA_ACCOUNT_ID,
    external_id: order.id.slice(0, 30),
    service_type: order.zipnovaServiceTypeCode,
    sort_by: 'price',
    origin_id: originId,
    declared_value: order.total,
    source: 'artentino-web',
    process_immediately: 1,
    destination: {
      name: order.contactName,
      document: order.contactDocument,
      email: order.contactEmail,
      phone: order.contactPhone,
      street: address.street,
      street_number: address.streetNumber,
      city: address.locality,
      state: address.province,
      zipcode: address.zip,
    },
    items: expandQuoteItems(quoteItems),
  }

  const res = await fetch(`${baseUrl}/v2/shipments`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Basic ${basicAuth}`,
    },
    body: JSON.stringify(requestBody),
    signal: AbortSignal.timeout(8000),
  })

  const rawBody = await res.text()
  const parsedBody = safeJsonParse(rawBody)

  if (!res.ok) {
    console.error(`[zipnova] ${res.status} al crear envío — request:`, JSON.stringify(requestBody), '— response:', rawBody)
    const message: string = parsedBody?.message ?? parsedBody?.error ?? `Zipnova respondió ${res.status}`
    return { ok: false, error: message }
  }

  const shipmentId = parsedBody?.id ?? parsedBody?.shipment_id ?? parsedBody?.data?.id
  if (typeof shipmentId !== 'number') {
    console.error('[zipnova] respuesta 200 sin ID de envío reconocible — request:', JSON.stringify(requestBody), '— response:', rawBody)
    return { ok: false, error: 'Zipnova no devolvió un ID de envío reconocible' }
  }

  return {
    ok: true,
    shipmentId,
    status: parsedBody?.status ?? parsedBody?.data?.status,
    statusName: parsedBody?.status_name ?? parsedBody?.data?.status_name,
  }
}

// ─── Trigger idempotente, llamado desde el webhook de MP y desde el admin ──

export async function triggerZipnovaShipmentIfNeeded(orderId: string): Promise<void> {
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            product: { select: { weight: true, height: true, width: true, length: true } },
          },
        },
      },
    })

    if (!order) return
    if (order.shippingProvider !== 'ZIPNOVA') return
    if (order.zipnovaShipmentId) return

    const result = await createZipnovaShipment({
      id: order.id,
      total: Number(order.total),
      contactName: order.contactName,
      contactDocument: order.contactDocument,
      contactEmail: order.contactEmail,
      contactPhone: order.contactPhone,
      zipnovaServiceTypeCode: order.zipnovaServiceTypeCode,
      shippingAddress: order.shippingAddress,
      items: order.items.map((item) => ({
        quantity: item.quantity,
        product: {
          weight: item.product.weight ? Number(item.product.weight) : null,
          height: item.product.height ? Number(item.product.height) : null,
          width: item.product.width ? Number(item.product.width) : null,
          length: item.product.length ? Number(item.product.length) : null,
        },
      })),
    })

    if (result.ok) {
      await prisma.order.update({
        where: { id: orderId },
        data: {
          zipnovaShipmentId: result.shipmentId,
          zipnovaShipmentStatus: result.statusName ?? result.status ?? null,
          zipnovaShipmentCreatedAt: new Date(),
          zipnovaShipmentError: null,
        },
      })
    } else {
      console.error('[ZIPNOVA_SHIPMENT_ERROR]', orderId, result.error)
      await prisma.order.update({
        where: { id: orderId },
        data: { zipnovaShipmentError: result.error },
      })
    }
  } catch (error) {
    console.error('[ZIPNOVA_SHIPMENT_ERROR]', orderId, error)
    try {
      await prisma.order.update({
        where: { id: orderId },
        data: {
          zipnovaShipmentError: error instanceof Error ? error.message : 'Error desconocido al crear el envío',
        },
      })
    } catch {
      // Si ni siquiera se puede guardar el error, no queda nada más por hacer acá.
    }
  }
}
