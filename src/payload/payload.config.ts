import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import { resendAdapter } from '@payloadcms/email-resend'
import { stripePlugin } from '@payloadcms/plugin-stripe'
import type Stripe from 'stripe'

import { Pages } from './collections/Pages'
import { Destinations } from './collections/Destinations'
import { Trips } from './collections/Trips'
import { Stories } from './collections/Stories'
import { BlogPosts } from './collections/BlogPosts'
import { BlogCategories } from './collections/BlogCategories'
import { Media } from './collections/Media'
import { Customers } from './collections/Customers'
import { Orders } from './collections/Orders'
import { Registrations } from './collections/Registrations'
import { GiftVouchers } from './collections/GiftVouchers'
import { Users } from './collections/Users'
import { Subscribers } from './collections/Subscribers'
import { Segments } from './collections/Segments'
import { EmailTemplates } from './collections/EmailTemplates'
import { Campaigns } from './collections/Campaigns'
import { CustomerMedia } from './collections/CustomerMedia'
import { CustomerRatings } from './collections/CustomerRatings'
import { Programs } from './collections/Programs'
import { Guides } from './collections/Guides'
import { GalleryCollections } from './collections/GalleryCollections'
import { Favorites } from './collections/Favorites'
import { Categories } from './collections/Categories'
import { Products } from './collections/Products'
import { DiscountCodes } from './collections/DiscountCodes'
import { StockAlerts } from './collections/StockAlerts'
import { Waitlist } from './collections/Waitlist'
import { Bundles } from './collections/Bundles'
import { AbandonedCarts } from './collections/AbandonedCarts'
import { Subscriptions } from './collections/Subscriptions'
import { Payouts } from './collections/Payouts'

import { Navigation } from './globals/Navigation'
import { Footer } from './globals/Footer'
import { WhyTravelWithUs } from './globals/WhyTravelWithUs'
import { SiteSettings } from './globals/SiteSettings'
import { Hero } from './globals/Hero'
import { DestinationCarousel } from './globals/DestinationCarousel'
import { Gallery } from './globals/Gallery'
import { Shop } from './globals/Shop'
import { FeaturedTravels } from './globals/FeaturedTravels'
import { CalendarCta } from './globals/CalendarCta'
import { TestimonialsSection } from './globals/TestimonialsSection'
import { Testimonials } from './collections/Testimonials'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    components: {
      graphics: {
        Logo: '@/components/admin/AdminLogo#AdminLogo',
        Icon: '@/components/admin/AdminLogo#AdminLogo',
      },
      beforeLogin: ['@/components/admin/AdminLoginBackground#AdminLoginBackground'],
      afterLogin: ['@/components/admin/AdminAfterLogin#AdminAfterLogin'],
      views: {
        StripeManagement: {
          Component: '@/components/admin/StripeManagementView#StripeManagementView',
          path: '/stripe',
        },
        StripeReconciliation: {
          Component: '@/components/admin/StripeReconciliationView#StripeReconciliationView',
          path: '/stripe-reconciliation',
        },
      },
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: ' — Panic Frame Admin',
    },
    livePreview: {
      url: ({ data, collectionConfig }) => {
        const base = process.env.NEXT_PUBLIC_SERVER_URL ?? 'http://localhost:3000'
        const secret = process.env.PAYLOAD_SECRET ?? 'fallback-secret'
        if (collectionConfig?.slug === 'pages') {
          const slug = (data as { slug?: string })?.slug ?? ''
          return `${base}/api/preview?collection=pages&slug=${encodeURIComponent(slug)}&secret=${encodeURIComponent(secret)}`
        }
        return base
      },
      breakpoints: [
        { label: 'Mobile', name: 'mobile', width: 375, height: 812 },
        { label: 'Tablet', name: 'tablet', width: 768, height: 1024 },
        { label: 'Desktop', name: 'desktop', width: 1440, height: 900 },
      ],
    },
  },
  collections: [
    Pages,
    Destinations,
    Trips,
    Stories,
    BlogPosts,
    BlogCategories,
    Media,
    Customers,
    Orders,
    Registrations,
    GiftVouchers,
    Users,
    Subscribers,
    Segments,
    EmailTemplates,
    Campaigns,
    CustomerMedia,
    CustomerRatings,
    Programs,
    Guides,
    GalleryCollections,
    Favorites,
    Categories,
    Products,
    DiscountCodes,
    StockAlerts,
    Waitlist,
    Bundles,
    AbandonedCarts,
    Subscriptions,
    Payouts,
    Testimonials,
  ],
  globals: [Navigation, Footer, SiteSettings, Hero, DestinationCarousel, Gallery, Shop, WhyTravelWithUs, FeaturedTravels, CalendarCta, TestimonialsSection],
  plugins: [
    stripePlugin({
      stripeSecretKey: process.env.STRIPE_SECRET_KEY ?? '',
      stripeWebhooksEndpointSecret: process.env.STRIPE_WEBHOOKS_ENDPOINT_SECRET ?? '',
      rest: false,
      sync: [
        {
          collection: 'customers',
          stripeResourceType: 'customers',
          stripeResourceTypeSingular: 'customer',
          fields: [
            { fieldPath: 'name', stripeProperty: 'name' },
            { fieldPath: 'email', stripeProperty: 'email' },
          ],
        },
        {
          collection: 'products',
          stripeResourceType: 'products',
          stripeResourceTypeSingular: 'product',
          fields: [
            { fieldPath: 'title', stripeProperty: 'name' },
          ],
        },
      ],
      webhooks: {
        'checkout.session.completed': async ({ event, payload: p }) => {
          const { handleCheckoutCompleted } = await import('@/lib/stripe-webhooks')
          await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session, p)
        },
        'customer.subscription.created': async ({ event, payload: p }) => {
          const { handleSubscriptionUpsert } = await import('@/lib/stripe-webhooks')
          await handleSubscriptionUpsert(event.data.object as Stripe.Subscription, p)
        },
        'customer.subscription.updated': async ({ event, payload: p }) => {
          const { handleSubscriptionUpsert } = await import('@/lib/stripe-webhooks')
          await handleSubscriptionUpsert(event.data.object as Stripe.Subscription, p)
        },
        'customer.subscription.deleted': async ({ event, payload: p }) => {
          const { handleSubscriptionDeleted } = await import('@/lib/stripe-webhooks')
          await handleSubscriptionDeleted(event.data.object as Stripe.Subscription, p)
        },
        'charge.refunded': async ({ event, payload: p }) => {
          const { handleChargeRefunded } = await import('@/lib/stripe-webhooks')
          await handleChargeRefunded(event.data.object as Stripe.Charge, p)
        },
        'invoice.payment_failed': async ({ event, payload: p }) => {
          const { handleInvoicePaymentFailed } = await import('@/lib/stripe-webhooks')
          await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice, p)
        },
        'invoice.payment_succeeded': async ({ event, payload: p }) => {
          const { handleInvoicePaymentSucceeded } = await import('@/lib/stripe-webhooks')
          await handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice, p)
        },
        'invoice.finalized': async ({ event, payload: p }) => {
          const { handleInvoiceFinalized } = await import('@/lib/stripe-webhooks')
          await handleInvoiceFinalized(event.data.object as Stripe.Invoice, p)
        },
        'payment_intent.succeeded': async ({ event, payload: p }) => {
          const { handlePaymentIntentSucceeded } = await import('@/lib/stripe-webhooks')
          await handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent, p)
        },
        'payment_intent.payment_failed': async ({ event, payload: p }) => {
          const { handlePaymentIntentFailed } = await import('@/lib/stripe-webhooks')
          await handlePaymentIntentFailed(event.data.object as Stripe.PaymentIntent, p)
        },
      },
    }),
  ],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET ?? 'fallback-secret',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI ?? '',
    },
    // Exclude Better Auth tables from Payload's Drizzle schema management
    tablesFilter: ['!user', '!session', '!account', '!verification'],
  }),
  upload: {
    limits: {
      fileSize: 200_000_000,
    },
  },
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL,
  sharp,
  email: resendAdapter({
    defaultFromAddress: process.env.RESEND_FROM_EMAIL ?? 'noreply@panicframe.com',
    defaultFromName: process.env.RESEND_FROM_NAME ?? 'Panic Frame',
    apiKey: process.env.RESEND_API_KEY ?? '',
  }),
})
