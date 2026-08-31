import { NextRequest, NextResponse } from 'next/server'
import { enforceRateLimit, getClientIp } from '@/lib/security/rate-limit'

export async function POST(request: NextRequest) {
  const body = await request.text()
  let email = ''
  try { email = String(JSON.parse(body)?.email ?? '').trim().toLowerCase() } catch {}
  try {
    const limits = await Promise.all([
      enforceRateLimit(`login:ip:${getClientIp(request)}`, 10, 900),
      ...(email ? [enforceRateLimit(`login:email:${email}`, 10, 900)] : []),
    ])
    const blocked = limits.find((limit) => !limit.allowed)
    if (blocked) return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 })

    const upstream = await fetch(new URL('/api/customers/login', request.url), {
      method: 'POST',
      headers: { 'content-type': 'application/json', cookie: request.headers.get('cookie') ?? '' },
      body,
      cache: 'no-store',
    })
    const response = new NextResponse(await upstream.text(), { status: upstream.status })
    response.headers.set('content-type', upstream.headers.get('content-type') ?? 'application/json')
    const setCookie = upstream.headers.get('set-cookie')
    if (setCookie) response.headers.set('set-cookie', setCookie)
    return response
  } catch {
    return NextResponse.json({ error: 'Authentication is temporarily unavailable.' }, { status: 503 })
  }
}
