'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { saveInitialToken } from './actions'

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('es-AR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

function daysUntil(iso: string) {
  const ms = new Date(iso).getTime() - Date.now()
  return Math.ceil(ms / (1000 * 60 * 60 * 24))
}

export default function InstagramClient({
  hasToken,
  expiresAt,
  updatedAt,
  igUserId,
}: {
  hasToken: boolean
  expiresAt: string | null
  updatedAt: string | null
  igUserId: string | null
}) {
  const [token, setToken] = useState('')
  const [error, setError] = useState('')
  const [pending, startTransition] = useTransition()
  const router = useRouter()

  function handleSave() {
    setError('')
    startTransition(async () => {
      const result = await saveInitialToken(token)
      if (!result.ok) {
        setError(result.error)
        return
      }
      setToken('')
      router.refresh()
    })
  }

  const days = expiresAt ? daysUntil(expiresAt) : null
  const statusColor =
    days === null ? '#9ca3af' : days < 0 ? '#ef4444' : days <= 10 ? '#f59e0b' : '#22c55e'
  const statusLabel =
    days === null
      ? 'Sin token cargado'
      : days < 0
        ? `Vencido hace ${Math.abs(days)} día${Math.abs(days) === 1 ? '' : 's'}`
        : `Vence en ${days} día${days === 1 ? '' : 's'}`

  return (
    <div className="max-w-xl space-y-8">
      {/* Estado actual */}
      <div className="rounded-2xl border border-gray-100 bg-white p-6">
        <p className="mb-3 text-xs font-black uppercase tracking-wider text-gray-400">
          Estado actual
        </p>
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: statusColor }} />
          <span className="text-sm font-bold text-[#1E1E1E]">{statusLabel}</span>
        </div>
        {hasToken && expiresAt && (
          <div className="mt-3 space-y-1 text-sm text-gray-500">
            <p>
              Expira el <span className="font-semibold text-[#1E1E1E]">{fmtDate(expiresAt)}</span>
            </p>
            {updatedAt && <p>Última actualización: {fmtDate(updatedAt)}</p>}
            {igUserId ? (
              <p>
                Instagram User ID: <span className="font-mono text-xs text-[#1E1E1E]">{igUserId}</span>
              </p>
            ) : (
              <p className="font-semibold text-amber-600">
                No se pudo resolver el Instagram User ID — el feed no va a poder traer publicaciones.
                Volvé a guardar el token.
              </p>
            )}
          </div>
        )}
        {!hasToken && (
          <p className="mt-3 text-sm text-gray-400">
            Todavía no hay ningún token guardado. Pegá uno abajo para activar el feed.
          </p>
        )}
      </div>

      {/* Formulario */}
      <div>
        <h2 className="mb-1 text-sm font-black uppercase tracking-wider text-gray-400">
          {hasToken ? 'Reemplazar token' : 'Cargar token inicial'}
        </h2>
        <p className="mb-3 text-xs text-gray-400">
          Pegá el access token de larga duración generado desde el Graph API Explorer de Meta.
          Se valida contra la API y se guarda junto con su fecha real de expiración.
        </p>
        <textarea
          value={token}
          onChange={(e) => setToken(e.target.value)}
          rows={3}
          placeholder="IGQVJ..."
          className="w-full rounded-xl border border-gray-200 px-4 py-3 font-mono text-xs text-[#1E1E1E] placeholder-gray-300 focus:border-[#0eb1c3] focus:outline-none"
        />
        {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
        <button
          onClick={handleSave}
          disabled={pending || !token.trim()}
          className="mt-3 rounded-xl px-5 py-2.5 text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          style={{ backgroundColor: '#0eb1c3' }}
        >
          {pending ? 'Validando...' : 'Guardar'}
        </button>
      </div>
    </div>
  )
}
