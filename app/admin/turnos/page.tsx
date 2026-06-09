import Link from 'next/link'
import { prisma } from '@/lib/prisma'

const STATUS = {
  PENDING:   { label: 'Pendiente',  bg: '#FEF3C7', color: '#D97706' },
  CONFIRMED: { label: 'Confirmado', bg: '#D1FAE5', color: '#059669' },
  CANCELLED: { label: 'Cancelado',  bg: '#FEE2E2', color: '#EF4444' },
} as const

const MODALITY = {
  PRESENCIAL: { label: 'Presencial', icon: '📍' },
  WHATSAPP:   { label: 'WhatsApp',   icon: '💬' },
} as const

type StatusKey = keyof typeof STATUS

function fmtDate(d: Date) {
  return d.toLocaleDateString('es-AR', { weekday: 'short', day: '2-digit', month: '2-digit', year: 'numeric' })
}

type Props = {
  searchParams: Promise<{ estado?: string }>
}

export default async function AdminTurnosPage({ searchParams }: Props) {
  const { estado } = await searchParams
  const statusFilter = estado && estado in STATUS ? (estado as StatusKey) : undefined

  const appointments = await prisma.appointment.findMany({
    where: statusFilter ? { status: statusFilter } : undefined,
    orderBy: [{ date: 'asc' }, { time: 'asc' }],
  })

  const counts = await prisma.appointment.groupBy({
    by: ['status'],
    _count: { id: true },
  })
  const countMap = Object.fromEntries(counts.map((c) => [c.status, c._count.id]))
  const total = counts.reduce((s, c) => s + c._count.id, 0)

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-black uppercase tracking-wide text-[#1E1E1E]">Turnos</h1>
        <p className="mt-0.5 text-sm text-gray-400">{appointments.length} {appointments.length === 1 ? 'turno' : 'turnos'}</p>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex flex-wrap gap-2">
        <Link
          href="/admin/turnos"
          className={`rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors ${
            !statusFilter
              ? 'border-[#0eb1c3] bg-[#0eb1c3] text-white'
              : 'border-gray-200 bg-white text-[#1E1E1E] hover:border-[#0eb1c3] hover:text-[#0eb1c3]'
          }`}
        >
          Todos ({total})
        </Link>
        {Object.entries(STATUS).map(([key, { label }]) => {
          const isActive = key === statusFilter
          return (
            <Link
              key={key}
              href={`/admin/turnos?estado=${key}`}
              className={`rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors ${
                isActive
                  ? 'border-[#0eb1c3] bg-[#0eb1c3] text-white'
                  : 'border-gray-200 bg-white text-[#1E1E1E] hover:border-[#0eb1c3] hover:text-[#0eb1c3]'
              }`}
            >
              {label} ({countMap[key] ?? 0})
            </Link>
          )
        })}
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white">
        {appointments.length === 0 ? (
          <div className="py-20 text-center">
            <p className="font-bold text-gray-400">No hay turnos{statusFilter ? ' con este estado' : ''}</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="px-4 py-3 text-left text-[10px] font-black uppercase tracking-wider text-gray-400">Fecha y hora</th>
                <th className="px-4 py-3 text-left text-[10px] font-black uppercase tracking-wider text-gray-400">Cliente</th>
                <th className="px-4 py-3 text-left text-[10px] font-black uppercase tracking-wider text-gray-400">Modalidad</th>
                <th className="px-4 py-3 text-left text-[10px] font-black uppercase tracking-wider text-gray-400">Estado</th>
                <th className="px-4 py-3 text-right text-[10px] font-black uppercase tracking-wider text-gray-400">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {appointments.map((apt) => {
                const s = STATUS[apt.status as StatusKey] ?? STATUS.PENDING
                const m = MODALITY[apt.modality as keyof typeof MODALITY]
                return (
                  <tr key={apt.id} className="transition-colors hover:bg-gray-50/50">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-[#1E1E1E]">{apt.time}hs</p>
                      <p className="text-xs text-gray-400">{fmtDate(apt.date)}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-[#1E1E1E]">{apt.name}</p>
                      <p className="text-xs text-gray-400">{apt.phone}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-gray-600">{m?.icon} {m?.label}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className="inline-block rounded-full px-2.5 py-0.5 text-[11px] font-black"
                        style={{ backgroundColor: s.bg, color: s.color }}
                      >
                        {s.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/admin/turnos/${apt.id}`}
                        className="text-sm font-semibold text-[#0eb1c3] transition-colors hover:underline"
                      >
                        Ver
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
