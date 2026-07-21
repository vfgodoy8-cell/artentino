import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendEmail, adminNewContactEmail } from '@/app/lib/email'
import { ADMIN_NOTIFICATION_EMAIL } from '@/app/lib/constants'

export async function POST(req: Request) {
  const body = await req.json()
  const { name, email, phone, message } = body

  if (!name || !email || !message) {
    return NextResponse.json({ error: 'Campos requeridos incompletos' }, { status: 400 })
  }

  await prisma.contact.create({
    data: {
      type: 'GENERAL',
      name,
      email,
      phone: phone || null,
      message,
    },
  })

  if (ADMIN_NOTIFICATION_EMAIL) {
    sendEmail({
      to: ADMIN_NOTIFICATION_EMAIL,
      subject: 'Artentino — Nuevo contacto',
      html: adminNewContactEmail({ name, email, message }),
    }).catch(() => {})
  }

  return NextResponse.json({ success: true })
}
