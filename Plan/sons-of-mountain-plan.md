Plan: Clone panicframe.com — Full Platform

 Context

 Build a 100% identical clone of panicframe.com — every page, section, animation, component. On top: visual page builder
 (Elementor-style), e-commerce bookings, email marketing — all in one /admin. Runs on Hetzner (self-hosted). Instant backend→frontend
 sync. Lighthouse 100, perfect SEO.

 ---
 Tech Stack (2026)

 ┌────────────────────────────┬───────────────────────────────────────────────────────────────────────────────────────┐
 │           Layer            │                                        Choice                                         │
 ├────────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────┤
 │ Framework                  │ Next.js 16+ (App Router, PPR, Turbopack)                                              │
 ├────────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────┤
 │ Runtime                    │ React 19 — RSC by default                                                             │
 ├────────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────┤
 │ Language                   │ TypeScript 5.x                                                                        │
 ├────────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────┤
 │ Styling                    │ Tailwind CSS v4                                                                       │
 ├────────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────┤
 │ Animations                 │ Motion v12 (motion/react)                                                             │
 ├────────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────┤
 │ CMS + Admin + Page Builder │ Payload CMS v3                                                                        │
 ├────────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────┤
 │ Database                   │ PostgreSQL (self-hosted on Hetzner, Docker container)                                 │
 ├────────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────┤
 │ Cache (ISR)                │ Redis (self-hosted, Docker) + @neshca/cache-handler for Next.js ISR                   │
 ├────────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────┤
 │ Payments                   │ Stripe (Checkout Sessions + Webhooks)                                                 │
 ├────────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────┤
 │ Email sending              │ Resend                                                                                │
 ├────────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────┤
 │ Email templates            │ React Email                                                                           │
 ├────────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────┤
 │ Forms                      │ Custom-built (React Hook Form + Zod + Server Actions — no Tally, no third-party)      │
 ├────────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────┤
 │ Media/Storage              │ Local filesystem on Hetzner via Payload media upload (backed by Nginx static serving) │
 ├────────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────┤
 │ Auth                       │ Payload built-in                                                                      │
 ├────────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────┤
 │ Deployment                 │ Self-hosted Hetzner — Docker Compose + Nginx (reverse proxy, SSL via Let's Encrypt)   │
 ├────────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────┤
 │ CI/CD                      │ GitHub Actions → SSH → docker compose pull && docker compose up -d                    │
 └────────────────────────────┴───────────────────────────────────────────────────────────────────────────────────────┘

 Why PostgreSQL?

 Relational DB is the right fit: trips relate to destinations, orders relate to trips and users, subscribers relate to segments,
 campaigns relate to templates and segments. Complex join queries (e.g., "orders for all trips in Uganda", "active subscribers tagged
 'adventure'") are natural SQL. Payload v3 has a first-class PostgreSQL adapter.

 ---
 Hetzner Self-Hosted Deployment

 # docker-compose.yml (on Hetzner)
 services:
   app:          # Next.js 16 + Payload CMS (same process)
   postgres:     # PostgreSQL 16
   redis:        # Redis 7 (Next.js ISR cache handler)
   nginx:        # Reverse proxy, SSL termination, static media serving

 - Nginx: terminates SSL (Let's Encrypt / Certbot), proxies to Next.js, serves /media static files directly
 - Volumes: postgres data, redis data, media uploads — all persisted
 - Cron: Linux system cron on Hetzner calls /api/cron/send-campaigns every 5 min (replaces Vercel Cron)
 - On-Demand ISR: @neshca/cache-handler writes Next.js page cache to Redis → revalidatePath/revalidateTag works reliably on single
 server; survives app restarts

 ---
 Instant Backend→Frontend Sync

 Editor saves in Payload admin
         ↓
 Payload afterChange hook (server-side)
         ↓
 revalidatePath('/') + revalidatePath('/destinations') + revalidateTag('trips') etc.
         ↓
 Next.js invalidates Redis cache entry
         ↓
 Next request regenerates page → served fresh

 Live Preview: while editing, Payload opens an iframe of the frontend in Draft Mode — fetches directly from Payload DB, bypasses all
 cache. Changes appear as you type.

 ---
 Complete Page List (100% match)

 Main site

 ┌──────────────────────┬────────────────────────────────────────┐
 │        Route         │              Description               │
 ├──────────────────────┼────────────────────────────────────────┤
 │ /                    │ Home                                   │
 ├──────────────────────┼────────────────────────────────────────┤
 │ /destinations        │ Destinations grid                      │
 ├──────────────────────┼────────────────────────────────────────┤
 │ /destinations/[slug] │ Destination detail                     │
 ├──────────────────────┼────────────────────────────────────────┤
 │ /calendar            │ Calendar by month                      │
 ├──────────────────────┼────────────────────────────────────────┤
 │ /stories             │ Stories listing                        │
 ├──────────────────────┼────────────────────────────────────────┤
 │ /stories/[slug]      │ Story article                          │
 ├──────────────────────┼────────────────────────────────────────┤
 │ /gallery             │ Gallery with "Виж всички снимки →" CTA │
 ├──────────────────────┼────────────────────────────────────────┤
 │ /photos              │ Full photo grid                        │
 ├──────────────────────┼────────────────────────────────────────┤
 │ /blog                │ Blog listing                           │
 ├──────────────────────┼────────────────────────────────────────┤
 │ /blog/[slug]         │ Blog post                              │
 ├──────────────────────┼────────────────────────────────────────┤
 │ /about               │ About us                               │
 ├──────────────────────┼────────────────────────────────────────┤
 │ /contact             │ Contact + FAQ accordion                │
 ├──────────────────────┼────────────────────────────────────────┤
 │ /gift                │ Gift voucher order page                │
 ├──────────────────────┼────────────────────────────────────────┤
 │ /legal/terms         │ Terms                                  │
 ├──────────────────────┼────────────────────────────────────────┤
 │ /legal/cookies       │ Privacy policy                         │
 └──────────────────────┴────────────────────────────────────────┘

 NoLimit sub-site (own navbar, own branding)

 ┌─────────────────────┬───────────────────────────────────────────────────────────────────────────────────────────────────┐
 │        Route        │                                            Description                                            │
 ├─────────────────────┼───────────────────────────────────────────────────────────────────────────────────────────────────┤
 │ /nolimit            │ Yacht Festival main — hero, 4 feature sections (Islands & Beaches, Wild Parties, Food, Community) │
 ├─────────────────────┼───────────────────────────────────────────────────────────────────────────────────────────────────┤
 │ /nolimit/itinerary  │ Route map — day by day, photo gallery grid                                                        │
 ├─────────────────────┼───────────────────────────────────────────────────────────────────────────────────────────────────┤
 │ /nolimit/catamarans │ Catamaran specs and cabins                                                                        │
 ├─────────────────────┼───────────────────────────────────────────────────────────────────────────────────────────────────┤
 │ /nolimit/gallery    │ Festival photo gallery                                                                            │
 ├─────────────────────┼───────────────────────────────────────────────────────────────────────────────────────────────────┤
 │ /nolimit/nextgen    │ NextGen section                                                                                   │
 ├─────────────────────┼───────────────────────────────────────────────────────────────────────────────────────────────────┤
 │ /nolimit/sign-up    │ Registration/booking form                                                                         │
 └─────────────────────┴───────────────────────────────────────────────────────────────────────────────────────────────────┘

 NoLimit navbar: [Яхтен Фестивал] [Програма] [Катамарани] [Галерия] [NextGen] [Panicframe.com] [Запиши се]

 Empire of Corals (co-branded Panic Frame + EXE)

 ┌─────────┬───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
 │  Route  │                                                      Description                                                      │
 ├─────────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
 │ /empire │ "Първият в света мегаяхтен фестивал за електронна музика" — 14-21 ноември 2026, Хургада, Египет. 1 чартър, 6          │
 │         │ мегаяхти, 6 артисти. Photo carousel, charter flight section, music section, lineup                                    │
 └─────────┴───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘

 Empire branding: Panic Frame logo + EXE Group logo (exegroup.org). Separate visual identity within site.

 ---
 Exact Site Anatomy

 Navigation (main site — all pages)

 Desktop (split around centered logo):
 [ДЕСТИНАЦИИ] [КАЛЕНДАР] [ИСТОРИИ]  [LOGO]  [ГАЛЕРИЯ] [БЛОГ] [ЗА НАС] [КОНТАКТИ]  [BG▾] [IG icon] [FB icon]
 - Logo dark bg: framerusercontent.com/images/sQ2kYkKWnh9M8mP6NCkfgP6bXuE.png
 - Logo light bg: framerusercontent.com/images/mh8zgg6AClf8FnfsGkbzfBNee0.png
 - Mobile: hamburger → full-screen overlay with same links
 - Behavior: backdrop blur + subtle bg on scroll; hide-on-scroll-down / show-on-scroll-up

 Homepage — All Sections (top → bottom)

 1. Full-viewport hero: layered/duplicated animated headline "Преоткривай света с нас!" (staggered word-by-word, translateY +
 opacity), subtitle "Пътувай с Panic Frame там, където комфортът среща приключението.", CTA button "Виж всички дестинации →" →
 /destinations
 2. Horizontal destination scroll carousel: draggable (Motion drag + inertia). Cards: portrait image, destination name (large white),
 month label, "САМО X МЕСТА" badge (pill). Auto-repeats for infinite loop. Left/right arrow buttons.
   - Азорски Острови (САМО 3 МЕСТА, юли), Уганда (август), Бразилия (септември), etc.
 3. "ЗАЩО ДА ПЪТУВАШ С НАС?": company pitch — "Ние сме тарзан турист и организираме пътешествия на трудно достъпни места..." with CTA
 "Научи повече за нас →" → /about
 4. Media appearances: clickable logos — BTV, BNT, YouTube
 5. "Кои сме ние?": team section
 6. "PANIC STORIES" section heading: horizontal scrolling story card carousel with back/forward arrow buttons. Each card: portrait
 image, title, author avatar (circle), author name, "за" + destination
   - Stories shown: Венецуела (Бояна Шарлопова), Тенерифе solo (Константин), Мароко Singles Only (Ивайла), Тенерифе group (Галена),
 Етиопия (Александър Станков)
 7. "ХУРГАДА, ЕГИПЕТ" promo block → /empire or /nolimit
 8. Full-bleed landscape destination showcase (Намибия джипове etc.)

 Destination Detail Page — All Sections

 1. Full-bleed hero image (100vh), destination name H1, intro text
 2. Photo gallery strip (5-6 portrait images, horizontal scroll)
 3. "Защо [destination]?" — icon + H2 + prose (why visit)
 4. "За теб ли е?" — visual fitness bars: Трудност / Комфорт / Природа / Култура
 5. Long-form description
 6. Group photo
 7. "Предстоящи пътувания" (Upcoming trips):
   - Trip card: dates, "X МЕСТА" badge, "ЗАПИШИ СЕ" CTA → opens custom booking popup
   - Process steps: 1. Fill form → 2. We call you → 3. Contracts + data → 4. Payment
   - Legal consent: terms + privacy policy links
 8. Itinerary section (day-by-day)
 9. "ЗАЩО ДА ПЪТУВАШ С НАС?" trust section (repeated)

 Story Page Structure

 - Destination tag link at top → /destinations/[slug]
 - H1 title
 - Author avatar + name
 - Hero portrait image
 - Interview-format article (H3 questions + prose answers)
 - Related destinations / more stories

 Gift Voucher Page (/gift)

 - Hero image (full width)
 - H1: "Подари нещо, което остава завинаги."
 - Description: vouchers for any value, any destination
 - Custom order form (in-house, no third-party):
   - Voucher amount, preferred destinations, buyer name/email, recipient name, message
   - Submit → Server Action → save order → email via Resend
 - Payment: bank transfer (note: "За момента приемаме плащания само по банков път")
 - Upcoming destinations strip (reused carousel component)

 Footer — Exact Structure

 Section 1: Email subscription
   "Абонирай се — Научавай първи за предстоящи пътешествия, отстъпки и събития."
   [Email input] [Абонирай се button]
   Privacy consent text

 Section 2: Social
   "Последвай ни!"
   [FB icon link] [IG icon link]

 Section 3: Two columns
   ПЪТУВАЙ С НАС          НАВИГАЦИЯ
   Мароко / май           Дестинации
   Азорски Острови / юли  Календар
   Уганда / август        Истории
   Бразилия / септември   Галерия
   [... all destinations] Блог / За нас
   Empire of Corals       Яхтен Фестивал
                          Подари ваучер
                          Контакти

 [Animated logo GIF]: framerusercontent.com/images/xAELSxhOFDDnqiDsAfvMhSuuw.png

 © 2018-2026 Паник Фрейм енд Травел
 Номер на лиценз: РК-01-8245 / 28.07.2022 (links to PDF)
 Номер на застрахователна полица: 03700100005995 / 31.08.2025 (links to PDF)
 [Общи условия] [Политика за поверителност]
 Дизайн и разработка от KICKFLIP → kickflip.design

 ---
 Design Tokens

 - Background: #0a0a0a
 - Text: #ffffff
 - Font: Space Grotesk (primary, geometric sans matching the site's look)
 - All images via next/image with remotePatterns: framerusercontent.com
 - Destination card: portrait aspect ratio, name overlaid on bottom, month in muted text
 - Badge "САМО X МЕСТА": small pill, white bg + dark text or colored
 - Badge "НЯМА МЕСТА": greyed/muted — sold out
 - Tag "Singles Only": small label on trip cards

 ---
 Animations (Motion v12)

 - Hero: per-word stagger (translateY + opacity), duplicated text layers for depth
 - Destination carousel: drag="x" + dragMomentum, auto-scroll infinite loop via useAnimationFrame
 - Story carousel: same drag pattern + arrow button nav
 - Scroll reveal: whileInView={{ opacity: 1, y: 0 }} + viewport={{ once: true }}
 - Card hover: whileHover={{ scale: 1.02 }}
 - Badge entrance: initial={{ scale: 0 }} animate={{ scale: 1 }}
 - Navbar: useScroll → backdrop blur class, hide/show on direction change
 - Mobile overlay menu: AnimatePresence slide-in from right or top

 ---
 Visual Page Builder (Elementor-equivalent in /admin)

 Every page has a layout block array. Admin UI: drag to reorder, add from palette, configure styles. Payload Live Preview shows exact
 frontend rendering in real time.

 Blocks: HeroBlock, DestinationCarouselBlock, TextBlock, RichTextBlock, ImageGalleryBlock, CalendarBlock, FAQBlock, CTABlock,
 StatsBlock, TripListingBlock, StoriesBlock, TeamBlock, MediaLogosBlock, EmbedBlock, QuoteBlock, VideoBlock

 Each block: full style controls — bg color, text color, padding, font-size override, layout variant (full-width / contained /
 two-column / centered).

 ---
 Blog (Block-Based, SEO Perfect)

 Blog posts use same block page builder (not just a text area). Per-post metadata, OG image via @vercel/og, BlogPosting JSON-LD,
 reading time, categories, tags. Auto-sitemap with lastmod.

 ---
 E-commerce (Stripe + Custom Booking Form)

 Custom booking popup (replaces Tally — 100% in-house):
 - 420px wide overlay, dark bg, close button, step indicator
 - Step 1: trip pre-filled, first name, last name, email, phone
 - Step 2: participant count, dietary notes, questions
 - Step 3: review + agree to terms/privacy → Submit
 - Server Action → save Order (status: pending) → send confirmation email → optionally redirect to Stripe for deposit payment

 Stripe flow: Checkout Session → webhook → mark Order paid → Resend email → revalidateTag('trips') updates seat counts on frontend
 instantly.

 ---
 Email Marketing (inside /admin)

 Collections: Subscribers (email, name, status, tags, source), Segments (filter rules: by tag / destination interest / booking
 history), EmailTemplates (block-based visual builder with React Email preview), Campaigns (template + segment + schedule → Resend
 bulk API).

 Linux cron on Hetzner → /api/cron/send-campaigns every 5 min. Resend webhooks track opens/bounces/unsubscribes.

 ---
 SEO (Lighthouse 100)

 - All pages SSG + On-Demand ISR
 - generateMetadata per page from Payload content
 - Dynamic OG images via @vercel/og
 - sitemap.ts — all pages, destinations, blog, stories with lastmod
 - robots.ts — disallow /admin
 - JSON-LD: TouristAttraction, TouristTrip, BlogPosting, Organization, WebSite
 - Canonical URLs, hreflang="bg"
 - next/image: WebP/AVIF, explicit dimensions, priority on above-fold
 - next/font Space Grotesk with display: swap
 - RSC everywhere, client components lazy-loaded only where interaction needed

 ---
 Project Structure

 sons-of-mountains/
   docker-compose.yml          — postgres, redis, app, nginx containers
   nginx/nginx.conf            — reverse proxy config, SSL, /media static
   src/
     app/
       (frontend)/
         page.tsx                     — Home
         destinations/page.tsx
         destinations/[slug]/page.tsx
         calendar/page.tsx
         stories/page.tsx + [slug]/page.tsx
         gallery/page.tsx + photos/page.tsx
         blog/page.tsx + [slug]/page.tsx
         about/page.tsx
         contact/page.tsx
         gift/page.tsx
         nolimit/page.tsx + itinerary/page.tsx + catamarans/page.tsx + gallery/page.tsx + nextgen/page.tsx + sign-up/page.tsx
         empire/page.tsx
         shop/page.tsx + [tripId]/page.tsx + success/page.tsx
         legal/terms/page.tsx + cookies/page.tsx
         sitemap.ts + robots.ts
       (payload)/
         admin/[[...segments]]/page.tsx
         api/[...slug]/route.ts
       api/
         checkout/route.ts
         webhooks/stripe/route.ts + resend/route.ts
         subscribe/route.ts + unsubscribe/route.ts
         cron/send-campaigns/route.ts
     payload/
       collections/ — Pages, Destinations, Trips, Stories, BlogPosts, BlogCategories,
                      Media, Orders, Users, Subscribers, Segments, EmailTemplates, Campaigns
       blocks/       — all block field schemas
       globals/      — Navigation, Footer, SiteSettings
       hooks/revalidate.ts   — afterChange → revalidatePath/revalidateTag
       payload.config.ts
     components/
       blocks/       — one React renderer per block
       ui/           — Navbar, Footer, DestinationCard, StoryCard, TripCard, etc.
       forms/        — BookingForm (multi-step popup), SubscribeForm, ContactForm, GiftVoucherForm
     emails/         — React Email templates
       ui/           — Navbar, Footer, DestinationCard, StoryCard, TripCard, etc.
       forms/        — BookingForm (multi-step popup), SubscribeForm, ContactForm, GiftVoucherForm
     emails/         — React Email templates
     lib/            — stripe.ts, resend.ts, animations.ts, metadata.ts
     data/seed/      — all scraped panicframe.com content

 ---
 Build Order

 1. Scaffold — create-next-app@16 + Payload v3 + Tailwind v4 + Motion v12
 2. Docker Compose — postgres, redis, nginx, app containers
 3. Payload config — all collections, blocks, globals, revalidation hooks
 4. DB + migrate — payload migrate, seed script
 5. Live Preview — configure Payload Draft Mode + Live Preview
 6. Design tokens — global CSS vars, Space Grotesk font
 7. Navbar — exact split layout, mobile overlay, scroll behavior
 8. Footer — exact structure, subscription form, animated GIF logo
 9. Block system — schemas + React renderers + BlockRenderer
 10. Home page — hero animation, destination carousel, stories carousel, all sections
 11. Destination detail — all sections, booking popup form
 12. Destinations grid, Calendar, Stories (listing + detail), Gallery, Blog (listing + post)
 13. About, Contact (FAQ accordion), Gift Voucher
 14. NoLimit sub-site — own navbar, all 6 sub-pages
 15. Empire page
 16. Legal pages
 17. E-commerce — Stripe flow, webhook, order management
 18. Email marketing — full stack, Resend integration
 19. Linux cron on Hetzner for campaign sending
 20. SEO — metadata, OG images, sitemap, structured data per page
 21. CI/CD — GitHub Actions → SSH → docker compose up
 22. Lighthouse audit — 100/100/100/100 on all key pages

 ---
 Verification

 - Every page side-by-side pixel comparison with panicframe.com
 - Admin: save content → frontend page updates with no manual step (verify via hook logs)
 - Live Preview: type in admin → iframe updates in real time
 - Custom booking form: click "ЗАПИШИ СЕ" → popup opens, submit → Order in DB + email
 - Gift voucher form: submit → PDF email sent
 - Stripe test booking → Order + confirmation email → seat count refreshes
 - Email campaign: create + segment + send → tracked opens
 - Lighthouse: 100/100/100/100 on /, /destinations/azores, /blog/[post]                                                                   - Google Rich Results Test: valid structured data on destination + blog pages
 - Docker: docker compose up on fresh Hetzner server → site live with SSL