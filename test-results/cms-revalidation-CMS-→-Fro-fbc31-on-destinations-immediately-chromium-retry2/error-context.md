# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: cms-revalidation.spec.ts >> CMS → Frontend Revalidation >> create destination via API → appears on /destinations immediately
- Location: tests/e2e/cms-revalidation.spec.ts:111:7

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 1
Received: 0
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - banner [ref=e2]:
    - navigation [ref=e3]:
      - generic [ref=e4]:
        - button "Програми" [ref=e5]:
          - text: Програми
          - img [ref=e6]
        - link "Календар" [ref=e8] [cursor=pointer]:
          - /url: /calendar
        - link "Истории" [ref=e9] [cursor=pointer]:
          - /url: /stories
      - generic [ref=e10]:
        - link "Блог" [ref=e11] [cursor=pointer]:
          - /url: /blog
        - link "Ваучери" [ref=e12] [cursor=pointer]:
          - /url: /vouchers
        - link "Магазин" [ref=e13] [cursor=pointer]:
          - /url: /shop
        - link "ВХОД" [ref=e14] [cursor=pointer]:
          - /url: /login
        - generic [ref=e15]:
          - button "Cart" [ref=e16]:
            - img [ref=e17]
          - button "Търсене" [ref=e21]:
            - img [ref=e22]
          - button "BG" [ref=e26]:
            - text: BG
            - img [ref=e27]
          - link "Instagram" [ref=e29] [cursor=pointer]:
            - /url: https://instagram.com
            - img [ref=e30]
          - link "Facebook" [ref=e34] [cursor=pointer]:
            - /url: https://facebook.com
            - img [ref=e35]
  - link "Logo" [ref=e37] [cursor=pointer]:
    - /url: /
    - img "Logo" [ref=e38]
  - generic "Shopping cart" [ref=e39]:
    - generic [ref=e40]:
      - heading "Cart (0)" [level=2] [ref=e41]
      - button "Close cart" [ref=e42]:
        - img [ref=e43]
    - generic [ref=e46]:
      - img [ref=e47]
      - paragraph [ref=e49]: Your cart is empty
  - main [ref=e50]:
    - generic [ref=e52]:
      - heading "Дестинации" [level=1] [ref=e53]
      - paragraph [ref=e54]: Избери своето следващо приключение
      - generic [ref=e55]:
        - link "uganda 2 E2E Dest 1781004756506" [ref=e56] [cursor=pointer]:
          - /url: /destinations/e2e-dest-1781004756506
          - img "uganda 2" [ref=e57]
          - heading "E2E Dest 1781004756506" [level=3] [ref=e60]
        - link "uganda 2 E2E Dest 1781004759563" [ref=e61] [cursor=pointer]:
          - /url: /destinations/e2e-dest-1781004759563
          - img "uganda 2" [ref=e62]
          - heading "E2E Dest 1781004759563" [level=3] [ref=e65]
        - link "uganda 2 E2E Dest 1781004833096" [ref=e66] [cursor=pointer]:
          - /url: /destinations/e2e-dest-1781004833096
          - img "uganda 2" [ref=e67]
          - heading "E2E Dest 1781004833096" [level=3] [ref=e70]
        - link "uganda 2 E2E Dest 1781004835538" [ref=e71] [cursor=pointer]:
          - /url: /destinations/e2e-dest-1781004835538
          - img "uganda 2" [ref=e72]
          - heading "E2E Dest 1781004835538" [level=3] [ref=e75]
        - link "Азорски Острови Азорски Острови" [ref=e76] [cursor=pointer]:
          - /url: /destinations/azores
          - img "Азорски Острови" [ref=e77]
          - heading "Азорски Острови" [level=3] [ref=e80]
        - link "Бразилия Бразилия" [ref=e81] [cursor=pointer]:
          - /url: /destinations/brazil
          - img "Бразилия" [ref=e82]
          - heading "Бразилия" [level=3] [ref=e85]
        - link "Исландия Исландия" [ref=e86] [cursor=pointer]:
          - /url: /destinations/iceland
          - img "Исландия" [ref=e87]
          - heading "Исландия" [level=3] [ref=e90]
        - link "Мароко Мароко" [ref=e91] [cursor=pointer]:
          - /url: /destinations/morocco
          - img "Мароко" [ref=e92]
          - heading "Мароко" [level=3] [ref=e95]
        - link "Перу Перу" [ref=e96] [cursor=pointer]:
          - /url: /destinations/peru
          - img "Перу" [ref=e97]
          - heading "Перу" [level=3] [ref=e100]
        - link "Пирин Планина Пирин Планина" [ref=e101] [cursor=pointer]:
          - /url: /destinations/pirin
          - img "Пирин Планина" [ref=e102]
          - heading "Пирин Планина" [level=3] [ref=e105]
        - link "Рила Планина Рила Планина" [ref=e106] [cursor=pointer]:
          - /url: /destinations/rila
          - img "Рила Планина" [ref=e107]
          - heading "Рила Планина" [level=3] [ref=e110]
        - link "Родопи Родопи" [ref=e111] [cursor=pointer]:
          - /url: /destinations/rhodopes
          - img "Родопи" [ref=e112]
          - heading "Родопи" [level=3] [ref=e115]
        - link "Планинска горила - Уганда Уганда" [ref=e116] [cursor=pointer]:
          - /url: /destinations/uganda
          - img "Планинска горила - Уганда" [ref=e117]
          - heading "Уганда" [level=3] [ref=e120]
        - link [ref=e121] [cursor=pointer]:
          - /url: /destinations/null
          - generic [ref=e123]:
            - heading [level=3]
        - link [ref=e124] [cursor=pointer]:
          - /url: /destinations/null
          - generic [ref=e126]:
            - heading [level=3]
        - link [ref=e127] [cursor=pointer]:
          - /url: /destinations/null
          - generic [ref=e129]:
            - heading [level=3]
        - link [ref=e130] [cursor=pointer]:
          - /url: /destinations/null
          - generic [ref=e132]:
            - heading [level=3]
  - contentinfo [ref=e133]:
    - generic [ref=e135]:
      - generic [ref=e136]:
        - generic [ref=e137]:
          - paragraph [ref=e138]: ПЪТУВАЙ С НАС
          - list [ref=e139]:
            - listitem [ref=e140]:
              - link "Черния връх зимен поход януари 2026" [ref=e141] [cursor=pointer]:
                - /url: /shop/2
                - generic [ref=e142]: Черния връх зимен поход
                - generic [ref=e143]: януари 2026
            - listitem [ref=e144]:
              - link "Исландия – Северно сияние февруари 2026" [ref=e145] [cursor=pointer]:
                - /url: /shop/9
                - generic [ref=e146]: Исландия – Северно сияние
                - generic [ref=e147]: февруари 2026
            - listitem [ref=e148]:
              - link "Мароко – Сахара и Атлас март 2026" [ref=e149] [cursor=pointer]:
                - /url: /shop/11
                - generic [ref=e150]: Мароко – Сахара и Атлас
                - generic [ref=e151]: март 2026
            - listitem [ref=e152]:
              - link "Мачу Пикчу и Амазония април 2026" [ref=e153] [cursor=pointer]:
                - /url: /shop/7
                - generic [ref=e154]: Мачу Пикчу и Амазония
                - generic [ref=e155]: април 2026
            - listitem [ref=e156]:
              - link "Ягодинска пещера и Триград май 2026" [ref=e157] [cursor=pointer]:
                - /url: /shop/5
                - generic [ref=e158]: Ягодинска пещера и Триград
                - generic [ref=e159]: май 2026
            - listitem [ref=e160]:
              - link "E2E Test Trip юни 2026" [ref=e161] [cursor=pointer]:
                - /url: /shop/15
                - generic [ref=e162]: E2E Test Trip
                - generic [ref=e163]: юни 2026
            - listitem [ref=e164]:
              - link "E2E Test Trip юни 2026" [ref=e165] [cursor=pointer]:
                - /url: /shop/18
                - generic [ref=e166]: E2E Test Trip
                - generic [ref=e167]: юни 2026
            - listitem [ref=e168]:
              - link "Исландия – Ринг Роуд юни 2026" [ref=e169] [cursor=pointer]:
                - /url: /shop/10
                - generic [ref=e170]: Исландия – Ринг Роуд
                - generic [ref=e171]: юни 2026
            - listitem [ref=e172]:
              - link "Седемте рилски езера юли 2026" [ref=e173] [cursor=pointer]:
                - /url: /shop/1
                - generic [ref=e174]: Седемте рилски езера
                - generic [ref=e175]: юли 2026
            - listitem [ref=e176]:
              - link "E2E Trip EDITED 1781001546936 август 2026" [ref=e177] [cursor=pointer]:
                - /url: /shop/e2e-trip-1781001546936
                - generic [ref=e178]: E2E Trip EDITED 1781001546936
                - generic [ref=e179]: август 2026
            - listitem [ref=e180]:
              - link "Уганда — Август 2026 август 2026" [ref=e181] [cursor=pointer]:
                - /url: /shop/13
                - generic [ref=e182]: Уганда — Август 2026
                - generic [ref=e183]: август 2026
            - listitem [ref=e184]:
              - link "Вихрен и Синаница август 2026" [ref=e185] [cursor=pointer]:
                - /url: /shop/3
                - generic [ref=e186]: Вихрен и Синаница
                - generic [ref=e187]: август 2026
            - listitem [ref=e188]:
              - link "Родопска приказка септември 2026" [ref=e189] [cursor=pointer]:
                - /url: /shop/6
                - generic [ref=e190]: Родопска приказка
                - generic [ref=e191]: септември 2026
            - listitem [ref=e192]:
              - link "Пирин есенен поход октомври 2026" [ref=e193] [cursor=pointer]:
                - /url: /shop/4
                - generic [ref=e194]: Пирин есенен поход
                - generic [ref=e195]: октомври 2026
            - listitem [ref=e196]:
              - link "Мароко – Медини и море октомври 2026" [ref=e197] [cursor=pointer]:
                - /url: /shop/12
                - generic [ref=e198]: Мароко – Медини и море
                - generic [ref=e199]: октомври 2026
            - listitem [ref=e200]:
              - link "Перу – Инките и Андите ноември 2026" [ref=e201] [cursor=pointer]:
                - /url: /shop/8
                - generic [ref=e202]: Перу – Инките и Андите
                - generic [ref=e203]: ноември 2026
        - generic [ref=e204]:
          - paragraph [ref=e205]: НАВИГАЦИЯ
          - list [ref=e206]:
            - listitem [ref=e207]:
              - link "Календар" [ref=e208] [cursor=pointer]:
                - /url: /calendar
            - listitem [ref=e209]:
              - link "Истории" [ref=e210] [cursor=pointer]:
                - /url: /stories
            - listitem [ref=e211]:
              - link "Блог" [ref=e212] [cursor=pointer]:
                - /url: /blog
            - listitem [ref=e213]:
              - link "Ваучери" [ref=e214] [cursor=pointer]:
                - /url: /vouchers
            - listitem [ref=e215]:
              - link "Магазин" [ref=e216] [cursor=pointer]:
                - /url: /shop
        - generic [ref=e217]:
          - paragraph [ref=e218]: Последвай ни!
          - paragraph [ref=e219]: Стани част от нашата общност и следи приключенията ни отблизо.
          - generic [ref=e220]:
            - link "0 Facebook" [ref=e221] [cursor=pointer]:
              - /url: https://facebook.com/panicframe
              - generic [ref=e222]:
                - generic [ref=e223]: "0"
                - generic [ref=e224]: Facebook
            - link "0 Instagram" [ref=e225] [cursor=pointer]:
              - /url: https://instagram.com/panicframe
              - generic [ref=e226]:
                - generic [ref=e227]: "0"
                - generic [ref=e228]: Instagram
        - generic [ref=e229]:
          - paragraph [ref=e230]: Абонирай се
          - paragraph [ref=e231]: Научавай първи за предстоящи пътешествия, отстъпки и събития.
          - generic [ref=e232]:
            - textbox "Име" [ref=e233]
            - textbox "Фамилия" [ref=e234]
            - textbox "E-mail адрес" [ref=e235]
            - button "Абонирай се!" [ref=e236] [cursor=pointer]
            - paragraph [ref=e237]:
              - text: С натискането на бутона "Абонирай се" се съгласяваш с
              - link "Политиката ни за поверителност" [ref=e238] [cursor=pointer]:
                - /url: /legal/cookies
      - paragraph [ref=e240]:
        - text: SONS OF
        - text: MOUNTAIN
      - generic [ref=e241]:
        - generic [ref=e242]:
          - img "Logo" [ref=e243] [cursor=pointer]
          - generic [ref=e244]:
            - paragraph [ref=e245]: © 2026 Сонс оф Маунтаин
            - paragraph [ref=e246]: "Номер на лиценз: РК-01-8245 / 28.07.2022"
            - paragraph [ref=e247]: "Номер на застрахователна полица: 03700100005995 / 31.08.2025"
        - generic [ref=e248]:
          - generic [ref=e249]:
            - link "Общи условия" [ref=e250] [cursor=pointer]:
              - /url: /legal/terms
            - link "Политика за поверителност" [ref=e251] [cursor=pointer]:
              - /url: /legal/cookies
          - paragraph [ref=e252]:
            - text: Дизайн и разработка от
            - link "NETINSKY" [ref=e253] [cursor=pointer]:
              - /url: /
  - button "Open Next.js Dev Tools" [ref=e259] [cursor=pointer]:
    - img [ref=e260]
  - alert [ref=e263]
```

# Test source

```ts
  31  |   const res = await fetch(`${BASE}/api/globals/${slug}`, {
  32  |     headers: { Authorization: `JWT ${token}` },
  33  |   })
  34  |   return res.json()
  35  | }
  36  | 
  37  | async function globalPatch(slug: string, data: Record<string, unknown>, token: string) {
  38  |   const res = await fetch(`${BASE}/api/globals/${slug}`, {
  39  |     method: 'PATCH',
  40  |     headers: { 'Content-Type': 'application/json', Authorization: `JWT ${token}` },
  41  |     body: JSON.stringify(data),
  42  |   })
  43  |   return res.json()
  44  | }
  45  | 
  46  | // ─── fixtures ────────────────────────────────────────────────────────────────
  47  | 
  48  | async function createDestination(suffix: string) {
  49  |   return create('destinations', {
  50  |     name: `E2E Dest ${suffix}`,
  51  |     slug: `e2e-dest-${suffix}`,
  52  |     price: 1200,
  53  |     durationDays: 7,
  54  |     type: 'bulgaria',
  55  |     heroImage: 181,
  56  |     introText: 'E2E test destination',
  57  |   })
  58  | }
  59  | 
  60  | async function createProgram(suffix: string) {
  61  |   return create('programs', {
  62  |     title: `E2E Program ${suffix}`,
  63  |     slug: `e2e-prog-${suffix}`,
  64  |     price: 800,
  65  |     status: 'active',
  66  |     type: 'Photography',
  67  |   })
  68  | }
  69  | 
  70  | async function createTrip(destinationId: number | string, suffix: string) {
  71  |   return create('trips', {
  72  |     title: `E2E Trip ${suffix}`,
  73  |     slug: `e2e-trip-${suffix}`,
  74  |     destination: destinationId,
  75  |     startDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
  76  |     endDate: new Date(Date.now() + 67 * 24 * 60 * 60 * 1000).toISOString(),
  77  |     spotsTotal: 10,
  78  |     spotsAvailable: 10,
  79  |     price: 1500,
  80  |     status: 'active',
  81  |   })
  82  | }
  83  | 
  84  | // ─── test suite ──────────────────────────────────────────────────────────────
  85  | 
  86  | test.describe('CMS → Frontend Revalidation', () => {
  87  |   let token: string
  88  |   let destId: string
  89  |   let destSlug: string
  90  |   let destSuffix: string
  91  |   let progId: string
  92  |   let progSlug: string
  93  |   let progSuffix: string
  94  |   let tripId: string
  95  |   let tripSlug: string
  96  |   let tripSuffix: string
  97  | 
  98  |   test.beforeAll(async () => {
  99  |     token = await getPayloadToken()
  100 |     expect(token, 'Must obtain JWT token').toBeTruthy()
  101 |   })
  102 | 
  103 |   // ── Auth ──────────────────────────────────────────────────────────────────
  104 | 
  105 |   test('admin login returns JWT token', async () => {
  106 |     expect(token.length).toBeGreaterThan(20)
  107 |   })
  108 | 
  109 |   // ── Destinations: create → frontend list ─────────────────────────────────
  110 | 
  111 |   test('create destination via API → appears on /destinations immediately', async ({ page }) => {
  112 |     const suffix = `${Date.now()}`
  113 |     destSuffix = suffix
  114 |     destSlug = `e2e-dest-${suffix}`
  115 | 
  116 |     // snapshot before
  117 |     await page.goto('/destinations')
  118 |     await page.waitForLoadState('networkidle')
  119 |     const before = await page.locator(`a[href="/destinations/${destSlug}"]`).count()
  120 |     expect(before).toBe(0)
  121 | 
  122 |     // create
  123 |     const res = await createDestination(suffix)
  124 |     destId = (res.doc ?? res).id
  125 |     expect(destId, 'Destination creation must return an id').toBeTruthy()
  126 | 
  127 |     // reload — must appear immediately (revalidateTag fired)
  128 |     await page.reload()
  129 |     await page.waitForLoadState('networkidle')
  130 |     const after = await page.locator(`a[href="/destinations/${destSlug}"]`).count()
> 131 |     expect(after).toBe(1)
      |                   ^ Error: expect(received).toBe(expected) // Object.is equality
  132 |   })
  133 | 
  134 |   test('destination detail page renders immediately (force-dynamic)', async ({ page }) => {
  135 |     await page.goto(`/destinations/${destSlug}`)
  136 |     await page.waitForLoadState('networkidle')
  137 |     const status = page.url()
  138 |     // page must not 404
  139 |     const body = await page.textContent('body')
  140 |     expect(body).not.toContain('404')
  141 |   })
  142 | 
  143 |   test('edit destination fields → /destinations reflects change immediately', async ({ page }) => {
  144 |     const updatedName = `E2E Dest EDITED ${destSuffix}`
  145 |     await update('destinations', destId, { name: updatedName })
  146 | 
  147 |     await page.goto('/destinations')
  148 |     await page.waitForLoadState('networkidle')
  149 |     const body = await page.textContent('body')
  150 |     expect(body).toContain(updatedName)
  151 |   })
  152 | 
  153 |   test('delete destination → removed from /destinations immediately', async ({ page }) => {
  154 |     await remove('destinations', destId)
  155 | 
  156 |     await page.goto('/destinations')
  157 |     await page.waitForLoadState('networkidle')
  158 |     const link = await page.locator(`a[href="/destinations/${destSlug}"]`).count()
  159 |     expect(link).toBe(0)
  160 |   })
  161 | 
  162 |   // ── Programs: create → frontend list ─────────────────────────────────────
  163 | 
  164 |   test('create program via API → appears on /programs immediately', async ({ page }) => {
  165 |     const suffix = `${Date.now()}`
  166 |     progSuffix = suffix
  167 |     progSlug = `e2e-prog-${suffix}`
  168 | 
  169 |     await page.goto('/programs')
  170 |     await page.waitForLoadState('networkidle')
  171 |     const before = await page.locator(`a[href="/programs/${progSlug}"]`).count()
  172 |     expect(before).toBe(0)
  173 | 
  174 |     const res = await createProgram(suffix)
  175 |     progId = (res.doc ?? res).id
  176 |     expect(progId).toBeTruthy()
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
```