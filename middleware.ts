import NextAuth from 'next-auth'
import { NextResponse } from 'next/server'
import { authConfig } from '@/auth.config'

const { auth } = NextAuth(authConfig)

export default auth((req) => {
  const { pathname } = req.nextUrl
  const isAdminPage = pathname.startsWith('/admin')
  const isAdminApi = pathname.startsWith('/api/admin')

  if (!isAdminPage && !isAdminApi) return NextResponse.next()

  if (!req.auth) {
    if (isAdminApi) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }
    const loginUrl = new URL('/login', req.nextUrl)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  const role = (req.auth.user as { role?: string })?.role
  if (role !== 'ADMIN') {
    if (isAdminApi) {
      return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 })
    }
    return NextResponse.redirect(new URL('/', req.nextUrl))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
}
