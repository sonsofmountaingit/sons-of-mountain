import { getPayload } from 'payload'
import config from '@payload-config'
import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { mediaUrl } from "@/lib/media-url"
import { Suspense } from 'react'


export const metadata: Metadata = {
  title: 'Bundle Deals — Sons of Mountains',
  description: 'Adventure bundles at unbeatable prices',
}

async function getBundles() {
  try {
    const payload = await getPayload({ config })
    const result = await payload.find({ collection: 'bundles', where: { isActive: { equals: true } }, sort: '-createdAt', limit: 20, depth: 2, overrideAccess: true })
    return result.docs
  } catch {
    return []
  }
}

async function BundlesContent() {
  const bundles = await getBundles()

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white pt-32 pb-24 px-6">
      <div className="max-w-[1440px] mx-auto">
        <Link href="/shop" className="text-xs tracking-widest uppercase text-white/30 hover:text-white transition-colors mb-12 inline-block">
          ← Back to Shop
        </Link>

        <div className="mb-16">
          <p className="text-xs tracking-[0.2em] text-white/30 uppercase mb-4">Save more</p>
          <h1 className="text-6xl md:text-8xl font-bold tracking-tight leading-none">Bundle Deals</h1>
          <p className="mt-6 text-lg text-white/40 max-w-lg">Combine experiences and gear for maximum savings</p>
        </div>

        {bundles.length === 0 ? (
          <p className="text-white/20 text-center py-32 tracking-widest uppercase text-xs">No bundles available right now. Check back soon.</p>
        ) : (
          <div className="grid gap-px md:grid-cols-2 border border-[#1a1a1a]">
            {bundles.map((bundle: any) => (
              <Link
                key={bundle.id}
                href={`/shop/bundles/${bundle.slug}`}
                className="group flex flex-col bg-[#111] hover:bg-[#161616] transition-colors overflow-hidden"
              >
                {bundle.image && mediaUrl(bundle.image as any) && (
                  <div className="relative h-64 overflow-hidden">
                    <Image
                      src={mediaUrl(bundle.image as any)!}
                      alt={bundle.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#111] to-transparent" />
                  </div>
                )}
                <div className="flex flex-1 flex-col p-8">
                  <h2 className="text-xl font-bold text-white mb-3">{bundle.title}</h2>
                  {bundle.description && (
                    <p className="text-white/40 text-sm mb-6 leading-relaxed">{bundle.description}</p>
                  )}

                  {bundle.items?.length > 0 && (
                    <ul className="text-xs text-white/30 space-y-2 mb-8">
                      {bundle.items.slice(0, 3).map((item: any, i: number) => {
                        const name = item.trip?.title ?? item.product?.title ?? item.program?.title ?? 'Item'
                        return (
                          <li key={i} className="flex items-center gap-2">
                            <span className="text-green-400">✓</span>
                            <span>{name}</span>
                          </li>
                        )
                      })}
                      {bundle.items.length > 3 && (
                        <li className="text-white/20">+ {bundle.items.length - 3} more</li>
                      )}
                    </ul>
                  )}

                  <div className="mt-auto flex items-center justify-between pt-6 border-t border-[#1a1a1a]">
                    <div className="flex items-baseline gap-3">
                      <span className="text-2xl font-bold text-white">€{bundle.bundlePrice}</span>
                      {bundle.basePrice && (
                        <span className="text-sm text-white/30 line-through">€{bundle.basePrice}</span>
                      )}
                      {bundle.savingsPercent && (
                        <span className="text-xs font-semibold text-green-400">Save {bundle.savingsPercent}%</span>
                      )}
                    </div>
                    {bundle.corporatePricing?.length > 0 && (
                      <span className="text-xs text-white/30 tracking-widest uppercase">Corporate available</span>
                    )}
                  </div>

                  <span className="text-xs tracking-widest uppercase text-white/20 group-hover:text-white transition-colors mt-4">
                    View bundle →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}

export default function BundlesPage() {
  return (
    <Suspense>
      <BundlesContent />
    </Suspense>
  )
}
