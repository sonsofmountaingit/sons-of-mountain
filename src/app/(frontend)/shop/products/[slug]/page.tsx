import { getPayload } from 'payload'
import config from '@payload-config'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Image from 'next/image'
import { Suspense } from 'react'
import { mediaUrl } from "@/lib/media-url"
import { AddToCartButton } from '@/components/shop/AddToCartButton'
import { WishlistButton } from '@/components/shop/WishlistButton'
import { StockAlertButton } from '@/components/shop/StockAlertButton'
import { WaitlistButton } from '@/components/shop/WaitlistButton'
import { StarRating } from '@/components/shop/StarRating'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = { title: 'Shop — Sons of Mountains' }

async function getProduct(slug: string) {
  try {
    const payload = await getPayload({ config })
    const [result, ratingsResult] = await Promise.all([
      payload.find({ collection: 'products', where: { and: [{ slug: { equals: slug } }, { status: { equals: 'active' } }] }, limit: 1, depth: 2, overrideAccess: true }),
      payload.find({ collection: 'customer-ratings', where: { product: { exists: true } }, limit: 20, depth: 1, overrideAccess: true }),
    ])
    return { product: result.docs[0] ?? null, ratings: ratingsResult.docs }
  } catch {
    return { product: null, ratings: [] }
  }
}

async function ProductContent({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const { product, ratings } = await getProduct(slug)
  if (!product) notFound()

  const p = product as any
  const soldOut = p.stock <= 0
  const firstImage = p.images?.[0]?.image
  const avgRating = ratings.length > 0 ? ratings.reduce((s: number, r: any) => s + r.rating, 0) / ratings.length : null

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <div className="grid gap-12 lg:grid-cols-2">
        {/* Images */}
        <div className="space-y-3">
          {firstImage && mediaUrl(firstImage as any) ? (
            <div className="relative aspect-square overflow-hidden rounded-2xl bg-gray-100">
              <Image src={mediaUrl(firstImage as any)!} alt={p.title} fill className="object-cover" priority />
            </div>
          ) : (
            <div className="aspect-square rounded-2xl bg-gray-100 flex items-center justify-center text-gray-300">No image</div>
          )}
          {p.images?.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {p.images.slice(1, 5).map((img: any, i: number) => {
                const imgUrl = mediaUrl(img.image as any)
                return imgUrl ? (
                  <div key={i} className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
                    <Image src={imgUrl} alt={img.alt ?? p.title} fill className="object-cover" />
                  </div>
                ) : null
              })}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="space-y-6">
          {p.category?.name && <p className="text-xs text-gray-400 uppercase tracking-widest">{p.category.name}</p>}
          <div className="flex items-start justify-between gap-4">
            <h1 className="text-3xl font-bold">{p.title}</h1>
            <WishlistButton itemType="product" itemId={p.id} />
          </div>

          {avgRating !== null && (
            <div className="flex items-center gap-2">
              <StarRating rating={avgRating} size="sm" />
              <span className="text-sm text-gray-500">({ratings.length} review{ratings.length !== 1 ? 's' : ''})</span>
            </div>
          )}

          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold">€{p.price.toFixed(2)}</span>
            {p.compareAtPrice && <span className="text-lg text-gray-400 line-through">€{p.compareAtPrice.toFixed(2)}</span>}
          </div>

          {soldOut ? (
            <div className="space-y-3">
              <p className="text-red-600 font-medium">Out of stock</p>
              <StockAlertButton itemType="product" itemId={p.id} />
            </div>
          ) : (
            <AddToCartButton
              item={{ id: `product-${p.id}`, type: 'product', productId: p.id, title: p.title, unitPrice: p.price, quantity: 1, image: firstImage && mediaUrl(firstImage as any) ? mediaUrl(firstImage as any)! : undefined, stock: p.stock }}
              className="w-full justify-center py-4 text-base"
            >
              Add to cart
            </AddToCartButton>
          )}

          <p className="text-sm text-gray-500">
            {soldOut ? '' : `${p.stock} in stock`}
          </p>

          {p.description && (
            <div className="prose prose-sm max-w-none text-gray-700 border-t pt-6">
              <h2 className="text-lg font-semibold mb-3">Description</h2>
              <p>{typeof p.description === 'string' ? p.description : 'See product details above.'}</p>
            </div>
          )}
        </div>
      </div>

      {/* Reviews */}
      {ratings.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Reviews ({ratings.length})</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {ratings.map((r: any) => (
              <div key={r.id} className="rounded-lg border p-4">
                <div className="flex items-center justify-between mb-2">
                  <StarRating rating={r.rating} size="sm" />
                  <span className="text-xs text-gray-400">{r.createdAt ? new Date(r.createdAt).toLocaleDateString('en-GB') : ''}</span>
                </div>
                {r.review && <p className="text-sm text-gray-700">{r.review}</p>}
                {r.customer?.name && <p className="text-xs text-gray-400 mt-2">— {r.customer.name}</p>}
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  )
}

export default function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  return (
    <Suspense>
      <ProductContent params={params} />
    </Suspense>
  )
}
