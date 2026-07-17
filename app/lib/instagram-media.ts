import { getInstagramToken } from './instagram-token'

export type InstagramFeedImage = {
  id: string
  url: string
  permalink: string
  alt: string
}

type IgMediaItem = {
  id: string
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM'
  media_url?: string
  thumbnail_url?: string
  permalink: string
}

// Devuelve exactamente 4 imágenes o null (token ausente/vencido, error de red,
// respuesta inesperada, o menos de 4 posts con imagen disponibles).
// El caller debe hacer fallback a placeholders — este helper nunca tira.
export async function getInstagramFeedImages(): Promise<InstagramFeedImage[] | null> {
  const token = await getInstagramToken()
  if (!token || !token.igUserId) return null
  if (token.expiresAt.getTime() <= Date.now()) return null

  const fields = 'id,media_type,media_url,thumbnail_url,permalink'
  const url = `https://graph.instagram.com/${token.igUserId}/media?fields=${fields}&limit=12&access_token=${encodeURIComponent(token.accessToken)}`

  let json: { data?: IgMediaItem[] }
  try {
    const res = await fetch(url, { next: { revalidate: 3600 } })
    if (!res.ok) return null
    json = await res.json()
  } catch {
    return null
  }

  const items = Array.isArray(json.data) ? json.data : []

  const images: InstagramFeedImage[] = items
    .map((m) => ({
      id: m.id,
      url: m.media_type === 'VIDEO' ? m.thumbnail_url : m.media_url,
      permalink: m.permalink,
      alt: 'Publicación de Instagram @artentino',
    }))
    .filter((m): m is InstagramFeedImage => !!m.url && !!m.permalink)
    .slice(0, 4)

  return images.length === 4 ? images : null
}
