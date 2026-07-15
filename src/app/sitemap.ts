import { getPayload } from 'payload'
import config from '@payload-config'
import type { MetadataRoute } from 'next'

export const dynamic = 'force-dynamic'

const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL ?? 'http://localhost:3000'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const payload = await getPayload({ config })

  const [
    { docs: destinations },
    { docs: stories },
    { docs: blogPosts },
    { docs: trips },
    { docs: programs },
    { docs: galleryCollections },
    { docs: products },
    { docs: bundles },
    { docs: photographers },
  ] = await Promise.all([
    payload.find({ collection: 'destinations', limit: 500, depth: 0 }),
    payload.find({ collection: 'stories', limit: 500, depth: 0 }),
    payload.find({ collection: 'blog-posts', limit: 500, depth: 0 }),
    payload.find({ collection: 'trips', limit: 500, depth: 0 }),
    payload.find({ collection: 'programs', limit: 500, depth: 0 }),
    payload.find({ collection: 'gallery-collections', where: { status: { equals: 'published' } }, limit: 500, depth: 0 }),
    payload.find({ collection: 'products', limit: 500, depth: 0 }),
    payload.find({ collection: 'bundles', limit: 500, depth: 0 }),
    payload.find({ collection: 'users', where: { username: { exists: true } }, limit: 500, depth: 0 }),
  ])

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${BASE_URL}/destinations`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE_URL}/calendar`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${BASE_URL}/trips`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE_URL}/programs`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/stories`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE_URL}/gallery`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE_URL}/photos`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.6 },
    { url: `${BASE_URL}/photographers`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.6 },
    { url: `${BASE_URL}/blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/gift`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/shop`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE_URL}/shop/bundles`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE_URL}/shop/gift-vouchers`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/nolimit`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/nolimit/catamarans`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/nolimit/itinerary`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/nolimit/nextgen`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/nolimit/gallery`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.5 },
    { url: `${BASE_URL}/empire`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/legal/terms`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/legal/privacy-policy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
  ]

  const destinationRoutes: MetadataRoute.Sitemap = destinations.map((d) => ({
    url: `${BASE_URL}/destinations/${(d as any).slug}`,
    lastModified: new Date((d as any).updatedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  const tripRoutes: MetadataRoute.Sitemap = trips.map((t) => ({
    url: `${BASE_URL}/trips/${(t as any).slug}`,
    lastModified: new Date((t as any).updatedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }))

  const programRoutes: MetadataRoute.Sitemap = programs.map((p) => ({
    url: `${BASE_URL}/programs/${(p as any).slug}`,
    lastModified: new Date((p as any).updatedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  const storyRoutes: MetadataRoute.Sitemap = stories.map((s) => ({
    url: `${BASE_URL}/stories/${(s as any).slug}`,
    lastModified: new Date((s as any).updatedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  const blogRoutes: MetadataRoute.Sitemap = blogPosts.map((p) => ({
    url: `${BASE_URL}/blog/${(p as any).slug}`,
    lastModified: new Date((p as any).updatedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  const galleryRoutes: MetadataRoute.Sitemap = galleryCollections.map((g) => ({
    url: `${BASE_URL}/gallery/${(g as any).slug}`,
    lastModified: new Date((g as any).updatedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  const productRoutes: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${BASE_URL}/shop/products/${(p as any).slug}`,
    lastModified: new Date((p as any).updatedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  const bundleRoutes: MetadataRoute.Sitemap = bundles.map((b) => ({
    url: `${BASE_URL}/shop/bundles/${(b as any).slug}`,
    lastModified: new Date((b as any).updatedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  const photographerRoutes: MetadataRoute.Sitemap = photographers
    .filter((u) => (u as any).username)
    .map((u) => ({
      url: `${BASE_URL}/photographers/${(u as any).username}`,
      lastModified: new Date((u as any).updatedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    }))

  return [
    ...staticRoutes,
    ...destinationRoutes,
    ...tripRoutes,
    ...programRoutes,
    ...storyRoutes,
    ...blogRoutes,
    ...galleryRoutes,
    ...productRoutes,
    ...bundleRoutes,
    ...photographerRoutes,
  ]
}
