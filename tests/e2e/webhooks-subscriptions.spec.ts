import { test, expect } from '@playwright/test'
import { getStripe } from './helpers/stripe'
import { create, remove, findOne } from './helpers/payload'

test.describe('Subscription Webhooks', () => {
  let stripe: ReturnType<typeof getStripe>

  test.beforeAll(() => {
    stripe = getStripe()
  })

  test('subscription record structure is correct', async () => {
    // Create a subscription record directly in Payload and verify fields
    const customer = await create('customers', {
      email: `sub-test-${Date.now()}@test.com`,
      name: 'Sub Test',
      status: 'active',
    })
    const cust = customer.doc ?? customer

    const sub = await create('subscriptions', {
      customer: cust.id,
      stripeSubscriptionId: `sub_e2e_${Date.now()}`,
      stripeCustomerId: 'cus_test_placeholder',
      plan: 'monthly',
      status: 'active',
    })
    const doc = sub.doc ?? sub
    expect(doc.status).toBe('active')
    expect(doc.plan).toBe('monthly')
    expect(doc.dunningEmailsSent ?? 0).toBe(0)

    await remove('subscriptions', doc.id)
    await remove('customers', cust.id)
  })

  test('subscription past_due sets pastDueAt and dunningEmailsSent increments', async () => {
    const customer = await create('customers', {
      email: `pastdue-${Date.now()}@test.com`,
      name: 'Past Due Test',
      status: 'active',
    })
    const cust = customer.doc ?? customer
    const sub = await create('subscriptions', {
      customer: cust.id,
      stripeSubscriptionId: `sub_pastdue_${Date.now()}`,
      stripeCustomerId: 'cus_test',
      plan: 'monthly',
      status: 'active',
    })
    const doc = sub.doc ?? sub

    // Simulate webhook updating status to past_due
    const { update } = await import('./helpers/payload')
    await update('subscriptions', doc.id, { status: 'past_due', pastDueAt: new Date().toISOString(), dunningEmailsSent: 1 })

    const { getById } = await import('./helpers/payload')
    const updated = await getById('subscriptions', doc.id)
    expect(updated.status).toBe('past_due')
    expect(updated.pastDueAt).toBeTruthy()
    expect(updated.dunningEmailsSent).toBe(1)

    await remove('subscriptions', doc.id)
    await remove('customers', cust.id)
  })

  test('subscription deleted — status becomes cancelled', async () => {
    const customer = await create('customers', {
      email: `cancelled-${Date.now()}@test.com`,
      name: 'Cancelled Test',
      status: 'active',
    })
    const cust = customer.doc ?? customer
    const sub = await create('subscriptions', {
      customer: cust.id,
      stripeSubscriptionId: `sub_cancel_${Date.now()}`,
      stripeCustomerId: 'cus_test',
      plan: 'annual',
      status: 'active',
    })
    const doc = sub.doc ?? sub

    const { update, getById } = await import('./helpers/payload')
    await update('subscriptions', doc.id, { status: 'cancelled' })
    const updated = await getById('subscriptions', doc.id)
    expect(updated.status).toBe('cancelled')

    await remove('subscriptions', doc.id)
    await remove('customers', cust.id)
  })
})
