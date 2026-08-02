'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { retryZipnovaShipment } from '../actions'

type Props = {
  orderId: string
  zipnovaShipmentId: number | null
  zipnovaShipmentStatus: string | null
  zipnovaShipmentError: string | null
}

export default function ZipnovaShipmentBlock({
  orderId,
  zipnovaShipmentId,
  zipnovaShipmentStatus,
  zipnovaShipmentError,
}: Props) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()

  function handleRetry() {
    startTransition(async () => {
      await retryZipnovaShipment(orderId)
      router.refresh()
    })
  }

  return (
    <div className="rounded-2xl border border-gray-100 bg-white px-5 py-4">
      <p className="mb-3 text-[10px] font-black uppercase tracking-wider text-gray-400">Envío Zipnova</p>

      {zipnovaShipmentId ? (
        <>
          <p className="font-semibold text-[#1E1E1E]">ID de envío: {zipnovaShipmentId}</p>
          {zipnovaShipmentStatus && (
            <p className="text-sm text-gray-500">Estado: {zipnovaShipmentStatus}</p>
          )}
          <a
            href={`/api/admin/pedidos/${orderId}/zipnova-label`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-block rounded-xl px-4 py-2 text-xs font-black uppercase tracking-widest text-white transition-opacity hover:opacity-85"
            style={{ backgroundColor: '#0eb1c3' }}
          >
            Descargar etiqueta
          </a>
        </>
      ) : zipnovaShipmentError ? (
        <>
          <p className="text-sm font-semibold text-red-500">{zipnovaShipmentError}</p>
          <button
            onClick={handleRetry}
            disabled={pending}
            className="mt-3 rounded-xl border border-gray-200 px-4 py-2 text-xs font-black uppercase tracking-widest text-[#1E1E1E] transition-colors hover:border-[#0eb1c3] hover:text-[#0eb1c3] disabled:opacity-50"
          >
            {pending ? 'Reintentando…' : 'Reintentar creación de envío'}
          </button>
        </>
      ) : (
        <p className="text-sm text-gray-400">Todavía no se generó el envío.</p>
      )}
    </div>
  )
}
