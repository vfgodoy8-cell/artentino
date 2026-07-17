import { NextResponse } from 'next/server'
import { getInstagramToken, saveInstagramToken } from '@/app/lib/instagram-token'

const DAY_MS = 24 * 60 * 60 * 1000

export async function GET(req: Request) {
  const authHeader = req.headers.get('authorization')
  if (!process.env.CRON_SECRET || authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
  }

  const token = await getInstagramToken()
  if (!token) {
    return NextResponse.json({ ok: true, skipped: 'no-token' })
  }

  const tokenAgeMs = Date.now() - token.updatedAt.getTime()
  if (tokenAgeMs < DAY_MS) {
    return NextResponse.json({ ok: true, skipped: 'too-young' })
  }
  if (token.expiresAt.getTime() <= Date.now()) {
    return NextResponse.json({ ok: false, skipped: 'expired', error: 'Token ya vencido — requiere reconexión manual.' })
  }

  const url = `https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=${encodeURIComponent(token.accessToken)}`

  let json: { access_token?: string; expires_in?: number; error?: { message: string } }
  try {
    const res = await fetch(url)
    json = await res.json()
  } catch (err) {
    return NextResponse.json({ ok: false, error: `Fetch falló: ${String(err)}` }, { status: 502 })
  }

  if (json.error || !json.access_token || !json.expires_in) {
    return NextResponse.json(
      { ok: false, error: json.error?.message ?? 'Respuesta inesperada al refrescar el token.' },
      { status: 502 },
    )
  }

  const expiresAt = new Date(Date.now() + json.expires_in * 1000)
  await saveInstagramToken(json.access_token, expiresAt, token.igUserId ?? undefined)

  return NextResponse.json({ ok: true, expiresAt: expiresAt.toISOString() })
}
