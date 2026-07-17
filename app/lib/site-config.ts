import { prisma } from '@/lib/prisma'

export async function getSiteConfig() {
  const config = await prisma.siteConfig.findUnique({ where: { id: 'singleton' } })
  if (config) return config
  return prisma.siteConfig.create({ data: { id: 'singleton' } })
}
