import { NextResponse, after } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendEmail, adminNewContactEmail } from '@/app/lib/email'

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

  after(async () => {
    try {
      await sendEmail({
        to: 'info@artentino.com',
        subject: 'Artentino — Nuevo contacto',
        html: adminNewContactEmail({ name, email, message }),
      })
    } catch (err) {
      console.error('[email] copia a info@ (contacto) falló:', err)
    }
  })

  return NextResponse.json({ success: true })
}
