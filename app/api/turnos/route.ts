import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendEmail, appointmentConfirmationEmail } from '@/app/lib/email'

export async function POST(req: Request) {
  const body = await req.json()
  const { name, surname, email, phone, modality, date, time } = body

  if (!name || !surname || !email || !phone || !modality || !date || !time) {
    return NextResponse.json({ error: 'Todos los campos son requeridos' }, { status: 400 })
  }

  const start = new Date(date + 'T00:00:00.000Z')
  const end = new Date(date + 'T23:59:59.999Z')

  const conflict = await prisma.appointment.findFirst({
    where: {
      date: { gte: start, lte: end },
      time,
      status: { not: 'CANCELLED' },
    },
  })

  if (conflict) {
    return NextResponse.json(
      { error: 'El horario seleccionado ya no está disponible. Por favor elegí otro.' },
      { status: 409 }
    )
  }

  const appointment = await prisma.appointment.create({
    data: {
      name: `${name} ${surname}`,
      email,
      phone,
      date: start,
      time,
      modality,
    },
  })

  const formattedDate = start.toLocaleDateString('es-AR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  })

  sendEmail({
    to: email,
    subject: 'Tu turno en Artentino está confirmado',
    html: appointmentConfirmationEmail({ name, date: formattedDate, time, modality }),
  }).catch((err) => console.error('[email] appointment confirmation failed:', err))

  return NextResponse.json({ success: true, id: appointment.id })
}
