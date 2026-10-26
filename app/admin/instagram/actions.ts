'use server'

import { revalidatePath, updateTag } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { exchangeAndSaveToken, INSTAGRAM_FEED_TAG } from '@/app/lib/instagram-token'

// El feed se renderiza en el layout raíz (todas las páginas) y se cachea con el tag
// INSTAGRAM_FEED_TAG — invalidamos ambos para que el cambio se vea de inmediato.
function revalidateInstagramFeed() {
  updateTag(INSTAGRAM_FEED_TAG)
  revalidatePath('/', 'layout')
}

export async function saveInitialToken(token: string) {
  const trimmed = token.trim()
  if (!trimmed) return { success: false as const, error: 'Pegá un access token.' }

  try {
    const result = await exchangeAndSaveToken(trimmed)
    if (!result.success) return result

    revalidateInstagramFeed()
    revalidatePath('/admin/instagram')
    return { success: true as const, expiresAt: result.expiresAt.toISOString(), igUserId: result.igUserId }
  } catch (err) {
    console.error('[admin/instagram] saveInitialToken falló:', err)
    return { success: false as const, error: 'No se pudo guardar el token. Probá de nuevo.' }
  }
}

// Curación manual del feed público: excluir/reincluir un post puntual sin tocar código.
export async function setPostExcluded(mediaId: string, excluded: boolean) {
  try {
    if (excluded) {
      await prisma.instagramExcludedPost.upsert({
        where: { mediaId },
        update: {},
        create: { mediaId },
      })
    } else {
      await prisma.instagramExcludedPost.deleteMany({ where: { mediaId } })
    }
    revalidateInstagramFeed()
    revalidatePath('/admin/instagram')
    return { success: true as const }
  } catch (err) {
    console.error('[admin/instagram] setPostExcluded falló:', err)
    return { success: false as const, error: 'No se pudo actualizar el post. Probá de nuevo.' }
  }
}
