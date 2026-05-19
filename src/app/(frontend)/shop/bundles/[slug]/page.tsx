import { getPayload } from 'payload'
import config from '@payload-config'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Image from 'next/image'
import { mediaUrl } from "@/lib/media-url"
import { AddToCartButton } from '@/components/shop/AddToCartButton'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  return { title: `${slug} Bundle — Sons of Mountains` }
}

export default async function BundlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const payload = await getPayload({ config })
  const result = await payload.find({ collection: 'bundles', where: { and: [{ slug: { equals: slug } }, { isActive: { equals: true } }] }, limit: 1, depth: 3 })
  const bundle = result.docs[0]
  if (!bundle) notFound()

  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      {bundle.image && typeof bundle.image === 'object' && bundle.image !== null && (
        <div className="relative h-72 w-full overflow-hidden rounded-2xl mb-8">
          <Image src={mediaUrl((bundle.image as any).url ?? bundle.image) ?? ''} alt={bundle.title} fill className="object-cover" />
        </div>
      )}

      <div className="grid gap-10 lg:grid-cols-[1fr_300px]">
        <div>
          <h1 className="text-4xl font-bold mb-3">{bundle.title}</h1>
          {bundle.description && <p className="text-gray-500 text-lg mb-8">{bundle.description}</p>}

          <h2 className="text-xl font-semibold mb-4">What is included</h2>
          <ul className="space-y-3 mb-8">
            {(bundle.items as any[]).map((item: any, i: number) => {
              const entity = item.trip ?? item.product ?? item.program
              return (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-green-100 text-green-700 text-xs">✓</span>
                  <div>
                    <p className="font-medium">{entity?.title ?? entity?.name ?? 'Item'}</p>
                    <p className="text-xs text-gray-400 capitalize">{item.itemType}{item.quantity > 1 ? ` × ${item.quantity}` : ''}</p>
                  </div>
                </li>
              )
            })}
          </ul>

          {(bundle.corporatePricing as any[])?.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Corporate / Group pricing</h2>
              <div className="overflow-hidden rounded-lg border">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium">Min. participants</th>
                      <th className="px-4 py-3 text-right font-medium">Price per person</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {(bundle.corporatePricing as any[]).map((tier: any, i: number) => (
                      <tr key={i}>
                        <td className="px-4 py-3">{tier.minPeople}+ people{tier.label ? ` (${tier.label})` : ''}</td>
                        <td className="px-4 py-3 text-right font-semibold">€{tier.pricePerPerson}/person</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        <div className="rounded-xl border bg-gray-50 p-6 h-fit space-y-4 sticky top-6">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-purple-700">€{bundle.bundlePrice}</span>
            {bundle.basePrice && <span className="text-sm text-gray-400 line-through">€{bundle.basePrice}</span>}
          </div>
          {bundle.savingsPercent && (
            <div className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-800 font-medium">
              You save {bundle.savingsPercent}% compared to buying separately
            </div>
          )}
          <AddToCartButton
            item={{
              id: `bundle-${bundle.id}`,
              type: 'bundle',
              bundleId: String(bundle.id),
              title: bundle.title,
              unitPrice: bundle.bundlePrice,
              quantity: 1,
              image: bundle.image && typeof bundle.image === 'object' && bundle.image !== null ? (mediaUrl((bundle.image as any).url ?? bundle.image) ?? undefined) : (typeof bundle.image === 'string' ? (mediaUrl(bundle.image) ?? undefined) : undefined),
            }}
            className="w-full justify-center"
          >
            Add bundle to cart
          </AddToCartButton>
          {bundle.expiresAt && (
            <p className="text-xs text-gray-400 text-center">Offer expires {new Date(bundle.expiresAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
          )}
        </div>
      </div>
    </main>
  )
}
