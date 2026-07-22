'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { updateExpressLocalities, updateShippingToggle } from './actions'

type Props = {
  initialLocalities: string[]
  initialExpressEnabled: boolean
  initialZipnovaEnabled: boolean
  mockMode: boolean
}

export default function ExtensionClient({
  initialLocalities,
  initialExpressEnabled,
  initialZipnovaEnabled,
  mockMode,
}: Props) {
  const router = useRouter()
  const [localities, setLocalities] = useState(initialLocalities)
  const [newLocality, setNewLocality] = useState('')
  const [expressEnabled, setExpressEnabled] = useState(initialExpressEnabled)
  const [zipnovaEnabled, setZipnovaEnabled] = useState(initialZipnovaEnabled)
  const [, startTransition] = useTransition()

  function persistLocalities(next: string[]) {
    setLocalities(next)
    startTransition(async () => {
      await updateExpressLocalities(next)
      router.refresh()
    })
  }

  function handleAddLocality() {
    const value = newLocality.trim()
    if (!value || localities.some((l) => l.toLowerCase() === value.toLowerCase())) return
    persistLocalities([...localities, value])
    setNewLocality('')
  }

  function handleRemoveLocality(value: string) {
    persistLocalities(localities.filter((l) => l !== value))
  }

  function handleToggle(field: 'expressShippingEnabled' | 'zipnovaShippingEnabled', value: boolean) {
    if (field === 'expressShippingEnabled') setExpressEnabled(value)
    else setZipnovaEnabled(value)
    startTransition(async () => {
      await updateShippingToggle(field, value)
      router.refresh()
    })
  }

  return (
    <div className="max-w-3xl space-y-6">

      {/* Métodos de envío */}
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xs font-black uppercase tracking-wider text-gray-400">Métodos de envío</h2>
        <div className="space-y-3">
          <ToggleRow
            label="Envío Express (Artentino)"
            description="Gestión interna, disponible solo en localidades de la zona Express"
            enabled={expressEnabled}
            onChange={(v) => handleToggle('expressShippingEnabled', v)}
          />
          <ToggleRow
            label="Envío Zipnova"
            description="Gestionado por la API de Zipnova — siempre disponible como opción de fallback"
            enabled={zipnovaEnabled}
            onChange={(v) => handleToggle('zipnovaShippingEnabled', v)}
          />
        </div>
      </div>

      {/* Localidades Express */}
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="mb-1 text-xs font-black uppercase tracking-wider text-gray-400">Localidades Express</h2>
        <p className="mb-4 text-sm text-gray-500">
          Solo estas localidades ven la opción de Envío Express en el checkout. El resto del país cotiza únicamente con Zipnova.
        </p>

        <div className="mb-4 flex flex-wrap gap-2">
          {localities.length === 0 ? (
            <p className="text-sm text-gray-400">No hay localidades cargadas todavía.</p>
          ) : (
            localities.map((locality) => (
              <span
                key={locality}
                className="inline-flex items-center gap-2 rounded-full bg-[#0eb1c3]/10 px-3 py-1.5 text-sm font-semibold text-[#0eb1c3]"
              >
                {locality}
                <button
                  onClick={() => handleRemoveLocality(locality)}
                  aria-label={`Quitar ${locality}`}
                  className="text-[#0eb1c3] transition-colors hover:text-red-500"
                >
                  ×
                </button>
              </span>
            ))
          )}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={newLocality}
            onChange={(e) => setNewLocality(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddLocality() } }}
            placeholder="Agregar localidad (ej: Pilar)"
            className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-[#1E1E1E] outline-none transition-colors focus:border-[#0eb1c3]"
          />
          <button
            onClick={handleAddLocality}
            disabled={!newLocality.trim()}
            className="rounded-xl px-5 py-2.5 text-sm font-black uppercase tracking-widest text-white transition-opacity disabled:opacity-40"
            style={{ backgroundColor: '#0eb1c3' }}
          >
            Agregar
          </button>
        </div>
      </div>

      {/* Estado de integración */}
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xs font-black uppercase tracking-wider text-gray-400">Estado de la integración</h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold text-[#1E1E1E]">Modo Zipnova</p>
            <p className="text-sm text-gray-500">
              Definido por <code className="rounded bg-gray-100 px-1.5 py-0.5 text-xs">ZIPNOVA_MOCK_MODE</code> en el servidor — solo lectura.
            </p>
          </div>
          <span
            className={`rounded-full px-3 py-1 text-xs font-black uppercase tracking-wider ${
              mockMode ? 'bg-amber-100 text-amber-600' : 'bg-green-100 text-green-600'
            }`}
          >
            {mockMode ? 'Mock' : 'Producción'}
          </span>
        </div>
      </div>
    </div>
  )
}

function ToggleRow({
  label,
  description,
  enabled,
  onChange,
}: {
  label: string
  description: string
  enabled: boolean
  onChange: (value: boolean) => void
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-gray-100 px-4 py-3">
      <div>
        <p className="font-semibold text-[#1E1E1E]">{label}</p>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
      <button
        onClick={() => onChange(!enabled)}
        className={`inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors ${
          enabled ? 'bg-[#0eb1c3]' : 'bg-gray-200'
        }`}
        aria-pressed={enabled}
      >
        <span
          className={`h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
            enabled ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  )
}
