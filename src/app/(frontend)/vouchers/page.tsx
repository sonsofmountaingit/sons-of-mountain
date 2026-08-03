import type { Metadata } from 'next'
import { Suspense } from 'react'
import { headers } from 'next/headers'
import { getPayload } from 'payload'
import config from '@payload-config'
import { unstable_cache } from 'next/cache'
import { VouchersPageClient } from './VouchersPageClient'
import { VouchersEditButton } from '@/components/ui/VouchersEditButton'

export const dynamic = 'force-dynamic'


export const metadata: Metadata = {
  title: 'Ваучери — Sons of Mountains',
  robots: { index: false, follow: false },
}

const getVoucherOptions = unstable_cache(
  async () => {
    const payload = await getPayload({ config })
    const [destinations, trips, programs, vouchersGlobal] = await Promise.all([
      payload.find({ collection: 'destinations', where: { bookingStatus: { not_equals: 'archived' } }, limit: 50, depth: 0 }),
      payload.find({ collection: 'trips', where: { status: { not_equals: 'draft' } }, sort: 'startDate', limit: 100, depth: 0 }),
      payload.find({ collection: 'programs', limit: 100, depth: 0 }),
      payload.findGlobal({ slug: 'vouchers', depth: 0 }),
    ])

    const programGroups = [
      { id: 'individual', label: 'ЗА ВСЕКИ ПРЕХОД' },
      { id: 'bulgaria', label: 'В БЪЛГАРИЯ' },
      { id: 'abroad', label: 'В ЧУЖБИНА' },
    ].map((group) => ({
      ...group,
      items: [
        ...trips.docs.filter((t: any) => t.navSection === group.id).map((t: any) => ({
          id: t.id,
          title: t.title,
          kind: 'trip' as const,
          price: t.price,
          currency: t.currency,
          earlyBirdPrice: t.earlyBirdPrice,
          earlyBirdUntil: t.earlyBirdUntil,
        })),
        ...programs.docs.filter((p: any) => p.navSection === group.id).map((p: any) => ({
          id: p.id,
          title: p.title,
          kind: 'program' as const,
          price: p.price,
          currency: p.currency,
          earlyBirdPrice: p.earlyBirdPrice,
          earlyBirdUntil: p.earlyBirdUntil,
        })),
      ],
    }))

    return { destinations: destinations.docs, trips: trips.docs, programs: programs.docs, programGroups, vouchersGlobal }
  },
  ['voucher-options'],
  { tags: ['destinations', 'trips', 'programs', 'vouchers'], revalidate: false }
)

async function VouchersContent() {
  const payload = await getPayload({ config })
  const [{ user }, { destinations, trips, programs, programGroups, vouchersGlobal }] = await Promise.all([
    payload.auth({ headers: await headers() }),
    getVoucherOptions(),
  ])

  let myVouchers: any[] = []
  if (user?.collection === 'customers') {
    const result = await payload.find({
      collection: 'gift-vouchers',
      where: { customer: { equals: user.id } },
      limit: 50,
      sort: '-createdAt',
    })
    myVouchers = result.docs
  }

  return (
    <>
      <VouchersPageClient
        destinations={destinations}
        trips={trips}
        programs={programs}
        programGroups={programGroups}
        myVouchers={myVouchers}
        content={vouchersGlobal as any}
      />
      <VouchersEditButton />
    </>
  )
}

export default function VouchersPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0a0a0a]" />}>
      <VouchersContent />
    </Suspense>
  )
}
