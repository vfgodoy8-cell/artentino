import { type VercelConfig } from '@vercel/config/v1'

export const config: VercelConfig = {
  crons: [
    // Refresca el long-lived token de Instagram todos los días a las 06:00 UTC.
    // El route handler solo refresca de verdad si el token tiene >=24hs desde
    // su última actualización (requisito de Meta) — de lo contrario responde skip.
    { path: '/api/cron/instagram-refresh', schedule: '0 6 * * *' },
    // Reconcilia órdenes PENDING de MercadoPago contra la API de MP cada 6hs — red de
    // contención si el webhook no llega a confirmar un pago (ver app/api/cron/reconcile-orders).
    { path: '/api/cron/reconcile-orders', schedule: '0 */6 * * *' },
  ],
}
