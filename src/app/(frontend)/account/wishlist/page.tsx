import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Wishlist — Sons of Mountains' }

export default async function WishlistPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect('/auth/login?redirect=/account/wishlist')

  const payload = await getPayload({ config })
  const customer = await payload.find({
    collection: 'customers',
    where: { betterAuthId: { equals: (session.user as any).id } },
    limit: 1,
    depth: 3,
  })
  const cust = customer.docs[0]
  const wishlist = (cust as any)?.wishlist ?? []

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="text-3xl font-bold mb-8">My Wishlist</h1>

      {wishlist.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="mb-4">Your wishlist is empty. Save trips, programs, and products you love.</p>
          <Link href="/shop" className="rounded bg-gray-900 px-6 py-3 text-sm font-semibold text-white">Browse shop</Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {wishlist.map((item: any, i: number) => {
            const entity = item.trip ?? item.program ?? item.destination ?? item.product
            const href = item.itemType === 'trip' ? `/shop/${entity?.id}`
              : item.itemType === 'program' ? `/programs/${entity?.slug}`
              : item.itemType === 'destination' ? `/destinations/${entity?.slug}`
              : item.itemType === 'product' ? `/shop/products/${entity?.slug}`
              : '#'
            return (
              <Link key={i} href={href} className="rounded-lg border bg-white p-4 hover:shadow-md transition-shadow">
                <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">{item.itemType}</p>
                <p className="font-semibold">{entity?.title ?? entity?.name ?? 'Item'}</p>
                {entity?.price && <p className="text-sm text-gray-500 mt-1">€{entity.price}</p>}
              </Link>
            )
          })}
        </div>
      )}
    </main>
  )
}
