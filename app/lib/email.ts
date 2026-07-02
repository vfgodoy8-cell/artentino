import { Resend } from 'resend'

export function interpolate(template: string, vars: Record<string, string>): string {
  return Object.entries(vars).reduce(
    (html, [key, val]) => html.replaceAll(`{{${key}}}`, val),
    template,
  )
}

const resend = new Resend(process.env.RESEND_API_KEY)

type SendEmailParams = {
  to: string
  subject: string
  html: string
}

export async function sendEmail({ to, subject, html }: SendEmailParams) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('[email] RESEND_API_KEY not configured, skipping send')
    return { error: null }
  }
  return resend.emails.send({
    from: 'Artentino <noreply@artentino.com.ar>',
    to,
    subject,
    html,
  })
}

const HEADER = `
  <div style="background:#0eb1c3;padding:36px 32px;text-align:center;">
    <p style="margin:0;color:rgba(255,255,255,.75);font-size:11px;font-weight:900;letter-spacing:3px;text-transform:uppercase;">Artentino</p>
    <h1 style="margin:8px 0 0;color:#fff;font-size:22px;font-weight:900;letter-spacing:1px;">{{title}}</h1>
  </div>`

const FOOTER = `
  <div style="background:#F7F7F7;padding:20px 32px;text-align:center;">
    <p style="margin:0;color:#aaa;font-size:12px;">© 2025 Artentino — Colegiales, CABA</p>
  </div>`

const WRAP_START = `<!DOCTYPE html><html lang="es">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:40px 0;background:#F7F7F7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,sans-serif;">
  <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:20px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.08);">`

const WRAP_END = `</div></body></html>`

export function appointmentConfirmationEmail({
  name,
  date,
  time,
  modality,
}: {
  name: string
  date: string
  time: string
  modality: 'PRESENCIAL' | 'WHATSAPP'
}) {
  const modalityLabel = modality === 'PRESENCIAL' ? 'Presencial en showroom' : 'WhatsApp por cámara'
  return (
    WRAP_START +
    HEADER.replace('{{title}}', '¡Turno confirmado!') +
    `<div style="padding:36px 32px;">
      <p style="margin:0 0 8px;color:#1E1E1E;font-size:16px;">Hola <strong>${name}</strong>,</p>
      <p style="margin:0 0 28px;color:#555;line-height:1.6;">Tu turno fue reservado exitosamente. Te esperamos.</p>
      <div style="background:#F7F7F7;border-radius:12px;padding:20px 24px;margin-bottom:28px;">
        <table style="width:100%;border-collapse:collapse;">
          <tr>
            <td style="padding:7px 0;color:#888;font-size:11px;font-weight:900;text-transform:uppercase;letter-spacing:1px;width:38%;">Fecha</td>
            <td style="padding:7px 0;color:#1E1E1E;font-weight:700;">${date}</td>
          </tr>
          <tr>
            <td style="padding:7px 0;color:#888;font-size:11px;font-weight:900;text-transform:uppercase;letter-spacing:1px;">Hora</td>
            <td style="padding:7px 0;color:#1E1E1E;font-weight:700;">${time} hs</td>
          </tr>
          <tr>
            <td style="padding:7px 0;color:#888;font-size:11px;font-weight:900;text-transform:uppercase;letter-spacing:1px;">Modalidad</td>
            <td style="padding:7px 0;color:#1E1E1E;font-weight:700;">${modalityLabel}</td>
          </tr>
        </table>
      </div>
      <p style="margin:0 0 24px;color:#555;line-height:1.6;">
        Nos comunicaremos para confirmar los detalles. Si necesitás cambiar o cancelar, escribinos a través de nuestra web.
      </p>
      <p style="margin:0;color:#0eb1c3;font-weight:900;">Equipo Artentino</p>
    </div>` +
    FOOTER +
    WRAP_END
  )
}

export function purchaseConfirmationEmail({
  name,
  items,
  total,
  shipping,
}: {
  name: string
  items: Array<{ name: string; quantity: number; price: number }>
  total: number
  shipping: 'pickup' | 'delivery'
}) {
  const shippingLabel =
    shipping === 'pickup' ? 'Retiro en tienda — Colegiales, CABA' : 'Envío a domicilio'

  const itemRows = items
    .map(
      (item) =>
        `<tr>
          <td style="padding:10px 0;color:#1E1E1E;border-bottom:1px solid #eee;">${item.name}</td>
          <td style="padding:10px 0;color:#888;text-align:center;border-bottom:1px solid #eee;">×${item.quantity}</td>
          <td style="padding:10px 0;color:#1E1E1E;font-weight:700;text-align:right;border-bottom:1px solid #eee;">$${(item.price * item.quantity).toLocaleString('es-AR')}</td>
        </tr>`
    )
    .join('')

  return (
    WRAP_START +
    HEADER.replace('{{title}}', '¡Gracias por tu compra!') +
    `<div style="padding:36px 32px;">
      <p style="margin:0 0 8px;color:#1E1E1E;font-size:16px;">Hola <strong>${name}</strong>,</p>
      <p style="margin:0 0 28px;color:#555;line-height:1.6;">
        Recibimos tu pedido y lo estamos procesando. Te avisamos cuando esté listo.
      </p>
      <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
        <thead>
          <tr>
            <th style="text-align:left;color:#888;font-size:11px;font-weight:900;text-transform:uppercase;letter-spacing:1px;padding-bottom:10px;border-bottom:2px solid #eee;">Producto</th>
            <th style="text-align:center;color:#888;font-size:11px;font-weight:900;text-transform:uppercase;letter-spacing:1px;padding-bottom:10px;border-bottom:2px solid #eee;">Cant.</th>
            <th style="text-align:right;color:#888;font-size:11px;font-weight:900;text-transform:uppercase;letter-spacing:1px;padding-bottom:10px;border-bottom:2px solid #eee;">Precio</th>
          </tr>
        </thead>
        <tbody>${itemRows}</tbody>
        <tfoot>
          <tr>
            <td colspan="2" style="padding:16px 0 0;color:#1E1E1E;font-weight:900;font-size:14px;text-transform:uppercase;letter-spacing:1px;">Total</td>
            <td style="padding:16px 0 0;text-align:right;color:#1E1E1E;font-weight:900;font-size:20px;">$${total.toLocaleString('es-AR')}</td>
          </tr>
        </tfoot>
      </table>
      <div style="background:#F7F7F7;border-radius:12px;padding:16px 20px;margin-bottom:28px;">
        <p style="margin:0;color:#555;"><strong style="color:#1E1E1E;">Envío:</strong> ${shippingLabel}</p>
      </div>
      <p style="margin:0;color:#0eb1c3;font-weight:900;">Equipo Artentino</p>
    </div>` +
    FOOTER +
    WRAP_END
  )
}
