import { prisma } from '@/lib/prisma'
import type { Prisma } from '@/app/generated/prisma/client'

type LogAuditInput = {
  userId: string
  userEmail: string
  action: string
  entity: string
  entityId?: string
  detail?: Record<string, unknown>
}

export async function logAudit({ userId, userEmail, action, entity, entityId, detail }: LogAuditInput) {
  await prisma.auditLog.create({
    data: {
      userId,
      userEmail,
      action,
      entity,
      entityId,
      detail: (detail as Prisma.InputJsonValue) ?? undefined,
    },
  })
}
