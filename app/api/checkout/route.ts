import { NextResponse } from 'next/server'
import { MercadoPagoConfig, Preference } from 'mercadopago'
import { sendEmail, purchaseConfirmationEmail } from '@/app/lib/email'

type CartItem = {
  productId: string
  name: string
  price: number
  quantity: number
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

export async function POST(req: Request) {
  console.log('MP Token:', process.env.MP_ACCESS_TOKEN?.substring(0, 20))

  const { items, payer, shipping } = (await req.json()) as CheckoutBody

  if (!items?.length || !payer?.email) {
    return NextResponse.json({ error: 'Datos incompletos' }, { status: 400 })
  }

  try {
    const client = new MercadoPagoConfig({
      accessToken: process.env.MP_ACCESS_TOKEN!,
    })
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

    const body = {
      items: mpItems,
      payer: {
        name: payer.name,
        email: payer.email,
        phone: { number: payer.phone },
      },
      back_urls: {
        success: 'http://localhost:3000/checkout/success',
        failure: 'http://localhost:3000/checkout/failure',
        pending: 'http://localhost:3000/checkout/pending',
      },
    }

    console.log('Creating preference with body:', JSON.stringify(body, null, 2))

    const result = await preference.create({ body })

    // In sandbox, init_point redirects to the real MP payment page.
    // sandbox_init_point stays inside the sandbox environment.
    const initPoint = result.sandbox_init_point ?? result.init_point
    console.log('Preference created, initPoint:', initPoint?.substring(0, 60))

    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    sendEmail({
      to: payer.email,
      subject: '¡Gracias por tu compra en Artentino!',
      html: purchaseConfirmationEmail({ name: payer.name, items, total, shipping }),
    }).catch((err) => console.error('[email] purchase confirmation failed:', err))

    return NextResponse.json({ initPoint })
  } catch (error) {
    console.error('MercadoPago error:', JSON.stringify(error, null, 2))
    return NextResponse.json({ error: JSON.stringify(error) }, { status: 500 })
  }
}
