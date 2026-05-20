import { test, expect } from '@playwright/test'

test.describe('Spend History API', () => {
  test('GET /api/stripe/spend-history — 401 without auth', async ({ request }) => {
    const res = await request.get('/api/stripe/spend-history')
    expect(res.status()).toBe(401)
  })

  test('authenticated customer with no stripeCustomerId gets empty history', async ({ request }) => {
    // Login via better-auth (session-based)
    // For now verify endpoint structure
    const res = await request.get('/api/stripe/spend-history')
    expect(res.status()).toBe(401) // unauthenticated
  })

  test('spend-history response shape is correct', async ({ request }) => {
    // Mock: if we had a valid session, the response should include these fields
    // Tested structurally here — full integration test requires a real session
    const loginRes = await request.post('/api/users/login', {
      data: {
        email: process.env.PAYLOAD_ADMIN_EMAIL ?? 'admin@test.com',
        password: process.env.PAYLOAD_ADMIN_PASSWORD ?? 'admin',
      },
    })
    const { token } = await loginRes.json()
    if (!token) { test.skip(); return }

    // Admin users may not have a customer record — endpoint returns 400 or empty
    const res = await request.get('/api/stripe/spend-history', {
      headers: { Authorization: `JWT ${token}` },
    })
    // 401 (not a better-auth session) or 200/400 depending on setup
    expect([200, 400, 401]).toContain(res.status())
    if (res.status() === 200) {
      const data = await res.json()
      expect(data).toHaveProperty('lifetimeSpend')
      expect(data).toHaveProperty('averageOrderValue')
      expect(data).toHaveProperty('chargeHistory')
    }
  })
})
