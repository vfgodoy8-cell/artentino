import { createRemoteJWKSet, flattenedVerify } from 'jose'
import { prisma } from '@/lib/prisma'
import { MODO_CC_CODE, MODO_USER_AGENT } from '@/app/lib/constants'

// Cliente de MODO (Botón de Pago, SDK v2). Doc:
// https://merchants.modo.com.ar/docs/eed4ee10-3201-4c25-a054-b8499e0e4d81
// Desde el 31/10/2026 MODO no soporta el modal embebido: el comprador se redirige al site
// de pagos de MODO (ver buildModoCheckoutUrl) y el pago se cierra SOLO por webhook.

type ModoEnv = 'test' | 'production'

const MODO_URLS: Record<ModoEnv, { api: string; site: string }> = {
  test: {
    api: 'https://merchants.preprod.playdigital.com.ar',
    site: 'https://site.preprod.modo.com.ar/checkout',
  },
  production: {
    api: 'https://merchants.playdigital.com.ar',
    site: 'https://site.modo.com.ar/checkout',
  },
}

// Cualquier valor distinto de "production" cae en test — nunca cobrar de verdad por un typo.
function getModoEnv(): ModoEnv {
  return process.env.MODO_ENV === 'production' ? 'production' : 'test'
}

function apiUrl(path: string) {
  return `${MODO_URLS[getModoEnv()].api}${path}`
}

// ── Token ────────────────────────────────────────────────────────────────────
// Dura 1 semana y el endpoint tiene rate limit de 10 requests / 10 min: se cachea en DB
// (una fila por ambiente) para que sobreviva a los cold starts. Se renueva con 1h de margen.
const TOKEN_REFRESH_MARGIN_MS = 60 * 60 * 1000

async function requestNewToken(): Promise<string> {
  const username = process.env.MODO_USERNAME
  const password = process.env.MODO_PASSWORD
  if (!username || !password) throw new Error('MODO_USERNAME / MODO_PASSWORD no están seteadas')

  const res = await fetch(apiUrl('/v2/stores/companies/token'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'User-Agent': MODO_USER_AGENT },
    body: JSON.stringify({ username, password }),
  })
  if (!res.ok) throw new Error(`MODO token respondió ${res.status}`)

  const json: { access_token: string; expires_in: number } = await res.json()
  const env = getModoEnv()
  const expiresAt = new Date(Date.now() + json.expires_in * 1000)
  await prisma.modoToken.upsert({
    where: { id: env },
    create: { id: env, accessToken: json.access_token, expiresAt },
    update: { accessToken: json.access_token, expiresAt },
  })
  return json.access_token
}

async function getToken(): Promise<string> {
  const cached = await prisma.modoToken.findUnique({ where: { id: getModoEnv() } })
  if (cached && cached.expiresAt.getTime() - Date.now() > TOKEN_REFRESH_MARGIN_MS) {
    return cached.accessToken
  }
  return requestNewToken()
}

// Request autenticado. Si MODO responde 401 (token revocado, credenciales rotadas) se pide
// un token nuevo y se reintenta una sola vez.
async function modoFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const doFetch = (token: string) =>
    fetch(apiUrl(path), {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': MODO_USER_AGENT,
        Authorization: `Bearer ${token}`,
        ...init.headers,
      },
    })

  const res = await doFetch(await getToken())
  if (res.status !== 401) return res
  return doFetch(await requestNewToken())
}

// ── Payment request ──────────────────────────────────────────────────────────

export type CreateModoPaymentRequestInput = {
  orderId: string
  amount: number
  description: string
  webhookUrl: string
  customer?: { fullName: string; email: string; identification: string; phone?: string }
  shippingAddress?: { state?: string; city?: string; zipCode?: string; street?: string; number?: string }
  items: Array<{ description: string; quantity: number; sku: string }>
}

export type ModoPaymentRequest = { id: string; expiration_date: string }

export async function createModoPaymentRequest(
  input: CreateModoPaymentRequestInput,
): Promise<ModoPaymentRequest> {
  const processorCode = process.env.MODO_PROCESSOR_CODE
  if (!processorCode) throw new Error('MODO_PROCESSOR_CODE no está seteada')

  const res = await modoFetch('/v2/payment-requests/', {
    method: 'POST',
    body: JSON.stringify({
      description: input.description.slice(0, 100),
      amount: Number(input.amount.toFixed(2)),
      currency: 'ARS',
      cc_code: MODO_CC_CODE,
      processor_code: processorCode,
      // external_intention_id tiene que ser único por payment request, y el id de MODO es de
      // un solo uso: cada reintento de la misma orden genera uno nuevo. El orderId viaja en
      // `message`, que MODO devuelve tal cual en el webhook (el cuid no tiene guiones, así
      // que el prefijo también es recuperable).
      external_intention_id: `${input.orderId}-${Date.now()}`,
      message: input.orderId,
      webhook_notification: input.webhookUrl,
      ...(input.customer
        ? {
            customer: {
              full_name: input.customer.fullName,
              email: input.customer.email,
              identification: input.customer.identification,
              ...(input.customer.phone ? { phone: input.customer.phone } : {}),
            },
          }
        : {}),
      ...(input.shippingAddress
        ? {
            shipping_address: {
              state: input.shippingAddress.state,
              city: input.shippingAddress.city,
              zip_code: input.shippingAddress.zipCode,
              street: input.shippingAddress.street,
              number: input.shippingAddress.number,
            },
          }
        : {}),
      items: input.items,
    }),
  })

  if (!res.ok) {
    // El body de error de MODO describe qué campo falló — no contiene credenciales.
    const detail = await res.text().catch(() => '')
    throw new Error(`MODO payment request respondió ${res.status}: ${detail.slice(0, 500)}`)
  }
  return res.json()
}

export function buildModoCheckoutUrl(
  paymentRequestId: string,
  callbackSuccess: string,
  callback: string,
): string {
  const url = new URL(MODO_URLS[getModoEnv()].site)
  url.searchParams.set('id', paymentRequestId)
  url.searchParams.set('callbackSuccess', callbackSuccess)
  url.searchParams.set('callback', callback)
  return url.toString()
}

// Solo responde para pagos aprobados, rechazados o devueltos (rate limit 600 / 10 min).
export type ModoPaymentData = { id: string; status: string; transaction_data?: { amount?: string } | null }

export async function getModoPaymentData(paymentRequestId: string): Promise<ModoPaymentData> {
  const res = await modoFetch(`/v2/payment-requests/${encodeURIComponent(paymentRequestId)}/data`)
  if (!res.ok) throw new Error(`MODO payment data respondió ${res.status}`)
  return res.json()
}

// ── Webhook ──────────────────────────────────────────────────────────────────

export type ModoWebhookPayload = {
  id: string
  status: 'CREATED' | 'SCANNED' | 'PROCESSING' | 'ACCEPTED' | 'REJECTED' | string
  external_intention_id?: string
  message?: string
  amount?: number
}

// createRemoteJWKSet baja el JWKS una vez por instancia y lo cachea (MODO pide no bajarlo en
// cada webhook); solo vuelve a pedirlo si llega un `kid` que no conoce.
const jwksByEnv: Partial<Record<ModoEnv, ReturnType<typeof createRemoteJWKSet>>> = {}

function getJwks() {
  const env = getModoEnv()
  jwksByEnv[env] ??= createRemoteJWKSet(new URL(apiUrl('/v2/payment-requests/.well-known/jwks.json')), {
    headers: { 'User-Agent': MODO_USER_AGENT },
  })
  return jwksByEnv[env]
}

// Verifica la JWS (flattened, RFC 7515 §7.2.2) del campo `signature` contra las JWK
// públicas de MODO y devuelve el payload FIRMADO — el caller debe usar este payload y no el
// body crudo. Además exige que los campos que usamos coincidan con el body, como pide la doc.
// Tira si la firma no valida.
export async function verifyModoWebhook(body: Record<string, unknown>): Promise<ModoWebhookPayload> {
  const signature = body.signature as { payload?: string; protected?: string; signature?: string } | undefined
  if (!signature?.payload || !signature.protected || !signature.signature) {
    throw new Error('webhook sin signature')
  }

  const { payload } = await flattenedVerify(
    { payload: signature.payload, protected: signature.protected, signature: signature.signature },
    getJwks(),
  )
  const signed = JSON.parse(new TextDecoder().decode(payload)) as ModoWebhookPayload

  for (const key of ['id', 'status', 'external_intention_id', 'message', 'amount'] as const) {
    if (signed[key] !== body[key]) throw new Error(`campo ${key} no coincide con el payload firmado`)
  }
  return signed
}
