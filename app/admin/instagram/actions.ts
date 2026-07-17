'use server'

import { revalidatePath } from 'next/cache'
import { saveInstagramToken } from '@/app/lib/instagram-token'

type DebugTokenResponse = {
  data?: {
    is_valid: boolean
    expires_at: number
  }
  error?: { message: string }
}

export async function saveInitialToken(token: string) {
  const trimmed = token.trim()
  if (!trimmed) return { ok: false as const, error: 'Pegá un access token.' }

  const url = `https://graph.facebook.com/debug_token?input_token=${encodeURIComponent(trimmed)}&access_token=${encodeURIComponent(trimmed)}`

  let json: DebugTokenResponse
  try {
    const res = await fetch(url)
    json = await res.json()
  } catch {
    return { ok: false as const, error: 'No se pudo contactar a la API de Meta.' }
  }

  if (json.error) {
    return { ok: false as const, error: json.error.message }
  }
  if (!json.data) {
    return { ok: false as const, error: 'Respuesta inesperada de la API de Meta.' }
  }
  if (!json.data.is_valid) {
    return { ok: false as const, error: 'El token no es válido.' }
  }
  if (!json.data.expires_at) {
    return {
      ok: false as const,
      error: 'El token no tiene fecha de expiración — verificá que sea un long-lived token.',
    }
  }

  const expiresAt = new Date(json.data.expires_at * 1000)

  // Resolver el Instagram User ID — necesario para llamar a /{ig-user-id}/media
  let igUserId: string | undefined
  try {
    const meRes = await fetch(
      `https://graph.instagram.com/me?fields=id,username&access_token=${encodeURIComponent(trimmed)}`,
    )
    const me = await meRes.json()
    if (me?.id) igUserId = me.id as string
  } catch {
    // No bloqueamos el guardado del token por esto — igUserId queda sin resolver.
  }

  await saveInstagramToken(trimmed, expiresAt, igUserId)
  revalidatePath('/admin/instagram')
  return { ok: true as const, expiresAt: expiresAt.toISOString(), igUserId: igUserId ?? null }
}
