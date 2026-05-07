'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const ALL_SLOTS = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00']

function getMinDate() {
  return new Date().toISOString().split('T')[0]
}

function isWeekend(dateStr: string) {
  const d = new Date(dateStr + 'T00:00:00')
  return d.getDay() === 0 || d.getDay() === 6
}

function formatDateLabel(dateStr: string) {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('es-AR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

type Modality = 'PRESENCIAL' | 'WHATSAPP'

type FormData = {
  name: string
  surname: string
  email: string
  phone: string
  modality: Modality
  date: string
  time: string
}

const INITIAL: FormData = {
  name: '',
  surname: '',
  email: '',
  phone: '',
  modality: 'PRESENCIAL',
  date: '',
  time: '',
}

export default function TurnosPage() {
  const [form, setForm] = useState<FormData>(INITIAL)
  const [availableSlots, setAvailableSlots] = useState<string[]>([])
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({})
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  useEffect(() => {
    if (!form.date) {
      setAvailableSlots([])
      return
    }
    if (isWeekend(form.date)) {
      setAvailableSlots([])
      return
    }
    setLoadingSlots(true)
    setForm((f) => ({ ...f, time: '' }))
    fetch(`/api/turnos/disponibles?date=${form.date}`)
      .then((r) => r.json())
      .then((data) => setAvailableSlots(data.available ?? []))
      .finally(() => setLoadingSlots(false))
  }, [form.date])

  function set(field: keyof FormData, value: string) {
    setForm((f) => ({ ...f, [field]: value }))
    setErrors((e) => ({ ...e, [field]: undefined }))
  }

  function validate() {
    const e: Partial<Record<keyof FormData, string>> = {}
    if (!form.name.trim()) e.name = 'Requerido'
    if (!form.surname.trim()) e.surname = 'Requerido'
    if (!form.email.trim()) e.email = 'Requerido'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Email inválido'
    if (!form.phone.trim()) e.phone = 'Requerido'
    if (!form.date) e.date = 'Elegí una fecha'
    else if (isWeekend(form.date)) e.date = 'Solo días hábiles (lunes a viernes)'
    if (!form.time) e.time = 'Elegí un horario'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    setServerError(null)
    try {
      const res = await fetch('/api/turnos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) {
        setServerError(data.error ?? 'Error al reservar. Intentá de nuevo.')
        return
      }
      setSubmitted(true)
    } catch {
      setServerError('Error de conexión. Intentá de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <main className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full" style={{ backgroundColor: '#2BBCB0' }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h1 className="mt-6 text-2xl font-black text-[#1E1E1E]">¡Turno reservado!</h1>
        <p className="mt-2 max-w-sm text-gray-500">
          Te confirmamos el turno para el{' '}
          <strong className="text-[#1E1E1E]">{formatDateLabel(form.date)}</strong> a las{' '}
          <strong className="text-[#1E1E1E]">{form.time} hs</strong>. Revisá tu casilla de email.
        </p>
        <Link
          href="/"
          className="mt-8 inline-block rounded-2xl px-8 py-4 text-sm font-black uppercase tracking-widest text-white transition-opacity hover:opacity-85"
          style={{ backgroundColor: '#2BBCB0' }}
        >
          Volver al inicio
        </Link>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#F7F7F7]">
      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">

        <div className="mb-8">
          <Link href="/" className="mb-4 inline-block text-sm font-semibold text-gray-400 transition-colors hover:text-[#2BBCB0]">
            ← Volver al inicio
          </Link>
          <h1 className="text-3xl font-black uppercase tracking-wide text-[#1E1E1E]">Reservar turno</h1>
          <p className="mt-2 text-sm text-gray-500">
            Agendá una consulta personalizada con nuestro equipo.
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-6">

          {/* Datos personales */}
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-xs font-black uppercase tracking-wider text-gray-400">Tus datos</h2>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Nombre" error={errors.name}>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => set('name', e.target.value)}
                  placeholder="María"
                  className={inputCls(errors.name)}
                />
              </Field>
              <Field label="Apellido" error={errors.surname}>
                <input
                  type="text"
                  value={form.surname}
                  onChange={(e) => set('surname', e.target.value)}
                  placeholder="García"
                  className={inputCls(errors.surname)}
                />
              </Field>
              <Field label="Email" error={errors.email} className="col-span-2">
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => set('email', e.target.value)}
                  placeholder="maria@ejemplo.com"
                  className={inputCls(errors.email)}
                />
              </Field>
              <Field label="Teléfono" error={errors.phone} className="col-span-2">
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => set('phone', e.target.value)}
                  placeholder="+54 11 1234-5678"
                  className={inputCls(errors.phone)}
                />
              </Field>
            </div>
          </div>

          {/* Modalidad */}
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-xs font-black uppercase tracking-wider text-gray-400">Modalidad</h2>
            <div className="space-y-3">
              {(
                [
                  { value: 'PRESENCIAL', label: 'Presencial', desc: 'En nuestro showroom — Colegiales, CABA' },
                  { value: 'WHATSAPP', label: 'WhatsApp por cámara', desc: 'Videollamada desde donde estés' },
                ] as const
              ).map((opt) => (
                <label
                  key={opt.value}
                  className={`flex cursor-pointer items-center gap-4 rounded-2xl border-2 p-4 transition-colors ${
                    form.modality === opt.value
                      ? 'border-[#2BBCB0] bg-[#2BBCB0]/5'
                      : 'border-gray-100 hover:border-gray-200'
                  }`}
                >
                  <input
                    type="radio"
                    name="modality"
                    value={opt.value}
                    checked={form.modality === opt.value}
                    onChange={() => set('modality', opt.value)}
                    className="accent-[#2BBCB0]"
                  />
                  <div>
                    <p className="font-black text-[#1E1E1E]">{opt.label}</p>
                    <p className="text-sm text-gray-500">{opt.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Fecha y horario */}
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-xs font-black uppercase tracking-wider text-gray-400">Fecha y horario</h2>

            <Field label="Fecha" error={errors.date}>
              <input
                type="date"
                min={getMinDate()}
                value={form.date}
                onChange={(e) => {
                  const val = e.target.value
                  if (isWeekend(val)) {
                    setErrors((prev) => ({ ...prev, date: 'Solo podés reservar de lunes a viernes' }))
                    setForm((f) => ({ ...f, date: val, time: '' }))
                    setAvailableSlots([])
                  } else {
                    set('date', val)
                  }
                }}
                className={inputCls(errors.date)}
              />
            </Field>

            <div className="mt-5">
              <label className="mb-3 block text-xs font-black uppercase tracking-wider text-gray-500">
                Horario disponible
              </label>
              {!form.date && (
                <p className="text-sm text-gray-400">Primero elegí una fecha.</p>
              )}
              {form.date && !isWeekend(form.date) && loadingSlots && (
                <p className="text-sm text-gray-400">Cargando horarios...</p>
              )}
              {form.date && !isWeekend(form.date) && !loadingSlots && availableSlots.length === 0 && (
                <p className="text-sm text-gray-500">No hay horarios disponibles para esta fecha. Probá con otro día.</p>
              )}
              {form.date && !isWeekend(form.date) && !loadingSlots && availableSlots.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {ALL_SLOTS.map((slot) => {
                    const available = availableSlots.includes(slot)
                    return (
                      <button
                        key={slot}
                        type="button"
                        disabled={!available}
                        onClick={() => available && set('time', slot)}
                        className={`rounded-xl border-2 px-4 py-2.5 text-sm font-black transition-colors ${
                          form.time === slot
                            ? 'border-[#2BBCB0] bg-[#2BBCB0] text-white'
                            : available
                            ? 'border-gray-200 text-[#1E1E1E] hover:border-[#2BBCB0] hover:text-[#2BBCB0]'
                            : 'cursor-not-allowed border-gray-100 text-gray-300 line-through'
                        }`}
                      >
                        {slot}
                      </button>
                    )
                  })}
                </div>
              )}
              {errors.time && (
                <p className="mt-2 text-xs font-semibold text-red-500">{errors.time}</p>
              )}
            </div>
          </div>

          {serverError && (
            <div className="rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-500">
              {serverError}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl py-4 text-sm font-black uppercase tracking-widest text-white transition-opacity disabled:opacity-50 hover:opacity-85"
            style={{ backgroundColor: '#2BBCB0' }}
          >
            {loading ? 'Reservando...' : 'Confirmar turno'}
          </button>
        </form>
      </div>
    </main>
  )
}

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
