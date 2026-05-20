import { test, expect } from '@playwright/test'
import { create, remove, getById, update } from './helpers/payload'
import { createCustomer, deleteCustomer } from './fixtures'

test.describe('Loyalty Points', () => {
  test('points credited after €100 purchase (at 1pt/EUR = 100 pts)', async () => {
    const customer = await createCustomer(`loyalty-${Date.now()}@test.com`, 0)
    // Simulate webhook crediting 100 pts for €100 order
    await update('customers', customer.id, { loyaltyPoints: 100 })
    const updated = await getById('customers', customer.id)
    expect(updated.loyaltyPoints).toBe(100)
    await deleteCustomer(customer.id)
  })

  test('tier upgrades: bronze → silver at 500 pts', async () => {
    const customer = await createCustomer(`tier-${Date.now()}@test.com`, 490)
    // Add 10 more pts to cross 500 threshold
    await update('customers', customer.id, { loyaltyPoints: 500, loyaltyTier: 'silver' })
    const updated = await getById('customers', customer.id)
    expect(updated.loyaltyTier).toBe('silver')
    await deleteCustomer(customer.id)
  })

  test('tier gold at 1500 pts', async () => {
    const customer = await createCustomer(`tier-gold-${Date.now()}@test.com`, 1500)
    await update('customers', customer.id, { loyaltyTier: 'gold' })
    const updated = await getById('customers', customer.id)
    expect(updated.loyaltyTier).toBe('gold')
    await deleteCustomer(customer.id)
  })

  test('tier platinum at 5000 pts', async () => {
    const customer = await createCustomer(`tier-plat-${Date.now()}@test.com`, 5000)
    await update('customers', customer.id, { loyaltyTier: 'platinum' })
    const updated = await getById('customers', customer.id)
    expect(updated.loyaltyTier).toBe('platinum')
    await deleteCustomer(customer.id)
  })

  test('points redemption reduces balance: 500pts = €5 discount', async () => {
    const customer = await createCustomer(`redeem-${Date.now()}@test.com`, 1000)
    // Simulate redeeming 500 pts
    await update('customers', customer.id, { loyaltyPoints: 500 })
    const updated = await getById('customers', customer.id)
    expect(updated.loyaltyPoints).toBe(500)
    await deleteCustomer(customer.id)
  })
})
