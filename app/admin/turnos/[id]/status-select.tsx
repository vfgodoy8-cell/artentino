'use client'

import { useTransition } from 'react'
import { updateAppointmentStatus } from '../actions'

type StatusMap = Record<string, { label: string; bg: string; color: string }>

type Props = {
  appointmentId: string
  currentStatus: string
  statuses: StatusMap
}

export default function StatusSelect({ appointmentId, currentStatus, statuses }: Props) {
  const [pending, startTransition] = useTransition()

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const next = e.target.value
    if (next === currentStatus) return
    startTransition(() => updateAppointmentStatus(appointmentId, next))
  }

  return (
    <div className="flex items-center gap-3">
      {pending && <span className="text-xs text-gray-400">Guardando…</span>}
      <select
        defaultValue={currentStatus}
        onChange={handleChange}
        disabled={pending}
        className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-[#1E1E1E] outline-none transition-colors focus:border-[#0eb1c3] disabled:opacity-50"
      >
        {Object.entries(statuses).map(([key, { label }]) => (
          <option key={key} value={key}>{label}</option>
        ))}
      </select>
    </div>
  )
}
