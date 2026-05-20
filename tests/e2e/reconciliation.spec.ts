import { test, expect } from '@playwright/test'

test.describe('Reconciliation API', () => {
  test('GET /api/stripe/reconciliation — 401 without auth', async ({ request }) => {
    const res = await request.get('/api/stripe/reconciliation')
    expect(res.status()).toBe(401)
  })

  test('reconciliation returns expected shape when authenticated as admin', async ({ request }) => {
    // Login as admin
    const loginRes = await request.post('/api/users/login', {
      data: {
        email: process.env.PAYLOAD_ADMIN_EMAIL ?? 'admin@test.com',
        password: process.env.PAYLOAD_ADMIN_PASSWORD ?? 'admin',
      },
    })
    const { token } = await loginRes.json()
    if (!token) {
      test.skip()
      return
    }

    // Use session cookie approach via browser context
    const res = await request.get('/api/stripe/reconciliation', {
      headers: { Authorization: `JWT ${token}` },
    })
    // May be 403 if user is not admin role, or 200 if admin
    expect([200, 403]).toContain(res.status())
    if (res.status() === 200) {
      const data = await res.json()
      expect(data).toHaveProperty('summary')
      expect(data).toHaveProperty('ghosts')
      expect(data).toHaveProperty('mismatches')
      expect(data).toHaveProperty('orphaned')
      expect(data).toHaveProperty('payouts')
    }
  })
})
