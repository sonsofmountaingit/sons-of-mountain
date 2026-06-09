import { jwtVerify } from 'jose'
import { createHash } from 'crypto'
import { headers as nextHeaders } from 'next/headers'

export async function verifyPayloadJWT(): Promise<boolean> {
  const requestHeaders = await nextHeaders()
  const authHeader = requestHeaders.get('authorization') ?? ''
  const token = authHeader.startsWith('JWT ') ? authHeader.slice(4) : null
  if (!token) return false

  const rawSecret = process.env.PAYLOAD_SECRET
  if (!rawSecret) return false

  const derivedSecret = createHash('sha256').update(rawSecret).digest('hex').slice(0, 32)
  const secretKey = new TextEncoder().encode(derivedSecret)

  try {
    await jwtVerify(token, secretKey)
    return true
  } catch {
    return false
  }
}
