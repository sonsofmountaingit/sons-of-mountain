import { createChallenge, verifySolution } from 'altcha-lib/v1'

function hmacKey(): string {
  const key = process.env.ALTCHA_HMAC_SECRET
  if (!key) throw new Error('ALTCHA_HMAC_SECRET is not configured')
  return key
}

export async function createCaptchaChallenge() {
  return createChallenge({
    hmacKey: hmacKey(),
    expires: new Date(Date.now() + 2 * 60 * 1000),
    maxNumber: 100_000,
  })
}

export async function verifyCaptchaPayload(payload: unknown): Promise<boolean> {
  if (typeof payload !== 'string' || payload.length === 0 || payload.length > 4096) return false
  try {
    return await verifySolution(payload, hmacKey(), true)
  } catch {
    return false
  }
}
