'use client'

import { useRef, useState } from 'react'

export type AddressData = {
  street: string
  streetNumber: string
  city: string
  province: string
  zip: string
}

export const ARGENTINE_PROVINCES = [
  'Buenos Aires',
  'CABA',
  'Catamarca',
  'Chaco',
  'Chubut',
  'Córdoba',
  'Corrientes',
  'Entre Ríos',
  'Formosa',
  'Jujuy',
  'La Pampa',
  'La Rioja',
  'Mendoza',
  'Misiones',
  'Neuquén',
  'Río Negro',
  'Salta',
  'San Juan',
  'San Luis',
  'Santa Cruz',
  'Santa Fe',
  'Santiago del Estero',
  'Tierra del Fuego',
  'Tucumán',
]

const OTHER_BA_LOCALITY = '__otra_localidad_ba__'

const inputClass = 'w-full rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-[#1E1E1E] outline-none focus:border-[#0eb1c3] focus:ring-2 focus:ring-[#0eb1c3]/20'
const disabledInputClass = `${inputClass} bg-gray-50 text-gray-400`

type Props = {
  address: AddressData
  onChange: (next: AddressData) => void
  expressLocalities: string[]
}

export default function AddressFields({ address, onChange, expressLocalities }: Props) {
  const isCaba = address.province === 'CABA'
  const isBuenosAires = address.province === 'Buenos Aires'
  const isOtherProvince = address.province !== '' && !isCaba && !isBuenosAires

  const [baSelectValue, setBaSelectValue] = useState('')
  const [baOtherLocality, setBaOtherLocality] = useState('')

  const [georefQuery, setGeorefQuery] = useState(address.city)
  const [georefSuggestions, setGeorefSuggestions] = useState<string[]>([])
  const [georefOpen, setGeorefOpen] = useState(false)
  const [georefAvailable, setGeorefAvailable] = useState(true)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  function handleProvinceChange(nextProvince: string) {
    setBaSelectValue('')
    setBaOtherLocality('')
    setGeorefQuery('')
    setGeorefSuggestions([])
    setGeorefOpen(false)
    onChange({ ...address, province: nextProvince, city: nextProvince === 'CABA' ? 'CABA' : '' })
  }

  function handleBaSelectChange(value: string) {
    setBaSelectValue(value)
    onChange({ ...address, city: value === OTHER_BA_LOCALITY ? baOtherLocality : value })
  }

  function handleBaOtherLocalityChange(value: string) {
    setBaOtherLocality(value)
    onChange({ ...address, city: value })
  }

  function handleGeorefInputChange(value: string) {
    setGeorefQuery(value)
    // Siempre reflejar lo tipeado — si Georef falla o no sugiere nada, el texto libre igual sirve.
    onChange({ ...address, city: value })

    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (!georefAvailable || value.trim().length < 3) {
      setGeorefSuggestions([])
      return
    }

    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://apis.datos.gob.ar/georef/api/localidades?provincia=${encodeURIComponent(address.province)}&nombre=${encodeURIComponent(value)}&max=8&campos=nombre`,
          { signal: AbortSignal.timeout(4000) },
        )
        if (!res.ok) throw new Error('georef error')
        const data = await res.json()
        const rawNames = (data.localidades ?? []).map((l: { nombre: string }) => l.nombre) as string[]
        const names: string[] = Array.from(new Set(rawNames))
        setGeorefSuggestions(names)
        setGeorefOpen(names.length > 0)
      } catch {
        // API externa caída — degradamos a texto libre para el resto de la sesión, nunca bloqueamos el checkout.
        setGeorefAvailable(false)
        setGeorefSuggestions([])
        setGeorefOpen(false)
      }
    }, 300)
  }

  function selectGeorefSuggestion(name: string) {
    setGeorefQuery(name)
    setGeorefOpen(false)
    onChange({ ...address, city: name })
  }

  return (
    <>
      <div className="col-span-2 sm:col-span-1">
        <label className="mb-1.5 block text-xs font-black uppercase tracking-wider text-gray-500">Calle</label>
        <input
          type="text"
          value={address.street}
          onChange={(e) => onChange({ ...address, street: e.target.value })}
          className={inputClass}
        />
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-black uppercase tracking-wider text-gray-500">Número</label>
        <input
          type="text"
          value={address.streetNumber}
          onChange={(e) => onChange({ ...address, streetNumber: e.target.value })}
          className={inputClass}
        />
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-black uppercase tracking-wider text-gray-500">Provincia</label>
        <select
          value={address.province}
          onChange={(e) => handleProvinceChange(e.target.value)}
          className={inputClass}
        >
          <option value="">Seleccioná una provincia</option>
          {[...ARGENTINE_PROVINCES].sort((a, b) => a.localeCompare(b, 'es')).map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </div>

      <div className="relative">
        <label className="mb-1.5 block text-xs font-black uppercase tracking-wider text-gray-500">Localidad</label>

        {!address.province && (
          <input type="text" disabled placeholder="Elegí una provincia primero" className={disabledInputClass} />
        )}

        {isCaba && (
          <input type="text" disabled value="CABA" className={disabledInputClass} />
        )}

        {isBuenosAires && (
          <>
            <select
              value={baSelectValue}
              onChange={(e) => handleBaSelectChange(e.target.value)}
              className={inputClass}
            >
              <option value="">Seleccioná tu localidad</option>
              {expressLocalities.map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
              <option value={OTHER_BA_LOCALITY}>Otra localidad de Buenos Aires</option>
            </select>
            {baSelectValue === OTHER_BA_LOCALITY && (
              <input
                type="text"
                value={baOtherLocality}
                onChange={(e) => handleBaOtherLocalityChange(e.target.value)}
                placeholder="Nombre de tu localidad"
                className={`${inputClass} mt-2`}
              />
            )}
          </>
        )}

        {isOtherProvince && (
          <>
            <input
              type="text"
              value={georefQuery}
              onChange={(e) => handleGeorefInputChange(e.target.value)}
              onFocus={() => setGeorefOpen(georefSuggestions.length > 0)}
              onBlur={() => setTimeout(() => setGeorefOpen(false), 150)}
              placeholder={georefAvailable ? 'Empezá a tipear tu localidad' : 'Nombre de tu localidad'}
              autoComplete="off"
              className={inputClass}
            />
            {georefOpen && georefSuggestions.length > 0 && (
              <ul className="absolute z-10 mt-1 max-h-48 w-full overflow-y-auto rounded-xl border border-gray-200 bg-white shadow-lg">
                {georefSuggestions.map((s) => (
                  <li key={s}>
                    <button
                      type="button"
                      onMouseDown={() => selectGeorefSuggestion(s)}
                      className="block w-full px-4 py-2 text-left text-sm text-[#1E1E1E] hover:bg-gray-50"
                    >
                      {s}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-black uppercase tracking-wider text-gray-500">Código Postal</label>
        <input
          type="text"
          required
          value={address.zip}
          onChange={(e) => onChange({ ...address, zip: e.target.value })}
          className={inputClass}
        />
      </div>
    </>
  )
}
