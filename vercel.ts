import { type VercelConfig } from '@vercel/config/v1'

export const config: VercelConfig = {
  crons: [
    // Refresca el long-lived token de Instagram todos los días a las 06:00 UTC.
    // El route handler solo refresca de verdad si el token tiene >=24hs desde
    // su última actualización (requisito de Meta) — de lo contrario responde skip.
    { path: '/api/cron/instagram-refresh', schedule: '0 6 * * *' },
  ],
}
