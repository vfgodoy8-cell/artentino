import { prisma } from '@/lib/prisma'

export async function getInstagramToken() {
  return prisma.instagramToken.findFirst()
}

export async function saveInstagramToken(
  accessToken: string,
  expiresAt: Date,
  igUserId?: string,
) {
  const existing = await prisma.instagramToken.findFirst({ select: { id: true } })
  const data = { accessToken, expiresAt, ...(igUserId ? { igUserId } : {}) }
  if (existing) {
    return prisma.instagramToken.update({ where: { id: existing.id }, data })
  }
  return prisma.instagramToken.create({ data })
}
