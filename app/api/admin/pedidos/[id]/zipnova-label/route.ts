import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function safeJsonParse(text: string): any {
  try {
    return JSON.parse(text)
  } catch {
    return null
  }
}

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const order = await prisma.order.findUnique({
    where: { id },
    select: { zipnovaShipmentId: true },
  })

  if (!order) {
    return NextResponse.json({ error: 'Pedido no encontrado' }, { status: 404 })
  }

  if (!order.zipnovaShipmentId) {
    return NextResponse.json({ error: 'Este pedido no tiene un envío de Zipnova creado' }, { status: 400 })
  }

  const key = process.env.ZIPNOVA_KEY
  const secret = process.env.ZIPNOVA_SECRET
  if (!key || !secret) {
    return NextResponse.json({ error: 'Zipnova no configurado' }, { status: 500 })
  }

  const baseUrl = process.env.ZIPNOVA_BASE_URL || 'https://api.zipnova.com.ar'
  const basicAuth = Buffer.from(`${key}:${secret}`).toString('base64')

  try {
    const res = await fetch(`${baseUrl}/v2/shipments/${order.zipnovaShipmentId}/label.pdf`, {
      headers: {
        Accept: 'application/json',
        Authorization: `Basic ${basicAuth}`,
      },
      signal: AbortSignal.timeout(8000),
    })

    if (res.status === 409) {
      return NextResponse.json(
        { ready: false, message: 'La etiqueta todavía se está procesando, probá de nuevo en unos minutos' },
        { status: 202 },
      )
    }

    const rawBody = await res.text()

    if (!res.ok) {
      console.error(`[zipnova] ${res.status} al descargar etiqueta — shipment ${order.zipnovaShipmentId}:`, rawBody)
      return NextResponse.json({ error: `Zipnova respondió ${res.status} al pedir la etiqueta` }, { status: 500 })
    }

    const parsedBody = safeJsonParse(rawBody)

    let base64: string | null = null
    if (parsedBody) {
      const candidate = parsedBody.data ?? parsedBody.content ?? parsedBody.file ?? parsedBody.label
      if (typeof candidate === 'string') {
        base64 = candidate
      } else if (candidate && typeof candidate === 'object') {
        base64 =
          candidate.data ?? candidate.content ?? candidate.file ?? candidate.label ?? null
      }
    } else {
      base64 = rawBody
    }

    if (!base64 || typeof base64 !== 'string') {
      console.error('[zipnova] respuesta 200 sin PDF reconocible al descargar etiqueta — response:', rawBody)
      return NextResponse.json({ error: 'Zipnova no devolvió una etiqueta reconocible' }, { status: 500 })
    }

    const pdfBuffer = Buffer.from(base64, 'base64')

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="envio-${order.zipnovaShipmentId}.pdf"`,
      },
    })
  } catch (error) {
    console.error('[zipnova] error al descargar etiqueta:', error)
    return NextResponse.json({ error: 'No se pudo descargar la etiqueta de Zipnova' }, { status: 500 })
  }
}
