'use client'

import Link from 'next/link'
import { Suspense, useState } from 'react'
import { useSearchParams } from 'next/navigation'

function RestablecerContrasenaForm() {
  const token = useSearchParams().get('token')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/auth/restablecer-contrasena', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? 'No se pudo restablecer la contraseña')
        return
      }
      setDone(true)
    } finally {
      setLoading(false)
    }
  }

  if (!token) {
    return (
      <div className="text-center">
        <h2 className="text-lg font-black text-[#1E1E1E]">Link inválido</h2>
        <p className="mt-2 text-sm text-gray-400">
          Este link no incluye un token válido. Pedí uno nuevo desde la pantalla de recuperación.
        </p>
        <Link
          href="/recuperar-contrasena"
          className="mt-6 inline-block text-sm font-bold transition-colors hover:text-[#0eb1c3]"
          style={{ color: '#1E1E1E' }}
        >
          ← Volver a recuperar contraseña
        </Link>
      </div>
    )
  }

  if (done) {
    return (
      <div className="text-center">
        <div
          className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full"
          style={{ backgroundColor: '#0eb1c3' }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h2 className="text-lg font-black text-[#1E1E1E]">¡Contraseña actualizada!</h2>
        <p className="mt-2 text-sm text-gray-400">Ya podés iniciar sesión con tu nueva contraseña.</p>
        <Link
          href="/login"
          className="mt-6 inline-block text-sm font-bold transition-colors hover:text-[#0eb1c3]"
          style={{ color: '#1E1E1E' }}
        >
          Ir al login
        </Link>
      </div>
    )
  }

  return (
    <>
      <p className="mb-6 text-sm text-gray-500">Ingresá tu nueva contraseña.</p>

      {error && (
        <div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-500">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1.5 block text-xs font-black uppercase tracking-wider text-gray-500">
            Nueva contraseña
          </label>
          <input
            type="password"
            required
            minLength={6}
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-[#1E1E1E] outline-none transition-colors focus:border-[#0eb1c3]"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-black uppercase tracking-wider text-gray-500">
            Confirmar contraseña
          </label>
          <input
            type="password"
            required
            minLength={6}
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-[#1E1E1E] outline-none transition-colors focus:border-[#0eb1c3]"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-2 w-full rounded-2xl py-4 text-sm font-black uppercase tracking-widest text-white disabled:opacity-60"
          style={{ backgroundColor: '#0eb1c3' }}
        >
          {loading ? 'Guardando…' : 'Restablecer contraseña'}
        </button>
      </form>
    </>
  )
}

export default function RestablecerContrasenaPage() {
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
            <p className="mt-1 text-sm font-semibold text-gray-400">Restablecé tu contraseña</p>
          </div>

          <Suspense fallback={null}>
            <RestablecerContrasenaForm />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
