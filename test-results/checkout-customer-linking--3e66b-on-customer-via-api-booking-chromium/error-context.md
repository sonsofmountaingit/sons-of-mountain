# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: checkout-customer-linking.spec.ts >> Checkout ties purchases/bookings to customer account >> authenticated booking links registration.customer via /api/booking
- Location: tests/e2e/checkout-customer-linking.spec.ts:130:7

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 200
Received: 500
```

# Test source

```ts
  43  |           quantity: 1,
  44  |           unitPrice: TRIP_PRICE,
  45  |           title: 'Митикас, Гърция',
  46  |         }],
  47  |         customerEmail: email,
  48  |         firstName: 'E2E',
  49  |         lastName: 'Linked',
  50  |         phone: '0000000000',
  51  |         orderTotal: TRIP_PRICE,
  52  |       },
  53  |     })
  54  |     expect(res.status()).toBe(200)
  55  |     const { url } = await res.json()
  56  |     expect(url).toBeTruthy()
  57  | 
  58  |     const order = await findOwn(request, token, 'orders', { email: { equals: email } })
  59  |     expect(order).toBeTruthy()
  60  |     const linkedCustomerId = typeof order.customer === 'object' ? order.customer?.id : order.customer
  61  |     expect(String(linkedCustomerId)).toBe(String(customer.id))
  62  |   })
  63  | 
  64  |   test('anonymous cart checkout does not link any customer', async ({ request }) => {
  65  |     const anonEmail = `e2e-anon-${Date.now()}@test.com`
  66  |     const res = await request.post('/api/checkout', {
  67  |       data: {
  68  |         type: 'cart',
  69  |         items: [{
  70  |           type: 'trip',
  71  |           tripId: String(TRIP_ID),
  72  |           quantity: 1,
  73  |           unitPrice: TRIP_PRICE,
  74  |           title: 'Митикас, Гърция',
  75  |         }],
  76  |         customerEmail: anonEmail,
  77  |         firstName: 'Anon',
  78  |         lastName: 'Buyer',
  79  |         phone: '0000000000',
  80  |         orderTotal: TRIP_PRICE,
  81  |       },
  82  |     })
  83  |     expect(res.status()).toBe(200)
  84  | 
  85  |     // Anonymous request has no session — verify indirectly: a follow-up authenticated
  86  |     // checkout for the SAME email does not pick up this anonymous order's identity,
  87  |     // i.e. linking is driven strictly by the request's own auth cookie, not by email.
  88  |     const res2 = await request.post('/api/checkout', {
  89  |       headers: { Cookie: `payload-token=${token}` },
  90  |       data: {
  91  |         type: 'cart',
  92  |         items: [{
  93  |           type: 'trip',
  94  |           tripId: String(TRIP_ID),
  95  |           quantity: 1,
  96  |           unitPrice: TRIP_PRICE,
  97  |           title: 'Митикас, Гърция',
  98  |         }],
  99  |         customerEmail: anonEmail,
  100 |         firstName: 'Anon',
  101 |         lastName: 'Buyer',
  102 |         phone: '0000000000',
  103 |         orderTotal: TRIP_PRICE,
  104 |       },
  105 |     })
  106 |     expect(res2.status()).toBe(200)
  107 |     const order = await findOwn(request, token, 'orders', { email: { equals: anonEmail } })
  108 |     expect(order).toBeTruthy()
  109 |     const linkedCustomerId = typeof order.customer === 'object' ? order.customer?.id : order.customer
  110 |     expect(String(linkedCustomerId)).toBe(String(customer.id))
  111 |   })
  112 | 
  113 |   test('authenticated legacy single-item registration checkout links customer', async ({ request }) => {
  114 |     const res = await request.post('/api/checkout', {
  115 |       headers: { Cookie: `payload-token=${token}` },
  116 |       data: {
  117 |         type: 'registration',
  118 |         recordId: `e2e-reg-link-${Date.now()}`,
  119 |         amount: TRIP_PRICE,
  120 |         tripId: TRIP_ID,
  121 |         customerEmail: email,
  122 |         description: 'Митикас, Гърция',
  123 |       },
  124 |     })
  125 |     expect(res.status()).toBe(200)
  126 |     const { url } = await res.json()
  127 |     expect(url).toBeTruthy()
  128 |   })
  129 | 
  130 |   test('authenticated booking links registration.customer via /api/booking', async ({ request }) => {
  131 |     const res = await request.post('/api/booking', {
  132 |       headers: { Cookie: `payload-token=${token}` },
  133 |       data: {
  134 |         tripId: TRIP_ID,
  135 |         firstName: 'E2E',
  136 |         lastName: 'Booker',
  137 |         email,
  138 |         phone: '0000000000',
  139 |         participantCount: 1,
  140 |         agreedToTerms: true,
  141 |       },
  142 |     })
> 143 |     expect(res.status()).toBe(200)
      |                          ^ Error: expect(received).toBe(expected) // Object.is equality
  144 |     const { registrationId } = await res.json()
  145 |     expect(registrationId).toBeTruthy()
  146 | 
  147 |     const registration = await findOwn(request, token, 'registrations', { id: { equals: registrationId } })
  148 |     expect(registration).toBeTruthy()
  149 |     const linkedCustomerId = typeof registration.customer === 'object' ? registration.customer?.id : registration.customer
  150 |     expect(String(linkedCustomerId)).toBe(String(customer.id))
  151 |   })
  152 | 
  153 |   test('anonymous booking leaves registration.customer unset', async ({ request }) => {
  154 |     const anonEmail = `e2e-anon-booking-${Date.now()}@test.com`
  155 |     const res = await request.post('/api/booking', {
  156 |       data: {
  157 |         tripId: TRIP_ID,
  158 |         firstName: 'Anon',
  159 |         lastName: 'Booker',
  160 |         email: anonEmail,
  161 |         phone: '0000000000',
  162 |         participantCount: 1,
  163 |         agreedToTerms: true,
  164 |       },
  165 |     })
  166 |     expect(res.status()).toBe(200)
  167 |     const { registrationId } = await res.json()
  168 |     expect(registrationId).toBeTruthy()
  169 | 
  170 |     // No session cookie means no authenticated read access either — confirm the API
  171 |     // rejects an unauthenticated read of the record it just created (default Payload
  172 |     // access requires an authenticated user of some collection).
  173 |     const readRes = await request.get(`/api/registrations/${registrationId}`)
  174 |     expect(readRes.status()).toBe(403)
  175 |   })
  176 | })
  177 | 
```