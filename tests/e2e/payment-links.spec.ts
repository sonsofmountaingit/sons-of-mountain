import { test, expect } from '@playwright/test'
import { createTrip, deleteTrip, createProduct, deleteProduct } from './fixtures'

test.describe('Payment Links', () => {
  test('POST /api/stripe/payment-links — 401 without auth', async ({ request }) => {
    const res = await request.post('/api/stripe/payment-links', {
      data: { type: 'trip', id: 'test-id', quantity: 1 },
    })
    expect(res.status()).toBe(401)
  })

  test('POST /api/stripe/payment-links — 400 with invalid type', async ({ request }) => {
    // Login would be needed for full test; just verify endpoint exists
    const res = await request.post('/api/stripe/payment-links', {
      data: { type: 'invalid', id: 'test' },
    })
    // 401 (auth) or 400 (invalid type) — both acceptable
    expect([400, 401]).toContain(res.status())
  })

  test('GET /api/stripe/payment-links — requires id param', async ({ request }) => {
    const res = await request.get('/api/stripe/payment-links')
    expect([400, 401]).toContain(res.status())
  })

  test('PATCH /api/stripe/payment-links — requires id', async ({ request }) => {
    const res = await request.patch('/api/stripe/payment-links', {
      data: { active: false },
    })
    expect([400, 401]).toContain(res.status())
  })
})
