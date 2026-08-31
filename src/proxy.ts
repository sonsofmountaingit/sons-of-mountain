import { NextRequest, NextResponse } from 'next/server'

const PROTECTED = ['/dashboard', '/account']

// Read the session cookie directly to avoid importing Payload in edge runtime.
// Payload's default cookiePrefix is "payload", producing "payload-token".
// This is presence-only; it cannot decode the JWT to confirm collection here.
function hasSessionCookie(req: NextRequest): boolean {
  return req.cookies.has('payload-token')
}

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl

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
  ],
}
