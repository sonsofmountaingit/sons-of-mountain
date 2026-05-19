import { getPayload } from 'payload'
import config from '@payload-config'
import { unstable_cache } from 'next/cache'
import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { ProductCard } from '@/components/shop/ProductCard'
import { mediaUrl } from "@/lib/media-url"

export const metadata: Metadata = {
  title: 'Shop — Sons of Mountains',
  description: 'Gear, experiences, and adventures',
}

const getCatalog = unstable_cache(
  async () => {
    const payload = await getPayload({ config })
    const [shop, categories, products, trips, bundles] = await Promise.all([
      payload.findGlobal({ slug: 'shop', depth: 2 }),
      payload.find({ collection: 'categories', sort: 'sortOrder', limit: 20, depth: 1 }),
      payload.find({ collection: 'products', where: { status: { equals: 'active' } }, sort: '-createdAt', limit: 24, depth: 1 }),
      payload.find({ collection: 'trips', where: { status: { not_equals: 'draft' } }, sort: 'startDate', limit: 12, depth: 1 }),
      payload.find({ collection: 'bundles', where: { isActive: { equals: true } }, limit: 4, depth: 2 }),
    ])
    return { shop, categories: categories.docs, products: products.docs, trips: trips.docs, bundles: bundles.docs }
  },
  ['shop-catalog'],
  { tags: ['shop', 'categories', 'products', 'trips', 'bundles'], revalidate: 3600 }
)

export default async function ShopPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const { category } = await searchParams
  const { shop, categories, products, trips, bundles } = await getCatalog()
  const shopData = shop as any

  const filteredProducts = category
    ? products.filter((p: any) => (typeof p.category === 'string' ? p.category : p.category?.id) === category)
    : products

  return (
    <main>
      {shopData?.bannerText && (
        <div className="bg-gray-900 py-2 text-center text-sm text-white">
          {shopData.bannerText}
          {shopData.bannerCta && shopData.bannerCtaHref && (
            <Link href={shopData.bannerCtaHref} className="ml-2 underline">{shopData.bannerCta}</Link>
          )}
        </div>
      )}

      <section className="relative bg-gray-900 text-white min-h-64 flex items-center">
        {shopData?.heroImage && mediaUrl(shopData.heroImage as any) && (
          <Image
            src={mediaUrl(shopData.heroImage as any)!}
            alt={shopData.heroTitle ?? 'Shop'}
            fill
            className="object-cover opacity-40"
            priority
          />
        )}
        <div className="relative mx-auto max-w-7xl px-6 py-24 text-center w-full">
          <h1 className="text-5xl font-bold tracking-tight">{shopData?.heroTitle ?? 'Adventure Shop'}</h1>
          {shopData?.heroSubtitle && <p className="mt-4 text-xl text-gray-300">{shopData.heroSubtitle}</p>}
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 py-12">
        <nav className="mb-8 flex flex-wrap gap-2">
          <Link href="/shop" className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${!category ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>All</Link>
          {categories.map((cat: any) => (
            <Link key={cat.id} href={`/shop?category=${cat.id}`} className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${category === cat.id ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>{cat.name}</Link>
          ))}
          <Link href="/shop/gift-vouchers" className="rounded-full bg-amber-100 px-4 py-1.5 text-sm font-medium text-amber-800 hover:bg-amber-200">Gift Vouchers</Link>
          <Link href="/shop/bundles" className="rounded-full bg-purple-100 px-4 py-1.5 text-sm font-medium text-purple-800 hover:bg-purple-200">Bundles</Link>
        </nav>

        {!category && bundles.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Bundle Deals</h2>
              <Link href="/shop/bundles" className="text-sm text-gray-500 hover:text-gray-900 underline">View all</Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {bundles.map((bundle: any) => (
                <Link key={bundle.id} href={`/shop/bundles/${bundle.slug}`} className="flex gap-4 rounded-xl border bg-gradient-to-r from-purple-50 to-white p-4 hover:shadow-md transition-shadow">
                  <div className="flex-1">
                    <p className="font-semibold">{bundle.title}</p>
                    <p className="text-sm text-gray-500 line-clamp-2">{bundle.description}</p>
                    <div className="mt-2 flex items-baseline gap-2">
                      <span className="text-lg font-bold text-purple-700">€{bundle.bundlePrice}</span>
                      {bundle.basePrice && <span className="text-sm text-gray-400 line-through">€{bundle.basePrice}</span>}
                      {bundle.savingsPercent && <span className="text-xs font-semibold text-green-600">Save {bundle.savingsPercent}%</span>}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {filteredProducts.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Gear &amp; Products</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredProducts.map((product: any) => {
                const img = product.images?.[0]?.image
                return (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    slug={product.slug}
                    title={product.title}
                    price={product.price}
                    compareAtPrice={product.compareAtPrice}
                    image={img ? (mediaUrl(img) ?? undefined) : undefined}
                    stock={product.stock ?? 0}
                    category={typeof product.category === 'object' ? product.category?.name : null}
                  />
                )
              })}
            </div>
          </section>
        )}

        {!category && trips.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Upcoming Adventures</h2>
              <Link href="/destinations" className="text-sm text-gray-500 hover:text-gray-900 underline">All destinations</Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {trips.map((trip: any) => {
                const dest = typeof trip.destination === 'object' ? trip.destination : null
                const soldOut = trip.spotsAvailable === 0
                return (
                  <Link key={trip.id} href={`/shop/${trip.id}`} className="group flex flex-col rounded-lg border bg-white p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold group-hover:underline">{trip.title ?? dest?.name}</p>
                        {dest && <p className="text-xs text-gray-500">{dest.name}</p>}
                      </div>
                      {soldOut && <span className="text-xs font-semibold text-red-600 bg-red-50 rounded px-2 py-0.5">Sold out</span>}
                    </div>
                    <div className="mt-auto pt-4 flex items-center justify-between text-sm">
                      <span className="text-gray-500">{trip.startDate ? new Date(trip.startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : ''}</span>
                      <span className="font-bold text-gray-900">€{trip.price}</span>
                    </div>
                    {!soldOut && <p className="text-xs text-gray-400 mt-1">{trip.spotsAvailable} spots left</p>}
                  </Link>
                )
              })}
            </div>
          </section>
        )}
      </div>
    </main>
  )
}
