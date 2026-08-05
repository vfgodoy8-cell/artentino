'use server'

import { revalidatePath } from 'next/cache'
import { saveInstagramToken } from '@/app/lib/instagram-token'

type MeResponse = {
  id?: string
  username?: string
  error?: { message: string }
}

type RefreshResponse = {
  access_token?: string
  expires_in?: number
  error?: { message: string }
}

// Flujo "Instagram API con inicio de sesión de Instagram" — los tokens (prefijo IGAA...)
// no son válidos contra graph.facebook.com/debug_token (esa era la API vieja, vía Facebook
// Login). Acá se valida y resuelve todo contra graph.instagram.com.
export async function saveInitialToken(token: string) {
  const trimmed = token.trim()
  if (!trimmed) return { ok: false as const, error: 'Pegá un access token.' }

  // 1. Validar el token y resolver el Instagram User ID (necesario para /{ig-user-id}/media).
  let igUserId: string
  try {
    const meRes = await fetch(
      `https://graph.instagram.com/me?fields=id,username&access_token=${encodeURIComponent(trimmed)}`,
    )
    const me: MeResponse = await meRes.json()
    if (me.error) {
      return { ok: false as const, error: me.error.message }
    }
    if (!me.id) {
      return { ok: false as const, error: 'No se pudo resolver el Instagram User ID — el token puede ser inválido.' }
    }
    igUserId = me.id
  } catch {
    return { ok: false as const, error: 'No se pudo contactar a la API de Instagram.' }
  }

  // 2. Obtener un token de larga duración + su expiración real. Mismo endpoint que ya usa
  // el cron de refresh (app/api/cron/instagram-refresh/route.ts).
  let refreshedToken: string
  let expiresAt: Date
  try {
    const refreshRes = await fetch(
      `https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=${encodeURIComponent(trimmed)}`,
    )
    const refreshed: RefreshResponse = await refreshRes.json()
    if (refreshed.error) {
      return { ok: false as const, error: refreshed.error.message }
    }
    if (!refreshed.access_token || !refreshed.expires_in) {
      return { ok: false as const, error: 'La API de Instagram no devolvió un token de larga duración válido.' }
    }
    refreshedToken = refreshed.access_token
    expiresAt = new Date(Date.now() + refreshed.expires_in * 1000)
  } catch {
    return { ok: false as const, error: 'No se pudo contactar a la API de Instagram para extender el token.' }
  }

  await saveInstagramToken(refreshedToken, expiresAt, igUserId)
  revalidatePath('/admin/instagram')
  return { ok: true as const, expiresAt: expiresAt.toISOString(), igUserId }
}
