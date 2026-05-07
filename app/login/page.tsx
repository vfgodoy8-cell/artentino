'use client'

import Link from 'next/link'
import { useActionState } from 'react'
import { login } from '@/app/actions/auth'

export default function LoginPage() {
  const [state, action, pending] = useActionState(login, undefined)

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#F7F7F7]">
      <div className="w-full max-w-md px-4">
        <div className="rounded-3xl bg-white p-8 shadow-sm">

          {/* Logo */}
          <div className="mb-8 text-center">
            <p
              className="font-script text-3xl font-bold"
              style={{ color: '#2BBCB0', fontFamily: 'var(--font-script)' }}
            >
              Artentino
            </p>
            <p className="mt-1 text-sm font-semibold text-gray-400">Iniciá sesión en tu cuenta</p>
          </div>

          {/* Error */}
          {state?.error && (
            <div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-500">
              {state.error}
            </div>
          )}

          <form action={action} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-black uppercase tracking-wider text-gray-500">
                Email
              </label>
              <input
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="tu@email.com"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-[#1E1E1E] outline-none transition-colors focus:border-[#2BBCB0]"
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
                autoComplete="current-password"
                placeholder="••••••••"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-[#1E1E1E] outline-none transition-colors focus:border-[#2BBCB0]"
              />
            </div>

            <div className="text-right">
              <Link
                href="/recuperar-contrasena"
                className="text-xs font-semibold text-gray-400 transition-colors hover:text-[#2BBCB0]"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            <button
              type="submit"
              disabled={pending}
              className="mt-2 w-full rounded-2xl py-4 text-sm font-black uppercase tracking-widest text-white transition-opacity disabled:opacity-60"
              style={{ backgroundColor: '#2BBCB0' }}
            >
              {pending ? 'Ingresando...' : 'Ingresar'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-400">
            ¿No tenés cuenta?{' '}
            <Link href="/registro" className="font-bold transition-colors hover:text-[#2BBCB0]" style={{ color: '#1E1E1E' }}>
              Registrate
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
