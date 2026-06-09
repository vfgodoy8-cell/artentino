import Link from 'next/link'
import { prisma } from '@/lib/prisma'

const TYPE = {
  GENERAL: { label: 'General',   bg: '#EDE9FE', color: '#7C3AED' },
  JOB:     { label: 'Trabajo',   bg: '#FEF3C7', color: '#D97706' },
} as const

type TypeKey = keyof typeof TYPE

function fmtDate(d: Date) {
  return d.toLocaleDateString('es-AR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

type Props = {
  searchParams: Promise<{ tipo?: string }>
}

export default async function AdminContactosPage({ searchParams }: Props) {
  const { tipo } = await searchParams
  const typeFilter = tipo && tipo in TYPE ? (tipo as TypeKey) : undefined

  const contacts = await prisma.contact.findMany({
    where: typeFilter ? { type: typeFilter } : undefined,
    orderBy: { createdAt: 'desc' },
  })

  const counts = await prisma.contact.groupBy({
    by: ['type'],
    _count: { id: true },
  })
  const countMap = Object.fromEntries(counts.map((c) => [c.type, c._count.id]))
  const total = counts.reduce((s, c) => s + c._count.id, 0)

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-black uppercase tracking-wide text-[#1E1E1E]">Contactos</h1>
        <p className="mt-0.5 text-sm text-gray-400">{contacts.length} {contacts.length === 1 ? 'mensaje' : 'mensajes'}</p>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex flex-wrap gap-2">
        <Link
          href="/admin/contactos"
          className={`rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors ${
            !typeFilter
              ? 'border-[#0eb1c3] bg-[#0eb1c3] text-white'
              : 'border-gray-200 bg-white text-[#1E1E1E] hover:border-[#0eb1c3] hover:text-[#0eb1c3]'
          }`}
        >
          Todos ({total})
        </Link>
        {Object.entries(TYPE).map(([key, { label }]) => (
          <Link
            key={key}
            href={`/admin/contactos?tipo=${key}`}
            className={`rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors ${
              typeFilter === key
                ? 'border-[#0eb1c3] bg-[#0eb1c3] text-white'
                : 'border-gray-200 bg-white text-[#1E1E1E] hover:border-[#0eb1c3] hover:text-[#0eb1c3]'
            }`}
          >
            {label} ({countMap[key] ?? 0})
          </Link>
        ))}
      </div>

      {/* Cards */}
      {contacts.length === 0 ? (
        <div className="rounded-2xl border border-gray-100 bg-white py-20 text-center">
          <p className="font-bold text-gray-400">No hay mensajes{typeFilter ? ' de este tipo' : ''}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {contacts.map((c) => {
            const t = TYPE[c.type as TypeKey] ?? TYPE.GENERAL
            return (
              <div key={c.id} className="rounded-2xl border border-gray-100 bg-white px-5 py-5">
                <div className="flex flex-wrap items-start justify-between gap-3">

                  {/* Left: sender info */}
                  <div className="flex items-start gap-3">
                    {/* Avatar inicial */}
                    <div
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-black text-white"
                      style={{ backgroundColor: '#0eb1c3' }}
                    >
                      {c.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-black text-[#1E1E1E]">{c.name}</p>
                      <div className="mt-0.5 flex flex-wrap items-center gap-3 text-sm text-gray-400">
                        <a href={`mailto:${c.email}`} className="transition-colors hover:text-[#0eb1c3]">
                          {c.email}
                        </a>
                        {c.phone && (
                          <a href={`tel:${c.phone}`} className="transition-colors hover:text-[#0eb1c3]">
                            {c.phone}
                          </a>
                        )}
                        {c.position && (
                          <span className="text-gray-400">{c.position}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: type + date */}
                  <div className="flex items-center gap-3">
                    <span
                      className="rounded-full px-2.5 py-0.5 text-[11px] font-black"
                      style={{ backgroundColor: t.bg, color: t.color }}
                    >
                      {t.label}
                    </span>
                    <span className="text-xs text-gray-400">{fmtDate(c.createdAt)}</span>
                  </div>
                </div>

                {/* Message */}
                <div className="mt-4 rounded-xl bg-gray-50 px-4 py-3">
                  <p className="whitespace-pre-wrap text-sm leading-relaxed text-[#1E1E1E]">{c.message}</p>
                </div>

                {/* Reply shortcut */}
                <div className="mt-3 flex justify-end">
                  <a
                    href={`mailto:${c.email}?subject=Re: tu mensaje en Artentino`}
                    className="text-sm font-semibold text-[#0eb1c3] transition-colors hover:underline"
                  >
                    Responder por email →
                  </a>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
