import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { z } from 'zod'
import { enforceRateLimit, getClientIp } from '@/lib/security/rate-limit'
import { verifyCaptchaPayload } from '@/lib/security/altcha'

const MIN_FORM_FILL_MS = 1500

const signupSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().toLowerCase().email().max(254),
  password: z.string().min(8).max(128),
  captchaPayload: z.string().min(1).max(4096),
  website: z.string().max(200).optional().default(''),
  formRenderedAt: z.number().optional(),
})

const GENERIC_RESPONSE = {
  message: 'If this email can be registered, a verification email will be sent.',
}

export async function POST(request: NextRequest) {
  let input: z.infer<typeof signupSchema>
  try {
    const body = await request.json()
    const parsed = signupSchema.safeParse(body)
    if (!parsed.success) return NextResponse.json({ error: 'Invalid signup details' }, { status: 400 })
    input = parsed.data

    // Honeypot field must stay empty, and the form must not be submitted
    // faster than a human could fill it in. Both are silently accepted as
    // "success" so scripted clients get no signal that they were caught.
    if (input.website.length > 0) return NextResponse.json(GENERIC_RESPONSE, { status: 202 })
    if (input.formRenderedAt != null && Date.now() - input.formRenderedAt < MIN_FORM_FILL_MS) {
      return NextResponse.json(GENERIC_RESPONSE, { status: 202 })
    }

    const ip = getClientIp(request)
    const [ipLimit, emailLimit] = await Promise.all([
      enforceRateLimit(`signup:ip:${ip}`, 5, 3600),
      enforceRateLimit(`signup:email:${input.email}`, 3, 3600),
    ])
    if (!ipLimit.allowed || !emailLimit.allowed) {
      return NextResponse.json(GENERIC_RESPONSE, {
        status: 202,
        headers: { 'Retry-After': String(Math.max(ipLimit.retryAfterSeconds, emailLimit.retryAfterSeconds)) },
      })
    }

    if (!await verifyCaptchaPayload(input.captchaPayload)) {
      return NextResponse.json({ error: 'Please complete the security check.' }, { status: 400 })
    }

    const payload = await getPayload({ config })
    await payload.create({
      collection: 'customers',
      overrideAccess: true,
      disableVerificationEmail: false,
      data: {
        name: input.name,
        email: input.email,
        password: input.password,
        status: 'active',
      } as any,
    })

    return NextResponse.json(GENERIC_RESPONSE, { status: 202 })
  } catch (error: any) {
    // Do not disclose duplicate-email or validation details. Payload's unique
    // constraint remains the source of truth and the response is enumeration-safe.
    if (error?.data?.errors?.some?.((entry: any) => /email|unique|registered/i.test(String(entry?.message)))) {
      return NextResponse.json(GENERIC_RESPONSE, { status: 202 })
    }
    if (error?.message === 'Rate limiting is not configured') {
      return NextResponse.json({ error: 'Signup is temporarily unavailable.' }, { status: 503 })
    }
    return NextResponse.json({ error: 'Signup is temporarily unavailable.' }, { status: 503 })
  }
}
