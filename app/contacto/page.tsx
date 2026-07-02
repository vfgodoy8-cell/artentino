'use client'

import { useState } from 'react'
import Link from 'next/link'

type Form = {
  name: string
  email: string
  phone: string
  message: string
}

const INITIAL: Form = { name: '', email: '', phone: '', message: '' }

function inputCls(error?: string) {
  return `w-full rounded-xl border px-4 py-3 text-sm font-semibold text-[#1E1E1E] outline-none transition-colors ${
    error ? 'border-red-300 focus:border-red-400' : 'border-[#e5e7eb] focus:border-[#0eb1c3]'
  }`
}

function Field({
  label,
  error,
  children,
  className = '',
}: {
  label: string
  error?: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={className}>
      <label className="mb-1.5 block text-xs font-black uppercase tracking-wider text-[#9ca3af]">
        {label}
      </label>
      {children}
      {error && <p className="mt-1.5 text-xs font-semibold text-red-500">{error}</p>}
    </div>
  )
}

function Success({ onReset }: { onReset: () => void }) {
  return (
    <div className="flex flex-col items-center py-12 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#0eb1c3]">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
      <h3 className="mt-5 text-xl font-black text-[#1E1E1E]">¡Mensaje enviado!</h3>
      <p className="mt-2 max-w-xs text-sm text-[#6b7280]">
        Recibimos tu consulta. Nos comunicaremos con vos a la brevedad.
      </p>
      <button
        onClick={onReset}
        className="mt-6 text-sm font-black uppercase tracking-widest text-[#0eb1c3] transition-opacity hover:opacity-70"
      >
        Enviar otra consulta
      </button>
    </div>
  )
}

export default function ContactoPage() {
  const [form, setForm] = useState<Form>(INITIAL)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)

  function set(field: keyof Form, value: string) {
    setForm((f) => ({ ...f, [field]: value }))
    setErrors((e) => ({ ...e, [field]: '' }))
  }

  function validate() {
    const e: Record<string, string> = {}
    if (!form.name.trim()) e.name = 'Requerido'
    if (!form.email.trim()) e.email = 'Requerido'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Email inválido'
    if (!form.message.trim()) e.message = 'Requerido'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    setServerError(null)

    try {
      const res = await fetch('/api/contacto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form }),
      })
      const data = await res.json()
      if (!res.ok) {
        setServerError(data.error ?? 'Error al enviar. Intentá de nuevo.')
        return
      }
      setSubmitted(true)
    } catch {
      setServerError('Error de conexión. Intentá de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  function resetForm() {
    setForm(INITIAL)
    setErrors({})
    setServerError(null)
    setSubmitted(false)
  }

  return (
    <main className="min-h-screen bg-[#F7F7F7]">
      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">

        <div className="mb-8">
          <Link
            href="/"
            className="mb-4 inline-block text-sm font-semibold text-[#9ca3af] transition-colors hover:text-[#0eb1c3]"
          >
            ← Volver al inicio
          </Link>
          <h1 className="text-3xl font-black uppercase tracking-wide text-[#1E1E1E]">Contacto</h1>
          <p className="mt-2 text-sm text-[#6b7280]">
            ¿Tenés una consulta? Completá el formulario o contactanos por mail a{' '}
            <a
              href="mailto:info@artentino.com.ar"
              className="font-semibold text-[#0eb1c3] transition-opacity hover:opacity-70"
            >
              info@artentino.com.ar
            </a>
          </p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          {submitted ? (
            <Success onReset={resetForm} />
          ) : (
            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Field label="Nombre" error={errors.name} className="col-span-2 sm:col-span-1">
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => set('name', e.target.value)}
                    placeholder="Tu nombre"
                    className={inputCls(errors.name)}
                  />
                </Field>
                <Field label="Email" error={errors.email} className="col-span-2 sm:col-span-1">
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => set('email', e.target.value)}
                    placeholder="tu@email.com"
                    className={inputCls(errors.email)}
                  />
                </Field>
              </div>

              <Field label="Teléfono (opcional)">
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => set('phone', e.target.value)}
                  placeholder="+54 11 1234-5678"
                  className={inputCls()}
                />
              </Field>

              <Field label="Mensaje" error={errors.message}>
                <textarea
                  rows={5}
                  value={form.message}
                  onChange={(e) => set('message', e.target.value)}
                  placeholder="¿En qué podemos ayudarte?"
                  className={`${inputCls(errors.message)} resize-none`}
                />
              </Field>

              {serverError && (
                <div className="rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-500">
                  {serverError}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="mt-2 w-full rounded-2xl bg-[#0eb1c3] py-4 text-sm font-black uppercase tracking-widest text-white transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {loading ? 'Enviando...' : 'Enviar mensaje'}
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  )
}
