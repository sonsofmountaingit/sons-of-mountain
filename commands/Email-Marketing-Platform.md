ail Marketing & Transactional Email System — Full Specification                                                                                      ↑

yload Admin Sidebar — Email Marketing Group                                                                                                          ↑

erything lives under one group: "Email Marketing"                                                                                                    ↑

 Payload Admin Sidebar                                                                                                                                  ↑
 └── Email Marketing
     ├── Email Settings        (Global — from/brand/test mode)                                                                                          ↑
     ├── Email Templates       (Collection — Maily + richText + HTML)
     ├── Email Flows           (Collection — 41+ trigger configs)                                                                                       ↑
     ├── Campaigns             (Collection — marketing blasts)
     ├── Segments              (Collection — audience filter rules)                                                                                     ↑
     ├── Subscribers           (Collection — opt-in list)
     └── Email Logs            (Collection — full send history)                                                                                         ↑

 Collections moved to admin.group: 'Email Marketing':                                                                                                   ↑
 - EmailTemplates — currently has no group (add it)
 - Campaigns — currently has no group (add it)                                                                                                          ↑
 - Segments — currently has no group (add it)
 - Subscribers — currently has no group (add it)                                                                                                        ↑
 - EmailFlows — new, set group on creation
 - EmailLogs — new, set group on creation                                                                                                               ↑

 Global added to admin.group: 'Email Marketing':                                                                                                        ↑
 - EmailSettings — new
                                                                                                                                                        ↑
 This means a non-technical admin can navigate to "Email Marketing" and find every email-related tool in one place — no hunting across the sidebar.
                                                                                                                                                        ↑
 ---
 Core Principles                                                                                                                                        ↑

 1. Everything configurable from Payload admin — no hardcoded subjects, copy, delays, or on/off switches in code                                        ↑
 2. Drag-and-drop email builder using Maily (@maily-to/core + @maily-to/render) embedded as a custom Payload field component
 3. 36 transactional triggers all controlled by EmailFlows collection — one doc per trigger, every option editable                                      ↑
 4. Full marketing campaign management in Payload — 23-filter segment engine, scheduling, test sends, audience type, multi-segment union
 5. EmailLogs collection — every email sent is logged with full context snapshot, status tracked via Resend webhooks                                    ↑
 6. EmailSettings global — site-wide from/brand/test-mode, one place to control everything
 7. Plunk rejected — requires AWS SES, not compatible with Resend or Namecheap SMTP                                                                     ↑

 ---                                                                                                                                                    ↑
 Packages to Install
                                                                                                                                                        ↑
 bun add @maily-to/core@0.3.7 @maily-to/render@0.2.3
                                                                                                                                                        ↑
 No other new external packages.
                                                                                                                                                        ↑
 ---
 Maily Editor — Built-in Blocks (Complete)                                                                                                              ↑

 @maily-to/core ships these blocks out of the box. All available in the toolbar, no custom code needed:                                                 ↑

 ┌───────────────────┬──────────────────────────────────────────────────────────────────────────────────────────┐                                       ↑
 │       Block       │                                       What it does                                       │
 ├───────────────────┼──────────────────────────────────────────────────────────────────────────────────────────┤                                       ↑
 │ Logo              │ Centered/left/right logo image with configurable size                                    │
 ├───────────────────┼──────────────────────────────────────────────────────────────────────────────────────────┤                                       ↑
 │ Text              │ Rich text paragraph with full formatting (bold, italic, underline, link, inline code)    │
 ├───────────────────┼──────────────────────────────────────────────────────────────────────────────────────────┤                                       ↑
 │ Heading           │ H1 / H2 / H3 headings                                                                    │
 ├───────────────────┼──────────────────────────────────────────────────────────────────────────────────────────┤                                       ↑
 │ Buttons           │ CTA button with variants: solid, outline, text-link; configurable color, size, alignment │
 ├───────────────────┼──────────────────────────────────────────────────────────────────────────────────────────┤                                       ↑
 │ Image             │ Inline image with alt text, link wrap, alignment, size                                   │
 ├───────────────────┼──────────────────────────────────────────────────────────────────────────────────────────┤                                       ↑
 │ Divider           │ Horizontal rule with color and spacing config                                            │
 ├───────────────────┼──────────────────────────────────────────────────────────────────────────────────────────┤                                       ↑
 │ Spacer            │ Empty vertical space block with configurable height                                      │
 ├───────────────────┼──────────────────────────────────────────────────────────────────────────────────────────┤                                       ↑
 │ Footer            │ Footer text block (typically for legal/unsubscribe)                                      │
 ├───────────────────┼──────────────────────────────────────────────────────────────────────────────────────────┤                                       ↑
 │ Inline Code       │ Monospace code snippet inline                                                            │
 ├───────────────────┼──────────────────────────────────────────────────────────────────────────────────────────┤                                       ↑
 │ Link Card         │ Card-style clickable block with title, description, and URL                              │
 ├───────────────────┼──────────────────────────────────────────────────────────────────────────────────────────┤                                       ↑
 │ Section           │ Container block with background color, padding, border — wraps other blocks              │
 ├───────────────────┼──────────────────────────────────────────────────────────────────────────────────────────┤                                       ↑
 │ Columns           │ 2-column layout block — each column holds nested blocks                                  │
 ├───────────────────┼──────────────────────────────────────────────────────────────────────────────────────────┤                                       ↑
 │ Repeat            │ Iterates over an array variable — renders child blocks once per item                     │
 ├───────────────────┼──────────────────────────────────────────────────────────────────────────────────────────┤                                       ↑
 │ Show If Condition │ Conditional block — renders children only if a variable matches a condition              │
 ├───────────────────┼──────────────────────────────────────────────────────────────────────────────────────────┤                                       ↑
 │ Variables         │ Insert {{variable}} tokens inline in any text block                                      │
 ├───────────────────┼──────────────────────────────────────────────────────────────────────────────────────────┤                                       ↑
 │ Alignment         │ Text/block alignment control (left / center / right)                                     │
 └───────────────────┴──────────────────────────────────────────────────────────────────────────────────────────┘                                       ↑

 Maily variables prop — all 43 tags exposed in the editor                                                                                               ↑

 The MailyEditor.tsx component passes all 43 merge tags as the variables prop so admins see them in the variable picker:                                ↑

 variables={[                                                                                                                                           ↑
   // Universal
   { name: 'firstName', label: 'First Name' },                                                                                                          ↑
   { name: 'lastName', label: 'Last Name' },
   { name: 'email', label: 'Email Address' },                                                                                                           ↑
   { name: 'siteUrl', label: 'Site URL' },
   { name: 'siteName', label: 'Site Name' },                                                                                                            ↑
   { name: 'currentYear', label: 'Current Year' },
   // Marketing                                                                                                                                         ↑
   { name: 'unsubscribe_url', label: 'Unsubscribe URL' },
   // Registration & Trip                                                                                                                               ↑
   { name: 'tripTitle', label: 'Trip Title' },
   { name: 'tripStartDate', label: 'Trip Start Date' },                                                                                                 ↑
   { name: 'tripEndDate', label: 'Trip End Date' },
   { name: 'tripLocation', label: 'Trip Location' },                                                                                                    ↑
   { name: 'participantCount', label: 'Participant Count' },
   { name: 'totalAmount', label: 'Total Amount' },                                                                                                      ↑
   { name: 'currency', label: 'Currency' },
   { name: 'depositAmount', label: 'Deposit Amount' },                                                                                                  ↑
   { name: 'remainingBalance', label: 'Remaining Balance' },
   { name: 'remainingDueDate', label: 'Remaining Due Date' },                                                                                           ↑
   { name: 'invoiceUrl', label: 'Invoice PDF URL' },
   { name: 'qrToken', label: 'QR Token' },                                                                                                              ↑
   { name: 'refundAmount', label: 'Refund Amount' },
   { name: 'stripeRefundId', label: 'Stripe Refund ID' },                                                                                               ↑
   // Orders
   { name: 'orderItems', label: 'Order Items (HTML list)' },                                                                                            ↑
   { name: 'orderTotal', label: 'Order Total' },
   { name: 'trackingNumber', label: 'Tracking Number' },                                                                                                ↑
   { name: 'shippingProvider', label: 'Shipping Provider' },
   { name: 'shippingAddress', label: 'Shipping Address' },                                                                                              ↑
   // Gift Vouchers
   { name: 'voucherCode', label: 'Voucher Code' },                                                                                                      ↑
   { name: 'voucherAmount', label: 'Voucher Amount' },
   { name: 'voucherExpiry', label: 'Voucher Expiry Date' },                                                                                             ↑
   { name: 'voucherMessage', label: 'Voucher Personal Message' },
   { name: 'recipientName', label: 'Recipient Name' },                                                                                                  ↑
   { name: 'senderName', label: 'Sender Name' },
   // Subscriptions                                                                                                                                     ↑
   { name: 'subscriptionPlan', label: 'Subscription Plan' },
   { name: 'subscriptionPeriodEnd', label: 'Subscription Period End' },                                                                                 ↑
   { name: 'discountCode', label: 'Discount Code' },
   { name: 'dunningCount', label: 'Dunning Attempt Number' },                                                                                           ↑
   { name: 'billingUpdateUrl', label: 'Billing Update URL' },
   // Loyalty                                                                                                                                           ↑
   { name: 'loyaltyTier', label: 'Loyalty Tier (bronze/silver/gold/platinum)' },
   { name: 'loyaltyPoints', label: 'Loyalty Points' },                                                                                                  ↑
   { name: 'previousTier', label: 'Previous Loyalty Tier' },
   { name: 'loyaltyTierLabel', label: 'Loyalty Tier Label (e.g. Bronze 0–499 pts)' },                                                                   ↑
   // Waitlist & Stock
   { name: 'waitlistPosition', label: 'Waitlist Position' },                                                                                            ↑
   { name: 'bookNowUrl', label: 'Book Now URL' },
   { name: 'itemTitle', label: 'Item Title (trip/product/program)' },                                                                                   ↑
   // Cart
   { name: 'cartItems', label: 'Cart Items (HTML list)' },                                                                                              ↑
   { name: 'cartTotal', label: 'Cart Total' },
   { name: 'cartUrl', label: 'Cart URL' },                                                                                                              ↑
   // Auth
   { name: 'resetUrl', label: 'Password Reset URL' },                                                                                                   ↑
   { name: 'verifyUrl', label: 'Email Verification URL' },
   // Dynamic content arrays (for Repeat block)                                                                                                         ↑
   { name: 'featuredTrips', label: 'Featured Trips (array — use with Repeat block)' },
   { name: 'featuredPrograms', label: 'Featured Programs (array — use with Repeat block)' },                                                            ↑
   { name: 'featuredDestinations', label: 'Featured Destinations (array — use with Repeat block)' },
 ]}                                                                                                                                                     ↑

 ---                                                                                                                                                    ↑
 Dynamic Content Blocks — Trips, Programs, Destinations in Emails
                                                                                                                                                        ↑
 Admins can embed live trip/program/destination cards in any email template using Maily's Repeat block combined with array merge tags.
                                                                                                                                                        ↑
 How it works
                                                                                                                                                        ↑
 In Campaigns: Add optional relationship fields to select specific items to feature:
                                                                                                                                                        ↑
 // Added to Campaigns collection:
 { name: 'featuredTrips', type: 'relationship', relationTo: 'trips', hasMany: true,                                                                     ↑
   admin: { description: 'Select trips to include as cards in this campaign. Resolves to {{featuredTrips}} array for Repeat block.' } },
                                                                                                                                                        ↑
 { name: 'featuredPrograms', type: 'relationship', relationTo: 'programs', hasMany: true },
                                                                                                                                                        ↑
 { name: 'featuredDestinations', type: 'relationship', relationTo: 'destinations', hasMany: true },
                                                                                                                                                        ↑
 In EmailFlows: Same fields — select which trips/programs/destinations to include in that flow's emails.
                                                                                                                                                        ↑
 At render time: email-renderer.ts resolves the relationships and builds array context:
                                                                                                                                                        ↑
 context.featuredTrips = JSON.stringify(campaign.featuredTrips.map(trip => ({
   title: trip.title,                                                                                                                                   ↑
   startDate: formatDate(trip.startDate),
   endDate: formatDate(trip.endDate),                                                                                                                   ↑
   location: trip.location,
   price: trip.price,                                                                                                                                   ↑
   currency: trip.currency,
   spotsAvailable: trip.spotsAvailable,                                                                                                                 ↑
   heroImageUrl: trip.heroImage?.url,
   slug: trip.slug,                                                                                                                                     ↑
   url: `${siteUrl}/trips/${trip.slug}`,
   status: trip.status,  // active | soldOut | draft | archived                                                                                         ↑
   navSection: trip.navSection,
 })))                                                                                                                                                   ↑

 context.featuredPrograms = JSON.stringify(programs.map(p => ({                                                                                         ↑
   title: p.title, type: p.type, startDate, endDate, location, price, heroImageUrl, url, ...
 })))                                                                                                                                                   ↑

 context.featuredDestinations = JSON.stringify(destinations.map(d => ({                                                                                 ↑
   title: d.title, slug: d.slug, heroImageUrl, description, url, tripCount, ...
 })))                                                                                                                                                   ↑

 In Maily editor: Admin uses the Repeat block, sets it to iterate over {{featuredTrips}}, then builds card layout inside:                               ↑
 - Image block → {{item.heroImageUrl}}
 - Heading → {{item.title}}                                                                                                                             ↑
 - Text → {{item.startDate}} — {{item.endDate}} · {{item.location}}
 - Text → €{{item.price}} {{item.currency}} · {{item.spotsAvailable}} spots left                                                                        ↑
 - Button → View Trip → {{item.url}}
                                                                                                                                                        ↑
 For transactional flows: The same featuredTrips/featuredPrograms/featuredDestinations fields are added to EmailFlows so a post-trip review request email can include "You might also like these upcoming trips."                                                                                                ↑

 How new Trips/Programs/Destinations become automatically available                                                                                     ↑

 Payload relationship fields are live queries — the moment a new Trip, Program, or Destination document is created in Payload admin, it instantly appear↑ in the relationship picker on Campaigns and EmailFlows. No configuration needed. The admin opens a Campaign or EmailFlow, clicks featuredTrips, and sees all current trips including just-created ones.                                                                                                         ↑

 At render time, data is always re-fetched fresh from the DB — not from the stored relationship IDs cache. The email-renderer.ts does:                  ↑

 // For each selected trip ID:                                                                                                                          ↑
 const trip = await payload.findByID({ collection: 'trips', id: tripId, depth: 1 })
 // Use live fields: trip.title, trip.spotsAvailable, trip.status, trip.price, trip.heroImage                                                           ↑

 This means if a trip sells out between when the campaign was saved and when it sends, the email shows the current spotsAvailable: 0 and status: soldOut↑— not stale data.
                                                                                                                                                        ↑
 Additional context arrays always available (no selection needed)
                                                                                                                                                        ↑
 These are auto-populated in campaign context regardless of selection — always fresh from DB:
                                                                                                                                                        ↑
 context.upcomingTrips    // next 3 trips by startDate, status=active, fetched at send time
 context.upcomingPrograms // next 3 programs by startDate, status=active                                                                                ↑
 context.soldOutTrips     // trips with status=soldOut (for waitlist campaigns)
 context.popularTrips     // trips sorted by viewCount desc, limit 3                                                                                    ↑

 ---                                                                                                                                                    ↑
 EmailFlows Additional Fields (dynamic content)
                                                                                                                                                        ↑
 Add to EmailFlows collection:
                                                                                                                                                        ↑
 { name: 'featuredTrips', type: 'relationship', relationTo: 'trips', hasMany: true,
   admin: { description: 'Trips to include as {{featuredTrips}} array in this flow\'s emails.' } },                                                     ↑

 { name: 'featuredPrograms', type: 'relationship', relationTo: 'programs', hasMany: true },                                                             ↑

 { name: 'featuredDestinations', type: 'relationship', relationTo: 'destinations', hasMany: true },                                                     ↑

 ---                                                                                                                                                    ↑
 Campaigns Additional Fields (dynamic content)
                                                                                                                                                        ↑
 Add to Campaigns collection:
                                                                                                                                                        ↑
 { name: 'featuredTrips', type: 'relationship', relationTo: 'trips', hasMany: true,
   admin: { description: 'Select trips to feature in this campaign. Available as {{featuredTrips}} array — use with Maily Repeat block.' } },           ↑

 { name: 'featuredPrograms', type: 'relationship', relationTo: 'programs', hasMany: true },                                                             ↑

 { name: 'featuredDestinations', type: 'relationship', relationTo: 'destinations', hasMany: true },                                                     ↑

 ---                                                                                                                                                    ↑
 Existing Inline Email Sends to Eliminate
                                                                                                                                                        ↑
 Every one of these becomes a sendFlow(trigger, recipient, context, payload) call:
                                                                                                                                                        ↑
 ┌────────────────────────────────────┬─────────────────────────────────────────────────────┬────────────────────────────────┐
 │                File                │                    What it sends                    │          New trigger           │                          ↑
 ├────────────────────────────────────┼─────────────────────────────────────────────────────┼────────────────────────────────┤
 │ src/app/api/booking/route.ts:134   │ "Заявката ти е получена" (booking request received) │ registration_pending           │                          ↑
 ├────────────────────────────────────┼─────────────────────────────────────────────────────┼────────────────────────────────┤
 │ src/lib/stripe-webhooks.ts:25–30   │ Loyalty tier upgrade                                │ loyalty_tier_upgrade           │                          ↑
 ├────────────────────────────────────┼─────────────────────────────────────────────────────┼────────────────────────────────┤
 │ src/lib/stripe-webhooks.ts:45–50   │ Waitlist spot available                             │ waitlist_spot_available        │                          ↑
 ├────────────────────────────────────┼─────────────────────────────────────────────────────┼────────────────────────────────┤
 │ src/lib/stripe-webhooks.ts:382–387 │ Gift voucher → recipient                            │ gift_voucher_recipient         │                          ↑
 ├────────────────────────────────────┼─────────────────────────────────────────────────────┼────────────────────────────────┤
 │ src/lib/stripe-webhooks.ts:395–400 │ Gift voucher → buyer/sender                         │ gift_voucher_buyer             │                          ↑
 ├────────────────────────────────────┼─────────────────────────────────────────────────────┼────────────────────────────────┤
 │ src/lib/stripe-webhooks.ts:546–550 │ Subscription payment failed (dunning)               │ subscription_payment_failed    │                          ↑
 ├────────────────────────────────────┼─────────────────────────────────────────────────────┼────────────────────────────────┤
 │ src/lib/stripe-webhooks.ts:558–562 │ Subscription payment recovered                      │ subscription_payment_recovered │                          ↑
 ├────────────────────────────────────┼─────────────────────────────────────────────────────┼────────────────────────────────┤
 │ src/lib/stripe-webhooks.ts:643–648 │ Order balance charge failed                         │ order_balance_failed           │                          ↑
 ├────────────────────────────────────┼─────────────────────────────────────────────────────┼────────────────────────────────┤
 │ src/lib/stripe-webhooks.ts:722–727 │ Registration balance charge failed                  │ registration_balance_failed    │                          ↑
 ├────────────────────────────────────┼─────────────────────────────────────────────────────┼────────────────────────────────┤
 │ src/lib/auth.ts:sendEmail (reset)  │ Password reset (Булг.)                              │ auth_password_reset            │                          ↑
 ├────────────────────────────────────┼─────────────────────────────────────────────────────┼────────────────────────────────┤
 │ src/lib/auth.ts:sendEmail (verify) │ Email verification (Булг.)                          │ auth_email_verification        │                          ↑
 └────────────────────────────────────┴─────────────────────────────────────────────────────┴────────────────────────────────┘
                                                                                                                                                        ↑
 auth.ts also creates new Resend() directly — replace with getResend() from src/lib/resend.ts.
                                                                                                                                                        ↑
 ---
 New Collection: EmailFlows                                                                                                                             ↑

 File: src/payload/collections/EmailFlows.ts                                                                                                            ↑
 Admin group: Email Marketing
 useAsTitle: label                                                                                                                                      ↑
 defaultColumns: ['label', 'trigger', 'enabled', 'totalSent', 'lastTriggeredAt']
                                                                                                                                                        ↑
 Fields (complete)
                                                                                                                                                        ↑
 { name: 'label', type: 'text', required: true,
   admin: { description: 'Human name shown in admin — e.g. "Booking Confirmed (Full Payment)"' } },                                                     ↑

 { name: 'trigger', type: 'select', required: true, options: [                                                                                          ↑
     // Registration
     { label: 'Registration: Pending (request received)', value: 'registration_pending' },                                                              ↑
     { label: 'Registration: Paid — Full Payment', value: 'registration_paid_full' },
     { label: 'Registration: Paid — Deposit', value: 'registration_paid_deposit' },                                                                     ↑
     { label: 'Registration: Confirmed by admin', value: 'registration_confirmed' },
     { label: 'Registration: Cancelled', value: 'registration_cancelled' },                                                                             ↑
     { label: 'Registration: Refunded', value: 'registration_refunded' },
     { label: 'Registration: Balance due in 7 days', value: 'registration_balance_due_7d' },                                                            ↑
     { label: 'Registration: Balance due tomorrow', value: 'registration_balance_due_1d' },
     { label: 'Registration: Balance overdue', value: 'registration_balance_overdue' },                                                                 ↑
     { label: 'Registration: Balance charge failed (Stripe)', value: 'registration_balance_failed' },
     { label: 'Registration: Trip reminder 7 days before', value: 'registration_trip_reminder_7d' },                                                    ↑
     { label: 'Registration: Trip reminder 1 day before', value: 'registration_trip_reminder_1d' },
     { label: 'Registration: Checked in (QR scanned)', value: 'registration_checkin' },                                                                 ↑
     { label: 'Registration: Certificate issued', value: 'registration_certificate' },
     { label: 'Registration: Post-trip review request', value: 'registration_review_request' },                                                         ↑
     // Orders
     { label: 'Order: Paid — Full Payment', value: 'order_paid_full' },                                                                                 ↑
     { label: 'Order: Paid — Deposit', value: 'order_paid_deposit' },
     { label: 'Order: Cancelled', value: 'order_cancelled' },                                                                                           ↑
     { label: 'Order: Refunded', value: 'order_refunded' },
     { label: 'Order: Shipped (tracking set)', value: 'order_shipped' },                                                                                ↑
     { label: 'Order: Balance due in 7 days', value: 'order_balance_due_7d' },
     { label: 'Order: Balance due tomorrow', value: 'order_balance_due_1d' },                                                                           ↑
     { label: 'Order: Balance charge failed (Stripe)', value: 'order_balance_failed' },
     // Gift Vouchers                                                                                                                                   ↑
     { label: 'Gift Voucher: Delivery to recipient', value: 'gift_voucher_recipient' },
     { label: 'Gift Voucher: Purchase confirmation to buyer', value: 'gift_voucher_buyer' },                                                            ↑
     { label: 'Gift Voucher: Expiry reminder (7 days)', value: 'gift_voucher_expiry_7d' },
     // Subscriptions                                                                                                                                   ↑
     { label: 'Subscription: Created / Welcome', value: 'subscription_created' },
     { label: 'Subscription: Payment failed (dunning 1)', value: 'subscription_payment_failed' },                                                       ↑
     { label: 'Subscription: Payment failed (dunning 2)', value: 'subscription_dunning_2' },
     { label: 'Subscription: Payment failed (dunning 3 — final)', value: 'subscription_dunning_3' },                                                    ↑
     { label: 'Subscription: Payment recovered', value: 'subscription_payment_recovered' },
     { label: 'Subscription: Cancelled', value: 'subscription_cancelled' },                                                                             ↑
     { label: 'Subscription: Renewal reminder (3 days)', value: 'subscription_renewal_3d' },
     // Loyalty                                                                                                                                         ↑
     { label: 'Loyalty: Tier upgraded', value: 'loyalty_tier_upgrade' },
     // Waitlist                                                                                                                                        ↑
     { label: 'Waitlist: Joined', value: 'waitlist_joined' },
     { label: 'Waitlist: Spot available', value: 'waitlist_spot_available' },                                                                           ↑
     { label: 'Waitlist: Offer expired', value: 'waitlist_expired' },
     // Stock                                                                                                                                           ↑
     { label: 'Stock Alert: Back in stock', value: 'stock_alert_notified' },
     // Cart                                                                                                                                            ↑
     { label: 'Abandoned Cart: 1 hour nudge', value: 'abandoned_cart_1h' },
     { label: 'Abandoned Cart: 24 hour nudge', value: 'abandoned_cart_24h' },                                                                           ↑
     // Auth
     { label: 'Auth: Password reset', value: 'auth_password_reset' },                                                                                   ↑
     { label: 'Auth: Email verification', value: 'auth_email_verification' },
   ]                                                                                                                                                    ↑
 },
                                                                                                                                                        ↑
 { name: 'enabled', type: 'checkbox', defaultValue: false,
   admin: { description: 'Must be explicitly enabled after assigning a template. Disabling stops all sends for this trigger instantly.' } },            ↑

 { name: 'template', type: 'relationship', relationTo: 'email-templates',                                                                               ↑
   admin: { description: 'The email template to render and send. Create templates in Email Templates collection.' } },
                                                                                                                                                        ↑
 { name: 'fromName', type: 'text',
   admin: { description: 'Override the global from name for this flow only. Leave empty to use EmailSettings default.' } },                             ↑

 { name: 'fromEmail', type: 'text',                                                                                                                     ↑
   admin: { description: 'Override the global from email address. Leave empty to use EmailSettings default.' } },
                                                                                                                                                        ↑
 { name: 'replyTo', type: 'text',
   admin: { description: 'Reply-to address for this flow. E.g. "trips@sonsofmountains.com" for booking emails.' } },                                    ↑

 { name: 'subjectOverride', type: 'text',                                                                                                               ↑
   admin: { description: 'Override the template subject for this specific flow. Supports merge tags: {{firstName}}, {{tripTitle}} etc.' } },
                                                                                                                                                        ↑
 { name: 'delayMinutes', type: 'number', defaultValue: 0,
   admin: { description: '0 = send immediately on trigger. E.g. 4320 = send 3 days after trigger fires. Used for review requests, voucher expiry reminde↑s etc.' } },
                                                                                                                                                        ↑
 { name: 'ccAdmin', type: 'checkbox', defaultValue: false,
   admin: { description: 'BCC the admin email (from EmailSettings.fromEmail) on every send from this flow.' } },                                        ↑

 { name: 'skipIfAlreadySent', type: 'checkbox', defaultValue: true,                                                                                     ↑
   admin: { description: 'Do not send if an EmailLog already exists for this trigger + recipient combination. Prevents duplicates on re-saves.' } },
                                                                                                                                                        ↑
 { name: 'resendTags', type: 'array', fields: [
     { name: 'name', type: 'text', required: true, admin: { description: 'Tag name — e.g. "category"' } },                                              ↑
     { name: 'value', type: 'text', required: true, admin: { description: 'Tag value — e.g. "transactional"' } },
   ],                                                                                                                                                   ↑
   admin: { description: 'Extra Resend tags attached to every email from this flow. "trigger" and "flowId" are always auto-added.' } },
                                                                                                                                                     ↑
name: 'notes', type: 'textarea',
admin: { description: 'Internal admin notes about this flow. Not visible to recipients.' } },                                                        ↑

 // readOnly stats — sidebar                                                                                                                            ↑
 { name: 'lastTriggeredAt', type: 'date', admin: { readOnly: true, position: 'sidebar', description: 'Last time this flow successfully fired.' } },
 { name: 'totalSent', type: 'number', defaultValue: 0, admin: { readOnly: true, position: 'sidebar', description: 'Total emails sent by this flow since creation.' } },
                                                                                                                                                        ↑
 ---
 Admin-Created Custom Segments & Custom Flows                                                                                                           ↑

 Custom Segments — already fully supported                                                                                                              ↑

 Admins can create unlimited Segment documents in Payload admin. Each one:                                                                              ↑
 - Has a name + description
Uses any combination of the 29 filter rule types (AND/exclude)                                                                                       ↑
Is instantly available in the segments relationship picker on any Campaign
                                                                                                                                                        ↑
 No code changes needed — this is inherent to the Payload collection architecture.
                                                                                                                                                     ↑
stom EmailFlows — two modes
                                                                                                                                                     ↑
de 1: Pre-seeded system trigger (the 41 seeded docs) — admin assigns a template, enables it, done.
                                                                                                                                                     ↑
de 2: Admin-created custom flow with a named trigger — admin creates a new EmailFlow doc, sets trigger = 'custom', gives it a customTriggerKey (e.g., customer_vip_tagged, blog_post_published, admin_manual_outreach). This flow can then be fired from:                                                    ↑
 - Any Payload afterChange hook by calling sendFlow('custom:customer_vip_tagged', ...)
 - A manual "Fire Flow" button in admin UI (custom endpoint)                                                                                            ↑
 - Any future webhook or automation
                                                                                                                                                        ↑
 Add to EmailFlows:
                                                                                                                                                        ↑
 // trigger select: add one more option
 { label: 'Custom (admin-defined key)', value: 'custom' },                                                                                              ↑

 // Additional field (shown when trigger=custom):                                                                                                       ↑
 { name: 'customTriggerKey', type: 'text',
   admin: {                                                                                                                                             ↑
     condition: (data) => data.trigger === 'custom',
     description: 'Unique key for this custom flow. Fire it from code: sendFlow("custom:your_key_here", ...). Use snake_case, e.g. customer_vip_tagged, blog_weekly_digest.',
   }                                                                                                                                                    ↑
 },
                                                                                                                                                        ↑
 sendFlow updated to handle custom:* triggers:
 // Find flow where trigger='custom' AND customTriggerKey = key                                                                                         ↑
 if (trigger.startsWith('custom:')) {
   const key = trigger.slice(7)                                                                                                                         ↑
   // payload.find({ where: { and: [{ trigger: eq 'custom' }, { customTriggerKey: eq key }, { enabled: eq true }] } })
 }                                                                                                                                                      ↑

 Manual "Fire Flow" Action in Admin                                                                                                                     ↑

 Add a custom Payload collection row action button on EmailFlows: "Send Test / Fire Now"                                                                ↑
 - Opens a modal: enter a recipient email + optional context JSON
 - POSTs to /api/email-flows/[id]/fire with { recipientEmail, context }                                                                                 ↑
 - Server renders template with context + sends immediately
 - Creates EmailLog                                                                                                                                     ↑
 - Useful for: manual outreach, testing, admin-triggered one-offs
                                                                                                                                                        ↑
 Route: POST /api/email-flows/[id]/fire
 Body: { recipientEmail: string, context?: Record<string, string> }                                                                                     ↑
 Auth: admin session only (check req.user from Payload)
 Action: sendFlow(flow.trigger, { email: recipientEmail }, context, payload, { skipDuplicateCheck: true })                                              ↑
 Response: { ok: true, subject, logId }
                                                                                                                                                        ↑
 ---
 New Collection: EmailLogs                                                                                                                              ↑

 File: src/payload/collections/EmailLogs.ts                                                                                                             ↑
 Admin group: Email Marketing
 Access: read + delete for admins; no create/update from UI                                                                                             ↑
 defaultColumns: ['trigger', 'recipient', 'status', 'sentAt']
                                                                                                                                                        ↑
 Fields (complete)
                                                                                                                                                        ↑
 { name: 'flow', type: 'relationship', relationTo: 'email-flows',
   admin: { readOnly: true, description: 'Which EmailFlow triggered this send. Null for campaign sends.' } },                                           ↑

 { name: 'campaign', type: 'relationship', relationTo: 'campaigns',                                                                                     ↑
   admin: { readOnly: true, description: 'Which Campaign triggered this send. Null for flow sends.' } },
                                                                                                                                                        ↑
 { name: 'trigger', type: 'text', admin: { readOnly: true } },
                                                                                                                                                        ↑
 { name: 'recipient', type: 'email', admin: { readOnly: true } },
                                                                                                                                                        ↑
 { name: 'subject', type: 'text', admin: { readOnly: true } },
                                                                                                                                                        ↑
 { name: 'status', type: 'select',
   options: [                                                                                                                                           ↑
     { label: 'Queued (delayed)', value: 'queued' },
     { label: 'Sent', value: 'sent' },                                                                                                                  ↑
     { label: 'Failed', value: 'failed' },
     { label: 'Bounced', value: 'bounced' },                                                                                                            ↑
     { label: 'Opened', value: 'opened' },
     { label: 'Clicked', value: 'clicked' },                                                                                                            ↑
   ],
   defaultValue: 'sent',                                                                                                                                ↑
   admin: { readOnly: true }
 },                                                                                                                                                     ↑

 { name: 'scheduledFor', type: 'date',                                                                                                                  ↑
   admin: { readOnly: true, description: 'Populated when status=queued (delayed flow). Null for immediate sends.' } },
                                                                                                                                                        ↑
 { name: 'resendMessageId', type: 'text', admin: { readOnly: true } },
                                                                                                                                                        ↑
 { name: 'sentAt', type: 'date', admin: { readOnly: true } },
 { name: 'openedAt', type: 'date', admin: { readOnly: true } },                                                                                         ↑
 { name: 'bouncedAt', type: 'date', admin: { readOnly: true } },
 { name: 'clickedAt', type: 'date', admin: { readOnly: true } },                                                                                        ↑

 { name: 'error', type: 'textarea', admin: { readOnly: true, description: 'Error message if status=failed.' } },                                        ↑

 { name: 'context', type: 'json',                                                                                                                       ↑
   admin: { readOnly: true, description: 'Snapshot of all merge tag values at send time. Used for debugging and re-send.' } },
                                                                                                                                                        ↑
 ---
 New Global: EmailSettings                                                                                                                              ↑

 File: src/payload/globals/EmailSettings.ts                                                                                                             ↑
 Admin group: Email Marketing
 slug: email-settings                                                                                                                                   ↑

 Fields (complete)                                                                                                                                      ↑

 { name: 'fromName', type: 'text', defaultValue: 'Sons of Mountains',                                                                                   ↑
   admin: { description: 'Default sender name for all emails.' } },
                                                                                                                                                        ↑
 { name: 'fromEmail', type: 'email',
   admin: { description: 'Default sender address. Must be verified in Resend dashboard.' } },                                                           ↑

 { name: 'replyToEmail', type: 'email',                                                                                                                 ↑
   admin: { description: 'Global reply-to address. Overridden per-flow by flow.replyTo.' } },
                                                                                                                                                        ↑
 { name: 'adminEmail', type: 'email',
   admin: { description: 'Admin BCC address when flow.ccAdmin = true.' } },                                                                             ↑

 { name: 'logoUrl', type: 'text',                                                                                                                       ↑
   admin: { description: 'Absolute URL of logo shown in email header. E.g. https://sonsofmountains.com/logo.png' } },
                                                                                                                                                        ↑
 { name: 'brandColor', type: 'text', defaultValue: '#ffffff',
   admin: { description: 'Primary CTA button color hex. E.g. #ffffff for white buttons on dark background.' } },                                        ↑

 { name: 'brandBgColor', type: 'text', defaultValue: '#0a0a0a',                                                                                         ↑
   admin: { description: 'Email background color. Default black matches current email design.' } },
                                                                                                                                                        ↑
 { name: 'footerText', type: 'richText',
   admin: { description: 'Legal footer shown in all campaign emails. E.g. company address, legal notice.' } },                                          ↑

 { name: 'socialLinks', type: 'array', fields: [                                                                                                        ↑
     { name: 'platform', type: 'select', options: [
         { label: 'Instagram', value: 'instagram' },                                                                                                    ↑
         { label: 'Facebook', value: 'facebook' },
         { label: 'YouTube', value: 'youtube' },                                                                                                        ↑
         { label: 'TikTok', value: 'tiktok' },
       ]                                                                                                                                                ↑
     },
     { name: 'url', type: 'text' },                                                                                                                     ↑
   ]
 },                                                                                                                                                     ↑

 { name: 'unsubscribeText', type: 'text', defaultValue: 'Отпиши се',                                                                                    ↑
   admin: { description: 'Link text for unsubscribe link in campaign email footers.' } },
                                                                                                                                                        ↑
 { name: 'testMode', type: 'checkbox', defaultValue: false,
   admin: { description: 'DANGER: When enabled, ALL emails (transactional and campaigns) are redirected to testEmail only. Real recipients do not receiv↑ anything.' } },
                                                                                                                                                        ↑
 { name: 'testEmail', type: 'email',
   admin: { condition: (data) => data.testMode, description: 'All emails go here when testMode is on.' } },                                             ↑

 ---                                                                                                                                                    ↑
 Modified Collection: EmailTemplates
                                                                                                                                                        ↑
 New fields added to existing name, subject, previewText, content (richText):
                                                                                                                                                        ↑
 { name: 'contentType', type: 'select', required: true, defaultValue: 'richtext',
   options: [                                                                                                                                           ↑
     { label: 'Visual Builder (Maily drag-and-drop)', value: 'maily' },
     { label: 'Rich Text (Lexical editor)', value: 'richtext' },                                                                                        ↑
     { label: 'Raw HTML', value: 'html' },
   ],                                                                                                                                                   ↑
   admin: { description: 'Choose how to edit this template. Maily = visual drag-and-drop. RichText = formatted editor. HTML = paste your own code.' }
 },                                                                                                                                                     ↑

 { name: 'mailyContent', type: 'json',                                                                                                                  ↑
   admin: {
     condition: (data) => data.contentType === 'maily',                                                                                                 ↑
     description: 'Maily visual editor JSON. Edit via the drag-and-drop builder above.',
     components: { Field: '@/payload/components/MailyEditor' },                                                                                         ↑
   }
 },                                                                                                                                                     ↑

 // existing 'content' richText — keep, shown when contentType=richtext                                                                                 ↑
 // admin.condition added: condition: (data) => data.contentType === 'richtext'
                                                                                                                                                        ↑
 { name: 'htmlContent', type: 'textarea',
   admin: {                                                                                                                                             ↑
     condition: (data) => data.contentType === 'html',
     description: 'Paste raw HTML here. Merge tags like {{firstName}} are substituted at send time. The email shell (logo, footer) is NOT added — includ↑ your full HTML.',
   }                                                                                                                                                    ↑
 },
                                                                                                                                                        ↑
 MailyEditor component — src/payload/components/MailyEditor.tsx:
 - Renders @maily-to/core inside a Payload custom field component wrapper                                                                               ↑
 - variables prop: array of all 43 merge tags (label + key), so the variable insert button in Maily's toolbar shows exactly which {{tags}} are available
 - onChange: calls Payload field setValue(mailyJson) on every change                                                                                    ↑
 - Height: 600px, full-width, dark mode to match admin theme
                                                                                                                                                        ↑
 ---
 Modified Collection: Campaigns                                                                                                                         ↑

 New fields (on top of existing name, template, segment, status, scheduledAt, sentAt, stats):                                                           ↑

 { name: 'audienceType', type: 'select', required: true, defaultValue: 'subscribers',                                                                   ↑
   options: [
     { label: 'Subscribers — opt-in marketing list', value: 'subscribers' },                                                                            ↑
     { label: 'Customers — all verified active accounts', value: 'customers' },
   ],                                                                                                                                                   ↑
   admin: { description: 'Subscribers = newsletter/marketing opt-in list. Customers = logged-in users from Better Auth who are emailVerified=true and status=active.' }                                                                                                                                      ↑
 },
                                                                                                                                                        ↑
 { name: 'segments', type: 'relationship', relationTo: 'segments', hasMany: true,
   admin: { description: 'Select one or more segments. Recipients are the UNION of all selected segment results, deduplicated by email. Leave empty to send to all active subscribers (or all active customers if audienceType=customers).' }
 },                                                                                                                                                     ↑

 { name: 'fromName', type: 'text',                                                                                                                      ↑
   admin: { description: 'Override sender name for this campaign. Leave empty to use EmailSettings default.' }
 },                                                                                                                                                     ↑

 { name: 'fromEmail', type: 'email',                                                                                                                    ↑
   admin: { description: 'Override sender address for this campaign.' }
 },                                                                                                                                                     ↑

 { name: 'replyTo', type: 'email',                                                                                                                      ↑
   admin: { description: 'Reply-to address for this campaign.' }
 },                                                                                                                                                     ↑

 { name: 'testEmail', type: 'email',                                                                                                                    ↑
   admin: { description: '"Send Test" sends one email to this address with real merge tags substituted. Does not affect scheduling or status.' }
 },                                                                                                                                                     ↑

 { name: 'resendMessageIds', type: 'array', admin: { readOnly: true },                                                                                  ↑
   fields: [{ name: 'id', type: 'text' }],
   admin: { description: 'Resend message IDs from the batch send. Used to correlate webhook open/bounce events.' }                                      ↑
 },
                                                                                                                                                        ↑
 { name: 'sentCount', type: 'number', defaultValue: 0,
   admin: { readOnly: true, position: 'sidebar', description: 'Total recipients this campaign was sent to.' }                                           ↑
 },
                                                                                                                                                        ↑
 // add inside existing 'stats' group:
 { name: 'clicks', type: 'number', defaultValue: 0 },  // in stats group alongside opens/bounces/unsubscribes                                           ↑

 New route: POST /api/campaigns/[id]/test                                                                                                               ↑
 - Loads campaign + template + EmailSettings
 - Renders template with dummy context: { firstName: 'Test', email: campaign.testEmail, unsubscribe_url: '#', ... }                                     ↑
 - Sends single Resend email to campaign.testEmail
 - Returns { ok: true, subject } — no campaign status change                                                                                            ↑

 ---                                                                                                                                                    ↑
 Modified Collection: Segments
                                                                                                                                                        ↑
 New fields (on top of existing name, filterRules, subscriberCount):
                                                                                                                                                        ↑
 { name: 'description', type: 'text',
   admin: { description: 'Internal note on who this segment targets. E.g. "Users who signed up via footer but never booked."' }                         ↑
 },
                                                                                                                                                        ↑
 { name: 'previewCount', type: 'number',
   admin: { readOnly: true, description: 'Estimated recipient count. Recalculated every time you save this segment.' }                                  ↑
 },
                                                                                                                                                        ↑
 Extend filterRules[].type select options from 4 to 23:
                                                                                                                                                        ↑
 options: [
   { label: 'All active subscribers', value: 'all' },                                                                                                   ↑
   { label: 'Tag', value: 'tag' },
   { label: 'Destination interest', value: 'destination_interest' },                                                                                    ↑
   { label: 'Has booked a specific trip/program', value: 'booking_history' },
   { label: 'Has never booked', value: 'no_booking' },                                                                                                  ↑
   { label: 'Cold lead (subscribed N+ days, no booking)', value: 'cold_lead' },
   { label: 'Active Adventure Pass (monthly)', value: 'subscription_monthly' },                                                                         ↑
   { label: 'Active Adventure Pass (annual)', value: 'subscription_annual' },
   { label: 'Any active Adventure Pass', value: 'subscription_any' },                                                                                   ↑
   { label: 'Upcoming trip participant (in next N days)', value: 'upcoming_trip' },
   { label: 'Past traveller (completed trip)', value: 'past_traveller' },                                                                               ↑
   { label: 'Booked Bulgaria trips', value: 'trip_region_bulgaria' },
   { label: 'Booked abroad trips', value: 'trip_region_abroad' },                                                                                       ↑
   { label: 'Language preference', value: 'language' },
   { label: 'High-value customer (spent > N EUR)', value: 'high_value' },                                                                               ↑
   { label: 'Has active discount code', value: 'has_discount' },
   { label: 'On waitlist (any item)', value: 'on_waitlist' },                                                                                           ↑
   { label: 'Gift voucher buyer', value: 'voucher_buyer' },
   { label: 'Gift voucher recipient', value: 'voucher_recipient' },                                                                                     ↑
   { label: 'Has given a rating', value: 'has_rated' },
   { label: 'Past traveller — never rated', value: 'no_rating' },                                                                                       ↑
   { label: 'Source: footer signup', value: 'source_footer' },
   { label: 'Source: booking auto-enroll', value: 'source_booking' },                                                                                   ↑
   // Trip-type specific
   { label: 'Booked yoga programs', value: 'program_type_yoga' },                                                                                       ↑
   { label: 'Booked ski programs', value: 'program_type_ski' },
   { label: 'Booked photography programs', value: 'program_type_photography' },                                                                         ↑
   { label: 'Booked hiking programs', value: 'program_type_hiking' },
   // Destination-specific interest                                                                                                                     ↑
   { label: 'Interested in specific destination', value: 'destination_specific' },
   // Early bird segment                                                                                                                                ↑
   { label: 'Registered during early bird window', value: 'early_bird_buyer' },
 ]                                                                                                                                                      ↑

 Total: 29 filter types. The value field meaning per type:                                                                                              ↑

 ┌──────────────────────────┬──────────────────────┬──────────────────────────────────┐                                                                 ↑
 │           type           │     value format     │             Example              │
 ├──────────────────────────┼──────────────────────┼──────────────────────────────────┤                                                                 ↑
 │ all                      │ empty                │ —                                │
 ├──────────────────────────┼──────────────────────┼──────────────────────────────────┤                                                                 ↑
 │ tag                      │ tag string           │ newsletter, vip, repeat-customer │
 ├──────────────────────────┼──────────────────────┼──────────────────────────────────┤                                                                 ↑
 │ destination_interest     │ destination slug     │ rila, pirin, vitosha             │
 ├──────────────────────────┼──────────────────────┼──────────────────────────────────┤                                                                 ↑
 │ booking_history          │ trip or program slug │ rila-2025, yoga-summer           │
 ├──────────────────────────┼──────────────────────┼──────────────────────────────────┤                                                                 ↑
 │ no_booking               │ empty                │ —                                │
 ├──────────────────────────┼──────────────────────┼──────────────────────────────────┤                                                                 ↑
 │ cold_lead                │ number (days)        │ 30, 90                           │
 ├──────────────────────────┼──────────────────────┼──────────────────────────────────┤                                                                 ↑
 │ subscription_monthly     │ empty                │ —                                │
 ├──────────────────────────┼──────────────────────┼──────────────────────────────────┤                                                                 ↑
 │ subscription_annual      │ empty                │ —                                │
 ├──────────────────────────┼──────────────────────┼──────────────────────────────────┤                                                                 ↑
 │ subscription_any         │ empty                │ —                                │
 ├──────────────────────────┼──────────────────────┼──────────────────────────────────┤                                                                 ↑
 │ upcoming_trip            │ number (days)        │ 7, 14, 30                        │
 ├──────────────────────────┼──────────────────────┼──────────────────────────────────┤                                                                 ↑
 │ past_traveller           │ empty                │ —                                │
 ├──────────────────────────┼──────────────────────┼──────────────────────────────────┤                                                                 ↑
 │ trip_region_bulgaria     │ empty                │ —                                │
 ├──────────────────────────┼──────────────────────┼──────────────────────────────────┤                                                                 ↑
 │ trip_region_abroad       │ empty                │ —                                │
 ├──────────────────────────┼──────────────────────┼──────────────────────────────────┤                                                                 ↑
 │ language                 │ language code        │ BG, EN, DE, RU                   │
 ├──────────────────────────┼──────────────────────┼──────────────────────────────────┤                                                                 ↑
 │ high_value               │ EUR amount           │ 500, 1000                        │
 ├──────────────────────────┼──────────────────────┼──────────────────────────────────┤                                                                 ↑
 │ has_discount             │ empty                │ —                                │
 ├──────────────────────────┼──────────────────────┼──────────────────────────────────┤                                                                 ↑
 │ on_waitlist              │ empty                │ —                                │
 ├──────────────────────────┼──────────────────────┼──────────────────────────────────┤                                                                 ↑
 │ voucher_buyer            │ empty                │ —                                │
 ├──────────────────────────┼──────────────────────┼──────────────────────────────────┤                                                                 ↑
 │ voucher_recipient        │ empty                │ —                                │
 ├──────────────────────────┼──────────────────────┼──────────────────────────────────┤                                                                 ↑
 │ has_rated                │ empty                │ —                                │
 ├──────────────────────────┼──────────────────────┼──────────────────────────────────┤                                                                 ↑
 │ no_rating                │ empty                │ —                                │
 ├──────────────────────────┼──────────────────────┼──────────────────────────────────┤                                                                 ↑
 │ source_footer            │ empty                │ —                                │
 ├──────────────────────────┼──────────────────────┼──────────────────────────────────┤                                                                 ↑
 │ source_booking           │ empty                │ —                                │
 ├──────────────────────────┼──────────────────────┼──────────────────────────────────┤                                                                 ↑
 │ program_type_yoga        │ empty                │ —                                │
 ├──────────────────────────┼──────────────────────┼──────────────────────────────────┤                                                                 ↑
 │ program_type_ski         │ empty                │ —                                │
 ├──────────────────────────┼──────────────────────┼──────────────────────────────────┤                                                                 ↑
 │ program_type_photography │ empty                │ —                                │
 ├──────────────────────────┼──────────────────────┼──────────────────────────────────┤                                                                 ↑
 │ program_type_hiking      │ empty                │ —                                │
 ├──────────────────────────┼──────────────────────┼──────────────────────────────────┤                                                                 ↑
 │ destination_specific     │ destination slug     │ rila, pirin                      │
 ├──────────────────────────┼──────────────────────┼──────────────────────────────────┤                                                                 ↑
 │ early_bird_buyer         │ empty                │ —                                │
 └──────────────────────────┴──────────────────────┴──────────────────────────────────┘                                                                 ↑

 Add operator field to each filterRule:                                                                                                                 ↑
 { name: 'operator', type: 'select', defaultValue: 'include',
   options: [                                                                                                                                           ↑
     { label: 'Include — must match', value: 'include' },
     { label: 'Exclude — must NOT match', value: 'exclude' },                                                                                           ↑
   ]
 },                                                                                                                                                     ↑

 Add afterChange hook: recalculates subscriberCount and previewCount by calling resolveSegment(doc.id, payload).                                        ↑

 ---                                                                                                                                                    ↑
 Modified Collection: Subscribers
                                                                                                                                                        ↑
 New fields:
                                                                                                                                                        ↑
 { name: 'unsubscribeToken', type: 'text', unique: true,
   admin: { readOnly: true, position: 'sidebar', description: 'Auto-generated UUID. Used in unsubscribe link. Never changes.' }                         ↑
 },
                                                                                                                                                        ↑
 { name: 'lastEmailSentAt', type: 'date',
   admin: { readOnly: true, position: 'sidebar', description: 'When the most recent email was sent to this subscriber.' }                               ↑
 },
                                                                                                                                                        ↑
 { name: 'emailCount', type: 'number', defaultValue: 0,
   admin: { readOnly: true, position: 'sidebar', description: 'Total number of emails ever sent to this subscriber.' }                                  ↑
 },
                                                                                                                                                        ↑
 beforeChange hook (operation = 'create'): if !data.unsubscribeToken → data.unsubscribeToken = crypto.randomUUID().
                                                                                                                                                        ↑
 ---
 Modified Collection: Registrations — afterChange hook                                                                                                  ↑

 Hook fires on every update. Guards:                                                                                                                    ↑
 - if (doc.status === previousDoc?.status && !isNew) skip (no status change)
                                                                                                                                                        ↑
 ┌───────────────────────────────────────────────────┬─────────────────────────────┬───────────────────────────────────────────────────────────────┐
 │                     Condition                     │        Trigger fired        │                         Context keys                          │    ↑
 ├───────────────────────────────────────────────────┼─────────────────────────────┼───────────────────────────────────────────────────────────────┤
 │ isNew && doc.status === 'pending'                 │ registration_pending        │ firstName, lastName, email, tripTitle, tripStartDate,         │    ↑
 │                                                   │                             │ tripEndDate, tripLocation, participantCount, siteUrl          │
 ├───────────────────────────────────────────────────┼─────────────────────────────┼───────────────────────────────────────────────────────────────┤    ↑
 │ doc.status === 'paid' && prev !== 'paid' &&       │ registration_paid_full      │ + totalAmount, currency, invoiceUrl, qrToken                  │
 │ paymentMode === 'full'                            │                             │                                                               │    ↑
 ├───────────────────────────────────────────────────┼─────────────────────────────┼───────────────────────────────────────────────────────────────┤
doc.status === 'paid' && prev !== 'paid' &&       │ registration_paid_deposit   │ + depositAmount, remainingBalance, remainingDueDate,          │    ↑
paymentMode === 'deposit'                         │                             │ invoiceUrl                                                    │
──────────────────────────────────────────────────┼─────────────────────────────┼───────────────────────────────────────────────────────────────┤    ↑
doc.status === 'paid' && prev !== 'paid' &&       │ registration_paid_full      │ + totalAmount, currency, invoiceUrl                           │
paymentMode === 'installments'                    │ (reuse)                     │                                                               │    ↑
──────────────────────────────────────────────────┼─────────────────────────────┼───────────────────────────────────────────────────────────────┤
 │ doc.status === 'confirmed' && prev !==            │ registration_confirmed      │ firstName, tripTitle, tripStartDate, qrToken                  │    ↑
 │ 'confirmed'                                       │                             │                                                               │
 ├───────────────────────────────────────────────────┼─────────────────────────────┼───────────────────────────────────────────────────────────────┤    ↑
 │ doc.status === 'cancelled' && prev !==            │ registration_cancelled      │ firstName, tripTitle, tripStartDate                           │
 │ 'cancelled'                                       │                             │                                                               │    ↑
 ├───────────────────────────────────────────────────┼─────────────────────────────┼───────────────────────────────────────────────────────────────┤
 │ doc.status === 'refunded' && prev !== 'refunded'  │ registration_refunded       │ firstName, tripTitle, refundAmount, currency, stripeRefundId  │    ↑
 ├───────────────────────────────────────────────────┼─────────────────────────────┼───────────────────────────────────────────────────────────────┤
 │ doc.checkedIn === true && !prev.checkedIn         │ registration_checkin        │ firstName, tripTitle                                          │    ↑
 ├───────────────────────────────────────────────────┼─────────────────────────────┼───────────────────────────────────────────────────────────────┤
 │ doc.certificateIssuedAt &&                        │ registration_certificate    │ firstName, tripTitle, siteUrl                                 │    ↑
 │ !prev.certificateIssuedAt                         │                             │                                                               │
 └───────────────────────────────────────────────────┴─────────────────────────────┴───────────────────────────────────────────────────────────────┘    ↑

 On status === 'paid' (any mode): also call upsertSubscriber(payload, { email, firstName, lastName, source: 'booking' }).                               ↑

 ---                                                                                                                                                    ↑
 Modified Collection: Orders — afterChange hook
                                                                                                                                                        ↑
 ┌───────────────────────────────────────────────────────────────┬────────────────────┬────────────────────────────────────────────────────────────┐
 │                           Condition                           │      Trigger       │                        Context keys                        │    ↑
 ├───────────────────────────────────────────────────────────────┼────────────────────┼────────────────────────────────────────────────────────────┤
 │ doc.status === 'paid' && prev !== 'paid' && paymentMode ===   │ order_paid_full    │ firstName, orderItems (HTML list), orderTotal, currency,   │    ↑
 │ 'full'                                                        │                    │ invoiceUrl                                                 │
 ├───────────────────────────────────────────────────────────────┼────────────────────┼────────────────────────────────────────────────────────────┤    ↑
 │ doc.status === 'paid' && prev !== 'paid' && paymentMode ===   │ order_paid_deposit │ + depositAmount, remainingBalance, remainingDueDate        │
 │ 'deposit'                                                     │                    │                                                            │    ↑
 ├───────────────────────────────────────────────────────────────┼────────────────────┼────────────────────────────────────────────────────────────┤
 │ doc.status === 'cancelled' && prev !== 'cancelled'            │ order_cancelled    │ firstName, orderItems                                      │    ↑
 ├───────────────────────────────────────────────────────────────┼────────────────────┼────────────────────────────────────────────────────────────┤
 │ doc.status === 'refunded' && prev !== 'refunded'              │ order_refunded     │ firstName, refundAmount, currency, stripeRefundId          │    ↑
 ├───────────────────────────────────────────────────────────────┼────────────────────┼────────────────────────────────────────────────────────────┤
 │ doc.trackingNumber && !prev.trackingNumber                    │ order_shipped      │ firstName, trackingNumber, shippingProvider, orderItems    │    ↑
 └───────────────────────────────────────────────────────────────┴────────────────────┴────────────────────────────────────────────────────────────┘
                                                                                                                                                        ↑
 On status === 'paid': upsertSubscriber(...).
                                                                                                                                                        ↑
 ---
 Modified Collection: GiftVouchers — afterChange hook                                                                                                   ↑

 Replaces inline sends in stripe-webhooks.ts lines 382–400.                                                                                             ↑

 ┌─────────────────────────┬────────────────────────┬──────────────────────────────────────────────────────────────────────────────────────────────┐    ↑
 │        Condition        │        Trigger         │                                         Context keys                                         │
 ├─────────────────────────┼────────────────────────┼──────────────────────────────────────────────────────────────────────────────────────────────┤    ↑
 │ isNew &&                │ gift_voucher_recipient │ recipientName, senderName, voucherCode, voucherAmount, currency, voucherExpiry,              │
 │ doc.recipientEmail      │                        │ voucherMessage, siteUrl                                                                      │    ↑
 ├─────────────────────────┼────────────────────────┼──────────────────────────────────────────────────────────────────────────────────────────────┤
 │ isNew (to buyer/sender) │ gift_voucher_buyer     │ firstName (=senderName or recipientName), recipientName, recipientEmail, voucherCode,        │    ↑
 │                         │                        │ voucherAmount, currency, voucherExpiry, isGift                                               │
 └─────────────────────────┴────────────────────────┴──────────────────────────────────────────────────────────────────────────────────────────────┘    ↑

 recipient for gift_voucher_recipient = doc.recipientEmail                                                                                              ↑
 recipient for gift_voucher_buyer = doc.isGift ? doc.senderEmail : doc.recipientEmail
                                                                                                                                                        ↑
 On create: upsertSubscriber for doc.recipientEmail with source 'gift_voucher'.
                                                                                                                                                        ↑
 ---
 Complete Merge Tags (43 tags, by category)                                                                                                             ↑

 Universal (all flows and campaigns)                                                                                                                    ↑

 {{firstName}}       {{lastName}}        {{email}}                                                                                                      ↑
 {{siteUrl}}         {{siteName}}        {{currentYear}}
                                                                                                                                                        ↑
 Marketing only
                                                                                                                                                        ↑
 {{unsubscribe_url}}   — resolves to /api/unsubscribe?token=<unsubscribeToken>
                                                                                                                                                        ↑
 Registration & Trip
                                                                                                                                                        ↑
 {{tripTitle}}           {{tripStartDate}}       {{tripEndDate}}
 {{tripLocation}}        {{participantCount}}    {{totalAmount}}                                                                                        ↑
 {{currency}}            {{depositAmount}}       {{remainingBalance}}
 {{remainingDueDate}}    {{invoiceUrl}}          {{qrToken}}                                                                                            ↑
 {{refundAmount}}        {{stripeRefundId}}
                                                                                                                                                        ↑
 Orders
                                                                                                                                                        ↑
 {{orderItems}}          — rendered as HTML `<ul>` list of item title + qty + price
 {{orderTotal}}          {{trackingNumber}}      {{shippingProvider}}                                                                                   ↑
 {{shippingAddress}}     — formatted single-line: "line1, city, country"
                                                                                                                                                        ↑
 Gift Vouchers
                                                                                                                                                        ↑
 {{voucherCode}}         {{voucherAmount}}       {{voucherExpiry}}
 {{voucherMessage}}      {{recipientName}}       {{senderName}}                                                                                         ↑
 {{recipientEmail}}      {{isGift}}
                                                                                                                                                        ↑
 Subscriptions
                                                                                                                                                        ↑
 {{subscriptionPlan}}    — "Monthly Adventure Pass" or "Annual Adventure Pass"
 {{subscriptionPeriodEnd}}  {{discountCode}}     {{dunningCount}}                                                                                       ↑
 {{billingUpdateUrl}}    — ${siteUrl}/dashboard/billing
                                                                                                                                                        ↑
 Loyalty
                                                                                                                                                        ↑
 {{loyaltyTier}}         — bronze | silver | gold | platinum
 {{loyaltyPoints}}       {{previousTier}}                                                                                                               ↑
 {{loyaltyTierLabel}}    — "Bronze (0–499 pts)" etc.
                                                                                                                                                        ↑
 Waitlist & Stock
                                                                                                                                                        ↑
 {{waitlistPosition}}    {{bookNowUrl}}          {{itemTitle}}
                                                                                                                                                        ↑
 Abandoned Cart
                                                                                                                                                        ↑
 {{cartItems}}           — rendered as HTML list
 {{cartTotal}}           {{cartUrl}}                                                                                                                    ↑

 Auth                                                                                                                                                   ↑

 {{resetUrl}}            {{verifyUrl}}                                                                                                                  ↑

 ---                                                                                                                                                    ↑
 /src/lib/email-flows.ts — Full Specification
                                                                                                                                                        ↑
 export async function sendFlow(
   trigger: FlowTrigger,                                                                                                                                ↑
   recipient: { email: string; firstName?: string; lastName?: string },
   context: Record<string, string>,                                                                                                                     ↑
   payload: Payload,
   opts?: { skipDuplicateCheck?: boolean }                                                                                                              ↑
 ): Promise<{ sent: boolean; logId?: string; reason?: string }>
                                                                                                                                                        ↑
 Steps:
 1. Find EmailFlow: trigger = trigger, enabled = true — if none → { sent: false, reason: 'no_flow' }                                                    ↑
 2. If flow.skipIfAlreadySent — check EmailLogs for existing sent/queued log with same trigger + recipient → skip if found
 3. Load EmailSettings global                                                                                                                           ↑
 4. Resolve FROM: flow.fromName || settings.fromName, flow.fromEmail || settings.fromEmail
 5. Resolve REPLY-TO: flow.replyTo || settings.replyToEmail                                                                                             ↑
 6. If settings.testMode → override recipient to settings.testEmail
 7. Resolve subject: flow.subjectOverride || template.subject → substitute merge tags                                                                   ↑
 8. renderEmail(template, fullContext, settings) → html
 9. If flow.delayMinutes > 0:                                                                                                                           ↑
   - createEmailLog({ status: 'queued', scheduledFor: now + delayMinutes, trigger, recipient, subject, context }) → logId
   - return { sent: false, logId, reason: 'queued' } — delayed-emails cron will pick it up                                                              ↑
 10. Send: getResend().emails.send({ from, to, replyTo, subject, html, tags: [{ name: 'trigger', value: trigger }, { name: 'flowId', value: flow.id }, ...flow.resendTags] })                                                                                                                                 ↑
 11. If flow.ccAdmin → also send to settings.adminEmail (same email)
 12. createEmailLog({ status: 'sent', resendMessageId, sentAt: now, trigger, recipient, subject, context }) → logId                                     ↑
 13. payload.update({ collection: 'email-flows', id: flow.id, data: { lastTriggeredAt: now, totalSent: flow.totalSent + 1 } })
 14. Update subscriber: lastEmailSentAt = now, emailCount++                                                                                             ↑
 15. return { sent: true, logId }
                                                                                                                                                        ↑
 On Resend error: createEmailLog({ status: 'failed', error: err.message, ... }), re-throw.
                                                                                                                                                        ↑
 ---
 /src/lib/email-renderer.ts — Full Specification                                                                                                        ↑

 export async function renderEmail(                                                                                                                     ↑
   template: EmailTemplate,
   context: Record<string, string>,                                                                                                                     ↑
   settings: EmailSettings,
   isMarketing = false                                                                                                                                  ↑
 ): Promise<{ html: string }>
                                                                                                                                                        ↑
 1. Based on template.contentType:
   - maily → import { render } from '@maily-to/render'; const body = await render(template.mailyContent, { variables: context })                        ↑
   - richtext → import { convertLexicalToHTML } from '@payloadcms/richtext-lexical'; const body = convertLexicalToHTML({ data: template.content }) then substitueMergeTags(body, context)                                                                                                                      ↑
   - html → substituteMergeTags(template.htmlContent, context)
 2. substituteMergeTags(str, context): replace all {{key}} with context[key] ?? ''                                                                      ↑
 3. Wrap in branded shell:
 <!DOCTYPE html>                                                                                                                                        ↑
 <html>
 <body style="margin:0;padding:0;background:{{brandBgColor}};font-family:'Helvetica Neue',Arial,sans-serif">                                            ↑
   <div style="max-width:560px;margin:0 auto;padding:48px 24px">
     <!-- Logo header -->                                                                                                                               ↑
     <div style="text-align:center;margin-bottom:48px">
       <img src="{{logoUrl}}" height="32" alt="Sons of Mountains" />                                                                                    ↑
     </div>
     <!-- Body from template -->                                                                                                                        ↑
     {{body}}
     <!-- Footer -->                                                                                                                                    ↑
     <div style="border-top:1px solid #1a1a1a;padding-top:24px;margin-top:48px;text-align:center">
       {{footerText}}                                                                                                                                   ↑
       {{#if isMarketing}}
       <p><a href="{{unsubscribe_url}}" style="color:#555;font-size:11px;">{{unsubscribeText}}</a></p>                                                  ↑
       {{/if}}
       <!-- Social links -->                                                                                                                            ↑
     </div>
   </div>                                                                                                                                               ↑
 </body>
 </html>                                                                                                                                                ↑
 4. If isMarketing → add List-Unsubscribe header value to return object for Resend headers param
                                                                                                                                                        ↑
 ---
 /src/lib/segments.ts — All 23 Filter Types                                                                                                             ↑

 export type SegmentSubscriber = {                                                                                                                      ↑
   email: string
   firstName?: string                                                                                                                                   ↑
   lastName?: string
   unsubscribeToken?: string                                                                                                                            ↑
 }
                                                                                                                                                        ↑
 export async function resolveSegment(
   segmentId: string,                                                                                                                                   ↑
   payload: Payload
 ): Promise<SegmentSubscriber[]>                                                                                                                        ↑

 export async function resolveAudience(                                                                                                                 ↑
   segmentIds: string[],          // union if multiple
   audienceType: 'subscribers' | 'customers',                                                                                                           ↑
   payload: Payload
 ): Promise<SegmentSubscriber[]>  // deduplicated by email                                                                                              ↑

 Filter resolution logic per type                                                                                                                       ↑

 All rules in a segment are AND-combined (with operator: include/exclude).                                                                              ↑

 ┌──────────────────────┬────────────┬──────────────────────────────────────────────────────────────────────────────────────────────────────────────┐   ↑
 │         type         │   value    │                                                Implementation                                                │
 ├──────────────────────┼────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────┤   ↑
 │ all                  │ —          │ payload.find({ collection: 'subscribers', where: { status: eq 'active' }, limit: 10000 })                    │
 ├──────────────────────┼────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────┤   ↑
 │ tag                  │ newsletter │ where: { and: [{ status: eq 'active' }, { 'tags.tag': eq value }] }                                          │
 ├──────────────────────┼────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────┤   ↑
 │ destination_interest │ rila       │ Find destination by slug → filter subscribers where destinationInterests relationship contains that          │
 │                      │            │ destination ID                                                                                               │   ↑
 ├──────────────────────┼────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
 │ booking_history      │ rila-2025  │ Find trips/programs by slug → find Customers with paid Reg/Order for that item → filter subscribers by email │   ↑
 ├──────────────────────┼────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
 │ no_booking           │ —          │ All active subscribers whose email is NOT in any Customer with a paid Reg/Order                              │   ↑
 ├──────────────────────┼────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
 │ cold_lead            │ 30         │ no_booking AND subscribedAt <= now - N days                                                                  │   ↑
 ├──────────────────────┼────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
 │ subscription_monthly │ —          │ Find Customers with Subscription plan=monthly status=active → filter subscribers by email                    │   ↑
 ├──────────────────────┼────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
 │ subscription_annual  │ —          │ Same for annual                                                                                              │   ↑
 ├──────────────────────┼────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
 │ subscription_any     │ —          │ Same for any active subscription                                                                             │   ↑
 ├──────────────────────┼────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
 │ upcoming_trip        │ 7          │ Find Customers with paid Registration where trip.startDate between now and now+N days → filter subs by email │   ↑
 ├──────────────────────┼────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
 │ past_traveller       │ —          │ Find Customers with paid Registration where trip.endDate < now → filter subs by email                        │   ↑
 ├──────────────────────┼────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
 │ trip_region_bulgaria │ —          │ Find Customers whose paid trips include navSection=bulgaria                                                  │   ↑
 ├──────────────────────┼────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
 │ trip_region_abroad   │ —          │ Same for abroad                                                                                              │   ↑
 ├──────────────────────┼────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
 │ language             │ BG         │ Find Customers with preferredLang=value → filter subs by email                                               │   ↑
 ├──────────────────────┼────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
 │ high_value           │ 500        │ Find Customers where sum(paid orders/registrations totalAmount) > N → filter subs by email                   │   ↑
 ├──────────────────────┼────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
 │ has_discount         │ —          │ Find Customers with a DiscountCode (via Subscriptions.discountCode or DiscountCodes.referredBy) → filter     │   ↑
 │                      │            │ subs                                                                                                         │
 ├──────────────────────┼────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────┤   ↑
 │ on_waitlist          │ —          │ Find Waitlist entries status=waiting → match to subscribers by email                                         │
 ├──────────────────────┼────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────┤   ↑
 │ voucher_buyer        │ —          │ Find GiftVouchers with a customer relationship → match to subscribers by email                               │
 ├──────────────────────┼────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────┤   ↑
 │ voucher_recipient    │ —          │ Find GiftVouchers by recipientEmail → match to subscribers                                                   │
 ├──────────────────────┼────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────┤   ↑
 │ has_rated            │ —          │ Find Customers with ≥1 CustomerRating → filter subs                                                          │
 ├──────────────────────┼────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────┤   ↑
 │ no_rating            │ —          │ past_traveller result MINUS has_rated result                                                                 │
 ├──────────────────────┼────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────┤   ↑
 │ source_footer        │ —          │ where: { and: [{ status: eq 'active' }, { source: eq 'footer_form' }] }                                      │
 ├──────────────────────┼────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────┤   ↑
 │ source_booking       │ —          │ Same for booking                                                                                             │
 └──────────────────────┴────────────┴──────────────────────────────────────────────────────────────────────────────────────────────────────────────┘   ↑

 Exclude operator: compute the include set, then remove those emails from the base active-subscriber set.                                               ↑

 ---                                                                                                                                                    ↑
 Campaign Send Route — Full Logic
                                                                                                                                                        ↑
 /src/app/api/cron/send-campaigns/route.ts (full rewrite):
                                                                                                                                                        ↑
 1. Auth: verify CRON_SECRET header
 2. Load payload                                                                                                                                        ↑
 3. Find campaigns: status=scheduled, scheduledAt <= now, limit 10, depth 2
 4. For each campaign:                                                                                                                                  ↑
    a. Mark status=sending immediately (prevents double-processing)
    b. Load EmailSettings global                                                                                                                        ↑
    c. resolveAudience(campaign.segments, campaign.audienceType, payload)
       → if segments empty + audienceType=subscribers → all active subscribers                                                                          ↑
       → if segments empty + audienceType=customers → all Customers (emailVerified=true, status=active)
    d. For each recipient: build context                                                                                                                ↑
       → always: { firstName, lastName, email, siteUrl, siteName, currentYear }
       → isMarketing: { unsubscribe_url: siteUrl + /api/unsubscribe?token=unsubscribeToken }                                                            ↑
       → for customers (no unsubscribeToken): unsubscribe_url = siteUrl + /api/unsubscribe?email=<email> (separate route)
    e. renderEmail(template, context, settings, isMarketing=true) → html per recipient                                                                  ↑
    f. Build Resend batch array (one per recipient):
       { from, to, subject, html, headers: { 'List-Unsubscribe': unsubscribeUrl },                                                                      ↑
         tags: [{ name: 'campaignId', value: campaign.id }, { name: 'type', value: 'campaign' }] }
    g. Send in batches of 100 via getResend().batch.send(chunk)                                                                                         ↑
    h. Collect all messageIds from responses
    i. Create one EmailLog per recipient: { campaign: campaign.id, recipient, subject, status: 'sent', resendMessageId, sentAt, context }               ↑
    j. Update subscriber.lastEmailSentAt + emailCount++ for each subscriber recipient
    k. Update campaign: status=sent, sentAt, stats.sent, resendMessageIds, sentCount                                                                    ↑
 5. On any error per campaign: status=failed, log error
 6. Return { processed: N, total: campaigns.docs.length }                                                                                               ↑

 ---                                                                                                                                                    ↑
 Resend Webhook Handler — Full Specification
                                                                                                                                                        ↑
 /src/app/api/resend/webhook/route.ts
                                                                                                                                                        ↑
 Signature verification (built-in crypto, no new packages):
 const svixId = req.headers.get('svix-id')                                                                                                              ↑
 const svixTimestamp = req.headers.get('svix-timestamp')
 const svixSignature = req.headers.get('svix-signature')                                                                                                ↑
 const body = await req.text()
 const toSign = `${svixId}.${svixTimestamp}.${body}`                                                                                                    ↑
 const expected = crypto.createHmac('sha256', process.env.RESEND_WEBHOOK_SECRET!)
   .update(toSign).digest('base64')                                                                                                                     ↑
 // compare against svix-signature (v1,<base64>)
                                                                                                                                                        ↑
 Events and actions:
                                                                                                                                                        ↑
 ┌────────────────────────┬────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
 │         Event          │                                                       Action                                                       │        ↑
 ├────────────────────────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
 │ email.opened           │ Find EmailLog by resendMessageId, set status=opened, openedAt=now. If log.campaign exists → campaign.stats.opens++ │        ↑
 ├────────────────────────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
 │ email.clicked          │ Same → status=clicked, clickedAt=now. If campaign → stats.clicks++                                                 │        ↑
 ├────────────────────────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
 │ email.bounced          │ Same → status=bounced, bouncedAt=now. Find Subscriber by email → status=bounced. If campaign → stats.bounces++     │        ↑
 ├────────────────────────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
 │ email.complained       │ Same as bounced                                                                                                    │        ↑
 ├────────────────────────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
 │ email.unsubscribed     │ Find EmailLog → find Subscriber by email → status=unsubscribed. If campaign → stats.unsubscribes++                 │        ↑
 ├────────────────────────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
 │ email.delivery_delayed │ Log warning, no action                                                                                             │        ↑
 └────────────────────────┴────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
                                                                                                                                                        ↑
 ---
 Unsubscribe Route                                                                                                                                      ↑

 /src/app/api/unsubscribe/route.ts                                                                                                                      ↑

 GET /api/unsubscribe?token=<uuid>                                                                                                                      ↑
 1. Find Subscriber where unsubscribeToken = token, limit 1
 2. If not found → 404 HTML: "Link invalid or already unsubscribed."                                                                                    ↑
 3. If found → payload.update({ status: 'unsubscribed' })
 4. Return branded HTML response (no redirect):                                                                                                         ↑
    - Heading: "Отписан си успешно."
    - Subtext: "Няма да получаваш повече имейли от нас."                                                                                                ↑
    - Link back to homepage
    - Same inline CSS style as existing email templates (dark background)                                                                               ↑

 ---                                                                                                                                                    ↑
 Cron Jobs — Complete Specification
                                                                                                                                                        ↑
 All routes: GET, secured by Authorization: Bearer ${CRON_SECRET} header.
                                                                                                                                                        ↑
 /api/cron/trip-reminders
                                                                                                                                                        ↑
 Handles registration_trip_reminder_7d and registration_trip_reminder_1d.
                                                                                                                                                        ↑
 For each window (7d, 1d):
   Find Registrations where:                                                                                                                            ↑
     status IN ['paid', 'confirmed']
     reminderSent7d = false (or reminderSent1d = false)                                                                                                 ↑
     trip.startDate BETWEEN now+6d and now+8d (or now+0d and now+2d)
   depth: 2 (populate trip)                                                                                                                             ↑
   limit: 500
   For each:                                                                                                                                            ↑
     sendFlow(trigger, { email, firstName }, { tripTitle, tripStartDate, tripLocation, ... }, payload)
     payload.update({ id, data: { reminderSent7d: true } })                                                                                             ↑

 /api/cron/balance-overdue                                                                                                                              ↑

 Handles registration_balance_overdue.                                                                                                                  ↑

 Find Registrations where:                                                                                                                              ↑
   status = 'paid'
   paymentMode = 'deposit'                                                                                                                              ↑
   remainingBalance > 0
   remainingDueDate < now                                                                                                                               ↑
   reminderSent1d = true   (they've already had the reminders)
 For each: sendFlow('registration_balance_overdue', ...)                                                                                                ↑

 /api/cron/review-requests                                                                                                                              ↑

 Handles registration_review_request.                                                                                                                   ↑

 Find Registrations where:                                                                                                                              ↑
   status IN ['paid', 'confirmed']
   trip.endDate BETWEEN now-4d and now-2d   (3 days after end ± 1d window)                                                                              ↑
 For each:
   Check: no CustomerRating exists for this customer + this trip                                                                                        ↑
   Check: no EmailLog with trigger=registration_review_request + recipient=email
   If both clear: sendFlow(...)                                                                                                                         ↑

 /api/cron/subscription-renewal                                                                                                                         ↑

 Handles subscription_renewal_3d.                                                                                                                       ↑

 Find Subscriptions where:                                                                                                                              ↑
   status = 'active'
cancelAtPeriodEnd = false                                                                                                                            ↑
currentPeriodEnd BETWEEN now+2d and now+4d
 For each:                                                                                                                                              ↑
   Check: no EmailLog for subscription_renewal_3d + customer email this period
   sendFlow('subscription_renewal_3d', { email: customer.email, firstName }, { subscriptionPlan, subscriptionPeriodEnd, billingUpdateUrl }, payload)    ↑

 /api/cron/voucher-expiry                                                                                                                               ↑

 Handles gift_voucher_expiry_7d.                                                                                                                        ↑

 Find GiftVouchers where:                                                                                                                               ↑
   status = 'active'
   expiresAt BETWEEN now+6d and now+8d                                                                                                                  ↑
 For each:
   Check: no EmailLog for gift_voucher_expiry_7d + recipientEmail                                                                                       ↑
   sendFlow('gift_voucher_expiry_7d', { email: recipientEmail, firstName: recipientName }, { voucherCode, voucherAmount, voucherExpiry }, payload)
                                                                                                                                                        ↑
 /api/cron/waitlist-expire
                                                                                                                                                        ↑
 Handles waitlist_expired.
                                                                                                                                                        ↑
 Find Waitlist entries where:
   status = 'notified'                                                                                                                                  ↑
   notifiedAt < now - 48h   (offer window expired)
 For each:                                                                                                                                              ↑
   payload.update({ status: 'expired' })
   sendFlow('waitlist_expired', { email, firstName: name }, { itemTitle, bookNowUrl }, payload)                                                         ↑

 /api/cron/delayed-emails                                                                                                                               ↑

 Picks up queued EmailLogs and sends them.                                                                                                              ↑

 Find EmailLogs where:                                                                                                                                  ↑
   status = 'queued'
   scheduledFor <= now                                                                                                                                  ↑
   limit: 100
 For each log:                                                                                                                                          ↑
   Load EmailFlow by log.flow
   Load template, settings                                                                                                                              ↑
   Re-render email from log.context
   Send via Resend                                                                                                                                      ↑
   Update log: status=sent, sentAt=now, resendMessageId
   Update flow: totalSent++, lastTriggeredAt                                                                                                            ↑

 Existing crons — refactored                                                                                                                            ↑

 /src/lib/cron/balance-reminders.ts (existing) — refactor to:                                                                                           ↑
 - Handle both registrations and orders (orders also has reminderSent7d/reminderSent1d)
 - Call sendFlow('registration_balance_due_7d' or 'order_balance_due_7d', ...) instead of inline send                                                   ↑

 /src/lib/cron/abandoned-cart.ts (existing) — refactor to:                                                                                              ↑
 - 1h: sendFlow('abandoned_cart_1h', ...)
 - 24h: separate check, sendFlow('abandoned_cart_24h', ...)                                                                                             ↑

 ---                                                                                                                                                    ↑
 /src/lib/stripe-webhooks.ts Refactor
                                                                                                                                                        ↑
 Replace all 9 inline resend.emails.send() calls with sendFlow() calls. Import sendFlow from @/lib/email-flows.
                                                                                                                                                        ↑
 ┌──────────────────────────────────┬──────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
 │            Line range            │                                                 Replacement                                                  │    ↑
 ├──────────────────────────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
 │ 25–30 (loyalty tier upgrade)     │ await sendFlow('loyalty_tier_upgrade', { email: cust.email, firstName }, { loyaltyTier, previousTier,        │    ↑
 │                                  │ loyaltyPoints, loyaltyTierLabel }, payload)                                                                  │
 ├──────────────────────────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────┤    ↑
 │ 45–50 (waitlist spot)            │ await sendFlow('waitlist_spot_available', { email: entry.email, firstName: entry.name }, { itemTitle,        │
 │                                  │ bookNowUrl, waitlistPosition }, payload)                                                                     │    ↑
 ├──────────────────────────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
 │ 382–400 (gift vouchers, two      │ Removed — handled by GiftVouchers.ts afterChange hook                                                        │    ↑
 │ sends)                           │                                                                                                              │
 ├──────────────────────────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────┤    ↑
 │ 546–550 (sub payment failed,     │ await sendFlow('subscription_payment_failed' or 'subscription_dunning_2' or '_3' based on dunningEmailsSent, │
 │ dunning)                         │  ...)                                                                                                        │    ↑
 ├──────────────────────────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
 │ 558–562 (sub payment recovered)  │ await sendFlow('subscription_payment_recovered', ...)                                                        │    ↑
 ├──────────────────────────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
 │ 643–648 (order balance charge    │ await sendFlow('order_balance_failed', ...)                                                                  │    ↑
 │ failed)                          │                                                                                                              │
 ├──────────────────────────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────┤    ↑
 │ 722–727 (registration balance    │ await sendFlow('registration_balance_failed', ...)                                                           │
 │ charge failed)                   │                                                                                                              │    ↑
 └──────────────────────────────────┴──────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
                                                                                                                                                        ↑
 Also: add subscription.created handler to fire sendFlow('subscription_created', ...) with welcome context.
 Also: add subscription.deleted handler to fire sendFlow('subscription_cancelled', ...).                                                                ↑

 ---                                                                                                                                                    ↑
 /src/lib/auth.ts Refactor
                                                                                                                                                        ↑
 Replace the sendEmail function:
                                                                                                                                                        ↑
 // Before: creates new Resend() inline
 async function sendEmail(to, subject, html) {                                                                                                          ↑
   const resend = new Resend(process.env.RESEND_API_KEY ?? 'placeholder')
   await resend.emails.send({ from, to, subject, html })                                                                                                ↑
 }
                                                                                                                                                        ↑
 // After: use sendFlow (when payload is available) or getResend() + renderEmail as fallback
 // The auth hooks don't have payload access easily, so:                                                                                                ↑
 // Option: use getResend() directly but render through a minimal branded shell
 // The flow will be configured in EmailFlows with trigger=auth_password_reset / auth_email_verification                                                ↑
 // Pass the url as context: { resetUrl } or { verifyUrl }
                                                                                                                                                        ↑
 Since auth.ts initializes before Payload, the cleanest approach:
 - Keep using getResend() directly (no sendFlow — avoids circular import)                                                                               ↑
 - But render through renderEmail using the configured EmailFlow's template looked up by trigger
 - If no flow configured → fall back to a minimal branded HTML wrapper (not raw <p> tags)                                                               ↑

 ---                                                                                                                                                    ↑
 Seed Script — /src/scripts/seed-email-flows.ts
                                                                                                                                                        ↑
 Creates 41 EmailFlow docs (all enabled: false, no template assigned) on first run:
                                                                                                                                                        ↑
 const flows = [
   { label: 'Registration: Pending (request received)', trigger: 'registration_pending' },                                                              ↑
   { label: 'Registration: Paid — Full Payment', trigger: 'registration_paid_full' },
   { label: 'Registration: Paid — Deposit', trigger: 'registration_paid_deposit' },                                                                     ↑
   // ... all 41
 ]                                                                                                                                                      ↑
 // For each: check if exists, skip if so, create if not
                                                                                                                                                        ↑
 Run: bun src/scripts/seed-email-flows.ts
                                                                                                                                                        ↑
 ---
 Schema Migrations                                                                                                                                      ↑

 bun payload migrate:create add-email-flows-and-logs                                                                                                    ↑
 bun payload migrate:create add-email-settings-global
 bun payload migrate:create add-subscriber-email-fields                                                                                                 ↑
 bun payload migrate:create add-campaign-fields-v2          # audienceType, segments, featuredTrips/Programs/Destinations, testEmail, etc.
 bun payload migrate:create email-template-maily            # contentType, mailyContent, htmlContent                                                    ↑
 bun payload migrate
                                                                                                                                                        ↑
 ---
 Complete File List                                                                                                                                     ↑

 New collections (2):                                                                                                                                   ↑
 - src/payload/collections/EmailFlows.ts
 - src/payload/collections/EmailLogs.ts                                                                                                                 ↑

 New global (1):                                                                                                                                        ↑
 - src/payload/globals/EmailSettings.ts
                                                                                                                                                        ↑
 New Payload admin component (1):
 - src/payload/components/MailyEditor.tsx                                                                                                               ↑

 New library (5):                                                                                                                                       ↑
 - src/lib/email-flows.ts
 - src/lib/email-renderer.ts                                                                                                                            ↑
 - src/lib/email-logger.ts
 - src/lib/segments.ts                                                                                                                                  ↑
 - src/lib/subscriber-upsert.ts
                                                                                                                                                        ↑
 New cron lib (6):
 - src/lib/cron/trip-reminders.ts                                                                                                                       ↑
 - src/lib/cron/balance-overdue.ts
 - src/lib/cron/review-requests.ts                                                                                                                      ↑
 - src/lib/cron/subscription-renewal.ts
 - src/lib/cron/voucher-expiry.ts                                                                                                                       ↑
 - src/lib/cron/waitlist-expire.ts
                                                                                                                                                        ↑
 New cron routes (7):
 - src/app/api/cron/trip-reminders/route.ts                                                                                                             ↑
 - src/app/api/cron/balance-overdue/route.ts
 - src/app/api/cron/review-requests/route.ts                                                                                                            ↑
 - src/app/api/cron/subscription-renewal/route.ts
 - src/app/api/cron/voucher-expiry/route.ts                                                                                                             ↑
 - src/app/api/cron/waitlist-expire/route.ts
 - src/app/api/cron/delayed-emails/route.ts                                                                                                             ↑

 New API routes (2):                                                                                                                                    ↑
 - src/app/api/unsubscribe/route.ts
 - src/app/api/resend/webhook/route.ts                                                                                                                  ↑
 - src/app/api/campaigns/[id]/test/route.ts
                                                                                                                                                        ↑
 New email components (17):
 - src/emails/RegistrationConfirmationEmail.tsx                                                                                                         ↑
 - src/emails/TripReminderEmail.tsx
 - src/emails/CancellationEmail.tsx                                                                                                                     ↑
 - src/emails/RefundEmail.tsx
 - src/emails/BalanceOverdueEmail.tsx                                                                                                                   ↑
 - src/emails/CheckInEmail.tsx
 - src/emails/CertificateEmail.tsx                                                                                                                      ↑
 - src/emails/ShippingEmail.tsx
 - src/emails/GiftVoucherEmail.tsx                                                                                                                      ↑
 - src/emails/GiftVoucherPurchaseEmail.tsx
 - src/emails/VoucherExpiryEmail.tsx                                                                                                                    ↑
 - src/emails/SubscriptionWelcomeEmail.tsx
 - src/emails/SubscriptionPaymentFailedEmail.tsx                                                                                                        ↑
 - src/emails/SubscriptionCancelledEmail.tsx
 - src/emails/SubscriptionRenewalReminderEmail.tsx                                                                                                      ↑
 - src/emails/WaitlistExpiredEmail.tsx
 - src/emails/ReviewRequestEmail.tsx                                                                                                                    ↑

 Seed script (1):                                                                                                                                       ↑
 - src/scripts/seed-email-flows.ts
                                                                                                                                                        ↑
 Modified (10):
 - src/payload/collections/Subscribers.ts                                                                                                               ↑
 - src/payload/collections/Segments.ts
 - src/payload/collections/Campaigns.ts                                                                                                                 ↑
 - src/payload/collections/EmailTemplates.ts
 - src/payload/collections/Registrations.ts                                                                                                             ↑
 - src/payload/collections/Orders.ts
 - src/payload/collections/GiftVouchers.ts                                                                                                              ↑
 - src/payload/payload.config.ts
 - src/app/api/cron/send-campaigns/route.ts                                                                                                             ↑
 - src/lib/cron/balance-reminders.ts
 - src/lib/cron/abandoned-cart.ts                                                                                                                       ↑
 - src/lib/stripe-webhooks.ts
 - src/app/api/booking/route.ts                                                                                                                         ↑
 - src/lib/auth.ts
                                                                                                                                                        ↑
 ---
 Environment Variables                                                                                                                                  ↑

 env                                                                                                                                                    ↑
 RESEND_WEBHOOK_SECRET=whsec_...
 # Already present: RESEND_API_KEY, RESEND_FROM_EMAIL, CRON_SECRET                                                                                      ↑

 Register webhook URL in Resend dashboard: https://sonsofmountains.com/api/resend/webhook                                                               ↑
 Events to subscribe: email.opened, email.clicked, email.bounced, email.complained, email.unsubscribed, email.delivery_delayed
                                                                                                                                                        ↑
 ---
 Implementation Order                                                                                                                                   ↑

 1. bun add @maily-to/core @maily-to/render                                                                                                             ↑
 2. EmailFlows + EmailLogs collections + EmailSettings global → register in payload.config.ts
 3. EmailTemplates — add contentType, mailyContent field, htmlContent field                                                                             ↑
 4. Subscribers — add unsubscribeToken, lastEmailSentAt, emailCount
 5. Segments — expand filterRules type options (23), add operator, description, previewCount                                                            ↑
 6. Campaigns — add audienceType, segments hasMany, fromName/Email/replyTo, testEmail, resendMessageIds, sentCount, stats.clicks
 7. Run all migrations: bun payload migrate:create ... && bun payload migrate                                                                           ↑
 8. MailyEditor.tsx component
 9. subscriber-upsert.ts                                                                                                                                ↑
 10. /api/unsubscribe/route.ts
 11. segments.ts (23 filter types with include/exclude operator)                                                                                        ↑
 12. email-logger.ts
 13. email-renderer.ts                                                                                                                                  ↑
 14. email-flows.ts (sendFlow with all options)
 15. /api/cron/send-campaigns/route.ts rewrite                                                                                                          ↑
 16. /api/resend/webhook/route.ts
 17. /api/campaigns/[id]/test/route.ts                                                                                                                  ↑
 18. Registrations.ts afterChange hook (9 immediate triggers)
 19. Orders.ts afterChange hook (5 triggers)                                                                                                            ↑
 20. GiftVouchers.ts afterChange hook (3 triggers) — remove from stripe-webhooks
. stripe-webhooks.ts — replace all 9 inline sends with sendFlow()                                                                                    ↑
. booking/route.ts — replace inline send with sendFlow('registration_pending', ...)
. auth.ts — refactor email sends
. balance-reminders.ts — refactor (cover orders too)
. abandoned-cart.ts — refactor (add 24h nudge)
. 6 new cron lib files + 7 cron route files
. 17 new email component files
. Seed script → bun src/scripts/seed-email-flows.ts

-
rification Checklist

[ ] EmailSettings global in Payload admin — configure from/brand/testMode
[ ] MailyEditor opens in EmailTemplates (contentType=maily), drag-drop blocks work, variable picker shows all 43 tags
[ ] 41 EmailFlow docs seeded (all disabled) — visible in Payload admin
[ ] Assign template to registration_paid_full → enabled=true → simulate paid registration → email arrives, EmailLog created with full context snapshot
[ ] Set enabled=false → simulate again → no email, no log
[ ] EmailSettings.testMode=true + testEmail set → all sends redirect to testEmail
[ ] Segment type no_booking → subscriberCount = correct count
[ ] Segment with operator=exclude on a tag → exclusion works
[ ] Campaign with 2 segments (union) → resolveAudience deduplicates by email
[ ] Campaign "Send Test" → POST /api/campaigns/[id]/test → preview email at testEmail
[ ] Scheduled campaign → runs at scheduledAt → Resend batch shows campaignId tag
[ ] Resend webhook email.opened → EmailLog status=opened, campaign.stats.opens++
 - [ ] Resend webhook email.bounced → subscriber.status=bounced
 - [ ] GET /api/unsubscribe?token=X → status=unsubscribed, branded HTML returned
 - [ ] EmailFlow delayMinutes=60 → EmailLog queued → delayed-emails cron sends after 1h
 - [ ] GiftVoucher created (isGift=true) → recipient gets voucher email, sender gets confirmation email
 - [ ] Subscription created in Stripe → subscription_created flow fires → welcome email
 - [ ] dunningEmailsSent=1 → subscription_dunning_2 flow fires (not _failed again)
 - [ ] Auth password reset → branded HTML (not raw <p> tag) via configured flow or fallback shell
 - [ ] Trip reminder cron: only registrations in correct date window, only those with reminderSent7d=false
 - [ ] Review request cron: skips if CustomerRating already exists for that customer+trip
 - [ ] Maily built-in blocks all work: Logo, Text, Button, Image, Divider, Spacer, Section, Columns, Repeat, Show If, Link Card, Footer
 - [ ] {{featuredTrips}} variable is populated in Repeat block: select 3 trips in a Campaign → email shows 3 trip cards with title/dates/location/price/CTA
 - [ ] Same for {{featuredPrograms}} and {{featuredDestinations}}
 - [ ] {{upcomingTrips}} auto-populated in campaigns even without selection (next 3 active trips)
 - [ ] Segment type destination_specific with value=rila → correctly filters subscribers who have rila in their destinationInterests
 - [ ] Segment type program_type_yoga → filters subscribers who have a paid Program booking with type=Yoga
 - [ ] early_bird_buyer segment → filters customers who registered during a trip's earlyBirdUntil window