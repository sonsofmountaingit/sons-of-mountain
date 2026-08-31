import { NextRequest, NextResponse } from 'next/server'
import { enforceRateLimit, getClientIp } from '@/lib/security/rate-limit'

export async function POST(request: NextRequest) {
  const body = await request.text()
  let email = ''
  try { email = String(JSON.parse(body)?.email ?? '').trim().toLowerCase() } catch {}
  try {
    const limits = await Promise.all([
      enforceRateLimit(`forgot:ip:${getClientIp(request)}`, 5, 3600),
      ...(email ? [enforceRateLimit(`forgot:email:${email}`, 3, 3600)] : []),
    ])
    const blocked = limits.find((limit) => !limit.allowed)
    if (blocked) return NextResponse.json({ message: 'If the account exists, reset instructions will be sent.' }, { status: 202 })

    const upstream = await fetch(new URL('/api/customers/forgot-password', request.url), {
      method: 'POST',
      headers: { 'content-type': 'application/json', cookie: request.headers.get('cookie') ?? '' },
      body,
      cache: 'no-store',
    })
    return new NextResponse(await upstream.text(), {
      status: upstream.status,
      headers: { 'content-type': upstream.headers.get('content-type') ?? 'application/json' },
    })
  } catch {
    return NextResponse.json({ error: 'Password reset is temporarily unavailable.' }, { status: 503 })
  }
}
