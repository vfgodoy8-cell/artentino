import { prisma } from '@/lib/prisma'

export default async function AdminDashboard() {
  const [productCount, categoryCount, pendingOrders, totalOrders] = await Promise.all([
    prisma.product.count(),
    prisma.category.count(),
    prisma.order.count({ where: { status: 'PENDING' } }),
    prisma.order.count(),
  ])

  const metrics = [
    { label: 'Total productos', value: productCount, color: '#0eb1c3', icon: 'box' },
    { label: 'Total categorías', value: categoryCount, color: '#8b5cf6', icon: 'layers' },
    { label: 'Pedidos pendientes', value: pendingOrders, color: '#f59e0b', icon: 'clock' },
    { label: 'Total pedidos', value: totalOrders, color: '#10b981', icon: 'cart' },
  ]

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-[#1E1E1E]">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-400">Resumen general de Artentino</p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((m) => (
          <div key={m.label} className="rounded-2xl border border-gray-100 bg-white p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">{m.label}</p>
                <p className="mt-2 text-4xl font-black text-[#1E1E1E]">{m.value}</p>
              </div>
              <div
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-white"
                style={{ backgroundColor: m.color }}
              >
                <MetricIcon name={m.icon} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function MetricIcon({ name }: { name: string }) {
  const p = {
    width: 22, height: 22, viewBox: '0 0 24 24', fill: 'none',
    stroke: 'white', strokeWidth: 2,
    strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const,
  }
  switch (name) {
    case 'box': return (
      <svg {...p}>
        <path d="M21 16V8a2 2 0 0 0-1-1.73L13 2.27a2 2 0 0 0-2 0L4 6.27A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73L11 21.73a2 2 0 0 0 2 0l7-4a2 2 0 0 0 1-1.73z" />
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
        <line x1="12" y1="22.08" x2="12" y2="12" />
      </svg>
    )
    case 'layers': return (
      <svg {...p}>
        <polygon points="12 2 2 7 12 12 22 7 12 2" />
        <polyline points="2 17 12 22 22 17" />
        <polyline points="2 12 12 17 22 12" />
      </svg>
    )
    case 'clock': return (
      <svg {...p}>
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    )
    case 'cart': return (
      <svg {...p}>
        <circle cx="9" cy="21" r="1" />
        <circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
      </svg>
    )
    default: return null
  }
}
