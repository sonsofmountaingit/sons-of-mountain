# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: cms-revalidation.spec.ts >> CMS → Frontend Revalidation >> PATCH /api/puck/testimonials returns 200
- Location: tests/e2e/cms-revalidation.spec.ts:275:7

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 200
Received: 500
```

# Test source

```ts
  177 | 
  178 |     await page.reload()
  179 |     await page.waitForLoadState('networkidle')
  180 |     const after = await page.locator(`a[href="/programs/${progSlug}"]`).count()
  181 |     expect(after).toBe(1)
  182 |   })
  183 | 
  184 |   test('program detail page renders immediately (force-dynamic)', async ({ page }) => {
  185 |     await page.goto(`/programs/${progSlug}`)
  186 |     await page.waitForLoadState('networkidle')
  187 |     const body = await page.textContent('body')
  188 |     expect(body).not.toContain('404')
  189 |   })
  190 | 
  191 |   test('edit program → /programs reflects change immediately', async ({ page }) => {
  192 |     const updatedTitle = `E2E Program EDITED ${progSuffix}`
  193 |     await update('programs', progId, { title: updatedTitle })
  194 | 
  195 |     await page.goto('/programs')
  196 |     await page.waitForLoadState('networkidle')
  197 |     const body = await page.textContent('body')
  198 |     expect(body).toContain(updatedTitle)
  199 |   })
  200 | 
  201 |   test('delete program → removed from /programs immediately', async ({ page }) => {
  202 |     await remove('programs', progId)
  203 | 
  204 |     await page.goto('/programs')
  205 |     await page.waitForLoadState('networkidle')
  206 |     const link = await page.locator(`a[href="/programs/${progSlug}"]`).count()
  207 |     expect(link).toBe(0)
  208 |   })
  209 | 
  210 |   // ── Trips: create → frontend list ────────────────────────────────────────
  211 | 
  212 |   test('create trip via API → appears on /trips immediately', async ({ page }) => {
  213 |     const suffix = `${Date.now()}`
  214 |     tripSuffix = suffix
  215 |     tripSlug = `e2e-trip-${suffix}`
  216 | 
  217 |     await page.goto('/trips')
  218 |     await page.waitForLoadState('networkidle')
  219 |     const before = await page.locator(`a[href*="${tripSlug}"], a[href*="/shop/"]`).count()
  220 | 
  221 |     const res = await createTrip(10, suffix) // destination id 10 exists from fixtures
  222 |     tripId = (res.doc ?? res).id
  223 |     expect(tripId).toBeTruthy()
  224 | 
  225 |     await page.reload()
  226 |     await page.waitForLoadState('networkidle')
  227 |     // trips list should grow
  228 |     const afterLinks = await page.locator('a[href*="/shop/"], a[href*="/trips/"]').count()
  229 |     expect(afterLinks).toBeGreaterThan(before)
  230 |   })
  231 | 
  232 |   test('trip detail page renders immediately (force-dynamic)', async ({ page }) => {
  233 |     await page.goto(`/trips/${tripSlug}`)
  234 |     await page.waitForLoadState('networkidle')
  235 |     // Either renders content or redirects to /shop — must not hard 500
  236 |     expect(page.url()).not.toContain('error')
  237 |   })
  238 | 
  239 |   test('edit trip → /trips reflects change immediately', async ({ page }) => {
  240 |     const updatedTitle = `E2E Trip EDITED ${tripSuffix}`
  241 |     await update('trips', tripId, { title: updatedTitle })
  242 | 
  243 |     await page.goto('/trips')
  244 |     await page.waitForLoadState('networkidle')
  245 |     const body = await page.textContent('body')
  246 |     expect(body).toContain(updatedTitle)
  247 |   })
  248 | 
  249 |   test('delete trip → removed from /trips immediately', async ({ page }) => {
  250 |     await remove('trips', tripId)
  251 | 
  252 |     await page.goto('/trips')
  253 |     await page.waitForLoadState('networkidle')
  254 |     const body = await page.textContent('body')
  255 |     expect(body).not.toContain(`E2E Trip EDITED ${tripSuffix}`)
  256 |   })
  257 | 
  258 |   // ── Puck visual editor save routes ────────────────────────────────────────
  259 | 
  260 |   test('PATCH /api/puck/hero returns 200', async () => {
  261 |     const status = await puckPatch('hero', token)
  262 |     expect(status).toBe(200)
  263 |   })
  264 | 
  265 |   test('PATCH /api/puck/footer returns 200', async () => {
  266 |     const status = await puckPatch('footer', token)
  267 |     expect(status).toBe(200)
  268 |   })
  269 | 
  270 |   test('PATCH /api/puck/navigation returns 200', async () => {
  271 |     const status = await puckPatch('navigation', token)
  272 |     expect(status).toBe(200)
  273 |   })
  274 | 
  275 |   test('PATCH /api/puck/testimonials returns 200', async () => {
  276 |     const status = await puckPatch('testimonials', token)
> 277 |     expect(status).toBe(200)
      |                    ^ Error: expect(received).toBe(expected) // Object.is equality
  278 |   })
  279 | 
  280 |   test('PATCH /api/puck/gallery returns 200', async () => {
  281 |     const status = await puckPatch('gallery', token)
  282 |     expect(status).toBe(200)
  283 |   })
  284 | 
  285 |   test('PATCH /api/puck/featured-travels returns 200', async () => {
  286 |     const status = await puckPatch('featured-travels', token)
  287 |     expect(status).toBe(200)
  288 |   })
  289 | 
  290 |   test('PATCH /api/puck/destination-carousel returns 200', async () => {
  291 |     const status = await puckPatch('destination-carousel', token)
  292 |     expect(status).toBe(200)
  293 |   })
  294 | 
  295 |   test('PATCH /api/puck/shop returns 200', async () => {
  296 |     const status = await puckPatch('shop', token)
  297 |     expect(status).toBe(200)
  298 |   })
  299 | 
  300 |   test('PATCH /api/puck/why-travel-with-us returns 200', async () => {
  301 |     const status = await puckPatch('why-travel-with-us', token)
  302 |     expect(status).toBe(200)
  303 |   })
  304 | 
  305 |   test('PATCH /api/puck/calendar-cta returns 200', async () => {
  306 |     const status = await puckPatch('calendar-cta', token)
  307 |     expect(status).toBe(200)
  308 |   })
  309 | 
  310 |   test('PATCH /api/puck/about returns 200', async () => {
  311 |     const status = await puckPatch('about', token)
  312 |     expect(status).toBe(200)
  313 |   })
  314 | 
  315 |   test('unauthenticated PATCH /api/puck/hero returns 401', async () => {
  316 |     const res = await fetch(`${BASE}/api/puck/hero`, {
  317 |       method: 'PATCH',
  318 |       headers: { 'Content-Type': 'application/json' },
  319 |       body: JSON.stringify({ puckData: {} }),
  320 |     })
  321 |     expect(res.status).toBe(401)
  322 |   })
  323 | 
  324 | 
  325 |   // ── Globals: Payload admin save → frontend cache busted ──────────────────
  326 | 
  327 |   test('Hero global: save via Payload API → homepage still serves (cache busted)', async ({ page }) => {
  328 |     const current = await globalGet('hero', token)
  329 |     const originalHeadline = current.headline ?? 'Original'
  330 |     const testHeadline = `E2E Hero Test ${Date.now()}`
  331 | 
  332 |     await globalPatch('hero', { headline: testHeadline }, token)
  333 | 
  334 |     await page.goto('/')
  335 |     await page.waitForLoadState('networkidle')
  336 |     const body = await page.textContent('body')
  337 |     expect(body).toContain(testHeadline)
  338 | 
  339 |     // restore
  340 |     await globalPatch('hero', { headline: originalHeadline }, token)
  341 |   })
  342 | 
  343 |   test('Navigation global: save via Payload API → navigation updates immediately', async ({ page }) => {
  344 |     const current = await globalGet('navigation', token)
  345 |     const testLabel = `E2E Nav ${Date.now()}`
  346 |     const origLeft = current.navLinksLeft ?? []
  347 | 
  348 |     const newLinks = [{ label: testLabel, href: '/e2e-nav-test' }, ...origLeft.slice(0, 2)]
  349 |     await globalPatch('navigation', { navLinksLeft: newLinks }, token)
  350 | 
  351 |     await page.goto('/')
  352 |     await page.waitForLoadState('networkidle')
  353 |     const body = await page.textContent('body')
  354 |     expect(body).toContain(testLabel)
  355 | 
  356 |     // restore
  357 |     await globalPatch('navigation', { navLinksLeft: origLeft }, token)
  358 |   })
  359 | 
  360 |   // ── Data API routes: no stale cache ──────────────────────────────────────
  361 | 
  362 |   test('GET /api/footer-data returns 200 with JSON', async () => {
  363 |     const res = await fetch(`${BASE}/api/footer-data`)
  364 |     expect(res.status).toBe(200)
  365 |     const data = await res.json()
  366 |     expect(typeof data).toBe('object')
  367 |   })
  368 | 
  369 |   test('GET /api/megamenu returns 200 with destinations and trips', async () => {
  370 |     const res = await fetch(`${BASE}/api/megamenu`)
  371 |     expect(res.status).toBe(200)
  372 |     const data = await res.json()
  373 |     expect(Array.isArray(data.destinations) || Array.isArray(data.trips) || typeof data === 'object').toBe(true)
  374 |   })
  375 | 
  376 |   test('GET /api/shop-data returns 200 with shop data', async () => {
  377 |     const res = await fetch(`${BASE}/api/shop-data`)
```