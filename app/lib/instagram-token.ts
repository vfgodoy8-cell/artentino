import { prisma } from '@/lib/prisma'

export const INSTAGRAM_FEED_TAG = 'instagram-feed'

type InstagramTokenRow = NonNullable<Awaited<ReturnType<typeof prisma.instagramToken.findFirst>>>

// Lee el token de la DB. Si la tabla está vacía y existe la env var INSTAGRAM_ACCESS_TOKEN,
// la usa para sembrar la DB (primer arranque) — después la env var deja de leerse: la DB
// es la fuente de verdad y el cron la mantiene refrescada.
export async function getInstagramToken(): Promise<InstagramTokenRow | null> {
  const token = await prisma.instagramToken.findFirst()
  if (token) return token
  return seedTokenFromEnv()
}

let seedAttempted = false

async function seedTokenFromEnv(): Promise<InstagramTokenRow | null> {
  const envToken = process.env.INSTAGRAM_ACCESS_TOKEN?.trim()
  // Un solo intento por instancia: si la env var es inválida no queremos pegarle a la API
  // de Instagram en cada render.
  if (!envToken || seedAttempted) return null
  seedAttempted = true

  const result = await exchangeAndSaveToken(envToken)
  if (!result.success) {
    console.error('[instagram] no se pudo sembrar el token desde INSTAGRAM_ACCESS_TOKEN:', result.error)
    return null
  }
  return prisma.instagramToken.findFirst()
}

export function isTokenValid(token: { igUserId: string | null; expiresAt: Date } | null) {
  return !!token && !!token.igUserId && token.expiresAt.getTime() > Date.now()
}

export async function saveInstagramToken(
  accessToken: string,
  expiresAt: Date,
  igUserId?: string,
) {
  const existing = await prisma.instagramToken.findFirst({ select: { id: true } })
  // Cualquier guardado de token (paste manual o refresh exitoso del cron) reinicia el
  // ciclo: la edad se mide desde refreshedAt y el próximo recordatorio desde cero.
  const now = new Date()
  const data = {
    accessToken,
    expiresAt,
    refreshedAt: now,
    lastRefreshAttemptAt: now,
    lastRefreshError: null,
    reminderSentAt: null,
    ...(igUserId ? { igUserId } : {}),
  }
  if (existing) {
    return prisma.instagramToken.update({ where: { id: existing.id }, data })
  }
  return prisma.instagramToken.create({ data })
}

type MeResponse = { id?: string; username?: string; error?: { message: string } }
type RefreshResponse = { access_token?: string; expires_in?: number; error?: { message: string } }

// Pide un token nuevo de 60 días a partir de uno vigente. Mismo endpoint para el paste
// manual (extiende el token recién generado) y para el cron de refresco.
export async function refreshAccessToken(
  accessToken: string,
): Promise<{ success: true; accessToken: string; expiresAt: Date } | { success: false; error: string }> {
  try {
    const res = await fetch(
      `https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=${encodeURIComponent(accessToken)}`,
      { cache: 'no-store' },
    )
    const json: RefreshResponse = await res.json()
    if (json.error) return { success: false, error: json.error.message }
    if (!json.access_token || !json.expires_in) {
      return { success: false, error: 'La API de Instagram no devolvió un token de larga duración válido.' }
    }
    return {
      success: true,
      accessToken: json.access_token,
      expiresAt: new Date(Date.now() + json.expires_in * 1000),
    }
  } catch (err) {
    return { success: false, error: `No se pudo contactar a la API de Instagram: ${String(err)}` }
  }
}

// Flujo "Instagram API con inicio de sesión de Instagram" — los tokens (prefijo IGAA...)
// no son válidos contra graph.facebook.com/debug_token (esa era la API vieja, vía Facebook
// Login). Acá se valida y resuelve todo contra graph.instagram.com.
export async function exchangeAndSaveToken(
  rawToken: string,
): Promise<{ success: true; expiresAt: Date; igUserId: string } | { success: false; error: string }> {
  // 1. Validar el token y resolver el Instagram User ID (necesario para /{ig-user-id}/media).
  let igUserId: string
  try {
    const meRes = await fetch(
      `https://graph.instagram.com/me?fields=id,username&access_token=${encodeURIComponent(rawToken)}`,
      { cache: 'no-store' },
    )
    const me: MeResponse = await meRes.json()
    if (me.error) return { success: false, error: me.error.message }
    if (!me.id) {
      return { success: false, error: 'No se pudo resolver el Instagram User ID — el token puede ser inválido.' }
    }
    igUserId = me.id
  } catch {
    return { success: false, error: 'No se pudo contactar a la API de Instagram.' }
  }

  // 2. Obtener un token de larga duración + su expiración real.
  const refreshed = await refreshAccessToken(rawToken)
  if (!refreshed.success) return refreshed

  await saveInstagramToken(refreshed.accessToken, refreshed.expiresAt, igUserId)
  return { success: true, expiresAt: refreshed.expiresAt, igUserId }
}
