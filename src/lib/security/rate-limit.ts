import { Redis } from '@upstash/redis'

export type RateLimitResult = {
  allowed: boolean
  remaining: number
  retryAfterSeconds: number
}

let redis: Redis | null | undefined

function getRedis(): Redis | null {
  if (redis !== undefined) return redis
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    redis = null
    return redis
  }
  redis = Redis.fromEnv()
  return redis
}

export function getClientIp(request: Request): string {
  // The edge/proxy must overwrite these headers. Never accept arbitrary client
  // supplied forwarding headers without a trusted proxy in front of the app.
  return request.headers.get('x-real-ip')?.trim()
    || request.headers.get('cf-connecting-ip')?.trim()
    || request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || 'unknown'
}

export async function getIdempotencyValue(key: string): Promise<string | null> {
  const store = getRedis()
  if (!store) return null
  return await store.get<string>(`som:idempotency:${key}`)
}

export async function claimIdempotencyKey(key: string, ttlSeconds = 300): Promise<boolean> {
  const store = getRedis()
  if (!store) return true
  const result = await store.set(`som:idempotency:${key}`, '__processing__', { nx: true, ex: ttlSeconds })
  return result === 'OK'
}

export async function setIdempotencyValue(key: string, value: string, ttlSeconds = 86400): Promise<void> {
  const store = getRedis()
  if (!store) return
  await store.set(`som:idempotency:${key}`, value, { ex: ttlSeconds })
}

export async function enforceRateLimit(
  key: string,
  limit: number,
  windowSeconds: number,
): Promise<RateLimitResult> {
  const store = getRedis()
  if (!store) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Rate limiting is not configured')
    }
    return { allowed: true, remaining: limit, retryAfterSeconds: 0 }
  }

  const redisKey = `som:rl:${key}`
  const count = await store.incr(redisKey)
  if (count === 1) await store.expire(redisKey, windowSeconds)
  const allowed = count <= limit
  return {
    allowed,
    remaining: Math.max(0, limit - count),
    retryAfterSeconds: allowed ? 0 : windowSeconds,
  }
}
