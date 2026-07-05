'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { updateSiteConfig } from './actions'

const DEFAULT_TEXT =
  'Deco, hogar y regalos únicos con diseño argentino. Cuotas sin interés y envíos a todo el país.'

export default function FooterTextSection({ initial }: { initial: string }) {
  const [text, setText] = useState(initial)
  const [saved, setSaved] = useState(false)
  const [, startT] = useTransition()
  const router = useRouter()

  function handleSave() {
    startT(async () => {
      await updateSiteConfig({ footerText: text })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
      router.refresh()
    })
  }

  function handleReset() {
    setText(DEFAULT_TEXT)
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-lg font-black text-[#1E1E1E]">Pie de página</h2>
        <p className="mt-1 text-sm text-[#9ca3af]">
          Texto descriptivo que aparece debajo del logo en el footer del sitio.
        </p>
      </div>

      <div className="max-w-2xl space-y-3">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={3}
          className="w-full rounded-xl border border-[#e5e7eb] px-4 py-3 text-sm text-[#1E1E1E] placeholder-[#9ca3af] focus:border-[#0eb1c3] focus:outline-none"
          placeholder={DEFAULT_TEXT}
        />

        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            className="rounded-xl px-5 py-2 text-sm font-bold text-white transition-colors"
            style={{ backgroundColor: saved ? '#1E1E1E' : '#0eb1c3' }}
          >
            {saved ? '¡Guardado!' : 'Guardar'}
          </button>
          <button
            onClick={handleReset}
            className="rounded-xl px-4 py-2 text-sm font-semibold text-[#6b7280] transition-colors hover:bg-[#f3f4f6]"
          >
            Restaurar default
          </button>
        </div>
      </div>
    </div>
  )
}
