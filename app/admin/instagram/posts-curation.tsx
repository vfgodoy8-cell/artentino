'use client'

import { useState, useTransition } from 'react'
import { setPostExcluded } from './actions'
import type { InstagramAdminPost } from '@/app/lib/instagram-media'

function fmtDate(iso: string | null) {
  if (!iso) return null
  return new Date(iso).toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' })
}

export default function PostsCuration({
  posts,
  initialExcludedIds,
  hasToken,
}: {
  posts: InstagramAdminPost[]
  initialExcludedIds: string[]
  hasToken: boolean
}) {
  const [excluded, setExcluded] = useState(new Set(initialExcludedIds))
  const [pendingId, setPendingId] = useState<string | null>(null)
  const [, startTransition] = useTransition()

  function handleToggle(mediaId: string) {
    const willExclude = !excluded.has(mediaId)
    setPendingId(mediaId)
    startTransition(async () => {
      await setPostExcluded(mediaId, willExclude)
      setExcluded((prev) => {
        const next = new Set(prev)
        if (willExclude) next.add(mediaId)
        else next.delete(mediaId)
        return next
      })
      setPendingId(null)
    })
  }

  return (
    <div>
      <h2 className="mb-1 text-sm font-black uppercase tracking-wider text-gray-400">
        Curar posts del feed público
      </h2>
      <p className="mb-4 text-xs text-gray-400">
        El feed de la home muestra automáticamente los últimos posts de Instagram. Ocultá acá
        los que no quieras mostrar (ej. fotos donde una persona queda muy expuesta) — el resto
        se completa solo con los siguientes posts disponibles.
      </p>

      {!hasToken ? (
        <div className="rounded-2xl border border-gray-100 bg-white py-16 text-center text-sm text-gray-400">
          Necesitás un token válido cargado arriba para poder traer los posts.
        </div>
      ) : posts.length === 0 ? (
        <div className="rounded-2xl border border-gray-100 bg-white py-16 text-center text-sm text-gray-400">
          No se pudieron traer posts de Instagram. Revisá el token o intentá de nuevo más tarde.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {posts.map((post) => {
            const isExcluded = excluded.has(post.id)
            const isPending = pendingId === post.id
            const date = fmtDate(post.timestamp)
            return (
              <div
                key={post.id}
                className="overflow-hidden rounded-2xl border border-gray-100 bg-white"
              >
                <div className="relative aspect-square bg-gray-100">
                  {post.url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={post.url}
                      alt={post.caption ?? 'Post de Instagram'}
                      className={`h-full w-full object-cover transition-opacity ${isExcluded ? 'opacity-40 grayscale' : ''}`}
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs text-gray-300">
                      Sin imagen
                    </div>
                  )}
                  {isExcluded && (
                    <span className="absolute left-2 top-2 rounded-full bg-[#1E1E1E]/80 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-white">
                      Oculto
                    </span>
                  )}
                </div>
                <div className="p-3">
                  {date && <p className="mb-1 text-[11px] text-gray-400">{date}</p>}
                  {post.caption && (
                    <p className="mb-2 line-clamp-2 text-xs text-gray-500">{post.caption}</p>
                  )}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggle(post.id)}
                      disabled={isPending}
                      className={`flex-1 rounded-lg px-3 py-1.5 text-xs font-bold transition-colors disabled:opacity-50 ${
                        isExcluded
                          ? 'bg-[#0eb1c3] text-white hover:opacity-90'
                          : 'bg-red-50 text-red-500 hover:bg-red-100'
                      }`}
                    >
                      {isPending ? '...' : isExcluded ? 'Mostrar' : 'Ocultar del sitio'}
                    </button>
                    <a
                      href={post.permalink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 rounded-lg px-2.5 py-1.5 text-xs font-bold text-gray-400 transition-colors hover:bg-gray-50 hover:text-gray-600"
                    >
                      Ver
                    </a>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
