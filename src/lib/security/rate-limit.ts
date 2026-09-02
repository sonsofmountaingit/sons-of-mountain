import { createClient, type RedisClientType } from 'redis'

export type RateLimitResult = {
  allowed: boolean
  remaining: number
  retryAfterSeconds: number
}

type RedisClient = RedisClientType
let clientPromise: Promise<RedisClient> | null = null

function getRedisClient(): Promise<RedisClient> {
  if (clientPromise) return clientPromise
  const url = process.env.REDIS_URL
    ?? (process.env.NODE_ENV === 'production' ? 'redis://redis:6379' : 'redis://localhost:6381')
  const client = createClient({ url }) as RedisClient
  client.on('error', () => undefined)
  clientPromise = client.connect().then(() => client)
  return clientPromise
}

export function getClientIp(request: Request): string {
  return request.headers.get('x-real-ip')?.trim()
    || request.headers.get('cf-connecting-ip')?.trim()
    || request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || 'unknown'
}

export async function enforceRateLimit(key: string, limit: number, windowSeconds: number): Promise<RateLimitResult> {
  const client = await getRedisClient()
  const redisKey = `som:rl:${key}`
  const count = await client.incr(redisKey)
  if (count === 1) await client.expire(redisKey, windowSeconds)
  const allowed = count <= limit
  return { allowed, remaining: Math.max(0, limit - count), retryAfterSeconds: allowed ? 0 : windowSeconds }
}

export async function getIdempotencyValue(key: string): Promise<string | null> {
  const client = await getRedisClient()
  return client.get(`som:idempotency:${key}`)
}

export async function claimIdempotencyKey(key: string, ttlSeconds = 300): Promise<string | null> {
  const client = await getRedisClient()
  const token = crypto.randomUUID()
  const result = await client.set(`som:idempotency:${key}`, JSON.stringify({ status: 'processing', token }), { NX: true, EX: ttlSeconds })
  return result === 'OK' ? token : null
}

export async function completeIdempotencyKey(key: string, token: string, value: string, ttlSeconds = 86400): Promise<void> {
  const client = await getRedisClient()
  await client.eval(
    `if redis.call('get', KEYS[1]) == ARGV[1] then redis.call('set', KEYS[1], ARGV[2], 'EX', ARGV[3]) return 1 end return 0`,
    { keys: [`som:idempotency:${key}`], arguments: [JSON.stringify({ status: 'processing', token }), value, String(ttlSeconds)] },
  )
}

export async function releaseIdempotencyKey(key: string, token: string): Promise<void> {
  const client = await getRedisClient()
  await client.eval(
    `if redis.call('get', KEYS[1]) == ARGV[1] then return redis.call('del', KEYS[1]) else return 0 end`,
    { keys: [`som:idempotency:${key}`], arguments: [JSON.stringify({ status: 'processing', token })] },
  )
}
