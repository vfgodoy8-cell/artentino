import { prisma } from '@/lib/prisma'
import CondicionTable from './condicion-table'

export default async function AdminCondicion() {
  const conditions = await prisma.condition.findMany({
    orderBy: { createdAt: 'asc' },
  })

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-[#1E1E1E]">Condición</h1>
        <p className="mt-1 text-sm text-gray-400">
          Estados visuales del producto: Nuevo, Oferta, Próximamente, etc.
        </p>
      </div>
      <CondicionTable initial={conditions} />
    </div>
  )
}
