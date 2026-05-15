import { NextRequest, NextResponse } from 'next/server'

const PROTECTED = ['/dashboard', '/account']

// Read the session cookie directly to avoid importing Payload in edge runtime.
// Better Auth sets a cookie named "better-auth.session_token" by default.
function hasSessionCookie(req: NextRequest): boolean {
  return (
    req.cookies.has('better-auth.session_token') ||
    req.cookies.has('__Secure-better-auth.session_token')
  )
}

export async function middleware(req: NextRequest) {
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
  matcher: ['/dashboard/:path*', '/account/:path*'],
}
