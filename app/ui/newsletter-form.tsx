'use client'

import { useState, type FormEvent } from 'react'
import { subscribeNewsletter } from './newsletter-actions'

type Status = 'idle' | 'loading' | 'success' | 'error'

export default function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState('')

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setStatus('loading')
    setError('')

    const result = await subscribeNewsletter(email)

    if (!result.success) {
      setStatus('error')
      setError(result.error)
      return
    }

    setStatus('success')
    setEmail('')
  }

  if (status === 'success') {
    return (
      <p className="mt-6 text-sm font-bold text-[#0eb1c3]">¡Listo! Ya estás suscripto.</p>
    )
  }

  return (
    <div className="mx-auto mt-6 max-w-sm">
      <p className="mb-3 text-xs font-black uppercase tracking-widest text-[#9ca3af]">
        Sumate a nuestro newsletter
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2 sm:flex-row">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tu@email.com"
          className="w-full flex-1 rounded-full border border-[#0eb1c3] px-5 py-3 text-sm text-[#1E1E1E] outline-none focus:ring-2 focus:ring-[#0eb1c3]/20"
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="shrink-0 rounded-full bg-[#0eb1c3] px-6 py-3 text-sm font-bold text-white transition-colors hover:opacity-90 disabled:opacity-60"
        >
          {status === 'loading' ? 'Enviando...' : 'Suscribirme'}
        </button>
      </form>
      {status === 'error' && (
        <p className="mt-2 text-xs font-semibold text-red-500">{error}</p>
      )}
    </div>
  )
}
