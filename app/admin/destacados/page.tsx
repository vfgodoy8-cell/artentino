import { prisma } from '@/lib/prisma'
import { getSiteConfig } from '@/app/lib/site-config'
import DestacadosClient from './destacados-client'

export default async function AdminDestacados() {
  const [featured, siteConfig] = await Promise.all([
    prisma.product.findMany({
      where: { featured: true },
      select: { id: true, name: true, price: true, imageUrl: true, sortOrder: true },
      orderBy: { sortOrder: 'asc' },
    }),
    getSiteConfig(),
  ])

  const serialized = featured.map((p) => ({
    ...p,
    price: Number(p.price.toString()),
  }))

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-[#1E1E1E]">Destacados</h1>
        <p className="mt-1 text-sm text-gray-400">
          Gestioná qué productos aparecen en la sección destacada del sitio.
        </p>
      </div>
      <DestacadosClient
        initial={serialized}
        initialOrderMode={siteConfig.featuredOrderMode as 'manual' | 'recent'}
      />
    </div>
  )
}
