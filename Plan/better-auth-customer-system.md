# Better Auth — Full Auth System: Sons of Mountains

## Status: IMPLEMENTED ✓
Completed 2026-05-15. Core auth system is live and functional.

## Context
Travel/experience platform. Customers browse and book destinations, trips, and individual programs; buy gift vouchers for others; and will use a future shop. Admins manage all of this via Payload CMS. Goal: full production auth system — customer frontend + Payload admin management.

---

## Quality Constraints (every file)
- **SEO**: pages are RSC by default; only interactive islands are `'use client'`; every page exports `generateMetadata`
- **Performance**: lazy-load auth forms with `dynamic()`; skeleton loaders; `next/image`; no blocking JS on initial paint
- **Security**: session reads server-side via `auth.api.getSession`; CSRF by Better Auth default; no passwords logged; `betterAuthUserId` fields `readOnly` in Payload
- **Code size**: shared `<AuthForm>` base component reused; minimal duplication
- **Animations**: GSAP only; `useGSAP` hook; stagger reveals, micro field animations, button spinners
- **Package manager**: bun

---

## Architecture

| Layer | Responsibility |
|---|---|
| **Better Auth** | Customer identity: `user`, `session`, `account`, `verification` tables in same PostgreSQL DB |
| **Payload CMS auth** | Admin/editor identity — untouched |
| **Payload collections** | `Customers` (mirrors Better Auth users for admin management), `Registrations`, `Orders`, `GiftVouchers` |
| **Next.js middleware** | Cookie-presence check only (edge runtime safe — no Payload imports) |

---

## Key Implementation Decisions

### Kysely adapter (NOT pg Pool)
Better Auth uses `@better-auth/kysely-adapter` with `kysely@0.28.17`.
```ts
import { kyselyAdapter } from '@better-auth/kysely-adapter'
import { Kysely, PostgresDialect } from 'kysely'
import pg from 'pg'
const db = new Kysely({ dialect: new PostgresDialect({ pool: new pg.Pool({ connectionString: process.env.DATABASE_URI }) }) })
```
**Do NOT use** `new Pool()` directly — causes "Failed to initialize database adapter".

### tablesFilter — prevent Payload from dropping Better Auth tables
```ts
db: postgresAdapter({
  pool: { connectionString: process.env.DATABASE_URI ?? '' },
  tablesFilter: ['!user', '!session', '!account', '!verification'],
})
```
Without this, Payload's Drizzle push DROPs the Better Auth tables on schema sync.

### betterAuthUserId field naming
Relationship fields auto-generate a `_id` FK column. If you name the text field `customerId`, it collides with the auto-generated `customer_id` FK from the `customer` relationship field. Use `betterAuthUserId` instead.

### Middleware — cookie-only, no auth.ts import
Edge runtime cannot import Payload or Better Auth server code. Middleware checks cookie presence only:
```ts
req.cookies.has('better-auth.session_token') || req.cookies.has('__Secure-better-auth.session_token')
```

### Suspense wrapper pattern (Next.js 15 + cacheComponents)
`export const dynamic = 'force-dynamic'` is incompatible with `cacheComponents`. Use:
```tsx
// page.tsx (sync, no dynamic export)
export default function Page() {
  return <Suspense fallback={<Skeleton />}><Content /></Suspense>
}
// Content = async RSC that calls auth.api.getSession
```

### databaseHooks — mandatory, non-silent
Customer creation must NOT be in try/catch. If it fails, signup fails. Idempotency check prevents duplicates:
```ts
const existing = await payload.find({ collection: 'customers', where: { betterAuthId: { equals: user.id } }, limit: 1 })
if (existing.docs.length > 0) return
await payload.create({ ... })  // throws on error — intentional
```

### Tables must be Payload-native
Drop manually-created tables and let Payload's Drizzle push recreate them. Manually-created tables cause `ALTER COLUMN id SET DATA TYPE serial` errors on every startup (serial is not a real PostgreSQL ALTER type).

---

## Database

### Better Auth tables (NOT managed by Payload)
Auto-created by Better Auth: `user`, `session`, `account`, `verification`

### Payload-managed collections
- `customers` — admin view of Better Auth users
- `registrations` — trip/destination sign-ups  
- `gift_vouchers` — purchased vouchers
- `orders` — shop purchases (modified)

---

## Payload Collections

### Customers
Slug: `customers` | Group: `Клиенти`

Fields: `betterAuthId` (text, unique, readOnly), `email` (email, readOnly), `name`, `status` (active/blocked/suspended), `blockedReason`, `emailVerified` (checkbox, readOnly), `phone`, `preferredLang` (BG/EN/DE/RU), `notes`, `tags` (array)

afterChange hook: if status → blocked, call `auth.api.revokeUserSessions({ body: { userId: doc.betterAuthId } })`

### Registrations
Slug: `registrations` | Group: `Регистрации`

Fields: `betterAuthUserId` (text, readOnly), `customer` (relationship→customers), `destination`, `trip`, `status` (pending/confirmed/paid/cancelled/refunded), `firstName`, `lastName`, `email`, `phone`, `participantCount`, `dietaryNotes`, `questions`, `agreedToTerms`, `stripeSessionId`, `stripePaymentIntentId`, `totalAmount`, `currency`, `paidAt`

### GiftVouchers
Slug: `gift-vouchers` | Group: `Shop`

Fields: `code` (auto-generated UUID, unique, readOnly), `betterAuthUserId` (readOnly), `customer`, `recipientEmail`, `recipientName`, `amount`, `currency`, `status` (active/redeemed/expired/cancelled), `expiresAt`, `redeemedAt`, `redeemedByCustomerId`, `stripeSessionId`, `stripePaymentIntentId`, `forDestination`, `forTrip`, `message`, `paidAt`

beforeChange hook auto-generates `code` if not set.

### Orders (modified)
Removed trip/participant fields. Added: `betterAuthUserId`, `customer` (relationship→customers), `productType`, `stripePaymentIntentId`, `paidAt`. Group: `Shop`.

---

## Files

| File | Purpose |
|---|---|
| `src/lib/auth.ts` | Server Better Auth instance (Kysely adapter + databaseHooks) |
| `src/lib/auth-client.ts` | Browser client (`useSession`, `signIn`, `signOut`, `signUp`, `forgetPassword`, `resetPassword`) |
| `src/app/api/auth/[...all]/route.ts` | Catch-all handler via `toNextJsHandler(auth)` |
| `middleware.ts` | Cookie-presence route protection (edge safe) |
| `src/payload/collections/Customers.ts` | Admin user management collection |
| `src/payload/collections/Registrations.ts` | Trip/destination sign-ups collection |
| `src/payload/collections/GiftVouchers.ts` | Gift vouchers collection |
| `src/payload/collections/Orders.ts` | Shop orders (modified) |
| `src/components/auth/AuthForm.tsx` | Shared form base with GSAP animations |
| `src/components/ui/NavbarClient.tsx` | Auth state: unauthenticated→ВХОД link, authenticated→dropdown |
| `src/app/(frontend)/login/` | Login page (RSC + dynamic() island) |
| `src/app/(frontend)/signup/` | Signup page |
| `src/app/(frontend)/forgot-password/` | Password reset request |
| `src/app/(frontend)/reset-password/` | Password reset confirm |
| `src/app/(frontend)/verify-email/` | Email verification |
| `src/app/(frontend)/dashboard/` | Overview dashboard |
| `src/app/(frontend)/dashboard/profile/` | Profile + change password + delete account |
| `src/app/(frontend)/dashboard/registrations/` | Registration history |
| `src/app/(frontend)/dashboard/orders/` | Order history |
| `src/app/(frontend)/dashboard/vouchers/` | Voucher list + redeem |
| `src/app/api/booking/route.ts` | Writes to `registrations`, attaches `betterAuthUserId` |
| `src/app/api/checkout/route.ts` | Multi-type: `registration`/`order`/`voucher` |
| `src/app/api/voucher/route.ts` | POST create voucher, GET redeem by code |
| `src/app/api/admin/block-user/route.ts` | Payload admin-only session revoke endpoint |

---

## Environment Variables
```env
BETTER_AUTH_SECRET=<32-char random>
BETTER_AUTH_URL=https://<domain>   # or http://localhost:3000 for dev
DATABASE_URI=postgresql://...
```

---

## Remaining Verification Checklist

### Auth flows
- [ ] Signup → customer record created in Payload immediately (verified ✓ 2026-05-15)
- [ ] Login with wrong password → error message shown, no crash
- [ ] Login correct → navbar shows profile dropdown
- [ ] `/dashboard` unauthenticated → redirected to `/login?redirect=/dashboard`
- [ ] Forgot password → email received → reset link → new password works
- [ ] Logout → session cleared, navbar reverts to Login

### Registration flow
- [ ] Book a trip as guest (no auth) → `registrations` record created, `betterAuthUserId` null
- [ ] Book a trip while authenticated → `registrations` record has `betterAuthUserId`
- [ ] Stripe checkout completes → registration `status` = paid, `stripeSessionId` populated, `paidAt` set
- [ ] `/dashboard/registrations` shows the booking

### Gift voucher flow
- [ ] Buy voucher (authenticated) → `gift_vouchers` record created with unique code, status = active
- [ ] Redeem voucher as different authenticated user → status = redeemed, `redeemedByCustomerId` set
- [ ] Attempt to redeem already-redeemed voucher → error returned, not double-redeemed

### Admin flows
- [ ] Payload `/admin` — Customers tab visible; customer record created on signup
- [ ] Block customer → all their Better Auth sessions revoked → their next frontend request → `/login`
- [ ] Payload admin auth (`/admin` login) unaffected by Better Auth changes

### TypeScript / build
- [ ] `bun run build` passes with zero TypeScript errors
- [ ] No unintentional `any` types

### Performance
- [ ] Lighthouse `/login` performance ≥ 95
- [ ] Lighthouse `/dashboard`, `/signup` performance ≥ 95

### Security
- [ ] `betterAuthUserId` fields are `readOnly` in Payload admin
- [ ] `/api/admin/block-user` returns 401 if caller is not a Payload admin
- [ ] Voucher redeem endpoint returns 400 for expired/cancelled/redeemed codes
