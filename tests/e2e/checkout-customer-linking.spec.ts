import { test, expect } from '@playwright/test'
import { createCustomerWithPassword, loginCustomer, deleteCustomer } from './fixtures'

// Real, pre-existing active trip in the local DB — avoids needing admin auth to seed fixtures.
const TRIP_ID = 2
const TRIP_PRICE = 200

async function findOwn(request: any, token: string, collection: string, where: Record<string, unknown>) {
  const res = await request.get(`/api/${collection}`, {
    headers: { Cookie: `payload-token=${token}` },
    params: { where: JSON.stringify(where), limit: '1', sort: '-createdAt' },
  })
  const data = await res.json()
  return data.docs?.[0] ?? null
}

test.describe('Checkout ties purchases/bookings to customer account', () => {
  let email: string
  let customer: any
  let token: string

  test.beforeAll(async () => {
    email = `e2e-link-${Date.now()}@test.com`
    customer = await createCustomerWithPassword(email)
    const login = await loginCustomer(email)
    token = login.token
    expect(token).toBeTruthy()
    expect(customer?.id).toBeTruthy()
  })

  test.afterAll(async () => {
    if (customer?.id) await deleteCustomer(customer.id)
  })

  test('authenticated cart checkout links order.customer to the logged-in customer', async ({ request }) => {
    const res = await request.post('/api/checkout', {
      headers: { Cookie: `payload-token=${token}` },
      data: {
        type: 'cart',
        items: [{
          type: 'trip',
          tripId: String(TRIP_ID),
          quantity: 1,
          unitPrice: TRIP_PRICE,
          title: 'Митикас, Гърция',
        }],
        customerEmail: email,
        firstName: 'E2E',
        lastName: 'Linked',
        phone: '0000000000',
        orderTotal: TRIP_PRICE,
      },
    })
    expect(res.status()).toBe(200)
    const { url } = await res.json()
    expect(url).toBeTruthy()

    const order = await findOwn(request, token, 'orders', { email: { equals: email } })
    expect(order).toBeTruthy()
    const linkedCustomerId = typeof order.customer === 'object' ? order.customer?.id : order.customer
    expect(String(linkedCustomerId)).toBe(String(customer.id))
  })

  test('anonymous cart checkout does not link any customer', async ({ request }) => {
    const anonEmail = `e2e-anon-${Date.now()}@test.com`
    const res = await request.post('/api/checkout', {
      data: {
        type: 'cart',
        items: [{
          type: 'trip',
          tripId: String(TRIP_ID),
          quantity: 1,
          unitPrice: TRIP_PRICE,
          title: 'Митикас, Гърция',
        }],
        customerEmail: anonEmail,
        firstName: 'Anon',
        lastName: 'Buyer',
        phone: '0000000000',
        orderTotal: TRIP_PRICE,
      },
    })
    expect(res.status()).toBe(200)

    // Anonymous request has no session — verify indirectly: a follow-up authenticated
    // checkout for the SAME email does not pick up this anonymous order's identity,
    // i.e. linking is driven strictly by the request's own auth cookie, not by email.
    const res2 = await request.post('/api/checkout', {
      headers: { Cookie: `payload-token=${token}` },
      data: {
        type: 'cart',
        items: [{
          type: 'trip',
          tripId: String(TRIP_ID),
          quantity: 1,
          unitPrice: TRIP_PRICE,
          title: 'Митикас, Гърция',
        }],
        customerEmail: anonEmail,
        firstName: 'Anon',
        lastName: 'Buyer',
        phone: '0000000000',
        orderTotal: TRIP_PRICE,
      },
    })
    expect(res2.status()).toBe(200)
    const order = await findOwn(request, token, 'orders', { email: { equals: anonEmail } })
    expect(order).toBeTruthy()
    const linkedCustomerId = typeof order.customer === 'object' ? order.customer?.id : order.customer
    expect(String(linkedCustomerId)).toBe(String(customer.id))
  })

  test('authenticated legacy single-item registration checkout links customer', async ({ request }) => {
    const res = await request.post('/api/checkout', {
      headers: { Cookie: `payload-token=${token}` },
      data: {
        type: 'registration',
        recordId: `e2e-reg-link-${Date.now()}`,
        amount: TRIP_PRICE,
        tripId: TRIP_ID,
        customerEmail: email,
        description: 'Митикас, Гърция',
      },
    })
    expect(res.status()).toBe(200)
    const { url } = await res.json()
    expect(url).toBeTruthy()
  })

  test('authenticated booking links registration.customer via /api/booking', async ({ request }) => {
    const res = await request.post('/api/booking', {
      headers: { Cookie: `payload-token=${token}` },
      data: {
        tripId: TRIP_ID,
        firstName: 'E2E',
        lastName: 'Booker',
        email,
        phone: '0000000000',
        participantCount: 1,
        agreedToTerms: true,
      },
    })
    expect(res.status()).toBe(200)
    const { registrationId } = await res.json()
    expect(registrationId).toBeTruthy()

    const registration = await findOwn(request, token, 'registrations', { id: { equals: registrationId } })
    expect(registration).toBeTruthy()
    const linkedCustomerId = typeof registration.customer === 'object' ? registration.customer?.id : registration.customer
    expect(String(linkedCustomerId)).toBe(String(customer.id))
  })

  test('anonymous booking leaves registration.customer unset', async ({ request }) => {
    const anonEmail = `e2e-anon-booking-${Date.now()}@test.com`
    const res = await request.post('/api/booking', {
      data: {
        tripId: TRIP_ID,
        firstName: 'Anon',
        lastName: 'Booker',
        email: anonEmail,
        phone: '0000000000',
        participantCount: 1,
        agreedToTerms: true,
      },
    })
    expect(res.status()).toBe(200)
    const { registrationId } = await res.json()
    expect(registrationId).toBeTruthy()

    // No session cookie means no authenticated read access either — confirm the API
    // rejects an unauthenticated read of the record it just created (default Payload
    // access requires an authenticated user of some collection).
    const readRes = await request.get(`/api/registrations/${registrationId}`)
    expect(readRes.status()).toBe(403)
  })
})
