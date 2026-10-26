import { NextResponse, after } from 'next/server'
import { revalidateTag } from 'next/cache'
import {
  getInstagramToken,
  refreshAccessToken,
  saveInstagramToken,
  INSTAGRAM_FEED_TAG,
} from '@/app/lib/instagram-token'
import { prisma } from '@/lib/prisma'
import { sendEmail, instagramTokenReminderEmail } from '@/app/lib/email'

const DAY_MS = 24 * 60 * 60 * 1000
// El cron corre semanalmente (vercel.ts). Con umbral de 30 días, el refresh cae entre el
// día 30 y el 37 de vida del token (dura 60) — quedan ~3 corridas de margen si falla.
const REFRESH_THRESHOLD_DAYS = 30
// Red de seguridad: si por cualquier motivo el token llega a esta edad sin refrescarse,
// se avisa aunque esta corrida no haya fallado (ej. el cron estuvo caído varias semanas).
const REMINDER_THRESHOLD_DAYS = 50

type RefreshResult =
  | { status: 'refreshed'; expiresAt: string }
  | { status: 'skipped'; reason: 'no-token' | 'too-young'; ageDays?: number }
  | { status: 'failed'; error: string }

// Prueba manual: curl -H "Authorization: Bearer $CRON_SECRET" https://<host>/api/cron/instagram-refresh
// Con ?force=1 refresca aunque el token tenga menos de 30 días (Meta exige >=24hs de edad).
export async function GET(req: Request) {
  const authHeader = req.headers.get('authorization')
  if (!process.env.CRON_SECRET || authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
  }

  const force = new URL(req.url).searchParams.get('force') === '1'

  const token = await getInstagramToken()
  if (!token) {
    return NextResponse.json({ ok: true, refresh: { status: 'skipped', reason: 'no-token' }, reminder: 'not-due' })
  }

  const ageDays = (Date.now() - token.refreshedAt.getTime()) / DAY_MS
  let refresh: RefreshResult

  if (!force && ageDays < REFRESH_THRESHOLD_DAYS) {
    refresh = { status: 'skipped', reason: 'too-young', ageDays: Math.floor(ageDays) }
  } else if (token.expiresAt.getTime() <= Date.now()) {
    refresh = { status: 'failed', error: 'Token ya vencido — requiere reconexión manual desde /admin/instagram.' }
  } else {
    const result = await refreshAccessToken(token.accessToken)
    if (result.success) {
      await saveInstagramToken(result.accessToken, result.expiresAt, token.igUserId ?? undefined)
      refresh = { status: 'refreshed', expiresAt: result.expiresAt.toISOString() }
    } else {
      refresh = { status: 'failed', error: result.error }
    }
  }

  if (refresh.status === 'failed') {
    console.error('[instagram-refresh] refresh falló:', refresh.error)
    await prisma.instagramToken.update({
      where: { id: token.id },
      data: { lastRefreshAttemptAt: new Date(), lastRefreshError: refresh.error },
    })
  }

  if (refresh.status === 'refreshed') {
    // El feed cacheado sigue usando el token viejo hasta su próxima revalidación — lo
    // marcamos stale para que la próxima visita lo regenere con el token nuevo.
    revalidateTag(INSTAGRAM_FEED_TAG, 'max')
  }

  // ── Recordatorio a administradores ──────────────────────────────────────────
  // Solo si el refresh automático falló, o si el token igual superó los 50 días (red de
  // seguridad). Un aviso por ciclo: saveInstagramToken() resetea reminderSentAt al
  // guardar un token nuevo.
  const shouldRemind =
    refresh.status !== 'refreshed' &&
    !token.reminderSentAt &&
    (refresh.status === 'failed' || ageDays >= REMINDER_THRESHOLD_DAYS)

  if (shouldRemind) {
    const failureReason = refresh.status === 'failed' ? refresh.error : null
    // Fire-and-forget: no bloquea la respuesta del cron. reminderSentAt se marca solo si
    // los envíos salieron — si fallan, se reintenta en la próxima corrida.
    after(async () => {
      try {
        const admins = await prisma.user.findMany({ where: { role: 'ADMIN' }, select: { email: true } })
        if (admins.length === 0) {
          console.warn('[instagram-refresh] no hay administradores para notificar el vencimiento del token')
          return
        }
        const daysRemaining = Math.max(0, Math.ceil((token.expiresAt.getTime() - Date.now()) / DAY_MS))
        await Promise.all(
          admins.map((admin) =>
            sendEmail({
              to: admin.email,
              subject: 'Artentino — El token de Instagram necesita renovarse',
              html: instagramTokenReminderEmail({ daysRemaining, expiresAt: token.expiresAt, failureReason }),
            }),
          ),
        )
        await prisma.instagramToken.update({ where: { id: token.id }, data: { reminderSentAt: new Date() } })
      } catch (err) {
        console.error('[instagram-refresh] fallo al enviar el recordatorio de vencimiento:', err)
      }
    })
  }

  return NextResponse.json({
    ok: refresh.status !== 'failed',
    refresh,
    reminder: shouldRemind ? 'scheduled' : token.reminderSentAt ? 'already-sent' : 'not-due',
  })
}
