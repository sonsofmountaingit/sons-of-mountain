import { create, remove } from '../helpers/payload'

export async function createTrip() {
  const res = await create('trips', {
    title: 'E2E Test Trip',
    slug: `e2e-trip-${Date.now()}`,
    destination: 10,
    startDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + 37 * 24 * 60 * 60 * 1000).toISOString(),
    spotsTotal: 10,
    spotsAvailable: 10,
    price: 299,
    status: 'active',
  })
  return res.doc ?? res
}

export async function deleteTrip(id: string) {
  await remove('trips', id)
}

export async function createProduct() {
  const res = await create('products', {
    title: 'E2E Test Product',
    slug: `e2e-product-${Date.now()}`,
    price: 49,
    stock: 5,
    status: 'active',
  })
  return res.doc ?? res
}

export async function deleteProduct(id: string) {
  await remove('products', id)
}

export async function createBundle() {
  const res = await create('bundles', {
    title: 'E2E Test Bundle',
    slug: `e2e-bundle-${Date.now()}`,
    bundlePrice: 199,
    isActive: true,
    maxUses: 100,
    usedCount: 0,
    items: [{ itemType: 'product', quantity: 1 }],
  })
  return res.doc ?? res
}

export async function deleteBundle(id: string) {
  await remove('bundles', id)
}

export async function createProgram() {
  const res = await create('programs', {
    title: 'E2E Test Program',
    slug: `e2e-program-${Date.now()}`,
    price: 150,
    spotsAvailable: 10,
    status: 'Active',
  })
  return res.doc ?? res
}

export async function deleteProgram(id: string) {
  await remove('programs', id)
}

export async function createDiscountCode(type: 'percent' | 'fixed' | 'referral', value: number) {
  const res = await create('discount-codes', {
    code: `E2E-${type.toUpperCase()}-${Date.now()}`,
    type,
    value,
    isActive: true,
    usedCount: 0,
  })
  return res.doc ?? res
}

export async function deleteDiscountCode(id: string) {
  await remove('discount-codes', id)
}

export async function createVoucher(amount: number) {
  const res = await create('gift-vouchers', {
    amount,
    currency: 'EUR',
    status: 'active',
    recipientEmail: 'e2e-test@test.com',
  })
  return res.doc ?? res
}

export async function deleteVoucher(id: string) {
  await remove('gift-vouchers', id)
}

export async function createCustomer(email: string, loyaltyPoints = 0) {
  const res = await create('customers', {
    email,
    name: 'E2E Test Customer',
    status: 'active',
    loyaltyPoints,
    loyaltyTier: loyaltyPoints >= 500 ? 'silver' : 'bronze',
  })
  return res.doc ?? res
}

export async function deleteCustomer(id: string) {
  await remove('customers', id)
}
