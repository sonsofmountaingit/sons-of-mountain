# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: checkout-cart.spec.ts >> Cart Checkout >> happy path: product → checkout → success
- Location: tests/e2e/checkout-cart.spec.ts:19:7

# Error details

```
Error: locator.waitFor: Target page, context or browser has been closed
Call log:
  - waiting for locator('iframe[name*="__privateStripeFrame"]').first().contentFrame().locator('input[data-elements-stable-field-name="cardNumber"], input[placeholder*="Card"]').first() to be visible

```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test'
  2   | import { getStripe, createTestCheckoutSession } from './helpers/stripe'
  3   | import { create, getById, remove, update } from './helpers/payload'
  4   | import { createProduct, deleteProduct, createDiscountCode, deleteDiscountCode, createVoucher, deleteVoucher, createCustomer, deleteCustomer } from './fixtures'
  5   | 
  6   | test.describe('Cart Checkout', () => {
  7   |   let product: any
  8   |   let stripe: ReturnType<typeof getStripe>
  9   | 
  10  |   test.beforeAll(async () => {
  11  |     stripe = getStripe()
  12  |     product = await createProduct()
  13  |   })
  14  | 
  15  |   test.afterAll(async () => {
  16  |     if (product?.id) await deleteProduct(product.id)
  17  |   })
  18  | 
  19  |   test('happy path: product → checkout → success', async ({ page }) => {
  20  |     await page.goto('/shop')
  21  |     // Add product to cart via API shortcut (Stripe hosted checkout)
  22  |     const session = await stripe.checkout.sessions.create({
  23  |       mode: 'payment',
  24  |       payment_method_types: ['card'],
  25  |       line_items: [{ price_data: { currency: 'eur', product_data: { name: product.title }, unit_amount: Math.round(product.price * 100) }, quantity: 1 }],
  26  |       success_url: 'http://localhost:3000/shop/success?session_id={CHECKOUT_SESSION_ID}',
  27  |       cancel_url: 'http://localhost:3000/shop/cancel',
  28  |     })
  29  |     await page.goto(session.url!)
  30  |     await page.waitForLoadState('networkidle', { timeout: 20_000 }).catch(() => {})
  31  |     // Fill email if prompted (Stripe Link / hosted checkout email prompt)
  32  |     const emailField = page.locator('input#email, input[name="email"]').first()
  33  |     if (await emailField.isVisible({ timeout: 5000 }).catch(() => false)) {
  34  |       await emailField.fill('test-checkout@test.com')
  35  |       await page.keyboard.press('Tab')
  36  |       await page.waitForTimeout(1000)
  37  |     }
  38  |     // Stripe hosted checkout (checkout.stripe.com) — card number input is inside
  39  |     // a nested __privateStripeFrame iframe within the Stripe-hosted page.
  40  |     // Use frameLocator chaining to find it.
  41  |     const cardFrameLocator = page.frameLocator('iframe[name*="__privateStripeFrame"]').first()
  42  |     // Wait for card number field — try direct page first, then iframe
  43  |     let cardFilled = false
  44  |     const directCardInput = page.locator('input[data-elements-stable-field-name="cardNumber"]').first()
  45  |     if (await directCardInput.isVisible({ timeout: 5000 }).catch(() => false)) {
  46  |       await directCardInput.fill('4242424242424242')
  47  |       await page.locator('input[data-elements-stable-field-name="cardExpiry"]').first().fill('12/30')
  48  |       await page.locator('input[data-elements-stable-field-name="cardCvc"]').first().fill('123')
  49  |       cardFilled = true
  50  |     }
  51  |     if (!cardFilled) {
  52  |       const cardInput = cardFrameLocator.locator('input[data-elements-stable-field-name="cardNumber"], input[placeholder*="Card"]').first()
> 53  |       await cardInput.waitFor({ state: 'visible', timeout: 30_000 })
      |                       ^ Error: locator.waitFor: Target page, context or browser has been closed
  54  |       await cardInput.fill('4242424242424242')
  55  |       await cardFrameLocator.locator('input[data-elements-stable-field-name="cardExpiry"], input[placeholder*="MM"]').first().fill('12/30')
  56  |       await cardFrameLocator.locator('input[data-elements-stable-field-name="cardCvc"], input[placeholder*="CVC"]').first().fill('123')
  57  |     }
  58  |     await page.locator('[data-testid="hosted-payment-submit-button"], button[type="submit"]').first().click()
  59  |     await page.waitForURL('**/shop/success**', { timeout: 45_000 })
  60  |     expect(page.url()).toContain('/shop/success')
  61  |   })
  62  | 
  63  |   test('discount code (percent) reduces total', async ({ request }) => {
  64  |     const dc = await createDiscountCode('percent', 10)
  65  |     const res = await request.post('/api/discount/validate', {
  66  |       data: { code: dc.code, cartTotal: 100 },
  67  |     })
  68  |     const data = await res.json()
  69  |     expect(data.discountAmount).toBeCloseTo(10)
  70  |     await deleteDiscountCode(dc.id)
  71  |   })
  72  | 
  73  |   test('discount code (fixed) reduces total', async ({ request }) => {
  74  |     const dc = await createDiscountCode('fixed', 20)
  75  |     const res = await request.post('/api/discount/validate', {
  76  |       data: { code: dc.code, cartTotal: 100 },
  77  |     })
  78  |     const data = await res.json()
  79  |     expect(data.discountAmount).toBeCloseTo(20)
  80  |     await deleteDiscountCode(dc.id)
  81  |   })
  82  | 
  83  |   test('gift voucher deducted from total', async ({ request }) => {
  84  |     const voucher = await createVoucher(15)
  85  |     const res = await request.post('/api/discount/validate', {
  86  |       data: { voucherCode: voucher.code, orderTotal: 100 },
  87  |     })
  88  |     // Voucher validation endpoint may vary — test it returns voucher data
  89  |     expect(res.status()).toBeLessThan(500)
  90  |     await deleteVoucher(voucher.id)
  91  |   })
  92  | 
  93  |   test('out-of-stock product blocked in cart validate', async ({ request }) => {
  94  |     const soldOut = await createProduct()
  95  |     await update('products', soldOut.id, { stock: 0 })
  96  |     const res = await request.post('/api/cart/validate', {
  97  |       data: { items: [{ type: 'product', productId: soldOut.id, quantity: 1, unitPrice: 49, title: soldOut.title }] },
  98  |     })
  99  |     const data = await res.json()
  100 |     const item = data.items?.find((i: any) => i.productId === soldOut.id)
  101 |     expect(item?.outOfStock ?? data.error).toBeTruthy()
  102 |     await deleteProduct(soldOut.id)
  103 |   })
  104 | 
  105 |   test('referral discount creates reward voucher for referrer', async ({ request }) => {
  106 |     const referrer = await createCustomer('referrer-e2e@test.com', 0)
  107 |     const dc = await create('discount-codes', {
  108 |       code: `REF-E2E-${Date.now()}`,
  109 |       type: 'referral',
  110 |       value: 10,
  111 |       isActive: true,
  112 |       usedCount: 0,
  113 |       referredBy: referrer.id,
  114 |     })
  115 | 
  116 |     // Verify the discount code structure is correct (actual reward created by webhook handler)
  117 |     expect((dc.doc ?? dc).type).toBe('referral')
  118 | 
  119 |     await remove('discount-codes', (dc.doc ?? dc).id)
  120 |     await deleteCustomer(referrer.id)
  121 |   })
  122 | })
  123 | 
```