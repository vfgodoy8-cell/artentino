import { prisma } from '@/lib/prisma'
import { getInstagramToken, isTokenValid } from '@/app/lib/instagram-token'
import { getInstagramPostsForAdmin } from '@/app/lib/instagram-media'
import InstagramClient from './instagram-client'
import PostsCuration from './posts-curation'

export const dynamic = 'force-dynamic'

export default async function AdminInstagram() {
  const token = await getInstagramToken()
  const hasToken = isTokenValid(token)

  const [posts, excludedRows] = hasToken
    ? await Promise.all([
        getInstagramPostsForAdmin(24),
        prisma.instagramExcludedPost.findMany({ select: { mediaId: true } }),
      ])
    : [[], []]

  const excludedIds = excludedRows.map((r) => r.mediaId)

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-[#1E1E1E]">Instagram</h1>
        <p className="mt-1 text-sm text-gray-400">
          Access token de Instagram Graph API usado para traer el feed que se muestra en el sitio.
        </p>
      </div>

      <div className="space-y-12">
        <InstagramClient
          hasToken={!!token}
          expiresAt={token?.expiresAt.toISOString() ?? null}
          updatedAt={token?.updatedAt.toISOString() ?? null}
          igUserId={token?.igUserId ?? null}
        />

        <div className="border-t border-gray-100" />

        <PostsCuration posts={posts} initialExcludedIds={excludedIds} hasToken={hasToken} />
      </div>
    </div>
  )
}
