import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { prisma } from '@/lib/prisma'
import { sendEmail, passwordResetEmail } from '@/app/lib/email'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL!

export async function POST(req: Request) {
  const { email } = await req.json()

  if (!email) {
    return NextResponse.json({ error: 'Email requerido' }, { status: 400 })
  }

  const user = await prisma.user.findUnique({ where: { email } })

  if (user) {
    const token = crypto.randomBytes(32).toString('hex')
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000)

    await prisma.passwordResetToken.create({
      data: { userId: user.id, token, expiresAt },
    })

    sendEmail({
      to: user.email,
      subject: 'Artentino — Recuperar contraseña',
      html: passwordResetEmail({
        name: user.name,
        resetUrl: `${BASE_URL}/restablecer-contrasena?token=${token}`,
      }),
    }).catch(() => {})
  }

  // Respuesta genérica — nunca revela si el email existe
  return NextResponse.json({ success: true })
}
