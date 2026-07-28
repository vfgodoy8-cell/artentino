'use client'

import { useState } from 'react'
import { submitArrepentimiento } from '@/app/arrepentimiento/actions'

type Status = 'idle' | 'sending' | 'sent'

export default function ArrepentimientoForm() {
  const [orderNumber, setOrderNumber] = useState('')
  const [email, setEmail] = useState('')
  const [motivo, setMotivo] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('sending')
    setError(null)
    const result = await submitArrepentimiento({ orderNumber, email, motivo })
    if (!result.success) {
      setError(result.error ?? 'No pudimos procesar tu solicitud')
      setStatus('idle')
      return
    }
    setStatus('sent')
  }

  if (status === 'sent') {
    return (
      <div className="rounded-2xl border border-[#0eb1c3]/20 bg-[#f0fbfc] p-6 text-center text-sm font-semibold text-[#0eb1c3]">
        Solicitud recibida. Te vamos a contactar a la brevedad para coordinar la devolución.
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      {error && (
        <div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-500">
          {error}
        </div>
      )}

      <div className="mb-4">
        <label className="mb-1.5 block text-xs font-black uppercase tracking-wider text-gray-500">
          Número de orden
        </label>
        <input
          type="text"
          required
          value={orderNumber}
          onChange={(e) => setOrderNumber(e.target.value)}
          placeholder="Ej: 09CCCBA2"
          className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-[#1E1E1E] outline-none transition-colors focus:border-[#0eb1c3]"
        />
      </div>

      <div className="mb-4">
        <label className="mb-1.5 block text-xs font-black uppercase tracking-wider text-gray-500">
          Email de contacto
        </label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tu@email.com"
          className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-[#1E1E1E] outline-none transition-colors focus:border-[#0eb1c3]"
        />
      </div>

      <div className="mb-4">
        <label className="mb-1.5 block text-xs font-black uppercase tracking-wider text-gray-500">
          Motivo (opcional)
        </label>
        <textarea
          value={motivo}
          onChange={(e) => setMotivo(e.target.value)}
          rows={3}
          placeholder="Contanos brevemente el motivo (opcional)"
          className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-[#1E1E1E] outline-none transition-colors focus:border-[#0eb1c3]"
        />
      </div>

      <button
        type="submit"
        disabled={status === 'sending'}
        className="w-full rounded-xl py-3 text-sm font-black uppercase tracking-widest text-white transition-opacity disabled:opacity-60"
        style={{ backgroundColor: '#0eb1c3' }}
      >
        {status === 'sending' ? 'Enviando…' : 'Confirmar solicitud de arrepentimiento'}
      </button>
    </form>
  )
}
