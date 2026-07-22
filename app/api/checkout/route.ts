import { NextResponse } from 'next/server'
import { MercadoPagoConfig, Preference } from 'mercadopago'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { sendEmail, pickupCashEmail, adminNewOrderEmail } from '@/app/lib/email'
import { CASH_DISCOUNT, CASH_DISCOUNT_PCT, ADMIN_NOTIFICATION_EMAIL } from '@/app/lib/constants'
import { createZipnovaShipment } from '@/app/lib/zipnova'

type CartItem = {
  productId: string
  name: string
  price: number
  quantity: number
  attributeValueId?: string
}

type ShippingAddress = {
  street?: string
  streetNumber?: string
  city: string
  province?: string
  zip?: string
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
  paymentMethod?: 'mercadopago' | 'cash' | 'transfer'
  shippingAddress?: ShippingAddress
  shippingCourier?: 'ARTENTINO_EXPRESS' | 'ZIPNOVA'
  shippingQuotedAmount?: number
}

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL!

// Paquete genérico de referencia (30x30x30 cm, 3kg) — mismo criterio que /api/checkout/quote-shipping
const DEFAULT_PACKAGE = { weight: 3000, height: 30, width: 30, length: 30 }

/**
 * Si el courier elegido es Zipnova, crea la solicitud de envío contra su API.
 * Si es Artentino Express, no se crea nada — el pedido queda para gestión interna.
 * Nunca rompe el checkout si la creación falla (mismo patrón que los emails).
 */
async function attachZipnovaShipment(orderId: string, body: CheckoutBody) {
  if (body.shipping !== 'delivery' || body.shippingCourier !== 'ZIPNOVA' || !body.shippingAddress) return

  try {
    const shipment = await createZipnovaShipment({
      externalId: orderId,
      destinationName: `${body.payer.name} ${body.payer.surname}`,
      destinationDocument: '',
      destinationEmail: body.payer.email,
      destinationPhone: body.payer.phone,
      destinationStreet: body.shippingAddress.street,
      destinationStreetNumber: body.shippingAddress.streetNumber,
      city: body.shippingAddress.city,
      province: body.shippingAddress.province,
      zip: body.shippingAddress.zip,
      declaredValue: body.shippingQuotedAmount ?? 0,
      packages: [DEFAULT_PACKAGE],
    })
    await prisma.order.update({ where: { id: orderId }, data: { zipnovaShipmentId: shipment.id } })
  } catch (error) {
    console.error('[checkout] fallo al crear el envío en Zipnova:', error)
  }
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const body = (await req.json()) as CheckoutBody
  const { items, payer, shipping, paymentMethod = 'mercadopago', shippingAddress, shippingCourier, shippingQuotedAmount } = body

  if (!items?.length || !payer?.email) {
    return NextResponse.json({ error: 'Datos incompletos' }, { status: 400 })
  }

  if (shipping === 'delivery' && (!shippingAddress?.city || !shippingCourier)) {
    return NextResponse.json({ error: 'Faltan datos de envío' }, { status: 400 })
  }

  const shippingAmount = shipping === 'delivery' ? (shippingQuotedAmount ?? 0) : 0

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

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  // Resolve variant names for emails (batch, only IDs present in this order)
  const avIds = [...new Set(items.map((i) => i.attributeValueId).filter(Boolean))] as string[]
  const avMap: Record<string, string> = {}
  if (avIds.length > 0) {
    const avRows = await prisma.attributeValue.findMany({
      where: { id: { in: avIds } },
      select: { id: true, value: true },
    })
    avRows.forEach((av) => { avMap[av.id] = av.value })
  }

  // ── Cash / transfer pickup flow ────────────────────────────────────────────
  if (paymentMethod === 'cash' || paymentMethod === 'transfer') {
    const discountedTotal = Math.round(subtotal * (1 - CASH_DISCOUNT)) + shippingAmount
    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        total: discountedTotal,
        shippingMethod: shipping,
        paymentMethod,
        status: 'PENDING_PICKUP_PAYMENT',
        ...(shipping === 'delivery' ? { shippingAddress: { ...shippingAddress }, shippingCourier, shippingQuotedAmount } : {}),
        items: {
          create: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
            ...(item.attributeValueId ? { attributeValueId: item.attributeValueId } : {}),
          })),
        },
      },
    })

    await attachZipnovaShipment(order.id, body)

    // Fire-and-forget email
    sendEmail({
      to: payer.email,
      subject: 'Artentino — Pedido registrado',
      html: pickupCashEmail({
        name: payer.name,
        items: items.map((i) => ({
          name: i.name,
          quantity: i.quantity,
          price: i.price,
          variantName: i.attributeValueId ? avMap[i.attributeValueId] : undefined,
        })),
        total: discountedTotal,
        discountPct: CASH_DISCOUNT_PCT,
        paymentMethod,
      }),
    }).catch(() => {})

    if (ADMIN_NOTIFICATION_EMAIL) {
      sendEmail({
        to: ADMIN_NOTIFICATION_EMAIL,
        subject: 'Artentino — Nuevo pedido',
        html: adminNewOrderEmail({ orderId: order.id, customerName: payer.name, total: discountedTotal }),
      }).catch(() => {})
    }

    return NextResponse.json({ confirmed: true, orderId: order.id })
  }

  // ── MercadoPago flow ────────────────────────────────────────────────────────
  const total = subtotal + shippingAmount

  const order = await prisma.order.create({
    data: {
      userId: session.user.id,
      total,
      shippingMethod: shipping,
      paymentMethod: 'mercadopago',
      status: 'PENDING',
      ...(shipping === 'delivery' ? { shippingAddress: { ...shippingAddress }, shippingCourier, shippingQuotedAmount } : {}),
      items: {
        create: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
          ...(item.attributeValueId ? { attributeValueId: item.attributeValueId } : {}),
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
        title: shippingCourier === 'ARTENTINO_EXPRESS' ? 'Envío Express (Artentino)' : 'Envío Zipnova',
        quantity: 1,
        unit_price: shippingAmount,
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

    await attachZipnovaShipment(order.id, body)

    if (ADMIN_NOTIFICATION_EMAIL) {
      sendEmail({
        to: ADMIN_NOTIFICATION_EMAIL,
        subject: 'Artentino — Nuevo pedido',
        html: adminNewOrderEmail({ orderId: order.id, customerName: payer.name, total }),
      }).catch(() => {})
    }

    return NextResponse.json({ initPoint })
  } catch (error) {
    // Los OrderItem se crean junto con el Order (nested write) — hay que borrarlos primero,
    // si no la FK RESTRICT de order_items rechaza el delete del Order.
    await prisma.orderItem.deleteMany({ where: { orderId: order.id } })
    await prisma.order.delete({ where: { id: order.id } })
    console.error('MercadoPago error:', JSON.stringify(error, null, 2))
    return NextResponse.json({ error: 'Error al crear la preferencia de pago' }, { status: 500 })
  }
}
