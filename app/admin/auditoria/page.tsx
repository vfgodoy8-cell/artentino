import { Suspense } from 'react'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import AuditFilters from './audit-filters'

const PER_PAGE = 25

type Props = {
  searchParams: Promise<{ page?: string; usuario?: string; accion?: string; desde?: string; hasta?: string }>
}

export default async function AdminAuditoriaPage({ searchParams }: Props) {
  const session = await auth()
  const adminRole = (session?.user as { adminRole?: string } | undefined)?.adminRole
  if (adminRole !== 'SUPERADMIN') redirect('/admin')

  const { page: pageParam, usuario, accion, desde, hasta } = await searchParams
  const page = Math.max(1, Number(pageParam) || 1)
  const skip = (page - 1) * PER_PAGE

  const where = {
    ...(usuario ? { userEmail: { contains: usuario, mode: 'insensitive' as const } } : {}),
    ...(accion ? { action: { contains: accion, mode: 'insensitive' as const } } : {}),
    ...(desde || hasta
      ? {
          createdAt: {
            ...(desde ? { gte: new Date(desde) } : {}),
            ...(hasta ? { lte: new Date(`${hasta}T23:59:59`) } : {}),
          },
        }
      : {}),
  }

  const [logs, total] = await Promise.all([
    prisma.auditLog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: PER_PAGE,
    }),
    prisma.auditLog.count({ where }),
  ])

  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE))

  function pageHref(p: number) {
    const params = new URLSearchParams()
    params.set('page', String(p))
    if (usuario) params.set('usuario', usuario)
    if (accion) params.set('accion', accion)
    if (desde) params.set('desde', desde)
    if (hasta) params.set('hasta', hasta)
    return `/admin/auditoria?${params.toString()}`
  }

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-[#1E1E1E]">Auditoría</h1>
        <p className="mt-1 text-sm text-gray-400">{total} registro{total !== 1 ? 's' : ''}</p>
      </div>

      <Suspense>
        <AuditFilters />
      </Suspense>

      <div className="overflow-x-auto rounded-2xl border border-gray-100 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              {['Usuario', 'Acción', 'Entidad', 'Fecha', 'Detalle'].map((label) => (
                <th key={label} className="whitespace-nowrap px-4 py-3 text-left text-xs font-black uppercase tracking-wider text-gray-400">
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {logs.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-sm text-gray-400">
                  No hay registros para estos filtros.
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-600">{log.userEmail}</td>
                  <td className="px-4 py-3 font-semibold text-[#1E1E1E]">{log.action}</td>
                  <td className="px-4 py-3 text-gray-500">
                    {log.entity}
                    {log.entityId && <span className="text-gray-300"> · {log.entityId.slice(-8)}</span>}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-gray-400">
                    {log.createdAt.toLocaleString('es-AR')}
                  </td>
                  <td className="max-w-xs truncate px-4 py-3 text-xs text-gray-400">
                    {log.detail ? JSON.stringify(log.detail) : '—'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-3">
          {page > 1 && (
            <a href={pageHref(page - 1)} className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-bold text-[#1E1E1E] transition-colors hover:border-[#0eb1c3] hover:text-[#0eb1c3]">
              ← Anterior
            </a>
          )}
          <span className="text-sm text-gray-400">Página {page} de {totalPages}</span>
          {page < totalPages && (
            <a href={pageHref(page + 1)} className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-bold text-[#1E1E1E] transition-colors hover:border-[#0eb1c3] hover:text-[#0eb1c3]">
              Siguiente →
            </a>
          )}
        </div>
      )}
    </div>
  )
}
