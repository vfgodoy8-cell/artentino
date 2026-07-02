import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

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

  return NextResponse.json({ success: true })
}
