'use server'

import bcrypt from 'bcryptjs'
import { after } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { sendEmail, passwordChangedEmail } from '@/app/lib/email'

type ChangePasswordState = { success: true } | { success: false; error: string } | undefined

export async function changePassword(
  _prev: ChangePasswordState,
  formData: FormData,
): Promise<ChangePasswordState> {
  try {
    const session = await auth()
    if (!session?.user) {
      return { success: false, error: 'No autenticado' }
    }

    const currentPassword = formData.get('currentPassword') as string
    const newPassword = formData.get('newPassword') as string
    const confirmPassword = formData.get('confirmPassword') as string

    if (newPassword !== confirmPassword) {
      return { success: false, error: 'Las contraseñas nuevas no coinciden' }
    }

    if (newPassword.length < 6) {
      return { success: false, error: 'La contraseña debe tener al menos 6 caracteres' }
    }

    const user = await prisma.user.findUnique({ where: { id: session.user.id } })
    if (!user) {
      return { success: false, error: 'No autenticado' }
    }

    const matches = await bcrypt.compare(currentPassword, user.password)
    if (!matches) {
      return { success: false, error: 'La contraseña actual es incorrecta' }
    }

    const hash = await bcrypt.hash(newPassword, 10)
    await prisma.user.update({ where: { id: user.id }, data: { password: hash } })

    after(async () => {
      try {
        await sendEmail({
          to: user.email,
          subject: 'Artentino — Tu contraseña fue cambiada',
          html: passwordChangedEmail({ name: user.name }),
        })
      } catch (err) {
        console.error('[email] aviso de contraseña cambiada falló:', err)
      }
    })

    return { success: true }
  } catch {
    return { success: false, error: 'Ocurrió un error al cambiar la contraseña' }
  }
}
