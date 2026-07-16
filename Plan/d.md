Current Plan
     /Users/stanchito/.claude/plans/based-on-this-https-payloadcms-com-docs-refactored-sunrise.md

     Replace better-auth with Payload CMS native auth (Customers collection)

     Context

     Customer authentication currently runs on better-auth (separate pg pool, separate session cookie, databaseHooks syncing into Payload's customers collection via a denormalized betterAuthId/betterAuthUserId text field on 8 collections). Payload's admin (Users collection, slug users) already uses Payload's native auth: true. The goal: make Customers itself a Payload auth: true collection, delete better-auth entirely, and repoint every consumer (30+ API routes, 6 server pages, ~10 client components, 8 collections, middleware) at Payload sessions. Two independent auth pools remain (users for admin/photographers, customers for buyers) — never merged.

     Payload session shape once customers has auth: true: req.user (server) / the authenticated doc (client) has .id = the customers doc ID directly, .collection === 'customers'. This replaces betterAuthId/betterAuthUserId lookups with direct customer: { equals: user.id } — no separate lookup step needed. Admin checks (req.user.collection === 'users') already used in CustomerMedia/CustomerRatings access control are unaffected and remain correct.

     Approach

     1. Customers collection — enable native auth

     src/payload/collections/Customers.ts:
     - Add auth: { tokenExpiration: 7200, verify: false, cookies: { secure: false, sameSite: 'Lax' } } (mirror Users.ts cookie settings; keep verify: false to match current requireEmailVerification: false — no forced email verification since none of the flows currently gate on it).
     - Remove betterAuthId field entirely (Payload's own id is now the auth key).
     - Remove custom emailVerified field — Payload's auth injects its own _verified when verify: true; since we're keeping verify off, drop the manual field (or keep as a plain non-auth boolean if used in admin UI — check with a grep before deleting; if unused elsewhere, delete).
     - Replace afterChange hook: auth.api.revokeSessions → nothing needed for a hard block (Payload has no direct "revoke all sessions" API for JWT-based auth by default; simplest equivalent is unusable-until-status-active enforced via beforeLogin hook or an access.read-style login gate). Add a beforeLogin hook on Customers that throws if doc.status !== 'active' — this blocks new logins immediately; existing JWTs still expire naturally within tokenExpiration (2h), which is an acceptable tradeoff given the short expiry already in use.

     2. Delete better-auth core files, add Payload-backed replacements

     - Delete src/lib/auth.ts, src/lib/auth-client.ts, src/app/api/auth/[...all]/route.ts.
     - New src/lib/auth-client.ts (client-side, 'use client'): thin wrappers around Payload's REST auth endpoints, all verified against node_modules/payload/dist/auth/endpoints/index.js (real registered paths, not guessed): POST /api/customers/login, POST /api/customers/logout, POST /api/customers for signup (plain collection create — confirmed in collections/operations/create.js that password is auto-hashed via registerLocalStrategy whenever collection.config.auth is set, no special signup endpoint needed), POST /api/customers/forgot-password, POST /api/customers/reset-password, GET /api/customers/me for session read (also confirmed: response includes { user, token, exp }; strip token client-side or rely on removeTokenFromResponses — leave default since login already sets the cookie), POST /api/customers/refresh-token for silent refresh if needed. Build useSession as fetch-on-mount over /me with local state, matching current { data: { user }, isPending } shape (the isPending field is required — shop/checkout/page.tsx destructures isPending: sessionLoading).
     - New server-side helper src/lib/get-customer-session.ts: getPayload({config}).auth({ headers }) returning { user } scoped to check user.collection === 'customers', used by every route/page that replaces auth.api.getSession.

     3. Middleware — verified against Payload 3.84.1 source (node_modules/payload/dist/auth/cookies.js, extractJWT.js, config/defaults.js)

     Confirmed facts, not assumptions:
     - Cookie name is ${payload.config.cookiePrefix}-token, and cookiePrefix is a single global config value (payload.config.ts top-level cookiePrefix, default 'payload') — NOT per-collection. There is no auth.cookies.name override field on collection config (only domain/sameSite/secure).
     - Critical consequence: the users (admin) collection and the new customers (auth) collection share the exact same cookie name (payload-token by default) once both have auth: true. Logging in as a customer in a browser tab that also has an active admin session (or vice versa) overwrites the single cookie, silently logging the other identity out. The JWT itself does encode collection: <slug> (verified in getFieldsToSign.js) so payload.auth() correctly resolves which collection a given token belongs to — but only one token can be stored in the browser at a time under the shared name.
     - Mitigation (required, not optional): set an explicit cookiePrefix override or scope customers under a distinct cookie by setting payload.config.ts top-level cookiePrefix unchanged (keep payload for admin) is not sufficient since it's global — the actual fix is to accept this as expected Payload behavior (this is the documented, standard multi-collection-auth limitation in Payload) OR isolate the two logins by domain/subdomain if simultaneous admin+customer sessions in one browser must never conflict. Given this app's admins and customers are different humans on different devices in practice, plan to accept the shared-cookie behavior (matches Payload's own documented multi-auth-collection model — this is not a bug, just a real constraint) and note it explicitly to the user rather than engineering a workaround that fights the framework.
     - Update middleware.ts: replace the better-auth.session_token / __Secure-better-auth.session_token cookie checks with req.cookies.has('payload-token') (read the actual cookiePrefix value from payload.config.ts if it has been customized — grep it before hardcoding). Keep the same protected-route matcher (/dashboard/:path*, /account/:path*). Middleware still cannot decode the JWT to confirm it belongs to customers vs users without running in Node runtime (Payload's JWT verify needs payload.config) — so, matching the current better-auth middleware's own limitation (it only checked cookie presence, not validity/collection), keep this middleware as a presence-only fast-path guard; real authorization still happens in each page/route via payload.auth().

     4. API routes — mechanical pattern replacement

     Pattern before:
     const session = await auth.api.getSession({ headers: await headers() })
     if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
     const betterAuthUserId = session.user.id
     const existing = await payload.find({ collection: 'customers', where: { betterAuthId: { equals: betterAuthUserId } }, limit: 1 })
     const customerDocId = existing.docs[0]?.id
     Pattern after:
     const { user } = await payload.auth({ headers: req.headers })
     if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
     const customerDocId = user.id
     Confirmed complete file list (verified via exhaustive repo-wide grep, not just the earlier agent sample):
     src/app/api/waitlist/join/route.ts, src/app/api/booking/route.ts, src/app/api/referral/generate/route.ts, src/app/api/ratings/submit/route.ts, src/app/api/checkout/route.ts (guest-optional: if (user) customerDocId = user.id else proceed as guest), src/app/api/dashboard/gallery-upload/route.ts, src/app/api/dashboard/gallery-collections/route.ts, src/app/api/voucher/route.ts, src/app/api/voucher/mine/route.ts, src/app/api/wishlist/route.ts, src/app/api/wishlist/toggle/route.ts, src/app/api/customer-media/route.ts, src/app/api/customer-ratings/route.ts, src/app/api/cart/abandoned/route.ts (client-supplied betterAuthUserId in POST body → rename param to customerId, caller-side too — see step 7 fetch call sites), src/app/api/stripe/reconciliation/route.ts, src/app/api/stripe/payment-links/route.ts, src/app/api/stripe/group-payment-links/route.ts, src/app/api/stripe/payment-intent/route.ts, src/app/api/stripe/payment-methods/route.ts, src/app/api/stripe/payment-methods/set-default/route.ts, src/app/api/stripe/subscriptions/pause/route.ts, src/app/api/stripe/spend-history/route.ts, src/app/api/stripe/refund/route.ts, src/app/api/stripe/billing-portal/route.ts.
     Special case admin/block-user/route.ts: drop the auth.api.revokeSessions call (superseded by the beforeLogin status gate in step 1); keep the admin-check (payload.auth against users) as-is.
     Special case photographer-profile/route.ts: this authenticates via better-auth session email against the admin users collection (photographer dashboard, not customer auth) — swap auth.api.getSession for payload.auth({headers}) checked against users collection (user.collection === 'users'), not customers. Keep everything else identical.

     5. Collections with denormalized betterAuthUserId/betterAuthId

     Registrations, Orders, GiftVouchers, Subscriptions, Favorites, AbandonedCarts, Waitlist: rename field betterAuthUserId → drop it. These already carry a customer relationship field alongside it — switch all queries from where: { betterAuthUserId: { equals: X } } to where: { customer: { equals: customerDocId } }, consistent with how CustomerMedia/CustomerRatings already query. Guest support (nullable field) is preserved automatically since customer relationship is already optional in these collections.

     6. Server-side pages — full confirmed list (13 files, not 6)

     src/app/(frontend)/dashboard/layout.tsx, dashboard/page.tsx, dashboard/ratings/page.tsx, dashboard/media/page.tsx, dashboard/vouchers/page.tsx, dashboard/orders/page.tsx, dashboard/profile/page.tsx, dashboard/registrations/page.tsx, dashboard/wishlist/page.tsx, shop/orders/page.tsx, shop/orders/[id]/page.tsx, vouchers/page.tsx, account/loyalty/page.tsx, account/wishlist/page.tsx: replace auth.api.getSession({headers: await headers()}) with payload.auth({headers: await headers()}); replace session.user.id/.name/.email with user.id/.name/.email; replace customers lookup-by-betterAuthId with using user.id directly as customerId; replace all downstream betterAuthUserId/betterAuthId query filters (present in vouchers/page.tsx, dashboard/vouchers, dashboard/orders, dashboard/registrations, account/wishlist) with customer: { equals: user.id }.

     7. Client components — full confirmed list (12 files)

     src/components/auth/AuthModal.tsx, src/app/(frontend)/login/LoginClient.tsx, src/app/(frontend)/signup/SignupClient.tsx, src/app/(frontend)/forgot-password/ForgotClient.tsx, src/app/(frontend)/reset-password/ResetClient.tsx, src/app/(frontend)/dashboard/profile/ProfileClient.tsx, src/components/ui/NavbarClient.tsx, src/app/(frontend)/dashboard/DashboardNav.tsx, src/app/(frontend)/vouchers/VouchersPageClient.tsx (uses useSession at line 137), src/app/(frontend)/shop/checkout/page.tsx (client component using useSession + isPending at lines 13/65 — note: also destructures isPending: sessionLoading, so the new useSession hook must expose an isPending loading flag, not just data): swap imports from @/lib/auth-client (better-auth) to the new Payload-backed @/lib/auth-client. Keep exported function names (useSession, signIn, signOut, signUp, resetPassword, forgotPassword) identical so call sites (signIn.email({...}), result.error.message, result.data.user) need minimal changes — implement the new client wrappers to match this exact call signature/response shape.
     ProfileClient.tsx: drop the fetch('/api/auth/update-user', ...) call (better-auth-specific name update) — fold name update into the existing /api/photographer-profile PATCH, or add name update directly via a new lightweight /api/customers/me PATCH route if the user being edited is a customer, not a photographer (confirm which — ProfileClient currently touches both better-auth name AND /api/photographer-profile; likely this page serves photographers who are users, not customers — verify before editing to avoid conflating the two auth pools).

     8. Cleanup

     - package.json: remove "better-auth" dependency; remove pg only if unused elsewhere (check — Payload's own db adapter may need it).
     - src/payload/payload.config.ts: remove drizzle tablesFilter: ['!user', '!session', '!account', '!verification'] (line 250) — those better-auth tables are no longer excluded/needed; after confirming no data must be preserved, these tables can be dropped from Postgres directly (ask user before running any DROP TABLE, per DB safety rule in CLAUDE.local.md).
     - .env.example/.env.local.example: remove BETTER_AUTH_SECRET, BETTER_AUTH_URL. Keep DATABASE_URI, RESEND_*, NEXT_PUBLIC_SERVER_URL. (Confirmed: current .env.example has no BETTER_AUTH_* lines already — only Dockerfile line 23 bakes ENV BETTER_AUTH_SECRET=build-secret as a build arg; remove that line.)
     - Run bun scripts/graph.ts --json after edits to confirm no dangling imports of deleted src/lib/auth.ts.
     - tests/e2e/spend-history.spec.ts references better-auth (likely seeds a session cookie/login helper) — update its login helper to Payload's customer login flow.
     - Plan/better-auth-customer-system.md and Plan/calendar-programs-wishlist-plan.md are stale planning docs referencing better-auth — leave as historical record unless user asks to update them (not code, no runtime effect).
     - Final re-verification command run before considering migration complete: grep -rln "better-auth\|betterAuthId\|betterAuthUserId\|BETTER_AUTH\|authClient\|@/lib/auth" . --include="*.ts" --include="*.tsx" --include="*.json" --exclude-dir=node_modules --exclude-dir=.next --exclude-dir=.git — must return zero source files (Plan/*.md docs are the only acceptable remaining hits).

     Verification

     1. grep -rn "better-auth\|betterAuthId\|betterAuthUserId\|from '@/lib/auth'" src middleware.ts package.json returns nothing.
     2. bun run build (or project's typecheck script) — catches any missed import/shape mismatch.
     3. Manual flow via /run skill or dev server: signup → login → dashboard loads with orders/registrations/vouchers → logout → protected /dashboard redirects to /login → forgot-password → reset-password → login again.
     4. Verify /admin login (Users collection) still works unaffected.
     5. Verify guest checkout (no session) still creates an Order with customer: null.