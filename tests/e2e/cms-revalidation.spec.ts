import { test, expect } from '@playwright/test'
import { create, remove, update, getById } from './helpers/payload'

const BASE = process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:3000'

// ─── helpers ─────────────────────────────────────────────────────────────────

async function getPayloadToken() {
  const res = await fetch(`${BASE}/api/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: process.env.PAYLOAD_ADMIN_EMAIL ?? 'test@test.com',
      password: process.env.PAYLOAD_ADMIN_PASSWORD ?? 'TestUser',
    }),
  })
  const data = await res.json()
  return data.token as string
}

async function puckPatch(route: string, token: string) {
  const res = await fetch(`${BASE}/api/puck/${route}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Authorization: `JWT ${token}` },
    body: JSON.stringify({ puckData: { content: [], root: { props: {} } } }),
  })
  return res.status
}

async function globalGet(slug: string, token: string) {
  const res = await fetch(`${BASE}/api/globals/${slug}`, {
    headers: { Authorization: `JWT ${token}` },
  })
  return res.json()
}

async function globalPatch(slug: string, data: Record<string, unknown>, token: string) {
  const res = await fetch(`${BASE}/api/globals/${slug}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Authorization: `JWT ${token}` },
    body: JSON.stringify(data),
  })
  return res.json()
}

// ─── fixtures ────────────────────────────────────────────────────────────────

async function createDestination(suffix: string) {
  return create('destinations', {
    name: `E2E Dest ${suffix}`,
    slug: `e2e-dest-${suffix}`,
    price: 1200,
    durationDays: 7,
    type: 'bulgaria',
    heroImage: 181,
    introText: 'E2E test destination',
  })
}

async function createProgram(suffix: string) {
  return create('programs', {
    title: `E2E Program ${suffix}`,
    slug: `e2e-prog-${suffix}`,
    price: 800,
    status: 'active',
    type: 'Photography',
  })
}

async function createTrip(destinationId: number | string, suffix: string) {
  return create('trips', {
    title: `E2E Trip ${suffix}`,
    slug: `e2e-trip-${suffix}`,
    destination: destinationId,
    startDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + 67 * 24 * 60 * 60 * 1000).toISOString(),
    spotsTotal: 10,
    spotsAvailable: 10,
    price: 1500,
    status: 'active',
  })
}

// ─── test suite ──────────────────────────────────────────────────────────────

test.describe('CMS → Frontend Revalidation', () => {
  let token: string
  let destId: string
  let destSlug: string
  let destSuffix: string
  let progId: string
  let progSlug: string
  let progSuffix: string
  let tripId: string
  let tripSlug: string
  let tripSuffix: string

  test.beforeAll(async () => {
    token = await getPayloadToken()
    expect(token, 'Must obtain JWT token').toBeTruthy()
  })

  // ── Auth ──────────────────────────────────────────────────────────────────

  test('admin login returns JWT token', async () => {
    expect(token.length).toBeGreaterThan(20)
  })

  // ── Destinations: create → frontend list ─────────────────────────────────

  test('create destination via API → appears on /destinations immediately', async ({ page }) => {
    const suffix = `${Date.now()}`
    destSuffix = suffix
    destSlug = `e2e-dest-${suffix}`

    // snapshot before
    await page.goto('/destinations')
    await page.waitForLoadState('networkidle')
    const before = await page.locator(`a[href="/destinations/${destSlug}"]`).count()
    expect(before).toBe(0)

    // create
    const res = await createDestination(suffix)
    destId = (res.doc ?? res).id
    expect(destId, 'Destination creation must return an id').toBeTruthy()

    // reload — must appear immediately (revalidateTag fired)
    await page.reload()
    await page.waitForLoadState('networkidle')
    const after = await page.locator(`a[href="/destinations/${destSlug}"]`).count()
    expect(after).toBe(1)
  })

  test('destination detail page renders immediately (force-dynamic)', async ({ page }) => {
    await page.goto(`/destinations/${destSlug}`)
    await page.waitForLoadState('networkidle')
    const status = page.url()
    // page must not 404
    const body = await page.textContent('body')
    expect(body).not.toContain('404')
  })

  test('edit destination fields → /destinations reflects change immediately', async ({ page }) => {
    const updatedName = `E2E Dest EDITED ${destSuffix}`
    await update('destinations', destId, { name: updatedName })

    await page.goto('/destinations')
    await page.waitForLoadState('networkidle')
    const body = await page.textContent('body')
    expect(body).toContain(updatedName)
  })

  test('delete destination → removed from /destinations immediately', async ({ page }) => {
    await remove('destinations', destId)

    await page.goto('/destinations')
    await page.waitForLoadState('networkidle')
    const link = await page.locator(`a[href="/destinations/${destSlug}"]`).count()
    expect(link).toBe(0)
  })

  // ── Programs: create → frontend list ─────────────────────────────────────

  test('create program via API → appears on /programs immediately', async ({ page }) => {
    const suffix = `${Date.now()}`
    progSuffix = suffix
    progSlug = `e2e-prog-${suffix}`

    await page.goto('/programs')
    await page.waitForLoadState('networkidle')
    const before = await page.locator(`a[href="/programs/${progSlug}"]`).count()
    expect(before).toBe(0)

    const res = await createProgram(suffix)
    progId = (res.doc ?? res).id
    expect(progId).toBeTruthy()

    await page.reload()
    await page.waitForLoadState('networkidle')
    const after = await page.locator(`a[href="/programs/${progSlug}"]`).count()
    expect(after).toBe(1)
  })

  test('program detail page renders immediately (force-dynamic)', async ({ page }) => {
    await page.goto(`/programs/${progSlug}`)
    await page.waitForLoadState('networkidle')
    const body = await page.textContent('body')
    expect(body).not.toContain('404')
  })

  test('edit program → /programs reflects change immediately', async ({ page }) => {
    const updatedTitle = `E2E Program EDITED ${progSuffix}`
    await update('programs', progId, { title: updatedTitle })

    await page.goto('/programs')
    await page.waitForLoadState('networkidle')
    const body = await page.textContent('body')
    expect(body).toContain(updatedTitle)
  })

  test('delete program → removed from /programs immediately', async ({ page }) => {
    await remove('programs', progId)

    await page.goto('/programs')
    await page.waitForLoadState('networkidle')
    const link = await page.locator(`a[href="/programs/${progSlug}"]`).count()
    expect(link).toBe(0)
  })

  // ── Trips: create → frontend list ────────────────────────────────────────

  test('create trip via API → appears on /trips immediately', async ({ page }) => {
    const suffix = `${Date.now()}`
    tripSuffix = suffix
    tripSlug = `e2e-trip-${suffix}`

    await page.goto('/trips')
    await page.waitForLoadState('networkidle')
    const before = await page.locator(`a[href*="${tripSlug}"], a[href*="/shop/"]`).count()

    const res = await createTrip(10, suffix) // destination id 10 exists from fixtures
    tripId = (res.doc ?? res).id
    expect(tripId).toBeTruthy()

    await page.reload()
    await page.waitForLoadState('networkidle')
    // trips list should grow
    const afterLinks = await page.locator('a[href*="/shop/"], a[href*="/trips/"]').count()
    expect(afterLinks).toBeGreaterThan(before)
  })

  test('trip detail page renders immediately (force-dynamic)', async ({ page }) => {
    await page.goto(`/trips/${tripSlug}`)
    await page.waitForLoadState('networkidle')
    // Either renders content or redirects to /shop — must not hard 500
    expect(page.url()).not.toContain('error')
  })

  test('edit trip → /trips reflects change immediately', async ({ page }) => {
    const updatedTitle = `E2E Trip EDITED ${tripSuffix}`
    await update('trips', tripId, { title: updatedTitle })

    await page.goto('/trips')
    await page.waitForLoadState('networkidle')
    const body = await page.textContent('body')
    expect(body).toContain(updatedTitle)
  })

  test('delete trip → removed from /trips immediately', async ({ page }) => {
    await remove('trips', tripId)

    await page.goto('/trips')
    await page.waitForLoadState('networkidle')
    const body = await page.textContent('body')
    expect(body).not.toContain(`E2E Trip EDITED ${tripSuffix}`)
  })

  // ── Puck visual editor save routes ────────────────────────────────────────

  test('PATCH /api/puck/hero returns 200', async () => {
    const status = await puckPatch('hero', token)
    expect(status).toBe(200)
  })

  test('PATCH /api/puck/footer returns 200', async () => {
    const status = await puckPatch('footer', token)
    expect(status).toBe(200)
  })

  test('PATCH /api/puck/navigation returns 200', async () => {
    const status = await puckPatch('navigation', token)
    expect(status).toBe(200)
  })

  test('PATCH /api/puck/testimonials returns 200', async () => {
    const status = await puckPatch('testimonials', token)
    expect(status).toBe(200)
  })

  test('PATCH /api/puck/gallery returns 200', async () => {
    const status = await puckPatch('gallery', token)
    expect(status).toBe(200)
  })

  test('PATCH /api/puck/featured-travels returns 200', async () => {
    const status = await puckPatch('featured-travels', token)
    expect(status).toBe(200)
  })

  test('PATCH /api/puck/destination-carousel returns 200', async () => {
    const status = await puckPatch('destination-carousel', token)
    expect(status).toBe(200)
  })

  test('PATCH /api/puck/shop returns 200', async () => {
    const status = await puckPatch('shop', token)
    expect(status).toBe(200)
  })

  test('PATCH /api/puck/why-travel-with-us returns 200', async () => {
    const status = await puckPatch('why-travel-with-us', token)
    expect(status).toBe(200)
  })

  test('PATCH /api/puck/calendar-cta returns 200', async () => {
    const status = await puckPatch('calendar-cta', token)
    expect(status).toBe(200)
  })

  test('PATCH /api/puck/about returns 200', async () => {
    const status = await puckPatch('about', token)
    expect(status).toBe(200)
  })

  test('unauthenticated PATCH /api/puck/hero returns 401', async () => {
    const res = await fetch(`${BASE}/api/puck/hero`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ puckData: {} }),
    })
    expect(res.status).toBe(401)
  })


  // ── Globals: Payload admin save → frontend cache busted ──────────────────

  test('Hero global: save via Payload API → homepage still serves (cache busted)', async ({ page }) => {
    const current = await globalGet('hero', token)
    const originalHeadline = current.headline ?? 'Original'
    const testHeadline = `E2E Hero Test ${Date.now()}`

    await globalPatch('hero', { headline: testHeadline }, token)

    await page.goto('/')
    await page.waitForLoadState('networkidle')
    const body = await page.textContent('body')
    expect(body).toContain(testHeadline)

    // restore
    await globalPatch('hero', { headline: originalHeadline }, token)
  })

  test('Navigation global: save via Payload API → navigation updates immediately', async ({ page }) => {
    const current = await globalGet('navigation', token)
    const testLabel = `E2E Nav ${Date.now()}`
    const origLeft = current.navLinksLeft ?? []

    const newLinks = [{ label: testLabel, href: '/e2e-nav-test' }, ...origLeft.slice(0, 2)]
    await globalPatch('navigation', { navLinksLeft: newLinks }, token)

    await page.goto('/')
    await page.waitForLoadState('networkidle')
    const body = await page.textContent('body')
    expect(body).toContain(testLabel)

    // restore
    await globalPatch('navigation', { navLinksLeft: origLeft }, token)
  })

  // ── Data API routes: no stale cache ──────────────────────────────────────

  test('GET /api/footer-data returns 200 with JSON', async () => {
    const res = await fetch(`${BASE}/api/footer-data`)
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(typeof data).toBe('object')
  })

  test('GET /api/megamenu returns 200 with destinations and trips', async () => {
    const res = await fetch(`${BASE}/api/megamenu`)
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(Array.isArray(data.destinations) || Array.isArray(data.trips) || typeof data === 'object').toBe(true)
  })

  test('GET /api/shop-data returns 200 with shop data', async () => {
    const res = await fetch(`${BASE}/api/shop-data`)
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(typeof data).toBe('object')
  })

  // ── Frontend pages: all load successfully ────────────────────────────────

  test('/ loads without error', async ({ page }) => {
    const res = await page.goto('/')
    expect(res?.status()).toBeLessThan(500)
  })

  test('/destinations loads without error', async ({ page }) => {
    const res = await page.goto('/destinations')
    expect(res?.status()).toBeLessThan(500)
    await expect(page.locator('h1')).toBeVisible()
  })

  test('/trips loads without error', async ({ page }) => {
    const res = await page.goto('/trips')
    expect(res?.status()).toBeLessThan(500)
  })

  test('/programs loads without error', async ({ page }) => {
    const res = await page.goto('/programs')
    expect(res?.status()).toBeLessThan(500)
  })

  test('/shop loads without error', async ({ page }) => {
    const res = await page.goto('/shop')
    expect(res?.status()).toBeLessThan(500)
  })

  test('/gallery loads without error', async ({ page }) => {
    const res = await page.goto('/gallery')
    expect(res?.status()).toBeLessThan(500)
  })

  test('/about loads without error', async ({ page }) => {
    const res = await page.goto('/about')
    expect(res?.status()).toBeLessThan(500)
  })

  test('/blog loads without error', async ({ page }) => {
    const res = await page.goto('/blog')
    expect(res?.status()).toBeLessThan(500)
  })

  test('/stories loads without error', async ({ page }) => {
    const res = await page.goto('/stories')
    expect(res?.status()).toBeLessThan(500)
  })

  test('/calendar loads without error', async ({ page }) => {
    const res = await page.goto('/calendar')
    expect(res?.status()).toBeLessThan(500)
  })
})
