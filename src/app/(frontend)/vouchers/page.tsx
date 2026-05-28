import type { Metadata } from 'next'
import { Suspense } from 'react'
import { headers } from 'next/headers'
import { getPayload } from 'payload'
import config from '@payload-config'
import { unstable_cache } from 'next/cache'
import { auth } from '@/lib/auth'
import { VouchersPageClient } from './VouchersPageClient'

export const dynamic = 'force-dynamic'


export const metadata: Metadata = {
  title: 'Gift Vouchers — Sons of Mountains',
  description: 'Buy, send, or redeem a Sons of Mountains gift voucher.',
}

const getVoucherOptions = unstable_cache(
  async () => {
    const payload = await getPayload({ config })
    const [destinations, trips, programs] = await Promise.all([
      payload.find({ collection: 'destinations', limit: 50, depth: 0 }),
      payload.find({ collection: 'trips', where: { status: { not_equals: 'draft' } }, sort: 'startDate', limit: 20, depth: 0 }),
      payload.find({ collection: 'programs', limit: 20, depth: 0 }),
    ])
    return { destinations: destinations.docs, trips: trips.docs, programs: programs.docs }
  },
  ['voucher-options'],
  { tags: ['destinations', 'trips', 'programs'], revalidate: 3600 }
)

async function VouchersContent() {
  const [session, { destinations, trips, programs }] = await Promise.all([
    auth.api.getSession({ headers: await headers() }),
    getVoucherOptions(),
  ])

  let myVouchers: any[] = []
  if (session) {
    const payload = await getPayload({ config })
    const result = await payload.find({
      collection: 'gift-vouchers',
      where: { betterAuthUserId: { equals: session.user.id } },
      limit: 50,
      sort: '-createdAt',
    })
    myVouchers = result.docs
  }

  return (
    <VouchersPageClient
      destinations={destinations}
      trips={trips}
      programs={programs}
      myVouchers={myVouchers}
    />
  )
}

export default function VouchersPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0a0a0a]" />}>
      <VouchersContent />
    </Suspense>
  )
}
