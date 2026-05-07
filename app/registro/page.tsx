'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'

export default function RegistroPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setPending(true)

    const formData = new FormData(e.currentTarget)
    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const phone = formData.get('phone') as string
    const password = formData.get('password') as string

    try {
      const res = await fetch('/api/auth/registro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error ?? 'Ocurrió un error al crear la cuenta')
        return
      }

      const result = await signIn('credentials', { email, password, redirect: false })
      if (result?.error) {
        setError('Cuenta creada. Iniciá sesión.')
        router.push('/login')
        return
      }

      router.push('/')
      router.refresh()
    } finally {
      setPending(false)
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
            <p className="mt-1 text-sm font-semibold text-gray-400">Creá tu cuenta</p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-500">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-black uppercase tracking-wider text-gray-500">
                Nombre completo
              </label>
              <input
                name="name"
                type="text"
                required
                placeholder="Tu nombre"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-[#1E1E1E] outline-none transition-colors focus:border-[#0eb1c3]"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-black uppercase tracking-wider text-gray-500">
                Email
              </label>
              <input
                name="email"
                type="email"
                required
                placeholder="tu@email.com"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-[#1E1E1E] outline-none transition-colors focus:border-[#0eb1c3]"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-black uppercase tracking-wider text-gray-500">
                Teléfono
              </label>
              <input
                name="phone"
                type="tel"
                placeholder="+54 11 1234 5678"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-[#1E1E1E] outline-none transition-colors focus:border-[#0eb1c3]"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-black uppercase tracking-wider text-gray-500">
                Contraseña
              </label>
              <input
                name="password"
                type="password"
                required
                minLength={6}
                placeholder="Mínimo 6 caracteres"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-[#1E1E1E] outline-none transition-colors focus:border-[#0eb1c3]"
              />
            </div>

            <button
              type="submit"
              disabled={pending}
              className="mt-2 w-full rounded-2xl py-4 text-sm font-black uppercase tracking-widest text-white transition-opacity disabled:opacity-60"
              style={{ backgroundColor: '#0eb1c3' }}
            >
              {pending ? 'Creando cuenta...' : 'Crear cuenta'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-400">
            ¿Ya tenés cuenta?{' '}
            <Link href="/login" className="font-bold transition-colors hover:text-[#0eb1c3]" style={{ color: '#1E1E1E' }}>
              Iniciá sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
