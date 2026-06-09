# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: cms-revalidation.spec.ts >> CMS → Frontend Revalidation >> create program via API → appears on /programs immediately
- Location: tests/e2e/cms-revalidation.spec.ts:164:7

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
      - heading "Индивидуални програми" [level=1] [ref=e53]
      - paragraph [ref=e54]: Изцяло персонализирани пътувания — ние организираме всичко за теб
      - generic [ref=e55]:
        - link "Фотография E2E Program 1781004775186 800 EUR" [ref=e56] [cursor=pointer]:
          - /url: /programs/e2e-prog-1781004775186
          - generic [ref=e59]: Фотография
          - generic [ref=e60]:
            - heading "E2E Program 1781004775186" [level=3] [ref=e61]
            - paragraph [ref=e62]: 800 EUR
        - link "Фотография E2E Program 1781004777771 800 EUR" [ref=e63] [cursor=pointer]:
          - /url: /programs/e2e-prog-1781004777771
          - generic [ref=e66]: Фотография
          - generic [ref=e67]:
            - heading "E2E Program 1781004777771" [level=3] [ref=e68]
            - paragraph [ref=e69]: 800 EUR
        - link "Фотография E2E Program 1781004780631 800 EUR" [ref=e70] [cursor=pointer]:
          - /url: /programs/e2e-prog-1781004780631
          - generic [ref=e73]: Фотография
          - generic [ref=e74]:
            - heading "E2E Program 1781004780631" [level=3] [ref=e75]
            - paragraph [ref=e76]: 800 EUR
        - link "Фотография E2E Program 1781004859885 800 EUR" [ref=e77] [cursor=pointer]:
          - /url: /programs/e2e-prog-1781004859885
          - generic [ref=e80]: Фотография
          - generic [ref=e81]:
            - heading "E2E Program 1781004859885" [level=3] [ref=e82]
            - paragraph [ref=e83]: 800 EUR
        - link "Велнес ретрийт – Черно море Уелнес Велнес ретрийт – Черно море Шест дни детокс, масажи, медитация и здравословна храна на брега на Черно море. септември 2026 г. Созопол, България 890 EUR" [ref=e84] [cursor=pointer]:
          - /url: /programs/wellness-black-sea-2026
          - generic [ref=e85]:
            - img "Велнес ретрийт – Черно море" [ref=e86]
            - generic [ref=e87]: Уелнес
          - generic [ref=e88]:
            - heading "Велнес ретрийт – Черно море" [level=3] [ref=e89]
            - paragraph [ref=e90]: Шест дни детокс, масажи, медитация и здравословна храна на брега на Черно море.
            - paragraph [ref=e91]: септември 2026 г.
            - paragraph [ref=e92]: Созопол, България
            - paragraph [ref=e93]: 890 EUR
        - link "Ветроходство Ветроходство – Гърция Седем дни на яхта сред Йонийските острови — Корфу, Левкада, Итака. Без опит необходим. юли 2026 г. Левкада, Гърция 1290 EUR" [ref=e94] [cursor=pointer]:
          - /url: /programs/sailing-greece-2026
          - generic [ref=e97]: Ветроходство
          - generic [ref=e98]:
            - heading "Ветроходство – Гърция" [level=3] [ref=e99]
            - paragraph [ref=e100]: Седем дни на яхта сред Йонийските острови — Корфу, Левкада, Итака. Без опит необходим.
            - paragraph [ref=e101]: юли 2026 г.
            - paragraph [ref=e102]: Левкада, Гърция
            - paragraph [ref=e103]: 1290 EUR
        - link "Азорски острови Йога Йога Ретрийт — Азорски Острови Вулканични острови, океанска медитация и дълбока йога практика. Пет дни в хармония с природата. септември 2026 г. Азорски Острови, Португалия 1950 EUR" [ref=e104] [cursor=pointer]:
          - /url: /programs/azores-yoga-2026
          - generic [ref=e105]:
            - img "Азорски острови" [ref=e106]
            - generic [ref=e107]: Йога
          - generic [ref=e108]:
            - heading "Йога Ретрийт — Азорски Острови" [level=3] [ref=e109]
            - paragraph [ref=e110]: Вулканични острови, океанска медитация и дълбока йога практика. Пет дни в хармония с природата.
            - paragraph [ref=e111]: септември 2026 г.
            - paragraph [ref=e112]: Азорски Острови, Португалия
            - paragraph [ref=e113]: 1950 EUR
        - link "Йога ретрийт в Родопи Йога Йога ретрийт в Родопи Петдневен йога ретрийт сред родопската природа — утринни практики, медитация, баня в извори. май 2026 г. Триград, България 680 EUR" [ref=e114] [cursor=pointer]:
          - /url: /programs/yoga-rhodopes-2026
          - generic [ref=e115]:
            - img "Йога ретрийт в Родопи" [ref=e116]
            - generic [ref=e117]: Йога
          - generic [ref=e118]:
            - heading "Йога ретрийт в Родопи" [level=3] [ref=e119]
            - paragraph [ref=e120]: Петдневен йога ретрийт сред родопската природа — утринни практики, медитация, баня в извори.
            - paragraph [ref=e121]: май 2026 г.
            - paragraph [ref=e122]: Триград, България
            - paragraph [ref=e123]: 680 EUR
        - link "Ски уикенд в Банско Ски Ски уикенд в Банско Четири дни ски и сноуборд в най-добрия ски курорт на Балканите с инструктори и après-ski. януари 2026 г. Банско, България 590 BGN" [ref=e124] [cursor=pointer]:
          - /url: /programs/ski-bansko-2026
          - generic [ref=e125]:
            - img "Ски уикенд в Банско" [ref=e126]
            - generic [ref=e127]: Ски
          - generic [ref=e128]:
            - heading "Ски уикенд в Банско" [level=3] [ref=e129]
            - paragraph [ref=e130]: Четири дни ски и сноуборд в най-добрия ски курорт на Балканите с инструктори и après-ski.
            - paragraph [ref=e131]: януари 2026 г.
            - paragraph [ref=e132]: Банско, България
            - paragraph [ref=e133]: 590 BGN
        - link "Фотографски уикенд – Пловдив Фотография Фотографски уикенд – Пловдив Уъркшоп по пейзажна и улична фотография в старинния Пловдив — Капана, Стария град, нощни снимки. април 2026 г. Пловдив, България 320 BGN" [ref=e134] [cursor=pointer]:
          - /url: /programs/photography-plovdiv-2026
          - generic [ref=e135]:
            - img "Фотографски уикенд – Пловдив" [ref=e136]
            - generic [ref=e137]: Фотография
          - generic [ref=e138]:
            - heading "Фотографски уикенд – Пловдив" [level=3] [ref=e139]
            - paragraph [ref=e140]: Уъркшоп по пейзажна и улична фотография в старинния Пловдив — Капана, Стария град, нощни снимки.
            - paragraph [ref=e141]: април 2026 г.
            - paragraph [ref=e142]: Пловдив, България
            - paragraph [ref=e143]: 320 BGN
        - link "Хайкинг Доломити Туризъм Хайкинг Доломити Осем дни из Доломитите — Alta Via 1, рифуджи, невероятни гледки. Средно ниво на физическа подготовка. август 2026 г. Кортина д'Ампецо, Италия 1490 EUR" [ref=e144] [cursor=pointer]:
          - /url: /programs/hiking-dolomites-2026
          - generic [ref=e145]:
            - img "Хайкинг Доломити" [ref=e146]
            - generic [ref=e147]: Туризъм
          - generic [ref=e148]:
            - heading "Хайкинг Доломити" [level=3] [ref=e149]
            - paragraph [ref=e150]: Осем дни из Доломитите — Alta Via 1, рифуджи, невероятни гледки. Средно ниво на физическа подготовка.
            - paragraph [ref=e151]: август 2026 г.
            - paragraph [ref=e152]: Кортина д'Ампецо, Италия
            - paragraph [ref=e153]: 1490 EUR
  - contentinfo [ref=e154]:
    - generic [ref=e156]:
      - generic [ref=e157]:
        - generic [ref=e158]:
          - paragraph [ref=e159]: ПЪТУВАЙ С НАС
          - list [ref=e160]:
            - listitem [ref=e161]:
              - link "Черния връх зимен поход януари 2026" [ref=e162] [cursor=pointer]:
                - /url: /shop/2
                - generic [ref=e163]: Черния връх зимен поход
                - generic [ref=e164]: януари 2026
            - listitem [ref=e165]:
              - link "Исландия – Северно сияние февруари 2026" [ref=e166] [cursor=pointer]:
                - /url: /shop/9
                - generic [ref=e167]: Исландия – Северно сияние
                - generic [ref=e168]: февруари 2026
            - listitem [ref=e169]:
              - link "Мароко – Сахара и Атлас март 2026" [ref=e170] [cursor=pointer]:
                - /url: /shop/11
                - generic [ref=e171]: Мароко – Сахара и Атлас
                - generic [ref=e172]: март 2026
            - listitem [ref=e173]:
              - link "Мачу Пикчу и Амазония април 2026" [ref=e174] [cursor=pointer]:
                - /url: /shop/7
                - generic [ref=e175]: Мачу Пикчу и Амазония
                - generic [ref=e176]: април 2026
            - listitem [ref=e177]:
              - link "Ягодинска пещера и Триград май 2026" [ref=e178] [cursor=pointer]:
                - /url: /shop/5
                - generic [ref=e179]: Ягодинска пещера и Триград
                - generic [ref=e180]: май 2026
            - listitem [ref=e181]:
              - link "E2E Test Trip юни 2026" [ref=e182] [cursor=pointer]:
                - /url: /shop/15
                - generic [ref=e183]: E2E Test Trip
                - generic [ref=e184]: юни 2026
            - listitem [ref=e185]:
              - link "E2E Test Trip юни 2026" [ref=e186] [cursor=pointer]:
                - /url: /shop/18
                - generic [ref=e187]: E2E Test Trip
                - generic [ref=e188]: юни 2026
            - listitem [ref=e189]:
              - link "Исландия – Ринг Роуд юни 2026" [ref=e190] [cursor=pointer]:
                - /url: /shop/10
                - generic [ref=e191]: Исландия – Ринг Роуд
                - generic [ref=e192]: юни 2026
            - listitem [ref=e193]:
              - link "Седемте рилски езера юли 2026" [ref=e194] [cursor=pointer]:
                - /url: /shop/1
                - generic [ref=e195]: Седемте рилски езера
                - generic [ref=e196]: юли 2026
            - listitem [ref=e197]:
              - link "E2E Trip EDITED 1781001546936 август 2026" [ref=e198] [cursor=pointer]:
                - /url: /shop/e2e-trip-1781001546936
                - generic [ref=e199]: E2E Trip EDITED 1781001546936
                - generic [ref=e200]: август 2026
            - listitem [ref=e201]:
              - link "Уганда — Август 2026 август 2026" [ref=e202] [cursor=pointer]:
                - /url: /shop/13
                - generic [ref=e203]: Уганда — Август 2026
                - generic [ref=e204]: август 2026
            - listitem [ref=e205]:
              - link "Вихрен и Синаница август 2026" [ref=e206] [cursor=pointer]:
                - /url: /shop/3
                - generic [ref=e207]: Вихрен и Синаница
                - generic [ref=e208]: август 2026
            - listitem [ref=e209]:
              - link "Родопска приказка септември 2026" [ref=e210] [cursor=pointer]:
                - /url: /shop/6
                - generic [ref=e211]: Родопска приказка
                - generic [ref=e212]: септември 2026
            - listitem [ref=e213]:
              - link "Пирин есенен поход октомври 2026" [ref=e214] [cursor=pointer]:
                - /url: /shop/4
                - generic [ref=e215]: Пирин есенен поход
                - generic [ref=e216]: октомври 2026
            - listitem [ref=e217]:
              - link "Мароко – Медини и море октомври 2026" [ref=e218] [cursor=pointer]:
                - /url: /shop/12
                - generic [ref=e219]: Мароко – Медини и море
                - generic [ref=e220]: октомври 2026
            - listitem [ref=e221]:
              - link "Перу – Инките и Андите ноември 2026" [ref=e222] [cursor=pointer]:
                - /url: /shop/8
                - generic [ref=e223]: Перу – Инките и Андите
                - generic [ref=e224]: ноември 2026
        - generic [ref=e225]:
          - paragraph [ref=e226]: НАВИГАЦИЯ
          - list [ref=e227]:
            - listitem [ref=e228]:
              - link "Календар" [ref=e229] [cursor=pointer]:
                - /url: /calendar
            - listitem [ref=e230]:
              - link "Истории" [ref=e231] [cursor=pointer]:
                - /url: /stories
            - listitem [ref=e232]:
              - link "Блог" [ref=e233] [cursor=pointer]:
                - /url: /blog
            - listitem [ref=e234]:
              - link "Ваучери" [ref=e235] [cursor=pointer]:
                - /url: /vouchers
            - listitem [ref=e236]:
              - link "Магазин" [ref=e237] [cursor=pointer]:
                - /url: /shop
        - generic [ref=e238]:
          - paragraph [ref=e239]: Последвай ни!
          - paragraph [ref=e240]: Стани част от нашата общност и следи приключенията ни отблизо.
          - generic [ref=e241]:
            - link "0 Facebook" [ref=e242] [cursor=pointer]:
              - /url: https://facebook.com/panicframe
              - generic [ref=e243]:
                - generic [ref=e244]: "0"
                - generic [ref=e245]: Facebook
            - link "0 Instagram" [ref=e246] [cursor=pointer]:
              - /url: https://instagram.com/panicframe
              - generic [ref=e247]:
                - generic [ref=e248]: "0"
                - generic [ref=e249]: Instagram
        - generic [ref=e250]:
          - paragraph [ref=e251]: Абонирай се
          - paragraph [ref=e252]: Научавай първи за предстоящи пътешествия, отстъпки и събития.
          - generic [ref=e253]:
            - textbox "Име" [ref=e254]
            - textbox "Фамилия" [ref=e255]
            - textbox "E-mail адрес" [ref=e256]
            - button "Абонирай се!" [ref=e257] [cursor=pointer]
            - paragraph [ref=e258]:
              - text: С натискането на бутона "Абонирай се" се съгласяваш с
              - link "Политиката ни за поверителност" [ref=e259] [cursor=pointer]:
                - /url: /legal/cookies
      - paragraph [ref=e261]:
        - text: SONS OF
        - text: MOUNTAIN
      - generic [ref=e262]:
        - generic [ref=e263]:
          - img "Logo" [ref=e264] [cursor=pointer]
          - generic [ref=e265]:
            - paragraph [ref=e266]: © 2026 Сонс оф Маунтаин
            - paragraph [ref=e267]: "Номер на лиценз: РК-01-8245 / 28.07.2022"
            - paragraph [ref=e268]: "Номер на застрахователна полица: 03700100005995 / 31.08.2025"
        - generic [ref=e269]:
          - generic [ref=e270]:
            - link "Общи условия" [ref=e271] [cursor=pointer]:
              - /url: /legal/terms
            - link "Политика за поверителност" [ref=e272] [cursor=pointer]:
              - /url: /legal/cookies
          - paragraph [ref=e273]:
            - text: Дизайн и разработка от
            - link "NETINSKY" [ref=e274] [cursor=pointer]:
              - /url: /
  - button "Open Next.js Dev Tools" [ref=e280] [cursor=pointer]:
    - img [ref=e281]
  - alert [ref=e284]
```

# Test source

```ts
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
  131 |     expect(after).toBe(1)
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
> 181 |     expect(after).toBe(1)
      |                   ^ Error: expect(received).toBe(expected) // Object.is equality
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
  277 |     expect(status).toBe(200)
  278 |   })
  279 | 
  280 |   test('PATCH /api/puck/gallery returns 200', async () => {
  281 |     const status = await puckPatch('gallery', token)
```