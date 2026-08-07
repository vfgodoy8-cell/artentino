'use server'

import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import { after } from 'next/server'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { auth } from '@/auth'
import { requireRole, type AdminRole } from '@/app/lib/permissions'
import { logAudit } from '@/app/lib/audit'
import { sendEmail, adminInviteEmail } from '@/app/lib/email'

type ActionResult<T> = { success: true; data: T } | { success: false; error: string }

export async function createAdmin(data: {
  name: string
  email: string
  adminRole: AdminRole
}): Promise<ActionResult<{ tempPassword: string }>> {
  const session = await auth()
  try {
    requireRole(session, ['SUPERADMIN'])
  } catch (err) {
    return { success: false, error: (err as Error).message }
  }

  const existing = await prisma.user.findUnique({ where: { email: data.email } })
  if (existing) {
    return { success: false, error: 'Ya existe un usuario con ese email' }
  }

  const tempPassword = crypto.randomBytes(6).toString('base64url')
  const hash = await bcrypt.hash(tempPassword, 10)

  const user = await prisma.user.create({
    data: {
      email: data.email,
      name: data.name,
      password: hash,
      role: 'ADMIN',
      adminRole: data.adminRole,
    },
  })

  await logAudit({
    userId: session!.user.id,
    userEmail: session!.user.email!,
    action: 'create',
    entity: 'AdminUser',
    entityId: user.id,
    detail: { email: data.email, adminRole: data.adminRole },
  })

  after(async () => {
    try {
      await sendEmail({
        to: data.email,
        subject: 'Artentino — Acceso al panel de administración',
        html: adminInviteEmail({ name: data.name, email: data.email, tempPassword, adminRole: data.adminRole }),
      })
    } catch (err) {
      console.error('[email] invitación de administrador falló:', err)
    }
  })

  revalidatePath('/admin/administradores')
  return { success: true, data: { tempPassword } }
}

export async function updateAdminRole(userId: string, adminRole: AdminRole): Promise<ActionResult<null>> {
  const session = await auth()
  try {
    requireRole(session, ['SUPERADMIN'])
  } catch (err) {
    return { success: false, error: (err as Error).message }
  }

  await prisma.user.update({ where: { id: userId }, data: { adminRole } })
  await logAudit({
    userId: session!.user.id,
    userEmail: session!.user.email!,
    action: 'update-role',
    entity: 'AdminUser',
    entityId: userId,
    detail: { adminRole },
  })
  revalidatePath('/admin/administradores')
  return { success: true, data: null }
}

export async function setAdminActive(userId: string, active: boolean): Promise<ActionResult<null>> {
  const session = await auth()
  try {
    requireRole(session, ['SUPERADMIN'])
  } catch (err) {
    return { success: false, error: (err as Error).message }
  }

  if (userId === session!.user.id && !active) {
    return { success: false, error: 'No podés desactivar tu propia cuenta' }
  }

  await prisma.user.update({ where: { id: userId }, data: { active } })
  await logAudit({
    userId: session!.user.id,
    userEmail: session!.user.email!,
    action: active ? 'reactivate' : 'deactivate',
    entity: 'AdminUser',
    entityId: userId,
  })
  revalidatePath('/admin/administradores')
  return { success: true, data: null }
}
