import { prisma } from '@/lib/prisma'
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
  caption?: string
  timestamp?: string
}

async function fetchRawInstagramMedia(limit: number): Promise<IgMediaItem[] | null> {
  const token = await getInstagramToken()
  if (!token || !token.igUserId) return null
  if (token.expiresAt.getTime() <= Date.now()) return null

  const fields = 'id,media_type,media_url,thumbnail_url,permalink,caption,timestamp'
  const url = `https://graph.instagram.com/${token.igUserId}/media?fields=${fields}&limit=${limit}&access_token=${encodeURIComponent(token.accessToken)}`

  try {
    const res = await fetch(url, { next: { revalidate: 3600 } })
    if (!res.ok) return null
    const json: { data?: IgMediaItem[] } = await res.json()
    return Array.isArray(json.data) ? json.data : []
  } catch {
    return null
  }
}

// Devuelve exactamente 4 imágenes o null (token ausente/vencido, error de red,
// respuesta inesperada, o menos de 4 posts con imagen disponible tras excluir los
// curados manualmente desde /admin/instagram). El caller debe hacer fallback a
// placeholders — este helper nunca tira.
// Se piden 24 posts crudos (no 4) para tener margen: si el admin excluye varios de
// los más recientes, igual hay de dónde completar el feed de 4.
export async function getInstagramFeedImages(): Promise<InstagramFeedImage[] | null> {
  const items = await fetchRawInstagramMedia(24)
  if (!items) return null

  const excluded = await prisma.instagramExcludedPost.findMany({ select: { mediaId: true } })
  const excludedIds = new Set(excluded.map((e) => e.mediaId))

  const images: InstagramFeedImage[] = items
    .filter((m) => !excludedIds.has(m.id))
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

export type InstagramAdminPost = {
  id: string
  url: string | null
  permalink: string
  mediaType: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM'
  caption: string | null
  timestamp: string | null
}

// Últimos N posts crudos (sin filtrar por exclusión) para la vista de curación en
// /admin/instagram — ahí se decide qué posts entran o no al feed público.
export async function getInstagramPostsForAdmin(limit = 24): Promise<InstagramAdminPost[]> {
  const items = await fetchRawInstagramMedia(limit)
  if (!items) return []

  return items.map((m) => ({
    id: m.id,
    url: (m.media_type === 'VIDEO' ? m.thumbnail_url : m.media_url) ?? null,
    permalink: m.permalink,
    mediaType: m.media_type,
    caption: m.caption ?? null,
    timestamp: m.timestamp ?? null,
  }))
}
