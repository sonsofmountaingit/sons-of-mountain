import { getPayload } from 'payload'
import config from '@payload-config'
import { unstable_cache } from 'next/cache'
import { cookies } from 'next/headers'
import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Suspense } from 'react'
import { ProductCard } from '@/components/shop/ProductCard'
import { ViewItemListTracker } from '@/components/analytics/ViewItemListTracker'
import { mediaUrl } from "@/lib/media-url"
import { buildStaticMetadata } from '@/lib/metadata'
import { formatPrice } from '@/lib/currency'
import { translations, type Language } from '@/lib/translations'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  return buildStaticMetadata('/shop', {
    title: 'Магазин — Sons of Mountains',
    description: 'Пътнически пакети, аксесоари и ваучери от Sons of Mountains. Открий всичко необходимо за твоето следващо приключение.',
  })
}

const getCatalog = unstable_cache(
  async () => {
    const payload = await getPayload({ config })
    const [shop, categories, products, trips, bundles, programs] = await Promise.all([
      payload.findGlobal({ slug: 'shop', depth: 2, overrideAccess: true }),
      payload.find({ collection: 'categories', sort: 'sortOrder', limit: 20, depth: 1, overrideAccess: true }),
      payload.find({ collection: 'products', where: { status: { equals: 'active' } }, sort: '-createdAt', limit: 24, depth: 1, overrideAccess: true }),
      payload.find({ collection: 'trips', where: { status: { not_equals: 'draft' } }, sort: 'startDate', limit: 12, depth: 1, overrideAccess: true }),
      payload.find({ collection: 'bundles', where: { isActive: { equals: true } }, limit: 4, depth: 2, overrideAccess: true }),
      payload.find({ collection: 'programs', where: { status: { equals: 'active' } }, sort: 'startDate', limit: 12, depth: 1, overrideAccess: true }),
    ])
    return { shop, categories: categories.docs, products: products.docs, trips: trips.docs, bundles: bundles.docs, programs: programs.docs }
  },
  ['shop-catalog'],
  { tags: ['shop', 'categories', 'products', 'trips', 'bundles', 'programs'], revalidate: false }
)

export default function ShopPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  return (
    <Suspense>
      <ShopPageInner searchParams={searchParams} />
    </Suspense>
  )
}

async function ShopPageInner({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const { category } = await searchParams
  const { shop, categories, products, trips, bundles, programs } = await getCatalog()
  const shopData = shop as any
  const cookieStore = await cookies()
  const language = (cookieStore.get('language')?.value ?? 'BG') as Language
  const t = translations[language]

  const filteredProducts = category
    ? products.filter((p: any) => (typeof p.category === 'string' ? p.category : p.category?.id) === category)
    : products

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      {shopData?.bannerText && (
        <div className="border-b border-[#1a1a1a] py-2 text-center text-xs tracking-widest text-white/50 uppercase">
          {shopData.bannerText}
          {shopData.bannerCta && shopData.bannerCtaHref && (
            <Link href={shopData.bannerCtaHref} className="ml-2 underline text-white/70 hover:text-white transition-colors">{shopData.bannerCta}</Link>
          )}
        </div>
      )}

      <section className="relative min-h-[60vh] flex items-end overflow-hidden -mt-24">
        {shopData?.heroImage && mediaUrl(shopData.heroImage as any) ? (
          <Image
            src={mediaUrl(shopData.heroImage as any)!}
            alt={shopData.heroTitle ?? 'Shop'}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-b from-[#111] to-[#0a0a0a]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/40 to-transparent" />
        <div className="relative w-full max-w-[1440px] mx-auto px-6 pb-16 pt-32">
          <p className="text-xs tracking-[0.2em] text-white/40 uppercase mb-4">Sons of Mountains</p>
          <h1 className="text-6xl md:text-8xl font-bold tracking-tight leading-none">
            {shopData?.heroTitle ?? t.shop.hero_title}
          </h1>
          {shopData?.heroSubtitle && (
            <p className="mt-6 text-lg text-white/50 max-w-lg">{shopData.heroSubtitle}</p>
          )}
        </div>
      </section>

      <div className="max-w-[1440px] mx-auto px-6 py-16">
        <nav className="mb-12 flex flex-wrap gap-2">
          <Link
            href="/shop"
            className={`px-5 py-2 text-xs tracking-widest uppercase font-medium border transition-colors ${
              !category
                ? 'border-white bg-white text-[#0a0a0a]'
                : 'border-[#1a1a1a] text-white/50 hover:border-white/30 hover:text-white'
            }`}
          >
            {t.shop.all_categories}
          </Link>
          {categories.map((cat: any) => (
            <Link
              key={cat.id}
              href={`/shop?category=${cat.id}`}
              className={`px-5 py-2 text-xs tracking-widest uppercase font-medium border transition-colors ${
                category === cat.id
                  ? 'border-white bg-white text-[#0a0a0a]'
                  : 'border-[#1a1a1a] text-white/50 hover:border-white/30 hover:text-white'
              }`}
            >
              {cat.name}
            </Link>
          ))}
          <Link href="/vouchers" className="px-5 py-2 text-xs tracking-widest uppercase font-medium border border-amber-900/50 text-amber-400/80 hover:border-amber-400 hover:text-amber-300 transition-colors">
            {t.shop.gift_vouchers}
          </Link>
          <Link href="/shop/bundles" className="px-5 py-2 text-xs tracking-widest uppercase font-medium border border-white/10 text-white/50 hover:border-white/30 hover:text-white transition-colors">
            {t.shop.bundles}
          </Link>
          <Link href="/destinations" className="px-5 py-2 text-xs tracking-widest uppercase font-medium border border-white/10 text-white/50 hover:border-white/30 hover:text-white transition-colors">
            {t.shop.programs_all}
          </Link>
        </nav>

        {!category && bundles.length > 0 && (
          <section className="mb-20">
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="text-xs tracking-widest text-white/30 uppercase mb-2">{t.shop.bundles_deals_eyebrow}</p>
                <h2 className="text-3xl font-bold">{t.shop.bundle_deals}</h2>
              </div>
              <Link href="/shop/bundles" className="text-xs tracking-widest uppercase text-white/30 hover:text-white transition-colors">
                {t.shop.bundles_view_all}
              </Link>
            </div>
            <div className="grid gap-px sm:grid-cols-2 border border-[#1a1a1a]">
              {bundles.map((bundle: any) => (
                <Link
                  key={bundle.id}
                  href={`/shop/bundles/${bundle.slug}`}
                  className="group flex flex-col gap-4 bg-[#111] p-8 hover:bg-[#161616] transition-colors"
                >
                  <p className="text-sm font-semibold text-white">{bundle.title}</p>
                  <p className="text-sm text-white/40 line-clamp-2">{bundle.description}</p>
                  <div className="flex items-baseline gap-3 mt-auto">
                    <span className="text-2xl font-bold text-white">{formatPrice(bundle.bundlePrice)}</span>
                    {bundle.basePrice && <span className="text-sm text-white/30 line-through">{formatPrice(bundle.basePrice)}</span>}
                    {bundle.savingsPercent && (
                      <span className="text-xs font-semibold text-green-400">{t.shop.save_percent_prefix} {bundle.savingsPercent}%</span>
                    )}
                  </div>
                  <span className="text-xs tracking-widest uppercase text-white/20 group-hover:text-white transition-colors">{t.shop.view_bundle}</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {!category && (
          <section className="mb-20">
            <Link
              href="/vouchers"
              className="group flex flex-col sm:flex-row items-center justify-between gap-8 border border-[#1a1a1a] px-10 py-10 hover:border-amber-900/50 transition-colors bg-[#0d0d0a]"
            >
              <div>
                <p className="text-xs tracking-[0.2em] text-amber-400/60 uppercase mb-3">{t.shop.voucher_eyebrow}</p>
                <h2 className="text-3xl font-bold text-white">{t.vouchers_hero.heading}</h2>
                <p className="mt-2 text-sm text-white/40 max-w-sm">{t.vouchers_hero.subtext}</p>
              </div>
              <div className="flex items-center gap-6 shrink-0">
                <div className="flex gap-2">
                  {[50, 100, 200, 500].map((a) => (
                    <span key={a} className="border border-amber-900/40 px-3 py-2 text-xs text-amber-300/70">{formatPrice(a)}</span>
                  ))}
                </div>
                <span className="text-xs tracking-widest text-white/30 group-hover:text-white transition-colors">{t.shop.buy}</span>
              </div>
            </Link>
          </section>
        )}

        {filteredProducts.length > 0 && (
          <section className="mb-20">
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="text-xs tracking-widest text-white/30 uppercase mb-2">{t.shop.gear_products_eyebrow}</p>
                <h2 className="text-3xl font-bold">{t.shop.gear_products}</h2>
              </div>
            </div>
            <ViewItemListTracker
              listId="shop-products"
              listName="Shop Products"
              items={filteredProducts.map((p: any) => ({ item_id: String(p.id), item_name: p.title, price: p.price ?? 0, item_category: 'product' }))}
            />
            <div className="grid gap-px sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 border border-[#1a1a1a]">
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
                    language={language}
                  />
                )
              })}
            </div>
          </section>
        )}

        {!category && programs.length > 0 && (
          <section className="mb-20">
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="text-xs tracking-widest text-white/30 uppercase mb-2">{t.shop.programs_eyebrow}</p>
                <h2 className="text-3xl font-bold">{t.shop.individual_programs_heading}</h2>
              </div>
              <Link href="/individual-programs" className="text-xs tracking-widest uppercase text-white/30 hover:text-white transition-colors">
                {t.shop.programs_all_arrow}
              </Link>
            </div>
            <div className="grid gap-px sm:grid-cols-2 lg:grid-cols-3 border border-[#1a1a1a]">
              {programs.map((program: any) => {
                const soldOut = program.status === 'soldOut' || program.spotsAvailable === 0
                return (
                  <Link
                    key={program.id}
                    href={`/programs/${program.slug ?? String(program.id)}`}
                    className="group flex flex-col bg-[#111] p-8 hover:bg-[#161616] transition-colors"
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <p className="font-semibold text-white group-hover:text-white/80 transition-colors">{program.title}</p>
                        {program.type && <p className="text-xs text-white/30 mt-1">{program.type}</p>}
                      </div>
                      {soldOut && (
                        <span className="shrink-0 text-xs font-semibold text-red-400 border border-red-900/40 px-2 py-0.5">{t.shop.out_of_stock}</span>
                      )}
                    </div>
                    <div className="mt-auto pt-8 flex items-center justify-between">
                      <span className="text-xs text-white/30">
                        {program.startDate ? new Date(program.startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : ''}
                      </span>
                      <span className="text-xl font-bold text-white">{formatPrice(program.price)}</span>
                    </div>
                    {!soldOut && typeof program.spotsAvailable === 'number' && (
                      <p className="text-xs text-white/20 mt-1">{program.spotsAvailable} {program.spotsAvailable === 1 ? (t.shop.spot_left ?? 'свободно място') : t.shop.spots_left}</p>
                    )}
                  </Link>
                )
              })}
            </div>
          </section>
        )}

        {!category && trips.length > 0 && (
          <section>
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="text-xs tracking-widest text-white/30 uppercase mb-2">{t.shop.trips_eyebrow}</p>
                <h2 className="text-3xl font-bold">{t.shop.upcoming_adventures}</h2>
              </div>
              <Link href="/destinations" className="text-xs tracking-widest uppercase text-white/30 hover:text-white transition-colors">
                {t.shop.destinations_all} →
              </Link>
            </div>
            <div className="grid gap-px sm:grid-cols-2 lg:grid-cols-3 border border-[#1a1a1a]">
              {trips.map((trip: any) => {
                const dest = typeof trip.destination === 'object' ? trip.destination : null
                const soldOut = trip.spotsAvailable === 0
                return (
                  <Link
                    key={trip.id}
                    href={`/shop/${trip.id}`}
                    className="group flex flex-col bg-[#111] p-8 hover:bg-[#161616] transition-colors"
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <p className="font-semibold text-white group-hover:text-white/80 transition-colors">{trip.title ?? dest?.name}</p>
                        {dest && <p className="text-xs text-white/30 mt-1">{dest.name}</p>}
                      </div>
                      {soldOut && (
                        <span className="shrink-0 text-xs font-semibold text-red-400 border border-red-900/40 px-2 py-0.5">{t.shop.out_of_stock}</span>
                      )}
                    </div>
                    <div className="mt-auto pt-8 flex items-center justify-between">
                      <span className="text-xs text-white/30">
                        {trip.startDate ? new Date(trip.startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : ''}
                      </span>
                      <span className="text-xl font-bold text-white">{formatPrice(trip.price)}</span>
                    </div>
                    {!soldOut && <p className="text-xs text-white/20 mt-1">{trip.spotsAvailable} {trip.spotsAvailable === 1 ? (t.shop.spot_left ?? 'свободно място') : t.shop.spots_left}</p>}
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
