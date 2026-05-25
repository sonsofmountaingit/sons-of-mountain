import { getPayload } from 'payload'
import config from '@payload-config'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { mediaUrl } from "@/lib/media-url"
import { AddToCartButton } from '@/components/shop/AddToCartButton'
import { Suspense } from 'react'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = { title: 'Bundle — Sons of Mountains' }

async function getBundle(slug: string) {
  try {
    const payload = await getPayload({ config })
    const result = await payload.find({
      collection: 'bundles',
      where: { and: [{ slug: { equals: slug } }, { isActive: { equals: true } }] },
      limit: 1,
      depth: 3,
      overrideAccess: true,
    })
    return result.docs[0] ?? null
  } catch {
    return null
  }
}

async function BundleContent({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const bundle = await getBundle(slug)
  if (!bundle) notFound()

  const heroUrl = bundle.image && typeof bundle.image === 'object' && bundle.image !== null
    ? (mediaUrl((bundle.image as any).url ?? bundle.image) ?? undefined)
    : typeof bundle.image === 'string'
      ? (mediaUrl(bundle.image) ?? undefined)
      : undefined

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Hero */}
      <section className="relative min-h-[55vh] flex items-end overflow-hidden -mt-24">
        {heroUrl ? (
          <Image src={heroUrl} alt={bundle.title} fill className="object-cover" priority />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-b from-[#111] to-[#0a0a0a]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/50 to-transparent" />
        <div className="relative w-full max-w-[1440px] mx-auto px-6 pb-16 pt-40">
          <Link href="/shop/bundles" className="text-xs tracking-widest uppercase text-white/30 hover:text-white transition-colors mb-6 inline-block">
            ← Bundle Deals
          </Link>
          <p className="text-xs tracking-[0.2em] text-white/30 uppercase mb-4">Bundle</p>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-none">{bundle.title}</h1>
        </div>
      </section>

      <div className="max-w-[1440px] mx-auto px-6 py-16">
        <div className="grid gap-16 lg:grid-cols-[1fr_360px]">
          {/* Left */}
          <div>
            {bundle.description && (
              <p className="text-lg text-white/50 leading-relaxed mb-16 max-w-2xl">{bundle.description}</p>
            )}

            <div className="mb-16">
              <p className="text-xs tracking-[0.2em] text-white/30 uppercase mb-8">What's included</p>
              <ul className="space-y-0 border border-[#1a1a1a]">
                {(bundle.items as any[]).map((item: any, i: number) => {
                  const entity = item.trip ?? item.product ?? item.program
                  return (
                    <li key={i} className="flex items-start gap-6 px-8 py-6 border-b border-[#1a1a1a] last:border-b-0">
                      <span className="mt-0.5 shrink-0 flex h-5 w-5 items-center justify-center border border-green-500/40 text-green-400 text-xs">✓</span>
                      <div>
                        <p className="font-semibold text-white">{entity?.title ?? entity?.name ?? 'Item'}</p>
                        <p className="text-xs text-white/30 capitalize mt-1">
                          {item.itemType}{item.quantity > 1 ? ` × ${item.quantity}` : ''}
                        </p>
                      </div>
                    </li>
                  )
                })}
              </ul>
            </div>

            {(bundle.corporatePricing as any[])?.length > 0 && (
              <div>
                <p className="text-xs tracking-[0.2em] text-white/30 uppercase mb-8">Corporate / Group Pricing</p>
                <div className="border border-[#1a1a1a]">
                  <div className="grid grid-cols-2 border-b border-[#1a1a1a] px-8 py-4">
                    <span className="text-xs tracking-widest uppercase text-white/30">Min. Participants</span>
                    <span className="text-xs tracking-widest uppercase text-white/30 text-right">Price per Person</span>
                  </div>
                  {(bundle.corporatePricing as any[]).map((tier: any, i: number) => (
                    <div key={i} className="grid grid-cols-2 border-b border-[#1a1a1a] last:border-b-0 px-8 py-5">
                      <span className="text-white/70">{tier.minPeople}+ people{tier.label ? ` — ${tier.label}` : ''}</span>
                      <span className="font-bold text-white text-right">€{tier.pricePerPerson}<span className="text-white/30 font-normal text-xs">/person</span></span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right — sticky purchase card */}
          <div className="lg:sticky lg:top-28 h-fit border border-[#1a1a1a] bg-[#111] p-8 space-y-6">
            <div>
              <p className="text-xs tracking-widest uppercase text-white/30 mb-3">Bundle price</p>
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold text-white">€{bundle.bundlePrice}</span>
                {bundle.basePrice && (
                  <span className="text-sm text-white/30 line-through">€{bundle.basePrice}</span>
                )}
              </div>
              {bundle.savingsPercent && (
                <p className="text-xs text-green-400 mt-2">You save {bundle.savingsPercent}% compared to buying separately</p>
              )}
            </div>

            {bundle.expiresAt && (
              <p className="text-xs text-white/30 border border-[#1a1a1a] px-4 py-3">
                Offer expires {new Date(bundle.expiresAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            )}

            <AddToCartButton
              item={{
                id: `bundle-${bundle.id}`,
                type: 'bundle',
                bundleId: String(bundle.id),
                title: bundle.title,
                unitPrice: bundle.bundlePrice,
                quantity: 1,
                image: heroUrl,
              }}
              className="w-full justify-center border border-white text-white hover:bg-white hover:text-[#0a0a0a] transition-colors"
            >
              Add bundle to cart
            </AddToCartButton>

            <div className="border-t border-[#1a1a1a] pt-6 space-y-3">
              <div className="flex justify-between text-xs text-white/30">
                <span>Items included</span>
                <span>{(bundle.items as any[]).length}</span>
              </div>
              {bundle.basePrice && (
                <div className="flex justify-between text-xs text-white/30">
                  <span>Individual value</span>
                  <span>€{bundle.basePrice}</span>
                </div>
              )}
              {bundle.savingsPercent && (
                <div className="flex justify-between text-xs text-green-400/70">
                  <span>Your savings</span>
                  <span>{bundle.savingsPercent}%</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default function BundlePage({ params }: { params: Promise<{ slug: string }> }) {
  return (
    <Suspense>
      <BundleContent params={params} />
    </Suspense>
  )
}
