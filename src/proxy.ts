import { NextRequest, NextResponse } from 'next/server'
import { enforceRateLimit, getClientIp } from '@/lib/security/rate-limit'

const PROTECTED = ['/dashboard', '/account']

// Read the session cookie directly to avoid importing Payload in edge runtime.
// Payload's default cookiePrefix is "payload", producing "payload-token".
// This is presence-only; it cannot decode the JWT to confirm collection here.
function hasSessionCookie(req: NextRequest): boolean {
  return req.cookies.has('payload-token')
}

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (pathname === '/api/customers/login' || pathname === '/api/customers/forgot-password') {
    try {
      const limit = await enforceRateLimit(`auth:ip:${getClientIp(req)}`, 10, 900)
      if (!limit.allowed) return NextResponse.json({ error: 'Too many attempts. Please try again later.' }, { status: 429, headers: { 'Retry-After': String(limit.retryAfterSeconds) } })
    } catch {
      return NextResponse.json({ error: 'Authentication is temporarily unavailable.' }, { status: 503 })
    }
  }

  const isProtected = PROTECTED.some((p) => pathname === p || pathname.startsWith(p + '/'))
  if (!isProtected) return NextResponse.next()

  if (!hasSessionCookie(req)) {
    const url = req.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('redirect', pathname)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/account/:path*',
    '/api/customers/login',
    '/api/customers/forgot-password',
  ],
}
