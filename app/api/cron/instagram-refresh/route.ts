import { NextResponse } from 'next/server'
import { getInstagramToken, saveInstagramToken } from '@/app/lib/instagram-token'
import { prisma } from '@/lib/prisma'
import { sendEmail, instagramTokenReminderEmail } from '@/app/lib/email'

const DAY_MS = 24 * 60 * 60 * 1000
const TOKEN_LIFETIME_DAYS = 60
const REMINDER_THRESHOLD_DAYS = 50

export async function GET(req: Request) {
  const authHeader = req.headers.get('authorization')
  if (!process.env.CRON_SECRET || authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
  }

  // TEMPORAL — solo para probar el recordatorio sin esperar 50 días. Sacar antes de cerrar la fase.
  const forceReminder = new URL(req.url).searchParams.get('forceReminder') === '1'

  let refreshResult: { ok: boolean; skipped?: string; error?: string; expiresAt?: string } = {
    ok: true,
    skipped: 'no-token',
  }

  const token = await getInstagramToken()

  if (token) {
    const tokenAgeMs = Date.now() - token.updatedAt.getTime()

    if (tokenAgeMs < DAY_MS) {
      refreshResult = { ok: true, skipped: 'too-young' }
    } else if (token.expiresAt.getTime() <= Date.now()) {
      refreshResult = {
        ok: false,
        skipped: 'expired',
        error: 'Token ya vencido — requiere reconexión manual.',
      }
    } else {
      const url = `https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=${encodeURIComponent(token.accessToken)}`

      try {
        const res = await fetch(url)
        const json: { access_token?: string; expires_in?: number; error?: { message: string } } =
          await res.json()

        if (json.error || !json.access_token || !json.expires_in) {
          refreshResult = {
            ok: false,
            error: json.error?.message ?? 'Respuesta inesperada al refrescar el token.',
          }
        } else {
          const expiresAt = new Date(Date.now() + json.expires_in * 1000)
          await saveInstagramToken(json.access_token, expiresAt, token.igUserId ?? undefined)
          refreshResult = { ok: true, expiresAt: expiresAt.toISOString() }
        }
      } catch (err) {
        refreshResult = { ok: false, error: `Fetch falló: ${String(err)}` }
      }
    }
  }

  // ── Recordatorio de vencimiento a administradores ──────────────────────────
  // Responsabilidad independiente del refresh de arriba — un fallo acá nunca debe
  // afectar el resultado del refresh, que ya se resolvió y persistió si correspondía.
  let reminderResult: { sent: boolean; reason?: string } = { sent: false }

  try {
    const current = await getInstagramToken()

    if (!current) {
      reminderResult = { sent: false, reason: 'no-token' }
    } else {
      const tokenAgeDays = (Date.now() - current.updatedAt.getTime()) / DAY_MS
      const shouldRemind = forceReminder || (tokenAgeDays >= REMINDER_THRESHOLD_DAYS && !current.reminderSentAt)

      if (!shouldRemind) {
        reminderResult = { sent: false, reason: 'not-due' }
      } else {
        const admins = await prisma.user.findMany({
          where: { role: 'ADMIN' },
          select: { email: true },
        })

        if (admins.length === 0) {
          console.warn('[instagram-refresh] no hay administradores para notificar el vencimiento del token')
          reminderResult = { sent: false, reason: 'no-admins' }
        } else {
          const daysRemaining = Math.max(0, TOKEN_LIFETIME_DAYS - Math.floor(tokenAgeDays))

          await Promise.all(
            admins.map((admin) =>
              sendEmail({
                to: admin.email,
                subject: 'Artentino — El token de Instagram vence pronto',
                html: instagramTokenReminderEmail({ daysRemaining, expiresAt: current.expiresAt }),
              }).catch(() => {}),
            ),
          )

          await prisma.instagramToken.update({
            where: { id: current.id },
            data: { reminderSentAt: new Date() },
          })

          reminderResult = { sent: true }
        }
      }
    }
  } catch (err) {
    console.error('[instagram-refresh] fallo al procesar el recordatorio de vencimiento:', err)
  }

  return NextResponse.json({ ...refreshResult, reminder: reminderResult })
}
