@AGENTS.md

# Dependency Graph — Token-Free Code Search

Before searching for files, tracing imports, or answering "what uses X / what does Y import":
1. Run `bun scripts/graph.ts --json | bun -e "..."` to query the pre-built import graph — do NOT use grep or Read to discover dependencies
2. For focused work on a single file: `bun scripts/graph.ts --focus <path> --out /tmp/g.html`
3. For changed-files-only review: `bun scripts/graph.ts --changed --json`
4. NEVER call the Claude API or any external service to answer structural questions about this codebase — the graph script is free, instant, and local

The graph resolves `@/` and `@payload-config` aliases and covers all 198 source files in `src/`.

# Component Scaffold — Inline Checklist (no SKILL.md read needed)

Trigger: "create/build/add/scaffold component/page/section"

Reference implementation: Footer. Canonical files:
- Global: `src/payload/globals/Footer.ts`
- Data API: `src/app/api/footer-data/route.ts`
- Save API: `src/app/api/puck/footer/route.ts`
- Blocks: `src/components/blocks/footer/*.tsx` (one file per visual section)
- Puck editor: `src/app/(puck)/puck/footer/page.tsx` + `PuckFooterEditorClient.tsx`
- Admin button: `src/components/admin/FooterVisualEditorButton.tsx`
- Frontend RSC: `src/components/ui/Footer.tsx`

## Every new component MUST have ALL of these (in order):

1. **Payload global/collection** `src/payload/globals/<Name>.ts`
   - One field per editable text/image/url
   - `afterChange: [() => { after(() => revalidateTag('<name>')) }]`
   - `admin: { group: 'Site Settings' }`
   - `ui` field: `Field: '@/components/admin/<Name>VisualEditorButton#<Name>VisualEditorButton'`
   - `puckData` json field with `admin: { hidden: true }`

2. **Data API** `src/app/api/<name>-data/route.ts` — GET, fetch global, resolve relationships, return flat JSON

3. **Puck save API** `src/app/api/puck/<name>/route.ts` — PATCH, auth check, parse puckData, extract block props, `payload.updateGlobal`, `revalidateTag`

4. **Section blocks** `src/components/blocks/<name>/<Name><Section>Block.tsx` — one file per visual section, `'use client'` only if needs hooks, pure rendering

5. **Register blocks** in `src/puck/config.tsx` — each section as its own named block with `fields`, `defaultProps`, `render`; update `componentToCategory` in `PuckEditorClient.tsx`

6. **Puck editor** `src/app/(puck)/puck/<name>/page.tsx` — auth check, fetch Payload, build puckData from saved or field values, pass to client
   `src/app/(puck)/puck/<name>/Puck<Name>EditorClient.tsx` — `'use client'`, save → PATCH `/api/puck/<name>`, `← Admin` link in headerActions

7. **Admin button** `src/components/admin/<Name>VisualEditorButton.tsx` — `'use client'`, `<a href="/puck/<name>">Open Visual Editor</a>`

8. **Frontend edit button** `src/components/ui/<Name>EditButton.tsx` — `'use client'`, polls `/api/users/me`, fixed-position link to `/puck/<name>`, returns null if not admin

9. **Frontend RSC** `src/components/ui/<Name>.tsx` — async, `unstable_cache` with `tags: ['<name>']` + `revalidate: 3600`, `??` fallbacks, renders `<> <element/> <<Name>EditButton /> </>`

10. **Register** in `src/payload/payload.config.ts` globals/collections array

11. **Clear cache**: `rm -rf .next/cache`
