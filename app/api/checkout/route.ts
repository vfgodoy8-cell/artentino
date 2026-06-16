import { NextResponse } from 'next/server'
import { MercadoPagoConfig, Preference } from 'mercadopago'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

type CartItem = {
  productId: string
  name: string
  price: number
  quantity: number
  attributeValueId?: string
}

type CheckoutBody = {
  items: CartItem[]
  payer: {
    name: string
    surname: string
    email: string
    phone: string
  }
  shipping: 'pickup' | 'delivery'
}

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL!

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const { items, payer, shipping } = (await req.json()) as CheckoutBody

  if (!items?.length || !payer?.email) {
    return NextResponse.json({ error: 'Datos incompletos' }, { status: 400 })
  }

  // Server-side stock validation — prevents overselling even if front-end is bypassed
  for (const item of items) {
    if (item.attributeValueId) {
      const stockEntry = await prisma.productStock.findUnique({
        where: {
          productId_attributeValueId: {
            productId: item.productId,
            attributeValueId: item.attributeValueId,
          },
        },
      })
      if (!stockEntry || stockEntry.stock < item.quantity) {
        return NextResponse.json(
          { error: `Sin stock suficiente para "${item.name}". Actualizá tu carrito.` },
          { status: 400 },
        )
      }
    } else {
      const stocks = await prisma.productStock.findMany({
        where: { productId: item.productId },
      })
      const total = stocks.reduce((s, st) => s + st.stock, 0)
      if (total < item.quantity) {
        return NextResponse.json(
          { error: `Sin stock suficiente para "${item.name}". Actualizá tu carrito.` },
          { status: 400 },
        )
      }
    }
  }

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const order = await prisma.order.create({
    data: {
      userId: session.user.id,
      total,
      shippingMethod: shipping,
      status: 'PENDING',
      items: {
        create: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        })),
      },
    },
  })

  try {
    const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN! })
    const preference = new Preference(client)

    const mpItems = items.map((item) => ({
      id: item.productId,
      title: item.name,
      quantity: item.quantity,
      unit_price: item.price,
      currency_id: 'ARS',
    }))

    if (shipping === 'delivery') {
      mpItems.push({
        id: 'envio',
        title: 'Envío a domicilio',
        quantity: 1,
        unit_price: 0,
        currency_id: 'ARS',
      })
    }

    const result = await preference.create({
      body: {
        items: mpItems,
        payer: {
          name: payer.name,
          email: payer.email,
          phone: { number: payer.phone },
        },
        back_urls: {
          success: `${BASE_URL}/checkout/success`,
          failure: `${BASE_URL}/checkout/failure`,
          pending: `${BASE_URL}/checkout/pending`,
        },
        auto_return: 'approved',
        notification_url: `${BASE_URL}/api/webhook/mercadopago`,
        external_reference: order.id,
      },
    })

    const initPoint = result.sandbox_init_point ?? result.init_point
    return NextResponse.json({ initPoint })
  } catch (error) {
    await prisma.order.delete({ where: { id: order.id } })
    console.error('MercadoPago error:', JSON.stringify(error, null, 2))
    return NextResponse.json({ error: 'Error al crear la preferencia de pago' }, { status: 500 })
  }
}
