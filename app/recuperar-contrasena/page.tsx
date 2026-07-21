'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function RecuperarContrasenaPage() {
  const [sent, setSent] = useState(false)
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    try {
      await fetch('/api/auth/recuperar-contrasena', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
    } finally {
      setLoading(false)
      setSent(true)
    }
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#F7F7F7]">
      <div className="w-full max-w-md px-4">
        <div className="rounded-3xl bg-white p-8 shadow-sm">

          {/* Logo */}
          <div className="mb-8 text-center">
            <p
              className="font-script text-3xl font-bold"
              style={{ color: '#0eb1c3', fontFamily: 'var(--font-script)' }}
            >
              Artentino
            </p>
            <p className="mt-1 text-sm font-semibold text-gray-400">Recuperá tu contraseña</p>
          </div>

          {sent ? (
            <div className="text-center">
              <div
                className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full"
                style={{ backgroundColor: '#0eb1c3' }}
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h2 className="text-lg font-black text-[#1E1E1E]">¡Revisá tu casilla!</h2>
              <p className="mt-2 text-sm text-gray-400">
                Si <span className="font-bold text-[#1E1E1E]">{email}</span> está registrado, recibirás un link para restablecer tu contraseña.
              </p>
              <Link
                href="/login"
                className="mt-6 inline-block text-sm font-bold transition-colors hover:text-[#0eb1c3]"
                style={{ color: '#1E1E1E' }}
              >
                ← Volver al login
              </Link>
            </div>
          ) : (
            <>
              <p className="mb-6 text-sm text-gray-500">
                Ingresá tu email y te enviaremos un link para recuperar tu contraseña.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-xs font-black uppercase tracking-wider text-gray-500">
                    Email
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

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-2 w-full rounded-2xl py-4 text-sm font-black uppercase tracking-widest text-white disabled:opacity-60"
                  style={{ backgroundColor: '#0eb1c3' }}
                >
                  {loading ? 'Enviando…' : 'Enviar link'}
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-gray-400">
                ¿Recordaste tu contraseña?{' '}
                <Link href="/login" className="font-bold transition-colors hover:text-[#0eb1c3]" style={{ color: '#1E1E1E' }}>
                  Iniciá sesión
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
