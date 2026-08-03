'use client'

import { useActionState, useEffect, useRef } from 'react'
import { changePassword } from '@/app/actions/perfil'

export default function PasswordForm() {
  const [state, action, pending] = useActionState(changePassword, undefined)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (state?.success) {
      formRef.current?.reset()
    }
  }, [state])

  return (
    <form ref={formRef} action={action} className="space-y-4">
      {state?.success && (
        <div className="rounded-xl bg-green-50 px-4 py-3 text-sm font-semibold text-green-600">
          Contraseña actualizada correctamente.
        </div>
      )}
      {state?.success === false && (
        <div className="rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-500">
          {state.error}
        </div>
      )}

      <div>
        <label className="mb-1.5 block text-xs font-black uppercase tracking-wider text-gray-500">
          Contraseña actual
        </label>
        <input
          name="currentPassword"
          type="password"
          required
          autoComplete="current-password"
          className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-[#1E1E1E] outline-none transition-colors focus:border-[#0eb1c3]"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-black uppercase tracking-wider text-gray-500">
          Nueva contraseña
        </label>
        <input
          name="newPassword"
          type="password"
          required
          minLength={6}
          autoComplete="new-password"
          placeholder="Mínimo 6 caracteres"
          className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-[#1E1E1E] outline-none transition-colors focus:border-[#0eb1c3]"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-black uppercase tracking-wider text-gray-500">
          Confirmar nueva contraseña
        </label>
        <input
          name="confirmPassword"
          type="password"
          required
          minLength={6}
          autoComplete="new-password"
          className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-[#1E1E1E] outline-none transition-colors focus:border-[#0eb1c3]"
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="mt-2 w-full rounded-2xl py-4 text-sm font-black uppercase tracking-widest text-white transition-opacity disabled:opacity-60"
        style={{ backgroundColor: '#0eb1c3' }}
      >
        {pending ? 'Guardando...' : 'Cambiar contraseña'}
      </button>
    </form>
  )
}
