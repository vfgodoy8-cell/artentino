import Link from 'next/link'
import { prisma } from '@/lib/prisma'

const STATUS = {
  PENDING:                { label: 'Pendiente',        bg: '#FEF3C7', color: '#D97706' },
  PENDING_PICKUP_PAYMENT: { label: 'A retirar',        bg: '#EDE9FE', color: '#7C3AED' },
  CONFIRMED:              { label: 'Confirmado',       bg: '#CCFBF4', color: '#0eb1c3' },
  SHIPPED:                { label: 'Enviado',          bg: '#DBEAFE', color: '#2563EB' },
  DELIVERED:              { label: 'Entregado',        bg: '#D1FAE5', color: '#059669' },
  CANCELLED:              { label: 'Cancelado',        bg: '#FEE2E2', color: '#EF4444' },
} as const

type StatusKey = keyof typeof STATUS

function fmt(n: number) {
  return `$${n.toLocaleString('es-AR')}`
}

function fmtDate(d: Date) {
  return d.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

type Props = {
  searchParams: Promise<{ estado?: string }>
}

export default async function AdminPedidosPage({ searchParams }: Props) {
  const { estado } = await searchParams
  const statusFilter = estado && estado in STATUS ? (estado as StatusKey) : undefined

  const orders = await prisma.order.findMany({
    where: statusFilter ? { status: statusFilter } : undefined,
    orderBy: { createdAt: 'desc' },
    include: {
      user: { select: { name: true, email: true } },
      items: true,
    },
  })

  const counts = await prisma.order.groupBy({
    by: ['status'],
    _count: { id: true },
  })
  const countMap = Object.fromEntries(counts.map((c) => [c.status, c._count.id]))

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-wide text-[#1E1E1E]">Pedidos</h1>
          <p className="mt-0.5 text-sm text-gray-400">{orders.length} {orders.length === 1 ? 'pedido' : 'pedidos'}</p>
        </div>
      </div>

      {/* Status filter tabs */}
      <div className="mb-6 flex flex-wrap gap-2">
        {([['', 'Todos'], ...Object.entries(STATUS).map(([k, v]) => [k, v.label])] as [string, string][]).map(([key, label]) => {
          const isActive = (key === '' && !statusFilter) || key === statusFilter
          const count = key === '' ? orders.length : (countMap[key] ?? 0)
          return (
            <Link
              key={key}
              href={key ? `/admin/pedidos?estado=${key}` : '/admin/pedidos'}
              className={`rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors ${
                isActive
                  ? 'border-[#0eb1c3] bg-[#0eb1c3] text-white'
                  : 'border-gray-200 bg-white text-[#1E1E1E] hover:border-[#0eb1c3] hover:text-[#0eb1c3]'
              }`}
            >
              {label}
              {!statusFilter && key === '' ? null : (
                <span className="ml-1.5 opacity-70">({key === '' ? orders.length : (countMap[key] ?? 0)})</span>
              )}
            </Link>
          )
        })}
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white">
        {orders.length === 0 ? (
          <div className="py-20 text-center">
            <p className="font-bold text-gray-400">No hay pedidos{statusFilter ? ' con este estado' : ''}</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="px-4 py-3 text-left text-[10px] font-black uppercase tracking-wider text-gray-400">ID</th>
                <th className="px-4 py-3 text-left text-[10px] font-black uppercase tracking-wider text-gray-400">Cliente</th>
                <th className="px-4 py-3 text-left text-[10px] font-black uppercase tracking-wider text-gray-400">Fecha</th>
                <th className="px-4 py-3 text-left text-[10px] font-black uppercase tracking-wider text-gray-400">Ítems</th>
                <th className="px-4 py-3 text-left text-[10px] font-black uppercase tracking-wider text-gray-400">Total</th>
                <th className="px-4 py-3 text-left text-[10px] font-black uppercase tracking-wider text-gray-400">Estado</th>
                <th className="px-4 py-3 text-right text-[10px] font-black uppercase tracking-wider text-gray-400">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {orders.map((order) => {
                const s = STATUS[order.status as StatusKey] ?? STATUS.PENDING
                const itemCount = order.items.reduce((sum, i) => sum + i.quantity, 0)
                return (
                  <tr key={order.id} className="transition-colors hover:bg-gray-50/50">
                    <td className="px-4 py-3 font-mono text-xs text-gray-400">{order.id.slice(-8).toUpperCase()}</td>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-[#1E1E1E]">{order.user.name}</p>
                      <p className="text-xs text-gray-400">{order.user.email}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{fmtDate(order.createdAt)}</td>
                    <td className="px-4 py-3 text-gray-500">{itemCount} {itemCount === 1 ? 'ítem' : 'ítems'}</td>
                    <td className="px-4 py-3 font-black text-[#1E1E1E]">{fmt(Number(order.total))}</td>
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
                        href={`/admin/pedidos/${order.id}`}
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
