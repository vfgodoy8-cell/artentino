import { getInstagramToken } from '@/app/lib/instagram-token'
import InstagramClient from './instagram-client'

export default async function AdminInstagram() {
  const token = await getInstagramToken()

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-[#1E1E1E]">Instagram</h1>
        <p className="mt-1 text-sm text-gray-400">
          Access token de Instagram Graph API usado para traer el feed que se muestra en el sitio.
        </p>
      </div>
      <InstagramClient
        hasToken={!!token}
        expiresAt={token?.expiresAt.toISOString() ?? null}
        updatedAt={token?.updatedAt.toISOString() ?? null}
        igUserId={token?.igUserId ?? null}
      />
    </div>
  )
}
