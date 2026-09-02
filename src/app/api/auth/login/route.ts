import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { z } from 'zod'
import { enforceRateLimit, getClientIp } from '@/lib/security/rate-limit'

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(254),
  password: z.string().min(1).max(128),
})

export async function POST(request: NextRequest) {
  let input: z.infer<typeof loginSchema>
  try {
    const parsed = loginSchema.safeParse(await request.json())
    if (!parsed.success) return NextResponse.json({ error: 'Невалиден имейл или парола.' }, { status: 400 })
    input = parsed.data
  } catch {
    return NextResponse.json({ error: 'Невалидно тяло на заявката.' }, { status: 400 })
  }

  try {
    const limits = await Promise.all([
      enforceRateLimit(`login:ip:${getClientIp(request)}`, 10, 900),
      enforceRateLimit(`login:email:${input.email}`, 10, 900),
    ])
    const blocked = limits.find((limit) => !limit.allowed)
    if (blocked) return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 })

    const payload = await getPayload({ config })
    const result = await payload.login({
      collection: 'customers',
      data: input,
    })
    const response = NextResponse.json(result)
    if (result.token) {
      response.cookies.set(`${payload.config.cookiePrefix}-token`, result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 7200,
      })
    }
    return response
  } catch (error) {
    const status = typeof error === 'object' && error !== null && 'status' in error && typeof error.status === 'number'
      ? error.status
      : 503
    if (status < 500 && error instanceof Error) {
      return NextResponse.json({ errors: [{ message: error.message }] }, { status })
    }
    return NextResponse.json({ error: 'Authentication is temporarily unavailable.' }, { status: 503 })
  }
}
