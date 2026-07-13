 Here is Claude's plan:                                                                                                                                 ↑
╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌
yment Plan System — Duration-Based Installments, Grace Period, Waitlist                                                                              ↑

 Context                                                                                                                                                ↑

 The client (Sons of Mountains) needs a formal payment policy encoded into the booking system:                                                          ↑

 - 1-day trips: 100% upfront.                                                                                                                           ↑
 - 2–3 day trips: 30% deposit + balance due 30 days before departure (or pay in full). If booked within 30 days of departure, full payment is required immediately.                                                                                                                                           ↑
 - Expeditions / multi-day programs: 3 installments — €100 (or ~10% for pricier trips) deposit at booking, balance up to 50% due within 1 month of booking  60 days before departure (whichever first), remaining 50% due 45 days before departure. Option to pay in full always available.                     ↑
Late payment policy: on missed installment, email the customer, grant a 5-day grace period, then auto-cancel and free the spot (with manual override ailable to admins) — reminders/cutoffs must be configurable per destination/trip/program, not hardcoded.                                             ↑
Capacity overflow needs a proper interest list (already partially exists as Waitlist) capturing full reservation intent so admins can follow up nually.                                                                                                                                              ↑

 Why now: The current codebase already has ~70% of the plumbing — deposit payment mode, a daily cron that auto-charges saved cards, 7d/1d reminder email↑, Stripe off-session charging, and a Waitlist collection. This plan extends existing patterns rather than building new infrastructure: add a 3rd payment mode (installments) mirroring how deposit already works, generalize the reminder/grace-period cron to be configurable and to check for overdue installments (not just one deposit), and add fields to Waitlist to fully capture reservation intent.
                                                                                                                                                        ↑
 Three separate, independent, sluggable collections, confirmed: Destinations, Trips, and Programs are three distinct Payload collections with three distinct frontend routes (destinations/[slug], trips/[slug], programs/[slug]). They are NOT nested or hierarchical — a Destination is not a parent/grouping of Trips. Each is its own independently bookable product line with its own inventory. ("Individual programs" is a navSection filter within the Programs collection, not a 4th collection.) All three need the new payment-plan config added independently, to their own collection file.   ↑

 Destinations — confirmed directly against the live production DB (ssh sons, sonsofmountains Postgres, table destinations):                             ↑
 Real, individually priced, individually dated bookable trips today. Live rows: Джангал (€50, 1 day), Кончето (€55, 1 day), Вихрен (€60, 1-2 days), Мальовица (€60, 2 days), Мраморният рид (€100, 2 days), Траверсът Добрила-Ботев (€120, 3 days) — every row has price, start_date/end_date, duration_day↑, spots_total/spots_available populated. deposit_amount is currently empty/unset on every row.
                                                                                                                                                        ↑
 Trips — confirmed directly against the live production DB (table trips, separate table, separate collection):
 Митикас €200 (2 days), Кораб €250 (3 days), Арарат €800 (7 days), Килиманджаро €3000 (8 days, draft). Same columns exist (price, deposit_amount, spots_total, spots_available, stripe_product_id, stripe_price_id, start_date, end_date, duration_days, status), same gap — deposit_amount unset on all rows.                                                                                                                                                  ↑

 Both collections independently need the same fix: each is schema-ready (has price/deposit_amount/dates/spots columns) but Destinations specifically is not yet wired into checkout/route.ts, stripe-webhooks.ts, or stripe-product-sync.ts (confirmed via grep — zero matches, even though its DB columns exist). Trips IS already wired into all three. This plan (a) adds the payment-plan config fields to Destinations, Trips, and Programs independently, an↑ (b) additionally wires Destinations into the booking pipeline so it reaches parity with Trips. Applying the actual policy: Джангал/Кончето/Вихрен (1 day) → full payment; Мальовица/Мраморният рид/Митикас (2 days) → 30% deposit; Траверсът/Кораб (3 days) → 30% deposit; Арарат/Килиманджаро (7-8 days) → 3-tie↑ installments.
                                                                                                                                                        ↑
 Key existing pieces being reused/extended
                                                                                                                                                        ↑
 - src/payload/collections/Orders.ts / Registrations.ts — already have paymentMode (full/deposit/installments), depositPaid, remainingBalance, remainingDueDate, balancePaymentIntentId, balanceChargeStatus, reminderSent7d/1d. Installments mode exists as an enum value but has no real field suppo↑t (installmentPlanId is a stray text field, unused elsewhere).
 - src/lib/cron/balance-charge.ts — daily cron charging saved card off-session when remainingDueDate passes. Only handles a single deposit→balance transition.
 - src/lib/cron/balance-reminders.ts — sends 7d/1d email reminders via Resend, generates a Stripe Payment Link for the amount due.                      ↑
 - src/app/api/cron/stripe/route.ts — Bearer-secured cron entrypoint calling both functions above; triggered by external cron daily.
 - src/app/api/checkout/route.ts — builds Stripe Checkout Session; sets setup_future_usage: 'off_session' when a Stripe customer exists, enabling later off-session charges. Writes paymentMode into session metadata.
 - src/lib/stripe-webhooks.ts handleCheckoutCompleted() (line 95+) — on deposit mode, stores balancePaymentIntentId: scheduled:<paymentMethodId> and balanceChargeStatus: pending (line 272-285) so the cron knows what to charge later.
 - src/payload/collections/Trips.ts / Programs.ts / Destinations.ts — all three already have price, depositAmount, durationDays (or month), spotsTotal/spotsAvailable, but no payment-plan-type field yet. Destinations additionally lacks any wiring into checkout/orders/webhooks — it's schema-only today.                                                                                                                                     ↑
 - src/payload/collections/Waitlist.ts — already tracks email/name/itemType/trip/program/destination/position/status; missing participant count and message/notes the user wants captured.                                                                                                                 ↑
 - src/lib/resend.ts, src/emails/ — Resend email sending pattern already established.
                                                                                                                                                        ↑
 Plan
                                                                                                                                                        ↑
 1. Payment plan schema on Destinations/Trips/Programs (admin-configurable)
                                                                                                                                                        ↑
 Add a shared set of fields (identical shape) to Destinations.ts, Trips.ts, and Programs.ts — all three are bookable slugs and must carry the same config:
                                                                                                                                                        ↑
 - paymentPlanType: select — auto (default, derived from durationDays) | full | deposit | installments3.
   - Auto rule: durationDays <= 1 → full; 2-3 → deposit; >=4 → installments3.                                                                           ↑
 - depositPercent: number (default 30) — used when plan resolves to deposit.
 - lateBookingThresholdDays: number (default 30) — if booking happens within this many days of startDate, force full payment regardless of plan type.   ↑
 - Installments3-specific group installmentPlan:
   - depositAmount (flat, default 100) or depositPercent (used if trip price is high) — reuse existing depositAmount field for this.                    ↑
   - secondPaymentPercent (default 50, i.e. up to 50% due)
   - secondPaymentDeadlineDays (default 30, "days after booking")                                                                                       ↑
   - secondPaymentDeadlineBeforeTripDays (default 60, "or before trip start, whichever first")
   - finalPaymentBeforeTripDays (default 45)                                                                                                            ↑
 - graceperiodDays: number (default 5) — used by the auto-cancel job.
 - reminderScheduleDays: array of numbers (default [7, 0], meaning 7 days before due + on due date) — replaces the hardcoded 7/1 day check; drives howev↑r many installments a plan has.
                                                                                                                                                        ↑
 These fields are added identically to Destinations, Trips, and Programs. Destinations already has depositAmount, earlyBirdPrice/earlyBirdUntil/earlyBirdSpots, spotsTotal/spotsAvailable, maxParticipantsPerRegistration — the new fields are purely additive (paymentPlanType, lateBookingThresholdDays, installmentPlan group, graceperiodDays, reminderScheduleDays), no conflicts with existing schema.
                                                                                                                                                        ↑
 Every number in this section is a per-record Payload field, editable in the admin UI, with a sane default — nothing is hardcoded in application code. This directly satisfies the requirement that admins can tune the late-booking threshold, deposit %, installment splits, grace period length, and remind↑r cadence independently for every single destination/trip/program. All downstream logic (sections 2, 7, 8) reads these fields from the record rather than using constants — confirmed below in each section.                                                                                                     ↑

 2. Installment schedule computed at checkout time                                                                                                      ↑

 New helper src/lib/pricing/payment-plan.ts:                                                                                                            ↑
 - resolvePaymentPlan(tripOrProgram, bookingDate) → returns { mode: 'full'|'deposit'|'installments3', installments: [{ label, amount, dueDate }] }, applying the late-booking override.                                                                                                                    ↑
 - Pure function, no side effects — used both by the checkout API (to build Stripe line items / metadata) and by any UI that needs to preview the schedule before payment.                                                                                                                                        ↑

 3. Extend Orders/Registrations to store a generic installment schedule                                                                                 ↑

 Add one new field to both collections (mirroring the existing items array pattern):                                                                    ↑
 - installments: array — { label (deposit/second/final), amount, dueDate, status (pending/charged/failed), paymentIntentId, chargeAttemptedAt }.
                                                                                                                                                        ↑
 Keep paymentMode, depositPaid, remainingBalance, remainingDueDate for backward compatibility with the existing 2-tier deposit flow (unchanged behavior). The new installments array is only populated when paymentMode === 'installments', and reminder tracking becomes per-row (reminderSent timestamps inside↑each installment row) instead of the two boolean flags, so this generalizes past a fixed 7d/1d schedule.
                                                                                                                                                        ↑
 4. Wire Destinations into the booking/payment pipeline (new — currently missing entirely)
                                                                                                                                                        ↑
 Destinations has full pricing/capacity fields but is never touched by checkout/route.ts, stripe-webhooks.ts, or stripe-product-sync.ts (confirmed via grep — zero matches). To make a Destination directly bookable:                                                                                         ↑

 - src/lib/stripe-product-sync.ts: call syncStripeProduct() from Destinations.ts's afterChange hook, same pattern already used in Trips.ts/Programs.ts (lines 522-528 / 515-521) — Destinations needs its own stripeProductId/stripePriceId fields added (mirroring Trips/Programs).
 - src/payload/collections/Orders.ts items[].itemType: add 'destination' as a valid option alongside trip | product | program | gift-voucher | bundle, plus a destination relationship field on each item row (same pattern as item.trip/item.program).
 - src/app/api/checkout/route.ts: add destination to the collectionMap used for price validation (line ~109-113) and Stripe Price ID lookup (line ~142-146), so Destination line items validate and build correctly.
 - src/lib/stripe-webhooks.ts handleCheckoutCompleted(): add a destination branch alongside the existing trip/product/program/bundle branches (line 150-188) to decrement spotsAvailable and flip bookingStatus to soldOut/active, mirroring the Trip logic exactly (lines 151-159).
 - src/payload/collections/Waitlist.ts already supports itemType: 'destination' — no change needed there; notifyWaitlist() in stripe-webhooks.ts already↑handles the generic itemType param.
                                                                                                                                                        ↑
 After this, a Destination behaves identically to a Trip/Program for booking, pricing validation, Stripe sync, spot tracking, and — via section 1 — payment-plan resolution.                                                                                                                               ↑

 5. Checkout flow changes                                                                                                                               ↑

 In src/app/api/checkout/route.ts:                                                                                                                      ↑
 - When creating a registration/order for a trip/program, call resolvePaymentPlan() to determine paymentMode and build the installments array up front (all rows status: pending, amounts/dates computed).                                                                                                    ↑
 - Charge only the first installment (deposit) via Stripe Checkout, same setup_future_usage: 'off_session' pattern already used (line 259-260) so future installments can be charged automatically.                                                                                                             ↑
 - Store the resolved installments array on the order/registration at creation (pending doc, same as today's pending order pattern at line 168-200).
                                                                                                                                                        ↑
 6. Webhook: mark first installment paid + schedule the rest
                                                                                                                                                        ↑
 In handleCheckoutCompleted() (src/lib/stripe-webhooks.ts), extend the existing deposit branch (line 272-285) to a generic installments branch:
 - Mark installments[0].status = 'charged', store its paymentIntentId.                                                                                  ↑
 - Store the saved payment method the same way (scheduled:<pmId> pattern already used) for the cron to pick up for all remaining installment rows, not just one balance.                                                                                                                                      ↑

 7. Generalize the cron jobs                                                                                                                            ↑

 Replace the single-balance logic in balance-charge.ts and balance-reminders.ts with logic that iterates installments arrays:                           ↑

 - balance-charge.ts: for each order/registration with paymentMode in (deposit,installments), scan installments rows where status === 'pending' and dueDate <= now; charge off-session using the stored payment method, mark charged or failed per row, and if failed, stamp firstFailedAt on that row (this is the trigger for step 7).                                                                                                                            ↑
 - balance-reminders.ts: for each pending row, use the trip/program's reminderScheduleDays (from step 1) instead of hardcoded 7/1, compute days-until-due per row, and send a reminder email once per configured offset (tracked via a remindersSent: number[] field on the installment row instead of two booleans).
                                                                                                                                                        ↑
 Keep the same Resend email + one-off Stripe Payment Link generation pattern already in balance-reminders.ts (lines 39-52).
                                                                                                                                                        ↑
 8. Grace period + auto-cancel job
                                                                                                                                                        ↑
 New function in src/lib/cron/grace-period.ts, wired into the same /api/cron/stripe route:
 - For installment rows with status === 'failed' and firstFailedAt set: send a "payment overdue" email immediately (once, tracked via overdueNoticeSent)↑ then check now - firstFailedAt >= gracePeriodDays (from the trip/program's graceperiodDays config).
 - If grace period expired: auto-cancel — set order/registration status = 'cancelled', free the spot (increment spotsAvailable, mirroring the decrement logic in handleCheckoutCompleted lines 150-157), and call the existing notifyWaitlist() (already in stripe-webhooks.ts line 36) to notify the next people in line.                                                                                                                                               ↑
 - Manual override: add an admin-only action — either a Payload custom button (following the VisualEditorButton.tsx admin-component pattern) on the Orders/Registrations detail view, or simpler: an admin-editable field manualCancelRequested: checkbox that a beforeChange hook checks to trigger the sa↑e cancel-and-free-spot logic immediately, bypassing the grace period wait. Recommend the checkbox approach — far less code, consistent with how admins already flip status manually today.                                                                                                                    ↑

 9. Waitlist enrichment (capacity overflow / interest list)                                                                                             ↑

 Extend src/payload/collections/Waitlist.ts with the reservation-intent fields the client asked for, so admins have full context to follow up manually: ↑
 - phone: text
 - participantCount: number (default 1)                                                                                                                 ↑
 - preferredDates or message: textarea (notes on flexibility, what they were trying to book)
 - source: select (sold-out | manual-inquiry) — distinguishes "tried to book, no capacity" entries (auto-created) from any future manual entries.       ↑

 Auto-creation happens through a dedicated waitlist form modal (below), not silently inside checkout.                                                   ↑

 10. Sold-out UI: button swaps to "Waitlist", opens an explanatory form modal                                                                           ↑

 Bug found, fix included: two conflicting waitlist endpoints exist today — /api/waitlist/join/route.ts (correct, writes to the Waitlist collection admin↑ see) and /api/waitlist/route.ts (legacy, writes to a subscribers collection with a segment tag, never reaches admin's Waitlist view). CalendarTripCard.tsx (line 238) currently calls the wrong legacy one. Fix: delete /api/waitlist/route.ts (or repoint it), and make /api/waitlist/join t↑e single source of truth everywhere.
                                                                                                                                                        ↑
 New shared component src/components/forms/WaitlistFormModal.tsx, built like BookingFormModal.tsx (react-hook-form + zod + motion for the open/close transition, matching Tailwind conventions — bg-white/5 border border-white/10 rounded px-3 py-2.5 text-sm):                                            ↑
 - Opens as a centered modal (backdrop + motion.div, same pattern as LoginModal in CalendarTripCard.tsx), not an inline expand — needs to hold an explanation, not just an email box.                                                                                                                    ↑
 - Explanation copy at the top of the modal: plainly states the item is sold out, what joining the waitlist means (admin will contact them if a spot opens, via the existing notifyWaitlist() email flow), and that it's not a booking/payment.                                                             ↑
 - Form fields: name, email, phone, participantCount, optional message/preferred-dates textarea — submits to /api/waitlist/join with itemType/itemId for whichever of destination/trip/program it was opened from, source: 'sold-out'.                                                                          ↑
 - On success: show a confirmation state (position in queue, from the existing position field already returned by /api/waitlist/join) instead of closing immediately.                                                                                                                                           ↑

 Button swap in each of the three CTA components (each currently handles sold-out differently, and only one shows any sold-out state at all):           ↑
 - BookingCtaSection.tsx (line 131-147): today just disables the arrow icon with no label/action when isFull. Replace the disabled state with a "Waitlist" button that opens WaitlistFormModal.                                                                                                                   ↑
 - AdventureCtaSection.tsx (line 115, "Резервирай сега"): currently has no isFull/sold-out branch at all — add one, swap label to "Присъедини се към списъка с чакащи" ("Join waitlist") when spotsAvailable === 0, opening the same modal.                                                                 ↑
 - FloatingBookingBar.tsx (line 147-152, "Запиши се"): same — add sold-out branch, swap label + open modal.
 - All three pass itemType/itemId (trip/program/destination + its id) as props into WaitlistFormModal so one component serves all three page types.     ↑

 11. Waitlist enrichment (capacity overflow / interest list)                                                                                            ↑

 Extend src/payload/collections/Waitlist.ts with the reservation-intent fields the client asked for, so admins have full context to follow up manually: ↑
 - phone: text
 - participantCount: number (default 1)                                                                                                                 ↑
message: textarea (notes on flexibility, what they were trying to book — captured by the new modal's optional field)                                 ↑
source: select (sold-out | manual-inquiry) — distinguishes "tried to book, no capacity" entries (from the new modal) from any future manual entries.

les touched (summary)

src/payload/collections/Destinations.ts, Trips.ts, Programs.ts — add payment-plan config fields; Destinations additionally needs ripeProductId/stripePriceId fields
src/payload/collections/Orders.ts — add 'destination' to items[].itemType + destination relationship field; add installments array field
src/payload/collections/Registrations.ts — add installments array field
src/payload/collections/Waitlist.ts — add phone/participantCount/message/source fields
src/lib/pricing/payment-plan.ts — new, pure schedule resolver (works for destination/trip/program alike)
src/lib/stripe-product-sync.ts / Destinations.ts afterChange hook — wire Destinations into Stripe product sync (currently absent)
src/app/api/checkout/route.ts — add destination to collectionMap for price/Stripe-price lookups; build installment schedule at booking time
src/lib/stripe-webhooks.ts — add destination branch to spot-decrement logic; generalize deposit-scheduling branch to installments
src/lib/cron/balance-charge.ts — iterate installment rows instead of single balance
src/lib/cron/balance-reminders.ts — configurable reminder offsets, per-row tracking
src/lib/cron/grace-period.ts — new, overdue notice + auto-cancel + waitlist notify
src/app/api/cron/stripe/route.ts — call the new grace-period function
src/components/forms/WaitlistFormModal.tsx — new, shared explanatory modal + form
src/components/ui/destination-page/BookingCtaSection.tsx, AdventureCtaSection.tsx, FloatingBookingBar.tsx — swap to "Waitlist" button + open modal when ld out
src/components/ui/CalendarTripCard.tsx — repoint from legacy /api/waitlist to /api/waitlist/join
src/app/api/waitlist/route.ts — remove or repoint (legacy, writes to wrong collection)

 Verification

 1. bun run build (or project's typecheck script) to confirm Payload field/type changes compile.
 2. Manually create a test Trip with durationDays = 5 (or set paymentPlanType = installments3 explicitly), book it through the checkout flow in a browser using a Stripe test card, and confirm the installments array on the resulting Registration/Order in Payload admin shows 3 correctly-dated/amounted rows with the first marked charged.
 3. Repeat step 2 for a Destination directly (not via a child Trip/Program) — confirm a Destination line item creates an Order, syncs to Stripe, decrements spotsAvailable, and resolves a payment plan identically to a Trip.
 4. Temporarily fake dueDate to today on a test record, hit /api/cron/stripe locally with the CRON_SECRET bearer token, and confirm the off-session charge fires (or fails gracefully) and status updates.
 5. Force a failed charge (test card 4000000000000341), confirm the overdue email sends, then fast-forward firstFailedAt past the grace period and re-run the cron to confirm auto-cancel + spot release + waitlist notification fires.
 6. Fill a sold-out destination/trip's capacity to 0, submit the booking form, confirm a Waitlist entry is created with phone/participantCount/message populated, visible in Payload admin.
 7. In a browser, visit a sold-out Destination, Trip, and Program detail page each — confirm the CTA button reads "Waitlist" (not the normal booking label) on all three, opens WaitlistFormModal with the explanation text visible, and submitting it creates a Waitlist row (not a subscribers row) with position returned in the confirmation state. Confirm CalendarTripCard.tsx's inline waitlist form also now hits /api/waitlist/join and produces the same╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌