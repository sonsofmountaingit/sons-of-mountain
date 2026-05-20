import { test, expect } from '@playwright/test'
import { getStripe } from './helpers/stripe'
import { create, remove } from './helpers/payload'

test.describe('Saved Payment Methods API', () => {
  test('GET /api/stripe/payment-methods — 401 without auth', async ({ request }) => {
    const res = await request.get('/api/stripe/payment-methods')
    expect(res.status()).toBe(401)
  })

  test('DELETE /api/stripe/payment-methods — 401 without auth', async ({ request }) => {
    const res = await request.delete('/api/stripe/payment-methods?id=pm_test')
    expect(res.status()).toBe(401)
  })

  test('POST /api/stripe/payment-methods/set-default — 401 without auth', async ({ request }) => {
    const res = await request.post('/api/stripe/payment-methods/set-default', {
      data: { paymentMethodId: 'pm_test' },
    })
    expect(res.status()).toBe(401)
  })

  test('customer defaultPaymentMethodId field exists', async () => {
    const customer = await create('customers', {
      email: `pm-test-${Date.now()}@test.com`,
      name: 'PM Test',
      status: 'active',
      defaultPaymentMethodId: 'pm_test_123',
    })
    const doc = customer.doc ?? customer
    expect(doc.defaultPaymentMethodId).toBe('pm_test_123')
    await remove('customers', doc.id)
  })
})
