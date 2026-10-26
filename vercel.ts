import { type VercelConfig } from '@vercel/config/v1'

export const config: VercelConfig = {
  crons: [
    // Chequea el long-lived token de Instagram los lunes a las 06:00 UTC. El route handler
    // solo lo refresca si tiene >30 días (dura 60) y avisa por mail a los admins si el
    // refresco falla o el token supera los 50 días.
    { path: '/api/cron/instagram-refresh', schedule: '0 6 * * 1' },
    // reconcile-orders DESACTIVADO a propósito (2026-10-26): al cargar CRON_SECRET en
    // Production (necesario para instagram-refresh) este cron empezaría a correr y cancelaría
    // las órdenes PENDING reales que todavía no se revisaron a mano. Reactivar cuando estén
    // revisadas: { path: '/api/cron/reconcile-orders', schedule: '0 12 * * *' }
  ],
}
