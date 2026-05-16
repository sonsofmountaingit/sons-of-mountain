# Calendar Page + Programs + Wishlist in Accounts — Full Plan

## Context
Building on the existing codebase to deliver:
1. **Programs collection** — a new Payload collection for individual programs ("Индивидуално Приключение": yoga retreat, ski week, etc.) that appear in the Calendar alongside Trips and Destinations
2. **Three-category Calendar** — mirrors the Navbar megamenu: В БЪЛГАРИЯ | В ЧУЖБИНА | ИНДИВИДУАЛНО ПРИКЛЮЧЕНИЕ — all shown in the same calendar grouped by month, with a category filter tab bar
3. **Server-side Wishlist** — stored in the `Customers` collection, synced to the dashboard
4. **Live spot tracking** — `spotsAvailable` auto-computed from confirmed Registrations via afterChange/afterDelete hooks
5. **Calendar page full rebuild** — 3-col month grid, GSAP animations, image/dates/spots/wishlist/badges, 100% SEO
6. **Dashboard wishlist tab** — new `/dashboard/wishlist` page

The megamenu (`ProgramsMegaMenu.tsx`) already uses tabs: "В БЪЛГАРИЯ", "В ЧУЖБИНА", "ИНДИВИДУАЛНО ПРИКЛЮЧЕНИЕ". The Calendar will share the same mental model: all three feed into it, grouped by `startDate` month.

---

## 1. Programs Collection (new Payload collection)

**File:** `src/payload/collections/Programs.ts`

Individual programs are distinct from Destinations (geography) and Trips (group tour). They are curated experiences (yoga, skiing, photography workshop, sailing week, etc.) with their own dates, capacity, price, type.

**Fields:**
- `title` (text, required)
- `slug` (text, unique, auto-generated)
- `type` (select: Yoga, Ski, Photography, Sailing, Hiking, Cultural, Wellness, Adventure, Other)
- `description` (richText)
- `shortDescription` (textarea)
- `heroImage` (upload → media)
- `gallery` (array of upload → media)
- `startDate` (date, required)
- `endDate` (date, required)
- `location` (text — e.g. "Банско, България")
- `destination` (relationship → destinations, optional — link to a destination if relevant)
- `spotsTotal` (number, default 12)
- `spotsAvailable` (number, default 12)
- `price` (number, required)
- `currency` (select: BGN/EUR/USD, default EUR)
- `depositAmount` (number)
- `tags` (array of select: Singles Only, Family, Couples, Photography, Yoga, Ski, Sailing)
- `included` (array: item text — what's included)
- `notIncluded` (array: item text)
- `itinerary` (array: day, title, content, image)
- `instructor` (group: name, bio, photo)
- `status` (select: active/soldOut/draft, default active)
- `meta` (group: title, description, image)
- `puckData` (json, hidden — for visual editor)

**Hooks:** `afterChange` revalidates `'programs'` tag + syncs `spotsAvailable` via same spot-sync logic

**Register** in `src/payload/payload.config.ts`

---

## 2. Spot Sync Hook (new utility)

**File:** `src/payload/hooks/syncTripSpots.ts`

```ts
// Called afterChange/afterDelete on Registrations
// Counts pending+confirmed+paid registrations by participantCount
// Patches spotsAvailable on the linked Trip OR Program
async function syncSpots(tripId, programId, payload) {
  // for trips
  if (tripId) {
    const { docs } = await payload.find({
      collection: 'registrations',
      where: { and: [{ trip: { equals: tripId } }, { status: { in: ['pending','confirmed','paid'] } }] },
      limit: 0,
    })
    const used = docs.reduce((s, r) => s + (r.participantCount ?? 1), 0)
    const trip = await payload.findByID({ collection: 'trips', id: tripId })
    await payload.update({ collection: 'trips', id: tripId, data: { spotsAvailable: Math.max(0, (trip.spotsTotal ?? 0) - used) } })
  }
  // same for programs
}
```

**Modify:** `src/payload/collections/Registrations.ts` — add `program` relationship field, add afterChange/afterDelete hooks

---

## 3. Wishlist in Customers Collection + API

**Modify:** `src/payload/collections/Customers.ts`
- Add field: `wishlist` (array) with sub-fields: `itemType` (select: trip/program), `trip` (relationship → trips, conditional), `program` (relationship → programs, conditional)

**New API routes:**
- `src/app/api/wishlist/route.ts` — GET (fetch user's wishlist), POST (add item), DELETE (remove item)
  - Auth: verify `better-auth` session via `auth.api.getSession`
  - Find customer by `betterAuthId`, update `wishlist` array

---

## 4. Dashboard Wishlist Tab

**New files:**
- `src/app/(frontend)/dashboard/wishlist/page.tsx` — RSC, fetches wishlist from `/api/wishlist`
- `src/app/(frontend)/dashboard/wishlist/WishlistClient.tsx` — `'use client'`, renders trip/program cards, remove button

**Modify:** `src/app/(frontend)/dashboard/DashboardNav.tsx` — add "Любими" link

---

## 5. Calendar Page Rebuild

### 5a. `src/app/(frontend)/calendar/page.tsx` — Replace

```
- RSC, 'use cache' + cacheTag('trips') + cacheTag('programs')
- Fetch trips (depth:2) + programs (depth:2) in parallel
- Map both to unified CalendarItem interface
- Group by startDate month → MonthGroup[]
- Full Metadata: title, description, og:title, og:description, og:image (first item image), canonical
- Render <CalendarGrid groups={monthGroups} />
```

**CalendarItem interface:**
```ts
{
  id: string
  kind: 'trip' | 'program'
  category: 'bulgaria' | 'abroad' | 'individual'  // maps to megamenu tabs
  title: string
  destinationName: string
  destinationSlug: string | null
  imageUrl: string | null
  imageAlt: string
  startDate: string
  endDate: string
  spotsAvailable: number
  spotsTotal: number
  status: 'active' | 'soldOut' | 'draft'
  tags: string[]
  href: string  // /destinations/[slug] for trips, /programs/[slug] for programs
}
```

Mapping logic in RSC page:
- Trip → `category = destination.type === 'bulgaria' ? 'bulgaria' : 'abroad'`
- Program → `category = 'individual'`

### 5b. `src/components/ui/CalendarGrid.tsx` — New, `'use client'`

- Receives `MonthGroup[]` + `initialWishlist: string[]` (passed from RSC via cookie/session)
- 3-col responsive grid: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
- Each column: month label (uppercase BG) + stacked `<CalendarTripCard>` items
- GSAP ScrollTrigger: `gsap.registerPlugin(ScrollTrigger)` in `useEffect`
- Per month group: `gsap.from(cardRefs, { y:40, opacity:0, stagger:0.08, duration:0.55, ease:'power2.out', scrollTrigger:{trigger:sectionRef, start:'top 80%'} })`
- Page-load hero animation: title + subtitle fade+slide from above on mount

**Filter/control bar (fully implemented, client-side):**
- **Category tabs**: Всички | В БЪЛГАРИЯ | В ЧУЖБИНА | ИНДИВИДУАЛНО ПРИКЛЮЧЕНИЕ — mirrors the megamenu
- **Tag filter chips**: All | Singles Only | Yoga | Adventure | Ski | Sailing | Photography | Wellness
- **Year switcher tabs**: detect unique years, render tab buttons (2026 | 2027), filter by year
- **"Само свободни" toggle**: hides items where `spotsAvailable === 0 || status === 'soldOut'`
- **"Любими" toggle**: only visible when logged in — filters to wishlisted item IDs
- **Search bar**: debounced 150ms, filters by title/destination name
- All filters compose (AND logic): category + tag + year + available + wishlist + search
- **URL-driven**: filter state synced to query params (`?category=abroad&year=2026&tag=Singles+Only`) via `useSearchParams` + `router.replace`
- GSAP transition: `gsap.to(grid, { opacity:0, duration:0.15 })` → update state → `gsap.to(grid, { opacity:1, duration:0.2 })`

### 5c. `src/components/ui/CalendarTripCard.tsx` — New, `'use client'`

Layout:
```
[thumbnail 80x80 rounded-lg] [text col: tag label / title / dates] [right: spots badge | wishlist heart | share]
```

- Spots badge:
  - 0 or soldOut → grey "НЯМА МЕСТА" pill
  - 1-3 → amber `"{N} МЕСТА"` pill with GSAP counter animation on scroll enter
  - 4-8 → subtle small grey count
  - 9+ → no badge
- Tags: first tag as small uppercase label above title
- Wishlist heart: logged-in only, optimistic UI, POST/DELETE `/api/wishlist`, GSAP pulse on toggle
- Card hover: `gsap.to(card, { y:-2, duration:0.2 })` mouseenter/leave
- Reduced motion: all GSAP wrapped in `matchMedia('(prefers-reduced-motion: reduce)')` check
- Preload on hover: `router.prefetch(href)` on `mouseenter`
- `id="trip-{id}"` for deep-linking
- View Transitions API: `<Link>` wrapped for smooth cross-page transitions

**Email reminder (sold-out):**
- "Уведоми ме" button when sold out
- Inline email form, POST to `/api/waitlist`, GSAP slide-down animation

**Share link:**
- Copy `window.location.origin + '/calendar#trip-' + id` to clipboard
- Toast with GSAP fade, auto-dismiss 2s

**Additional card features:**
- "Бил съм тук ✓" badge if `userVisited` prop is true
- `viewCount` display for trips with 10+ views (social proof)
- "Добави в календар" iCal download button
- Compare checkbox: select 2-3 trips → sticky comparison drawer at bottom

---

## 6. SEO — Full

```ts
export const metadata: Metadata = {
  title: 'Календар с пътувания 2026 | Sons of Mountains',
  description: 'Всички предстоящи пътувания и програми по месец. Открий своето следващо приключение.',
  openGraph: { title, description, images: [firstTripImage], type: 'website' },
  alternates: { canonical: '/calendar' },
}
```

- **JSON-LD structured data**: `ItemList` of `Event` schema for all trips (Google rich results)
- **Canonical hreflang**: ready for English version when added
- **Print view**: `@media print` CSS — clean B&W list, hides filters/buttons

---

## 7. Map View

- Toggle button in CalendarGrid header: list ↔ map
- **`src/components/ui/CalendarMap.tsx`** — `'use client'`, MapLibre GL JS
- Add `latitude` + `longitude` fields to Destinations + Programs collections
- Free tile source: `https://tiles.openfreemap.org/styles/liberty`
- Pins per item, popup on click: title, dates, spots, link

---

## 8. Additional Features (all implemented)

### Visual / UX
- **Sticky month headers** on mobile: `position: sticky; top: 0`
- **Collapsible month sections** on mobile: GSAP height animation
- **GSAP counter** on spots badge: 0 → N on scroll enter
- **Skeleton loaders**: `animate-pulse` shimmer cards during hydration
- **Seasonal banners**: "ЛЯТО 2026" banner above first month group of each season (GSAP fade-in)
- **Recently viewed**: `localStorage` key `'som_recent'`, "Последно видяно" strip at top
- **"Сравни" mode**: checkbox per card → sticky comparison drawer (price, dates, spots, tags)

### Backend
- **Cron auto-soldOut**: `src/app/api/cron/sync-sold-out/route.ts`
- **Waitlist auto-notify**: Resend email when spot opens after cancellation
- **Early-bird pricing**: `earlyBirdPrice` + `earlyBirdUntil` + `earlyBirdSpots` fields on Trips/Programs
- **Group booking**: `maxParticipantsPerRegistration` field + multi-seat booking form
- **iCal export**: `src/app/api/ical/[itemId]/route.ts` → `.ics` download
- **Price alert**: POST `/api/price-alert`, email on price drop

### Quality
- All interactive elements have `aria-label`; keyboard navigation for filters
- Error states: revert optimistic UI + error toast on API failure
- Loading spinners on in-flight wishlist calls
- `next/image` with `sizes` + `priority` on first 3 cards
- All new files pass `tsc --noEmit`

---

## Files Summary

| Path | Action |
|------|--------|
| `src/payload/collections/Programs.ts` | **Create** |
| `src/payload/payload.config.ts` | **Modify** — register Programs |
| `src/payload/hooks/syncTripSpots.ts` | **Create** |
| `src/payload/collections/Registrations.ts` | **Modify** — add program field + spot-sync hooks |
| `src/payload/collections/Customers.ts` | **Modify** — add wishlist array field |
| `src/payload/collections/Destinations.ts` | **Modify** — add latitude/longitude |
| `src/payload/collections/Trips.ts` | **Modify** — add earlyBird fields, viewCount |
| `src/app/api/wishlist/route.ts` | **Create** |
| `src/app/api/waitlist/route.ts` | **Create** |
| `src/app/api/price-alert/route.ts` | **Create** |
| `src/app/api/ical/[itemId]/route.ts` | **Create** |
| `src/app/api/cron/sync-sold-out/route.ts` | **Create** |
| `src/app/(frontend)/dashboard/wishlist/page.tsx` | **Create** |
| `src/app/(frontend)/dashboard/wishlist/WishlistClient.tsx` | **Create** |
| `src/app/(frontend)/dashboard/DashboardNav.tsx` | **Modify** — add wishlist link |
| `src/app/(frontend)/calendar/page.tsx` | **Replace** |
| `src/components/ui/CalendarGrid.tsx` | **Create** |
| `src/components/ui/CalendarTripCard.tsx` | **Create** |
| `src/components/ui/CalendarMap.tsx` | **Create** — MapLibre GL JS |

---

## Verification — End-to-End Checklist

### Backend / Data
- [ ] Create a Program in Payload admin → saved, visible in `/admin/collections/programs`
- [ ] Trip linked to Bulgaria destination → `category: 'bulgaria'` in calendar
- [ ] Trip linked to Abroad destination → `category: 'abroad'` in calendar
- [ ] Create a Registration → `spotsAvailable` auto-decrements on Trip
- [ ] Cancel registration → `spotsAvailable` restores
- [ ] `spotsAvailable === 0` → `status: 'soldOut'` (cron or immediate hook)

### Calendar Page UI
- [ ] `/calendar` renders 3-col month grid
- [ ] All three categories present; category filter tabs work
- [ ] Tag filter, year switcher, available-only toggle, search all work
- [ ] "Любими" toggle (logged in only) filters correctly
- [ ] URL updates on filter change; back button restores state
- [ ] GSAP stagger per month section on scroll
- [ ] Page title + subtitle animate on load
- [ ] Sold-out → grey pill; low spots → amber pill with counter animation
- [ ] Skeleton shimmer on hydration
- [ ] Collapsible months on mobile; sticky month headers
- [ ] Seasonal banners ("ЛЯТО 2026") display correctly
- [ ] Recently viewed strip at top after visiting a trip detail

### Wishlist
- [ ] Not logged in → no heart, no "Любими" toggle
- [ ] Logged in → heart visible, toggles optimistically, persists on reload
- [ ] Dashboard `/dashboard/wishlist` shows saved items with remove button
- [ ] Dashboard nav has "Любими" link

### Sold-out / Waitlist
- [ ] Sold-out card shows "Уведоми ме" button
- [ ] Submit email → Subscriber created with `waitlist:tripId` segment
- [ ] Form animates open/closed

### Share / iCal / Map
- [ ] Share copies URL with anchor, toast appears
- [ ] "Добави в календар" downloads valid `.ics`
- [ ] Map toggle renders MapLibre with pins; popup on click

### Compare
- [ ] Select 2 trips → comparison drawer appears
- [ ] Drawer shows price, dates, spots, tags side by side

### SEO
- [ ] `<title>Календар с пътувания 2026 | Sons of Mountains</title>`
- [ ] og:title, og:description, og:image in `<head>`
- [ ] `<link rel="canonical">` present
- [ ] JSON-LD `Event` schema in `<script>` tag

---

## Future Roadmap (not in this plan)
- Personalized recommendations based on registration history + wishlist
- Live availability via WebSocket / SSE
- "Само 2 места — 3 души гледат" combined urgency message
- Trip preview drawer (open inline without leaving calendar)
- Multi-currency toggle (BGN / EUR)
- Gamification: loyalty points per trip booked
- AI trip suggestions: natural language filter box
