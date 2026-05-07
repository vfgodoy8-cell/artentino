import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const ALL_SLOTS = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00']

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const date = searchParams.get('date')

  if (!date) {
    return NextResponse.json({ error: 'date requerida' }, { status: 400 })
  }

  const start = new Date(date + 'T00:00:00.000Z')
  const end = new Date(date + 'T23:59:59.999Z')

  const booked = await prisma.appointment.findMany({
    where: {
      date: { gte: start, lte: end },
      status: { not: 'CANCELLED' },
    },
    select: { time: true },
  })

  const bookedTimes = booked.map((a) => a.time)
  const available = ALL_SLOTS.filter((slot) => !bookedTimes.includes(slot))

  return NextResponse.json({ available })
}
