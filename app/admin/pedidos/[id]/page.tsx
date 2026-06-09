import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import StatusSelect from './status-select'

const STATUS = {
  PENDING:   { label: 'Pendiente',  bg: '#FEF3C7', color: '#D97706' },
  CONFIRMED: { label: 'Confirmado', bg: '#CCFBF4', color: '#0eb1c3' },
  SHIPPED:   { label: 'Enviado',    bg: '#DBEAFE', color: '#2563EB' },
  DELIVERED: { label: 'Entregado',  bg: '#D1FAE5', color: '#059669' },
  CANCELLED: { label: 'Cancelado',  bg: '#FEE2E2', color: '#EF4444' },
} as const

type StatusKey = keyof typeof STATUS

function fmt(n: number) {
  return `$${n.toLocaleString('es-AR')}`
}

function fmtDate(d: Date) {
  return d.toLocaleDateString('es-AR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

type Props = { params: Promise<{ id: string }> }

export default async function AdminPedidoDetallePage({ params }: Props) {
  const { id } = await params

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      user: { select: { name: true, email: true, phone: true } },
      items: {
        include: { product: { select: { name: true, slug: true, imageUrl: true } } },
      },
    },
  })

  if (!order) notFound()

  const s = STATUS[order.status as StatusKey] ?? STATUS.PENDING
  const shippingAddress = order.shippingAddress as Record<string, string> | null

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/admin/pedidos"
          className="mb-3 inline-block text-sm font-semibold text-gray-400 transition-colors hover:text-[#0eb1c3]"
        >
          ← Volver a pedidos
        </Link>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black uppercase tracking-wide text-[#1E1E1E]">
              Pedido #{order.id.slice(-8).toUpperCase()}
            </h1>
            <p className="mt-0.5 text-sm text-gray-400">{fmtDate(order.createdAt)}</p>
          </div>
          <StatusSelect orderId={order.id} currentStatus={order.status} statuses={STATUS} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">

        {/* Items */}
        <div className="lg:col-span-2">
          <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white">
            <div className="border-b border-gray-100 px-5 py-4">
              <p className="text-[10px] font-black uppercase tracking-wider text-gray-400">Productos</p>
            </div>
            <div className="divide-y divide-gray-50">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center gap-4 px-5 py-4">
                  <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-gray-100">
                    {item.product.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.product.imageUrl} alt={item.product.name} className="h-full w-full object-cover" />
                    ) : (
                      <div className="h-full w-full" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="truncate font-semibold text-[#1E1E1E]">{item.product.name}</p>
                    <p className="text-sm text-gray-400">x{item.quantity}</p>
                  </div>
                  <p className="font-black text-[#1E1E1E]">{fmt(Number(item.price) * item.quantity)}</p>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-100 px-5 py-4">
              <div className="flex justify-between">
                <span className="font-semibold text-gray-500">Total</span>
                <span className="text-lg font-black text-[#1E1E1E]">{fmt(Number(order.total))}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="flex flex-col gap-4">

          {/* Estado */}
          <div className="rounded-2xl border border-gray-100 bg-white px-5 py-4">
            <p className="mb-3 text-[10px] font-black uppercase tracking-wider text-gray-400">Estado actual</p>
            <span
              className="inline-block rounded-full px-3 py-1 text-sm font-black"
              style={{ backgroundColor: s.bg, color: s.color }}
            >
              {s.label}
            </span>
          </div>

          {/* Cliente */}
          <div className="rounded-2xl border border-gray-100 bg-white px-5 py-4">
            <p className="mb-3 text-[10px] font-black uppercase tracking-wider text-gray-400">Cliente</p>
            <p className="font-semibold text-[#1E1E1E]">{order.user.name}</p>
            <p className="text-sm text-gray-400">{order.user.email}</p>
            {order.user.phone && <p className="text-sm text-gray-400">{order.user.phone}</p>}
          </div>

          {/* Envío */}
          {(order.shippingMethod || shippingAddress) && (
            <div className="rounded-2xl border border-gray-100 bg-white px-5 py-4">
              <p className="mb-3 text-[10px] font-black uppercase tracking-wider text-gray-400">Envío</p>
              {order.shippingMethod && (
                <p className="font-semibold text-[#1E1E1E]">{order.shippingMethod}</p>
              )}
              {shippingAddress && (
                <div className="mt-1 text-sm text-gray-500 space-y-0.5">
                  {shippingAddress.street && <p>{shippingAddress.street}</p>}
                  {shippingAddress.city && <p>{shippingAddress.city}{shippingAddress.province ? `, ${shippingAddress.province}` : ''}</p>}
                  {shippingAddress.zip && <p>CP: {shippingAddress.zip}</p>}
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
