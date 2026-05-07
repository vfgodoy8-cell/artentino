'use client'

import { useState } from 'react'
import Link from 'next/link'

type Tab = 'GENERAL' | 'JOB'

type GeneralForm = {
  name: string
  email: string
  phone: string
  message: string
}

type JobForm = {
  name: string
  email: string
  phone: string
  position: string
  message: string
}

const INITIAL_GENERAL: GeneralForm = { name: '', email: '', phone: '', message: '' }
const INITIAL_JOB: JobForm = { name: '', email: '', phone: '', position: '', message: '' }

function inputCls(error?: string) {
  return `w-full rounded-xl border px-4 py-3 text-sm font-semibold text-[#1E1E1E] outline-none transition-colors ${
    error ? 'border-red-300 focus:border-red-400' : 'border-gray-200 focus:border-[#2BBCB0]'
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
      <label className="mb-1.5 block text-xs font-black uppercase tracking-wider text-gray-500">
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
      <div
        className="flex h-14 w-14 items-center justify-center rounded-full"
        style={{ backgroundColor: '#2BBCB0' }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
      <h3 className="mt-5 text-xl font-black text-[#1E1E1E]">¡Mensaje enviado!</h3>
      <p className="mt-2 max-w-xs text-sm text-gray-500">
        Recibimos tu consulta. Nos comunicaremos con vos a la brevedad.
      </p>
      <button
        onClick={onReset}
        className="mt-6 text-sm font-black uppercase tracking-widest transition-colors hover:opacity-70"
        style={{ color: '#2BBCB0' }}
      >
        Enviar otra consulta
      </button>
    </div>
  )
}

export default function ContactoPage() {
  const [tab, setTab] = useState<Tab>('GENERAL')
  const [general, setGeneral] = useState<GeneralForm>(INITIAL_GENERAL)
  const [job, setJob] = useState<JobForm>(INITIAL_JOB)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)

  function resetForm() {
    setGeneral(INITIAL_GENERAL)
    setJob(INITIAL_JOB)
    setErrors({})
    setServerError(null)
    setSubmitted(false)
  }

  function validateGeneral() {
    const e: Record<string, string> = {}
    if (!general.name.trim()) e.name = 'Requerido'
    if (!general.email.trim()) e.email = 'Requerido'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(general.email)) e.email = 'Email inválido'
    if (!general.message.trim()) e.message = 'Requerido'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function validateJob() {
    const e: Record<string, string> = {}
    if (!job.name.trim()) e.name = 'Requerido'
    if (!job.email.trim()) e.email = 'Requerido'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(job.email)) e.email = 'Email inválido'
    if (!job.position.trim()) e.position = 'Requerido'
    if (!job.message.trim()) e.message = 'Requerido'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const valid = tab === 'GENERAL' ? validateGeneral() : validateJob()
    if (!valid) return

    setLoading(true)
    setServerError(null)

    const payload =
      tab === 'GENERAL'
        ? { type: 'GENERAL', ...general }
        : { type: 'JOB', ...job }

    try {
      const res = await fetch('/api/contacto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
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

  function switchTab(next: Tab) {
    setTab(next)
    setErrors({})
    setServerError(null)
    setSubmitted(false)
  }

  return (
    <main className="min-h-screen bg-[#F7F7F7]">
      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">

        <div className="mb-8">
          <Link href="/" className="mb-4 inline-block text-sm font-semibold text-gray-400 transition-colors hover:text-[#2BBCB0]">
            ← Volver al inicio
          </Link>
          <h1 className="text-3xl font-black uppercase tracking-wide text-[#1E1E1E]">Contacto</h1>
          <p className="mt-2 text-sm text-gray-500">¿Tenés una consulta o querés trabajar con nosotros?</p>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex rounded-2xl bg-white p-1.5 shadow-sm">
          <button
            type="button"
            onClick={() => switchTab('GENERAL')}
            className={`flex-1 rounded-xl py-3 text-sm font-black uppercase tracking-wider transition-colors ${
              tab === 'GENERAL' ? 'text-white' : 'text-gray-400 hover:text-gray-600'
            }`}
            style={tab === 'GENERAL' ? { backgroundColor: '#2BBCB0' } : {}}
          >
            Consulta general
          </button>
          <button
            type="button"
            onClick={() => switchTab('JOB')}
            className={`flex-1 rounded-xl py-3 text-sm font-black uppercase tracking-wider transition-colors ${
              tab === 'JOB' ? 'text-white' : 'text-gray-400 hover:text-gray-600'
            }`}
            style={tab === 'JOB' ? { backgroundColor: '#2BBCB0' } : {}}
          >
            Postulación laboral
          </button>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          {submitted ? (
            <Success onReset={resetForm} />
          ) : (
            <form onSubmit={handleSubmit} noValidate className="space-y-4">

              {tab === 'GENERAL' && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Nombre" error={errors.name} className="col-span-2 sm:col-span-1">
                      <input
                        type="text"
                        value={general.name}
                        onChange={(e) => {
                          setGeneral({ ...general, name: e.target.value })
                          setErrors({ ...errors, name: '' })
                        }}
                        placeholder="Tu nombre"
                        className={inputCls(errors.name)}
                      />
                    </Field>
                    <Field label="Email" error={errors.email} className="col-span-2 sm:col-span-1">
                      <input
                        type="email"
                        value={general.email}
                        onChange={(e) => {
                          setGeneral({ ...general, email: e.target.value })
                          setErrors({ ...errors, email: '' })
                        }}
                        placeholder="tu@email.com"
                        className={inputCls(errors.email)}
                      />
                    </Field>
                  </div>
                  <Field label="Teléfono (opcional)">
                    <input
                      type="tel"
                      value={general.phone}
                      onChange={(e) => setGeneral({ ...general, phone: e.target.value })}
                      placeholder="+54 11 1234-5678"
                      className={inputCls()}
                    />
                  </Field>
                  <Field label="Mensaje" error={errors.message}>
                    <textarea
                      rows={5}
                      value={general.message}
                      onChange={(e) => {
                        setGeneral({ ...general, message: e.target.value })
                        setErrors({ ...errors, message: '' })
                      }}
                      placeholder="¿En qué podemos ayudarte?"
                      className={`${inputCls(errors.message)} resize-none`}
                    />
                  </Field>
                </>
              )}

              {tab === 'JOB' && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Nombre" error={errors.name} className="col-span-2 sm:col-span-1">
                      <input
                        type="text"
                        value={job.name}
                        onChange={(e) => {
                          setJob({ ...job, name: e.target.value })
                          setErrors({ ...errors, name: '' })
                        }}
                        placeholder="Tu nombre"
                        className={inputCls(errors.name)}
                      />
                    </Field>
                    <Field label="Email" error={errors.email} className="col-span-2 sm:col-span-1">
                      <input
                        type="email"
                        value={job.email}
                        onChange={(e) => {
                          setJob({ ...job, email: e.target.value })
                          setErrors({ ...errors, email: '' })
                        }}
                        placeholder="tu@email.com"
                        className={inputCls(errors.email)}
                      />
                    </Field>
                  </div>
                  <Field label="Teléfono (opcional)">
                    <input
                      type="tel"
                      value={job.phone}
                      onChange={(e) => setJob({ ...job, phone: e.target.value })}
                      placeholder="+54 11 1234-5678"
                      className={inputCls()}
                    />
                  </Field>
                  <Field label="Puesto al que te postulás" error={errors.position}>
                    <input
                      type="text"
                      value={job.position}
                      onChange={(e) => {
                        setJob({ ...job, position: e.target.value })
                        setErrors({ ...errors, position: '' })
                      }}
                      placeholder="Ej: Vendedor/a, Diseñador/a..."
                      className={inputCls(errors.position)}
                    />
                  </Field>
                  <Field label="Presentación / Mensaje" error={errors.message}>
                    <textarea
                      rows={5}
                      value={job.message}
                      onChange={(e) => {
                        setJob({ ...job, message: e.target.value })
                        setErrors({ ...errors, message: '' })
                      }}
                      placeholder="Contanos sobre vos y tu experiencia..."
                      className={`${inputCls(errors.message)} resize-none`}
                    />
                  </Field>
                </>
              )}

              {serverError && (
                <div className="rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-500">
                  {serverError}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="mt-2 w-full rounded-2xl py-4 text-sm font-black uppercase tracking-widest text-white transition-opacity disabled:opacity-50 hover:opacity-85"
                style={{ backgroundColor: '#2BBCB0' }}
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
