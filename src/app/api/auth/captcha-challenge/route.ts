import { NextResponse } from 'next/server'
import { createCaptchaChallenge } from '@/lib/security/altcha'

export async function GET() {
  try {
    const challenge = await createCaptchaChallenge()
    return NextResponse.json(challenge, { headers: { 'Cache-Control': 'no-store' } })
  } catch {
    return NextResponse.json({ error: 'Security check is temporarily unavailable.' }, { status: 503 })
  }
}
