import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { z } from 'zod'
import { enforceRateLimit, getClientIp } from '@/lib/security/rate-limit'

const forgotPasswordSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(254),
})

export async function POST(request: NextRequest) {
  let email: string
  try {
    const parsed = forgotPasswordSchema.safeParse(await request.json())
    if (!parsed.success) return NextResponse.json({ error: 'Моля, въведи валиден имейл адрес.' }, { status: 400 })
    email = parsed.data.email
  } catch {
    return NextResponse.json({ error: 'Невалидно тяло на заявката.' }, { status: 400 })
  }

  try {
    const limits = await Promise.all([
      enforceRateLimit(`forgot:ip:${getClientIp(request)}`, 5, 3600),
      enforceRateLimit(`forgot:email:${email}`, 3, 3600),
    ])
    const blocked = limits.find((limit) => !limit.allowed)
    if (blocked) return NextResponse.json({ message: 'Ако съществува такъв акаунт, ще изпратим инструкции за нулиране.' }, { status: 202 })

    const payload = await getPayload({ config })
    await payload.forgotPassword({
      collection: 'customers',
      data: { email },
    })
    return NextResponse.json({ message: 'Успех' })
  } catch {
    return NextResponse.json({ error: 'Нулирането на паролата временно не е достъпно.' }, { status: 503 })
  }
}
