import { NextResponse } from 'next/server'
import { MercadoPagoConfig, Preference } from 'mercadopago'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { sendEmail, pickupCashEmail, adminNewOrderEmail } from '@/app/lib/email'
import { CASH_DISCOUNT, CASH_DISCOUNT_PCT, ADMIN_NOTIFICATION_EMAIL } from '@/app/lib/constants'
import { CABA_LOCALITY, OTHER_COUNTRY_LOCALITY, isExpressLocality } from '@/app/lib/shipping-zones'
import { getZipnovaQuote, type ZipnovaQuoteItem } from '@/app/lib/shipping/zipnova'

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
  locality: string
  zip?: string
  city?: string
  province?: string
}

type ShippingProvider = 'PICKUP' | 'ARTENTINO' | 'ZIPNOVA'

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
}

function resolveBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_BASE_URL) return process.env.NEXT_PUBLIC_BASE_URL

  console.warn(
    '[checkout] NEXT_PUBLIC_BASE_URL no está seteada — los back_urls de MercadoPago pueden apuntar mal. Revisar variables de entorno en Vercel.',
  )
  // Fallback controlado: en Vercel, VERCEL_PROJECT_PRODUCTION_URL siempre está presente
  // y apunta al dominio real de producción, evitando que un back_url termine en localhost.
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  }
  return 'http://localhost:3000'
}

const BASE_URL = resolveBaseUrl()
// Fallback cuando el producto no tiene peso/dimensiones cargados en el admin.
const DEFAULT_WEIGHT_GRAMS = 3000
const DEFAULT_DIMENSION_CM = 30

export async function POST(req: Request) {
  const session = await auth()

  const body = (await req.json()) as CheckoutBody
  const { items, payer, shipping, paymentMethod = 'mercadopago', shippingAddress } = body

  if (!items?.length || !payer?.email) {
    return NextResponse.json({ error: 'Datos incompletos' }, { status: 400 })
  }

  if (shipping === 'delivery' && !shippingAddress?.locality) {
    return NextResponse.json({ error: 'Faltan datos de envío' }, { status: 400 })
  }

  if (
    shipping === 'delivery' &&
    shippingAddress!.locality === OTHER_COUNTRY_LOCALITY &&
    (!shippingAddress?.city || !shippingAddress?.province)
  ) {
    return NextResponse.json({ error: 'Faltan ciudad y provincia para el destino' }, { status: 400 })
  }

  // Nunca confiar en el provider/monto que mande el cliente — se recalcula acá.
  let shippingProvider: ShippingProvider = 'PICKUP'
  let shippingAmount = 0

  if (shipping === 'delivery') {
    const locality = shippingAddress!.locality
    const isExpress = await isExpressLocality(locality)
    shippingProvider = isExpress ? 'ARTENTINO' : 'ZIPNOVA'

    const shippingProducts = await prisma.product.findMany({
      where: { id: { in: items.map((i) => i.productId) } },
      select: { id: true, height: true, width: true, length: true, weight: true },
    })
    const shippingProductMap = new Map(shippingProducts.map((p) => [p.id, p]))

    const quoteItems: ZipnovaQuoteItem[] = items.map((item) => {
      const product = shippingProductMap.get(item.productId)
      return {
        weightGrams: product?.weight ? Math.round(Number(product.weight) * 1000) : DEFAULT_WEIGHT_GRAMS,
        heightCm: product?.height ? Number(product.height) : DEFAULT_DIMENSION_CM,
        widthCm: product?.width ? Number(product.width) : DEFAULT_DIMENSION_CM,
        lengthCm: product?.length ? Number(product.length) : DEFAULT_DIMENSION_CM,
        quantity: item.quantity,
      }
    })

    const declaredValue = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

    // "Resto del país" no es una localidad real de Zipnova — usa la ciudad/provincia
    // que cargó el usuario. Para CABA/GBA, la localidad elegida en el dropdown es la ciudad real.
    const destinationCity = locality === OTHER_COUNTRY_LOCALITY ? shippingAddress!.city! : locality
    const destinationState =
      locality === OTHER_COUNTRY_LOCALITY
        ? shippingAddress!.province!
        : locality === CABA_LOCALITY
        ? 'Capital Federal'
        : 'Buenos Aires'

    const quote = await getZipnovaQuote({
      destinationCity,
      destinationState,
      destinationZipcode: shippingAddress!.zip,
      items: quoteItems,
      declaredValue,
    })

    if (!quote.ok) {
      return NextResponse.json(
        { error: 'Envío a domicilio no disponible por el momento. Probá con retiro en tienda.' },
        { status: 409 },
      )
    }

    shippingAmount = quote.price
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
        userId: session?.user?.id ?? null,
        contactName: `${payer.name} ${payer.surname}`.trim(),
        contactEmail: payer.email,
        contactPhone: payer.phone,
        total: discountedTotal,
        shippingMethod: shipping,
        paymentMethod,
        status: 'PENDING_PICKUP_PAYMENT',
        shippingProvider,
        ...(shipping === 'delivery' ? { shippingAddress: { ...shippingAddress }, shippingQuotedAmount: shippingAmount } : {}),
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
      userId: session?.user?.id ?? null,
      contactName: `${payer.name} ${payer.surname}`.trim(),
      contactEmail: payer.email,
      contactPhone: payer.phone,
      total,
      shippingMethod: shipping,
      paymentMethod: 'mercadopago',
      status: 'PENDING',
      shippingProvider,
      ...(shipping === 'delivery' ? { shippingAddress: { ...shippingAddress }, shippingQuotedAmount: shippingAmount } : {}),
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
        title: shippingProvider === 'ARTENTINO' ? 'Envío Artentino' : 'Envío Zipnova',
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

    const initPoint = result.init_point ?? result.sandbox_init_point

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
