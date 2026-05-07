import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'

const STATUS_MAP: Record<string, { label: string; bg: string; color: string }> = {
  PENDING:   { label: 'Pendiente',  bg: '#FEF3C7', color: '#D97706' },
  CONFIRMED: { label: 'Confirmado', bg: '#CCFBF4', color: '#2BBCB0' },
  SHIPPED:   { label: 'Enviado',    bg: '#DBEAFE', color: '#2563EB' },
  DELIVERED: { label: 'Entregado',  bg: '#D1FAE5', color: '#059669' },
  CANCELLED: { label: 'Cancelado',  bg: '#FEE2E2', color: '#EF4444' },
}

function fmt(n: number) {
  return `$${n.toLocaleString('es-AR')}`
}

export default async function PedidosPage() {
  const session = await auth()
  if (!session?.user) redirect('/login')

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
    include: { items: true },
  })

  return (
    <main className="min-h-screen bg-[#F7F7F7]">
      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">

        <div className="mb-8">
          <Link href="/perfil" className="mb-4 inline-block text-sm font-semibold text-gray-400 transition-colors hover:text-[#2BBCB0]">
            ← Mi perfil
          </Link>
          <h1 className="text-3xl font-black uppercase tracking-wide text-[#1E1E1E]">Mis pedidos</h1>
        </div>

        {orders.length === 0 ? (
          <div className="rounded-2xl bg-white px-6 py-16 text-center shadow-sm">
            <p className="text-lg font-black text-[#1E1E1E]">Todavía no realizaste ningún pedido</p>
            <p className="mt-2 text-sm text-gray-400">Explorá nuestro catálogo y encontrá algo que te guste.</p>
            <Link
              href="/catalogo"
              className="mt-6 inline-block rounded-2xl px-8 py-4 text-sm font-black uppercase tracking-widest text-white transition-opacity hover:opacity-85"
              style={{ backgroundColor: '#2BBCB0' }}
            >
              Ver catálogo
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => {
              const status = STATUS_MAP[order.status] ?? STATUS_MAP.PENDING
              const itemCount = order.items.reduce((s, i) => s + i.quantity, 0)
              return (
                <Link
                  key={order.id}
                  href={`/perfil/pedidos/${order.id}`}
                  className="flex items-center justify-between rounded-2xl bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-black uppercase tracking-wider text-gray-400">
                      #{order.id.slice(0, 8).toUpperCase()}
                    </span>
                    <span className="text-sm font-bold text-[#1E1E1E]">
                      {itemCount} {itemCount === 1 ? 'producto' : 'productos'}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(order.createdAt).toLocaleDateString('es-AR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span
                      className="rounded-full px-3 py-1 text-xs font-black"
                      style={{ backgroundColor: status.bg, color: status.color }}
                    >
                      {status.label}
                    </span>
                    <span className="text-base font-black text-[#1E1E1E]">
                      {fmt(Number(order.total))}
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}
