import { prisma } from '@/lib/prisma'
import AtributosTable from './atributos-table'

export default async function AdminAtributos() {
  const raw = await prisma.attribute.findMany({
    orderBy: [{ position: 'asc' }, { name: 'asc' }],
    include: {
      values: {
        orderBy: { value: 'asc' },
        include: { _count: { select: { productStocks: true, productImages: true } } },
      },
    },
  })

  const attributes = raw.map((a) => ({
    id: a.id,
    name: a.name,
    filter: a.filter,
    hidden: a.hidden,
    imageDriven: a.imageDriven,
    position: a.position,
    active: a.active,
    values: a.values.map((v) => ({
      id: v.id,
      value: v.value,
      stockCount: v._count.productStocks,
      imageCount: v._count.productImages,
    })),
  }))

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-[#1E1E1E]">Atributos</h1>
        <p className="mt-1 text-sm text-gray-400">
          Grupos de atributos: Color, Diseño, Talle, Único, etc.
        </p>
      </div>
      <AtributosTable initial={attributes} />
    </div>
  )
}
