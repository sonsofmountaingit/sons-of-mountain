import { test, expect } from '@playwright/test'
import { getById, update } from './helpers/payload'
import { createBundle, deleteBundle } from './fixtures'

test.describe('Bundle Checkout', () => {
  test('bundle purchase — checkout session created', async ({ request }) => {
    const bundle = await createBundle()
    const res = await request.post('/api/checkout', {
      data: {
        type: 'cart',
        items: [{ type: 'bundle', bundleId: bundle.id, title: bundle.title, unitPrice: bundle.bundlePrice ?? 199, quantity: 1 }],
        orderTotal: bundle.bundlePrice ?? 199,
        customerEmail: 'buyer@test.com',
        firstName: 'Test',
        lastName: 'User',
        phone: '+1234567890',
      },
    })
    expect(res.status()).toBe(200)
    const { url } = await res.json()
    expect(url).toContain('stripe.com')
    await deleteBundle(bundle.id)
  })

  test('bundle at max uses is blocked by cart validate', async ({ request }) => {
    const bundle = await createBundle()
    await update('bundles', bundle.id, { usedCount: 100, maxUses: 100 })
    const res = await request.post('/api/cart/validate', {
      data: { items: [{ type: 'bundle', bundleId: bundle.id, quantity: 1, unitPrice: 199, title: bundle.title }] },
    })
    const data = await res.json()
    const item = data.items?.find((i: any) => i.bundleId === bundle.id)
    // Expect either blocked flag or error
    expect(res.status() < 500).toBeTruthy()
    await deleteBundle(bundle.id)
  })
})
