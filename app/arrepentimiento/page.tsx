import Link from 'next/link'
import type { Metadata } from 'next'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { isWithinArrepentimientoWindow } from '@/app/lib/arrepentimiento'

export const metadata: Metadata = {
  title: 'Botón de Arrepentimiento — Artentino',
  description: 'Revocá tu compra dentro de los 10 días corridos desde la entrega, según la Resolución 424/2020.',
}

function fmt(n: number) {
  return `$${n.toLocaleString('es-AR')}`
}

export default async function ArrepentimientoPage() {
  const session = await auth()

  const eligibleOrders = session?.user?.id
    ? await prisma.order.findMany({
        where: { userId: session.user.id, status: 'DELIVERED' },
        orderBy: { deliveredAt: 'desc' },
        include: { items: true },
      }).then((orders) => orders.filter((o) => isWithinArrepentimientoWindow(o.deliveredAt)))
    : []

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="border-b border-gray-100 bg-white py-12">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <p className="mb-2 text-xs font-black uppercase tracking-widest" style={{ color: '#0eb1c3' }}>
            Legal
          </p>
          <h1 className="text-3xl font-black text-[#1E1E1E] sm:text-4xl">
            Botón de Arrepentimiento
          </h1>
          <p className="mt-3 text-gray-500">
            De acuerdo a la Resolución 424/2020, tenés derecho a revocar tu compra dentro de los 10
            días corridos desde que recibiste el pedido, sin necesidad de indicar motivo ni costo
            alguno.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-3xl space-y-4 px-4 py-12 sm:px-6 lg:px-8">
        {!session?.user ? (
          <div className="rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-sm">
            <p className="mb-4 font-semibold text-[#1E1E1E]">
              Iniciá sesión para ver tus pedidos entregados y ejercer tu derecho de arrepentimiento.
            </p>
            <Link
              href="/login?callbackUrl=/arrepentimiento"
              className="inline-block rounded-2xl px-8 py-3 text-sm font-black uppercase tracking-widest text-white transition-opacity hover:opacity-85"
              style={{ backgroundColor: '#0eb1c3' }}
            >
              Iniciar sesión
            </Link>
          </div>
        ) : eligibleOrders.length === 0 ? (
          <div className="rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-sm">
            <p className="font-semibold text-[#1E1E1E]">
              No tenés pedidos entregados dentro de los últimos 10 días.
            </p>
            <p className="mt-2 text-sm text-gray-400">
              El botón de arrepentimiento está disponible en el detalle de cada pedido entregado,
              durante los 10 días corridos posteriores a la entrega.
            </p>
            <Link
              href="/perfil/pedidos"
              className="mt-4 inline-block text-sm font-bold transition-colors hover:text-[#0eb1c3]"
              style={{ color: '#0eb1c3' }}
            >
              Ver mis pedidos →
            </Link>
          </div>
        ) : (
          <>
            <p className="text-sm font-semibold text-gray-500">
              Elegí el pedido para el que querés ejercer tu derecho de arrepentimiento:
            </p>
            {eligibleOrders.map((order) => {
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
                  </div>
                  <span className="text-base font-black text-[#1E1E1E]">{fmt(Number(order.total))}</span>
                </Link>
              )
            })}
          </>
        )}
      </div>
    </div>
  )
}
