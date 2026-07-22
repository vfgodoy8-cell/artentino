'use client'

import { useState } from 'react'

type Status = 'idle' | 'open' | 'sending' | 'sent' | 'error'

export default function ArrepentimientoForm({ orderId }: { orderId: string }) {
  const [status, setStatus] = useState<Status>('idle')
  const [motivo, setMotivo] = useState('')
  const [error, setError] = useState<string | null>(null)

  async function handleConfirm() {
    setStatus('sending')
    setError(null)
    try {
      const res = await fetch('/api/arrepentimiento', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, motivo }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? 'No se pudo enviar la solicitud')
        setStatus('open')
        return
      }
      setStatus('sent')
    } catch {
      setError('No se pudo enviar la solicitud')
      setStatus('open')
    }
  }

  if (status === 'sent') {
    return (
      <div className="rounded-2xl border border-[#0eb1c3]/20 bg-[#f0fbfc] p-5 text-sm font-semibold text-[#0eb1c3]">
        Solicitud recibida. Te vamos a contactar a la brevedad para coordinar la devolución.
      </div>
    )
  }

  if (status === 'idle') {
    return (
      <button
        onClick={() => setStatus('open')}
        className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-bold text-gray-600 transition-colors hover:border-[#0eb1c3] hover:text-[#0eb1c3]"
      >
        Arrepentirme de esta compra
      </button>
    )
  }

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <h3 className="mb-2 font-black text-[#1E1E1E]">Botón de Arrepentimiento</h3>
      <p className="mb-4 text-sm leading-relaxed text-gray-600">
        De acuerdo a la Resolución 424/2020, tenés derecho a revocar tu compra dentro de los 10
        días corridos desde que recibiste el pedido, sin necesidad de indicar motivo ni costo
        alguno. Completá este formulario y nuestro equipo se va a poner en contacto para coordinar
        la devolución.
      </p>

      {error && (
        <div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-500">
          {error}
        </div>
      )}

      <div className="mb-4">
        <label className="mb-1.5 block text-xs font-black uppercase tracking-wider text-gray-500">
          Pedido
        </label>
        <p className="text-sm font-bold text-[#1E1E1E]">#{orderId.slice(-8).toUpperCase()}</p>
      </div>

      <div className="mb-4">
        <label className="mb-1.5 block text-xs font-black uppercase tracking-wider text-gray-500">
          Motivo (opcional)
        </label>
        <textarea
          value={motivo}
          onChange={(e) => setMotivo(e.target.value)}
          placeholder="Contanos brevemente el motivo (opcional)"
          rows={3}
          className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-[#1E1E1E] outline-none transition-colors focus:border-[#0eb1c3]"
        />
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => setStatus('idle')}
          disabled={status === 'sending'}
          className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-bold text-gray-600 transition-colors hover:border-gray-300 disabled:opacity-60"
        >
          Cancelar
        </button>
        <button
          onClick={handleConfirm}
          disabled={status === 'sending'}
          className="flex-1 rounded-xl py-2.5 text-sm font-black uppercase tracking-widest text-white transition-opacity disabled:opacity-60"
          style={{ backgroundColor: '#0eb1c3' }}
        >
          {status === 'sending' ? 'Enviando…' : 'Confirmar solicitud de arrepentimiento'}
        </button>
      </div>

      <p className="mt-3 text-xs leading-relaxed text-gray-400">
        Al confirmar, iniciás el proceso de revocación de compra según la Resolución 424/2020.
        Nuestro equipo te va a contactar por email para coordinar la devolución del producto y el
        reintegro.
      </p>
    </div>
  )
}
