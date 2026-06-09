import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import StatusSelect from './status-select'

const STATUS = {
  PENDING:   { label: 'Pendiente',  bg: '#FEF3C7', color: '#D97706' },
  CONFIRMED: { label: 'Confirmado', bg: '#D1FAE5', color: '#059669' },
  CANCELLED: { label: 'Cancelado',  bg: '#FEE2E2', color: '#EF4444' },
} as const

const MODALITY = {
  PRESENCIAL: 'Presencial',
  WHATSAPP:   'WhatsApp',
} as const

type StatusKey = keyof typeof STATUS

function fmtDate(d: Date) {
  return d.toLocaleDateString('es-AR', {
    weekday: 'long', day: '2-digit', month: 'long', year: 'numeric',
  })
}

type Props = { params: Promise<{ id: string }> }

export default async function AdminTurnoDetallePage({ params }: Props) {
  const { id } = await params

  const apt = await prisma.appointment.findUnique({ where: { id } })
  if (!apt) notFound()

  const s = STATUS[apt.status as StatusKey] ?? STATUS.PENDING

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/admin/turnos"
          className="mb-3 inline-block text-sm font-semibold text-gray-400 transition-colors hover:text-[#0eb1c3]"
        >
          ← Volver a turnos
        </Link>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black uppercase tracking-wide text-[#1E1E1E]">
              Turno — {apt.time}hs · {fmtDate(apt.date)}
            </h1>
            <p className="mt-0.5 text-sm text-gray-400">
              {MODALITY[apt.modality as keyof typeof MODALITY]}
            </p>
          </div>
          <StatusSelect appointmentId={apt.id} currentStatus={apt.status} statuses={STATUS} />
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

        {/* Estado */}
        <div className="rounded-2xl border border-gray-100 bg-white px-5 py-5">
          <p className="mb-3 text-[10px] font-black uppercase tracking-wider text-gray-400">Estado</p>
          <span
            className="inline-block rounded-full px-3 py-1 text-sm font-black"
            style={{ backgroundColor: s.bg, color: s.color }}
          >
            {s.label}
          </span>
        </div>

        {/* Fecha y hora */}
        <div className="rounded-2xl border border-gray-100 bg-white px-5 py-5">
          <p className="mb-3 text-[10px] font-black uppercase tracking-wider text-gray-400">Fecha y hora</p>
          <p className="text-lg font-black text-[#1E1E1E]">{apt.time}hs</p>
          <p className="mt-0.5 text-sm capitalize text-gray-500">{fmtDate(apt.date)}</p>
        </div>

        {/* Modalidad */}
        <div className="rounded-2xl border border-gray-100 bg-white px-5 py-5">
          <p className="mb-3 text-[10px] font-black uppercase tracking-wider text-gray-400">Modalidad</p>
          <p className="font-semibold text-[#1E1E1E]">
            {apt.modality === 'PRESENCIAL' ? '📍 Presencial' : '💬 WhatsApp'}
          </p>
        </div>

        {/* Cliente */}
        <div className="rounded-2xl border border-gray-100 bg-white px-5 py-5 sm:col-span-2 lg:col-span-3">
          <p className="mb-3 text-[10px] font-black uppercase tracking-wider text-gray-400">Cliente</p>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Nombre</p>
              <p className="mt-0.5 font-semibold text-[#1E1E1E]">{apt.name}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Email</p>
              <a href={`mailto:${apt.email}`} className="mt-0.5 block font-semibold text-[#0eb1c3] hover:underline">
                {apt.email}
              </a>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Teléfono</p>
              <a href={`tel:${apt.phone}`} className="mt-0.5 block font-semibold text-[#1E1E1E] hover:text-[#0eb1c3]">
                {apt.phone}
              </a>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
