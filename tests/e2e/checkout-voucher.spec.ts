import { test, expect } from '@playwright/test'
import { getById } from './helpers/payload'
import { createVoucher, deleteVoucher } from './fixtures'

test.describe('Gift Voucher Checkout', () => {
  test('voucher purchase — checkout session created', async ({ request }) => {
    const voucher = await createVoucher(50)
    const res = await request.post('/api/checkout', {
      data: {
        type: 'voucher',
        recordId: voucher.id,
        amount: 50,
        customerEmail: 'buyer@test.com',
        description: 'Gift Voucher €50',
      },
    })
    expect(res.status()).toBe(200)
    const { url } = await res.json()
    expect(url).toContain('stripe.com')
    await deleteVoucher(voucher.id)
  })

  test('voucher has deliveryDate preserved', async () => {
    const deliveryDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    const { create, remove } = await import('./helpers/payload')
    const voucher = await create('gift-vouchers', {
      amount: 30,
      currency: 'EUR',
      status: 'active',
      recipientEmail: 'recipient@test.com',
      deliveryDate,
    })
    const doc = voucher.doc ?? voucher
    const fetched = await getById('gift-vouchers', doc.id)
    expect(fetched.deliveryDate).toBeTruthy()
    await remove('gift-vouchers', doc.id)
  })

  test('invalid voucher code rejected by discount validate', async ({ request }) => {
    const res = await request.post('/api/discount/validate', {
      data: { code: 'INVALID-CODE-XYZ', orderTotal: 100 },
    })
    expect(res.status()).toBe(404)
    const data = await res.json()
    expect(data.error).toBeTruthy()
  })
})
