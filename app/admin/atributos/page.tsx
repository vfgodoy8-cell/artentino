import { prisma } from '@/lib/prisma'
import AtributosTable from './atributos-table'

export default async function AdminAtributos() {
  const attributes = await prisma.attribute.findMany({
    orderBy: [{ position: 'asc' }, { name: 'asc' }],
  })

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
