import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import { resendAdapter } from '@payloadcms/email-resend'

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
import { SiteSettings } from './globals/SiteSettings'
import { Hero } from './globals/Hero'
import { DestinationCarousel } from './globals/DestinationCarousel'
import { Gallery } from './globals/Gallery'
import { Shop } from './globals/Shop'

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
  ],
  globals: [Navigation, Footer, SiteSettings, Hero, DestinationCarousel, Gallery, Shop],
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
