import { after } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendEmail, purchaseConfirmationEmail, interpolate } from '@/app/lib/email'
import { triggerZipnovaShipmentIfNeeded } from '@/app/lib/shipping/zipnova'
import { getSiteContact } from '@/app/lib/site-contact'
import { addContactToBrevo } from '@/app/lib/brevo'

type ApplyResult = { ok: true } | { ok: false; reason: string }

// Efectos secundarios de confirmar un pedido pagado: dispara el envío por Zipnova si
// corresponde y manda los mails de confirmación (cliente + copia a info@). Compartido
// entre el webhook de MercadoPago (app/api/webhook/mercadopago) y el cron de
// reconciliación (app/api/cron/reconcile-orders) — el caller es responsable de haber
// actualizado antes `order.status` a CONFIRMED.
export async function applyOrderConfirmedEffects(orderId: string): Promise<ApplyResult> {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: { include: { product: { select: { name: true } } } },
      user: { select: { name: true, email: true } },
    },
  })

  if (!order) return { ok: false, reason: 'order-not-found' }

  await triggerZipnovaShipmentIfNeeded(orderId)

  const customerName = order.contactName ?? order.user?.name
  const customerEmail = order.contactEmail ?? order.user?.email

  if (!customerName || !customerEmail) return { ok: false, reason: 'missing-contact' }

  const contact = await getSiteContact()
  const shippingLabel =
    order.shippingMethod === 'pickup'
      ? `Retiro en tienda — ${contact.addressLine1}`
      : 'Envío a domicilio'

  const itemsData = order.items.map((i) => ({
    name: i.product.name,
    quantity: i.quantity,
    price: Number(i.price),
  }))

  // after() extiende la invocación serverless hasta que estas promesas resuelvan —
  // sin esto, Vercel puede congelar el proceso apenas se manda la response y el
  // fetch a Resend nunca llega a completarse.
  after(async () => {
    // Independiente del envío de mails — si Brevo falla no debe afectarlos (ni viceversa).
    await addContactToBrevo(customerEmail, { PRENOM: customerName })

    try {
      const template = await prisma.emailTemplate.findUnique({
        where: { key: 'ORDER_PRE_CONFIRMATION' },
      })

      const html = template
        ? interpolate(template.htmlBody, {
            nombreCliente: customerName,
            itemsHtml: itemsData
              .map(
                (item) =>
                  `<tr>
                    <td style="padding:10px 0;color:#1E1E1E;border-bottom:1px solid #eee;">${item.name}</td>
                    <td style="padding:10px 0;color:#888;text-align:center;border-bottom:1px solid #eee;">×${item.quantity}</td>
                    <td style="padding:10px 0;color:#1E1E1E;font-weight:700;text-align:right;border-bottom:1px solid #eee;">$${(item.price * item.quantity).toLocaleString('es-AR')}</td>
                  </tr>`,
              )
              .join(''),
            total: Number(order.total).toLocaleString('es-AR'),
            envio: shippingLabel,
          })
        : purchaseConfirmationEmail({
            name: customerName,
            items: itemsData,
            total: Number(order.total),
            shipping: (order.shippingMethod as 'pickup' | 'delivery') ?? 'pickup',
          })

      const subject = template?.subject ?? '¡Gracias por tu compra en Artentino!'

      // Independientes entre sí — si uno falla, el otro tiene que intentar igual.
      await sendEmail({ to: customerEmail, subject, html }).catch((err) => {
        console.error('[order-confirmed] email al cliente falló:', err)
      })

      await sendEmail({
        to: 'info@artentino.com',
        subject: `Nuevo pedido — ${customerName} — $${Number(order.total).toLocaleString('es-AR')}`,
        html,
      }).catch((err) => {
        console.error('[order-confirmed] copia a info@ falló:', err)
      })
    } catch (err) {
      console.error('[order-confirmed] email failed:', err)
    }
  })

  return { ok: true }
}
