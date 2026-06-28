---
paths:
  - "src/payload/globals/**"
  - "src/app/api/**"
  - "src/components/blocks/**"
  - "src/components/admin/**"
  - "src/components/ui/**"
  - "src/puck/**"
  - "src/app/(puck)/**"
---

# Component Scaffold

Trigger: "create/build/add/scaffold component/page/section"

Reference: Footer — `src/payload/globals/Footer.ts`, `src/app/api/footer-data/route.ts`, `src/app/api/puck/footer/route.ts`, `src/components/blocks/footer/*.tsx`, `src/app/(puck)/puck/footer/page.tsx`, `src/components/admin/FooterVisualEditorButton.tsx`, `src/components/ui/Footer.tsx`

## Every new component MUST have ALL of these (in order):

1. **Payload global** `src/payload/globals/<Name>.ts` — one field per editable text/image/url, `afterChange: [() => { after(() => revalidateTag('<name>')) }]`, `admin: { group: 'Site Settings' }`, `ui` field `Field: '@/components/admin/<Name>VisualEditorButton#<Name>VisualEditorButton'`, `puckData` json field `admin: { hidden: true }`

2. **Data API** `src/app/api/<name>-data/route.ts` — GET, fetch global, resolve relationships, return flat JSON

3. **Puck save API** `src/app/api/puck/<name>/route.ts` — PATCH, auth check, parse puckData, extract block props, `payload.updateGlobal`, `revalidateTag`

4. **Section blocks** `src/components/blocks/<name>/<Name><Section>Block.tsx` — one per visual section, `'use client'` only if hooks needed

5. **Register blocks** in `src/puck/config.tsx` — each section as named block with `fields`, `defaultProps`, `render`; update `componentToCategory` in `PuckEditorClient.tsx`

6. **Puck editor** `src/app/(puck)/puck/<name>/page.tsx` + `Puck<Name>EditorClient.tsx` — auth check, fetch Payload, build puckData; client: `'use client'`, save → PATCH `/api/puck/<name>`, `← Admin` in headerActions

7. **Admin button** `src/components/admin/<Name>VisualEditorButton.tsx` — `'use client'`, `<a href="/puck/<name>">Open Visual Editor</a>`

8. **Frontend edit button** `src/components/ui/<Name>EditButton.tsx` — `'use client'`, polls `/api/users/me`, fixed-position link to `/puck/<name>`, null if not admin

9. **Frontend RSC** `src/components/ui/<Name>.tsx` — async, `unstable_cache` tags `['<name>']` + `revalidate: 3600`, `??` fallbacks, renders `<> <element/> <<Name>EditButton /> </>`

10. **Register** in `src/payload/payload.config.ts` globals array

11. **Clear cache**: `rm -rf .next/cache`
