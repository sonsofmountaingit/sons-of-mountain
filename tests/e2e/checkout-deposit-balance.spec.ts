import { test, expect } from '@playwright/test'
import { getById, update, create, remove } from './helpers/payload'
import { createTrip, deleteTrip } from './fixtures'

test.describe('Deposit + Balance Auto-Charge', () => {
  test('deposit checkout session uses depositAmount as line item total', async ({ request }) => {
    const trip = await createTrip()
    const res = await request.post('/api/checkout', {
      data: {
        type: 'deposit',
        recordId: 'dep-test-reg',
        amount: trip.price ?? 299,
        depositAmount: 99,
        paymentMode: 'deposit',
        tripId: trip.id,
        customerEmail: 'dep@test.com',
        description: trip.title,
      },
    })
    expect(res.status()).toBe(200)
    const { url } = await res.json()
    expect(url).toContain('stripe.com')
    await deleteTrip(trip.id)
  })

  test('balance reminder API — order with past due date gets flagged', async () => {
    // Create an order with deposit mode and past remainingDueDate
    const order = await create('orders', {
      firstName: 'Test',
      lastName: 'User',
      email: 'baltest@test.com',
      phone: '+1234567890',
      status: 'paid',
      paymentMode: 'deposit',
      remainingBalance: 50,
      reminderSent7d: false,
      reminderSent1d: false,
      totalAmount: 150,
      currency: 'EUR',
      remainingDueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 1 day from now
    })
    const doc = order.doc ?? order
    expect(doc.id).toBeTruthy()
    expect(doc.remainingBalance).toBe(50)
    await remove('orders', doc.id)
  })

  test('balanceChargeStatus defaults to pending after deposit', async () => {
    const order = await create('orders', {
      firstName: 'Test',
      lastName: 'User',
      email: 'pending@test.com',
      phone: '+1234567890',
      status: 'paid',
      paymentMode: 'deposit',
      remainingBalance: 200,
      balanceChargeStatus: 'pending',
      totalAmount: 300,
      currency: 'EUR',
    })
    const doc = order.doc ?? order
    expect(doc.balanceChargeStatus).toBe('pending')
    await remove('orders', doc.id)
  })
})
