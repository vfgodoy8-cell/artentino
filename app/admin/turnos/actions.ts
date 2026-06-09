'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'

const VALID_STATUSES = ['PENDING', 'CONFIRMED', 'CANCELLED'] as const
type AppointmentStatus = (typeof VALID_STATUSES)[number]

export async function updateAppointmentStatus(id: string, status: string) {
  if (!VALID_STATUSES.includes(status as AppointmentStatus)) {
    throw new Error('Estado inválido')
  }
  await prisma.appointment.update({
    where: { id },
    data: { status: status as AppointmentStatus },
  })
  revalidatePath('/admin/turnos')
  revalidatePath(`/admin/turnos/${id}`)
}
