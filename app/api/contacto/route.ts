import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  const body = await req.json()
  const { type, name, email, phone, position, message } = body

  if (!type || !name || !email || !message) {
    return NextResponse.json({ error: 'Campos requeridos incompletos' }, { status: 400 })
  }

  if (type !== 'GENERAL' && type !== 'JOB') {
    return NextResponse.json({ error: 'Tipo inválido' }, { status: 400 })
  }

  await prisma.contact.create({
    data: {
      type,
      name,
      email,
      phone: phone || null,
      position: position || null,
      message,
    },
  })

  return NextResponse.json({ success: true })
}
