const VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'

export async function verifyTurnstile(token: unknown, request: Request): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY
  const isProduction = process.env.NODE_ENV === 'production'
  if (!secret) return !isProduction
  if (typeof token !== 'string' || token.length < 10 || token.length > 2048) return false

  const form = new URLSearchParams({
    secret,
    response: token,
  })
  const ip = request.headers.get('cf-connecting-ip') || request.headers.get('x-real-ip')
  if (ip) form.set('remoteip', ip)

  try {
    const response = await fetch(VERIFY_URL, {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body: form,
      cache: 'no-store',
    })
    if (!response.ok) return false
    const result = await response.json() as { success?: boolean; hostname?: string }
    const expectedHost = process.env.TURNSTILE_HOSTNAME
    return result.success === true && (!expectedHost || result.hostname === expectedHost)
  } catch {
    return false
  }
}
