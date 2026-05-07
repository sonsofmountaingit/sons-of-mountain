---
name: component-scaffold
description: |
  Scaffold a new component or page with full Payload CMS field definitions,
  real-time revalidation, Puck editor blocks (one block per section, each individually
  clickable/editable), a dedicated /puck/<name> editor route, an API save route that
  syncs Puck props back to Payload globals/collections, and an admin UI button that
  opens the Puck editor. Trigger when the user says: "create component", "new component",
  "create page", "new page", "add section", "scaffold", or any request to build a new
  UI section that should be CMS-editable.
triggers:
  - create component
  - new component
  - create page
  - new page
  - add section
  - scaffold
---

# Component Scaffold Skill

## Reference Implementation

The footer is the canonical reference. Study these files before generating anything:

**Payload Global (CMS fields):**
- `src/payload/globals/Footer.ts` — field definitions, revalidation hook, admin group

**API routes:**
- `src/app/api/footer-data/route.ts` — GET: fetches global + resolves relationships (trips, nav), returns flat JSON for client
- `src/app/api/puck/footer/route.ts` — PATCH: receives puckData, extracts block props, writes each field back to Payload global, calls `revalidateTag`

**Puck config blocks** (one block per visual section, each individually selectable in editor):
- `src/components/blocks/footer/FooterSubscribeBlock.tsx` — subscribe form section
- `src/components/blocks/footer/FooterFollowBlock.tsx` — social follow section
- `src/components/blocks/footer/FooterTravelBlock.tsx` — travel links section (fetches from API)
- `src/components/blocks/footer/FooterNavBlock.tsx` — navigation links section (fetches from API)
- `src/components/blocks/footer/FooterBottomBlock.tsx` — bottom bar section

**Puck block registrations** in `src/puck/config.tsx`:
- Each section block registered separately with its own `fields`, `defaultProps`, `render`
- `FooterBlock` kept as legacy global-fetch block

**Puck editor route:**
- `src/app/(puck)/puck/footer/page.tsx` — server component: auth check, fetches Payload global, populates all block props from existing Payload data, falls back to defaults
- `src/app/(puck)/puck/footer/PuckFooterEditorClient.tsx` — client: `<Puck>` with save/autosave/publish wired to `/api/puck/footer`

**Admin UI button:**
- `src/components/admin/FooterVisualEditorButton.tsx` — `'use client'`, renders `<a href="/puck/footer">Open Visual Editor</a>`
- Registered in `src/payload/globals/Footer.ts` as a `ui` field with `admin.components.Field`

**Frontend button (for logged-in admins):**
- `src/components/ui/FooterEditButton.tsx` — `'use client'`, polls `/api/users/me`, shows fixed-position button linking to `/puck/footer`
- Rendered inside `src/components/ui/Footer.tsx` wrapped in a fragment `<> <footer>…</footer> <FooterEditButton /> </>`

**Frontend server component:**
- `src/components/ui/Footer.tsx` — async RSC, uses `unstable_cache` with `revalidateTag`, reads all fields from Payload global, renders full footer

---

## Rules for Every New Component

### 1. Payload Global or Collection

Create `src/payload/globals/<Name>.ts` (or collection):
- Every editable text/image/url = one field
- Add revalidation hook: `afterChange: [() => { after(() => revalidateTag('<name>')) }]`
- Add `admin: { group: 'Site Settings' }` for globals
- Add a `ui` field with `Field: '@/components/admin/<Name>VisualEditorButton#<Name>VisualEditorButton'`
- Add a `puckData` json field with `admin: { hidden: true }`
- Register in `src/payload/payload.config.ts` globals or collections array

### 2. API Data Route

Create `src/app/api/<name>-data/route.ts`:
- GET handler: fetch Payload global/collection, resolve relationships, return flat JSON
- No auth required (public read)

### 3. API Puck Save Route

Create `src/app/api/puck/<name>/route.ts`:
- PATCH handler: auth check, parse body.puckData, extract props from each block type, call `payload.updateGlobal` or `payload.update`, call `revalidateTag('<name>')`

### 4. Section Blocks (one per visual section)

Create `src/components/blocks/<name>/` directory with one file per section:
- `'use client'` only if needs `useEffect`/`useState` (e.g. fetching dynamic data)
- Props = only the fields that section owns
- Default props = same defaults as Payload field `defaultValue`
- Pure rendering — no business logic

### 5. Puck Block Registrations

In `src/puck/config.tsx`:
- Import each section block
- Register each as its own named block: `<Name><Section>Block: { label, fields, defaultProps, render: (props) => <Component {...props} /> }`
- Fields mirror the Payload fields for that section
- Add to `componentToCategory` in `PuckEditorClient.tsx` under `'global'`

### 6. Puck Editor Route

Create `src/app/(puck)/puck/<name>/page.tsx`:
- Async RSC: auth check → redirect('/admin') if not logged in
- Fetch Payload global/collection
- Build `puckData: Data` — if saved puckData exists use it, else build from Payload field values
- Pass to `<Puck<Name>EditorClient initialData={puckData} />`

Create `src/app/(puck)/puck/<name>/Puck<Name>EditorClient.tsx`:
- `'use client'`
- Import `puckConfig` from `@/puck/config`
- `saveData` function → PATCH `/api/puck/<name>`
- `<Puck config={puckConfig} data={initialData} onPublish={handlePublish} onAction={handleAutosave} ...>`
- Include `← Admin` link in `headerActions` pointing to `/admin/globals/<name>`

### 7. Admin Visual Editor Button

Create `src/components/admin/<Name>VisualEditorButton.tsx`:
- `'use client'`
- `<a href="/puck/<name>" target="_blank">Open Visual Editor</a>`
- Style matching `VisualEditorButton.tsx`

### 8. Frontend Edit Button (admin-only floating button)

Create `src/components/ui/<Name>EditButton.tsx`:
- `'use client'`
- `useEffect` → fetch `/api/users/me` → if `d?.user` setIsAdmin(true)
- Fixed position button linking to `/puck/<name>`
- Returns null if not admin

### 9. Frontend Server Component

Create or update `src/components/ui/<Name>.tsx`:
- Async RSC (no `'use client'`)
- `unstable_cache` wrapping Payload fetch with `tags: ['<name>']` and `revalidate: 3600`
- Read all fields with `??` fallbacks
- Return `<> <main-element>…</main-element> <<Name>EditButton /> </>`

### 10. Register in Payload Config

Open `src/payload/payload.config.ts`:
- Add the new global to `globals: [...]` array
- Add the new collection to `collections: [...]` if applicable

---

## Execution Checklist

When triggered, perform ALL of these steps in order:

1. Read the user's component description
2. Identify all editable sections and fields
3. Create Payload global/collection with all fields + puckData + ui button field + revalidation hook
4. Create `/api/<name>-data/route.ts`
5. Create `/api/puck/<name>/route.ts`
6. Create section block components in `src/components/blocks/<name>/`
7. Register all blocks in `src/puck/config.tsx`
8. Update `componentToCategory` in `PuckEditorClient.tsx`
9. Create Puck editor page + client in `src/app/(puck)/puck/<name>/`
10. Create admin `<Name>VisualEditorButton.tsx`
11. Create frontend `<Name>EditButton.tsx`
12. Create/update frontend server component `src/components/ui/<Name>.tsx`
13. Register global/collection in `src/payload/payload.config.ts`
14. Delete `.next/cache` to force recompile
