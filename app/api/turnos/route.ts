import { NextResponse, after } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendEmail, appointmentConfirmationEmail, adminNewAppointmentEmail, interpolate } from '@/app/lib/email'
import { ADMIN_NOTIFICATION_EMAIL } from '@/app/lib/constants'
import { resolveBaseUrl } from '@/app/lib/base-url'

const BASE_URL = resolveBaseUrl()

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
      { status: 409 },
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

  const modalityLabel = modality === 'PRESENCIAL' ? 'Presencial en showroom' : 'WhatsApp por cámara'

  // after() extiende la invocación serverless hasta que esta promesa resuelva —
  // sin esto, Vercel puede congelar el proceso apenas se manda la response y el
  // fetch a Resend nunca llega a completarse.
  after(async () => {
    try {
      const template = await prisma.emailTemplate.findUnique({
        where: { key: 'APPOINTMENT_CONFIRMATION' },
      })

      const html = template
        ? interpolate(template.htmlBody, {
            nombreCliente: name,
            fecha: formattedDate,
            hora: time,
            modalidad: modalityLabel,
          })
        : appointmentConfirmationEmail({ name, date: formattedDate, time, modality })

      const subject = template?.subject ?? 'Tu turno en Artentino está confirmado'

      await sendEmail({ to: email, subject, html })
    } catch (err) {
      console.error('[email] appointment confirmation failed:', err)
    }

    // Independiente del mail al cliente — si uno falla, el otro se intenta igual.
    try {
      await sendEmail({
        to: ADMIN_NOTIFICATION_EMAIL,
        subject: `Nuevo turno — ${appointment.name} — ${formattedDate} ${time}`,
        html: adminNewAppointmentEmail({
          name: appointment.name,
          email,
          phone,
          date: formattedDate,
          time,
          modality,
          adminUrl: `${BASE_URL}/admin/turnos`,
        }),
      })
    } catch (err) {
      console.error('[email] aviso de turno a admin falló:', err)
    }
  })

  return NextResponse.json({ success: true, id: appointment.id })
}
