'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { updateContactSettings } from './actions'

const inp =
  'w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm text-[#1E1E1E] placeholder-gray-300 outline-none transition-colors focus:border-[#0eb1c3] focus:ring-2 focus:ring-[#0eb1c3]/10'

const lbl = 'mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-400'

type ContactData = {
  phone: string
  whatsappNumber: string
  email: string
  addressLine1: string
  addressLine2: string
  businessHours: string
}

export default function ContactSection({ initial }: { initial: ContactData }) {
  const [form, setForm] = useState(initial)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  function setField<K extends keyof ContactData>(k: K, v: ContactData[K]) {
    setForm((prev) => ({ ...prev, [k]: v }))
  }

  function handleSave() {
    setError('')
    startTransition(async () => {
      const result = await updateContactSettings(form)
      if (!result.success) {
        setError(result.error)
        return
      }
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
      router.refresh()
    })
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-lg font-black text-[#1E1E1E]">Datos de contacto</h2>
        <p className="mt-1 text-sm text-[#9ca3af]">
          Teléfono, email, dirección y horario que se muestran en el footer, contacto, FAQ y checkout.
        </p>
      </div>

      <div className="grid max-w-2xl gap-4 sm:grid-cols-2">
        <div>
          <label className={lbl}>Teléfono (display)</label>
          <input
            type="text"
            value={form.phone}
            onChange={(e) => setField('phone', e.target.value)}
            className={inp}
            placeholder="+54 9 11 3936 3333"
          />
        </div>
        <div>
          <label className={lbl}>WhatsApp (solo números)</label>
          <input
            type="text"
            value={form.whatsappNumber}
            onChange={(e) => setField('whatsappNumber', e.target.value)}
            className={inp}
            placeholder="5491139363333"
          />
        </div>
        <div className="sm:col-span-2">
          <label className={lbl}>Email</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setField('email', e.target.value)}
            className={inp}
            placeholder="info@artentino.com"
          />
        </div>
        <div>
          <label className={lbl}>Dirección — línea 1</label>
          <input
            type="text"
            value={form.addressLine1}
            onChange={(e) => setField('addressLine1', e.target.value)}
            className={inp}
            placeholder="Av. Corrientes 5022"
          />
        </div>
        <div>
          <label className={lbl}>Dirección — línea 2</label>
          <input
            type="text"
            value={form.addressLine2}
            onChange={(e) => setField('addressLine2', e.target.value)}
            className={inp}
            placeholder="CABA CP 1414"
          />
        </div>
        <div className="sm:col-span-2">
          <label className={lbl}>Horario de atención</label>
          <input
            type="text"
            value={form.businessHours}
            onChange={(e) => setField('businessHours', e.target.value)}
            className={inp}
            placeholder="Lunes a Viernes 9 a 19hs"
          />
        </div>
      </div>

      {error && <p className="mt-3 text-sm font-semibold text-red-500">{error}</p>}

      <div className="mt-4 flex items-center gap-3">
        <button
          onClick={handleSave}
          disabled={isPending}
          className="rounded-xl px-5 py-2 text-sm font-bold text-white transition-colors disabled:opacity-60"
          style={{ backgroundColor: saved ? '#1E1E1E' : '#0eb1c3' }}
        >
          {saved ? '¡Guardado!' : 'Guardar'}
        </button>
      </div>
    </div>
  )
}
