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
  // Cualquier guardado de token (paste manual o refresh exitoso del cron) reinicia el
  // ciclo de aviso de vencimiento — el próximo recordatorio se calcula desde este momento.
  const data = { accessToken, expiresAt, reminderSentAt: null, ...(igUserId ? { igUserId } : {}) }
  if (existing) {
    return prisma.instagramToken.update({ where: { id: existing.id }, data })
  }
  return prisma.instagramToken.create({ data })
}
