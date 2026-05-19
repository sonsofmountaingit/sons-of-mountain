import { getPayload } from 'payload'
import config from '@payload-config'
import { unstable_cache } from 'next/cache'
import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { mediaUrl } from "@/lib/media-url"

export const metadata: Metadata = {
  title: 'Bundle Deals — Sons of Mountains',
  description: 'Adventure bundles at unbeatable prices',
}

const getBundles = unstable_cache(
  async () => {
    const payload = await getPayload({ config })
    return payload.find({ collection: 'bundles', where: { isActive: { equals: true } }, sort: '-createdAt', limit: 20, depth: 2 })
  },
  ['bundles-list'],
  { tags: ['bundles'], revalidate: 3600 }
)

export default async function BundlesPage() {
  const { docs: bundles } = await getBundles()

  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-3">Bundle Deals</h1>
        <p className="text-gray-500 text-lg">Combine experiences and gear for maximum savings</p>
      </div>

      {bundles.length === 0 ? (
        <p className="text-center text-gray-400">No bundles available right now. Check back soon.</p>
      ) : (
        <div className="grid gap-8 md:grid-cols-2">
          {bundles.map((bundle: any) => (
            <Link
              key={bundle.id}
              href={`/shop/bundles/${bundle.slug}`}
              className="group flex flex-col rounded-2xl border overflow-hidden hover:shadow-lg transition-shadow"
            >
              {bundle.image && mediaUrl(bundle.image as any) && (
                <div className="relative h-56 overflow-hidden">
                  <Image src={mediaUrl(bundle.image as any)!} alt={bundle.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
              )}
              <div className="flex flex-1 flex-col p-6">
                <h2 className="text-xl font-bold mb-2">{bundle.title}</h2>
                {bundle.description && <p className="text-gray-500 text-sm mb-4">{bundle.description}</p>}

                {bundle.items?.length > 0 && (
                  <ul className="text-xs text-gray-500 space-y-1 mb-4">
                    {bundle.items.slice(0, 3).map((item: any, i: number) => {
                      const name = item.trip?.title ?? item.product?.title ?? item.program?.title ?? 'Item'
                      return <li key={i} className="flex items-center gap-1"><span className="text-green-500">✓</span>{name}</li>
                    })}
                    {bundle.items.length > 3 && <li className="text-gray-400">+ {bundle.items.length - 3} more</li>}
                  </ul>
                )}

                <div className="mt-auto flex items-center justify-between">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-purple-700">€{bundle.bundlePrice}</span>
                    {bundle.basePrice && <span className="text-sm text-gray-400 line-through">€{bundle.basePrice}</span>}
                    {bundle.savingsPercent && <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-bold text-green-700">Save {bundle.savingsPercent}%</span>}
                  </div>

                  {bundle.corporatePricing?.length > 0 && (
                    <span className="text-xs text-purple-600 font-medium">Corporate pricing available</span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  )
}
