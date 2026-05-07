import { auth } from '@/auth'
import { redirect, notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'

const STATUS_MAP: Record<string, { label: string; bg: string; color: string }> = {
  PENDING:   { label: 'Pendiente',  bg: '#FEF3C7', color: '#D97706' },
  CONFIRMED: { label: 'Confirmado', bg: '#CCFBF4', color: '#0eb1c3' },
  SHIPPED:   { label: 'Enviado',    bg: '#DBEAFE', color: '#2563EB' },
  DELIVERED: { label: 'Entregado',  bg: '#D1FAE5', color: '#059669' },
  CANCELLED: { label: 'Cancelado',  bg: '#FEE2E2', color: '#EF4444' },
}

function fmt(n: number) {
  return `$${n.toLocaleString('es-AR')}`
}

export default async function PedidoDetallePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await auth()
  if (!session?.user) redirect('/login')

  const { id } = await params

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: {
        include: { product: true },
      },
    },
  })

  if (!order || order.userId !== session.user.id) notFound()

  const status = STATUS_MAP[order.status] ?? STATUS_MAP.PENDING
  const subtotal = order.items.reduce((s, i) => s + Number(i.price) * i.quantity, 0)

  return (
    <main className="min-h-screen bg-[#F7F7F7]">
      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">

        {/* Header */}
        <div className="mb-8">
          <Link href="/perfil/pedidos" className="mb-4 inline-block text-sm font-semibold text-gray-400 transition-colors hover:text-[#0eb1c3]">
            ← Mis pedidos
          </Link>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-black uppercase tracking-wide text-[#1E1E1E]">
              #{order.id.slice(0, 8).toUpperCase()}
            </h1>
            <span
              className="rounded-full px-4 py-1.5 text-xs font-black"
              style={{ backgroundColor: status.bg, color: status.color }}
            >
              {status.label}
            </span>
          </div>
          <p className="mt-1 text-sm text-gray-400">
            {new Date(order.createdAt).toLocaleDateString('es-AR', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>

        {/* Products */}
        <div className="mb-4 rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-xs font-black uppercase tracking-wider text-gray-400">Productos</h2>
          <ul className="space-y-3">
            {order.items.map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between gap-4 border-b border-gray-50 pb-3 last:border-0 last:pb-0"
              >
                <div className="flex items-center gap-3">
                  <span
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-black text-white"
                    style={{ backgroundColor: '#0eb1c3' }}
                  >
                    {item.quantity}
                  </span>
                  <div>
                    <p className="text-sm font-bold text-[#1E1E1E]">{item.product.name}</p>
                    <p className="text-xs text-gray-400">{fmt(Number(item.price))} c/u</p>
                  </div>
                </div>
                <span className="shrink-0 text-sm font-black text-[#1E1E1E]">
                  {fmt(Number(item.price) * item.quantity)}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Shipping */}
        <div className="mb-4 rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="mb-3 text-xs font-black uppercase tracking-wider text-gray-400">Método de envío</h2>
          <p className="text-sm font-bold text-[#1E1E1E]">
            {order.shippingMethod === 'pickup'
              ? 'Retiro en tienda — Colegiales, CABA'
              : order.shippingMethod === 'delivery'
              ? 'Envío a domicilio'
              : order.shippingMethod ?? '—'}
          </p>
        </div>

        {/* Total */}
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Subtotal</span>
            <span className="text-sm font-bold text-[#1E1E1E]">{fmt(subtotal)}</span>
          </div>
          <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3">
            <span className="text-base font-black uppercase tracking-wider text-[#1E1E1E]">Total</span>
            <span className="text-2xl font-black text-[#1E1E1E]">{fmt(Number(order.total))}</span>
          </div>
        </div>

      </div>
    </main>
  )
}
