import { getPayload } from 'payload'
import config from '@payload-config'
import type { Metadata } from 'next'
import { GiftVoucherPurchaseForm } from './_components/GiftVoucherPurchaseForm'
import { Suspense } from 'react'
import { unstable_cache } from 'next/cache'


export const metadata: Metadata = {
  title: 'Gift Vouchers — Sons of Mountains',
  description: 'Give the gift of adventure',
}

const getVoucherOptions = unstable_cache(
  async () => {
    try {
      const payload = await getPayload({ config })
      const [destinations, trips, programs] = await Promise.all([
        payload.find({ collection: 'destinations', limit: 20, depth: 0, overrideAccess: true }),
        payload.find({ collection: 'trips', where: { status: { equals: 'active' } }, limit: 20, depth: 1, overrideAccess: true }),
        payload.find({ collection: 'programs', where: { status: { equals: 'active' } }, limit: 20, depth: 0, overrideAccess: true }),
      ])
      return { destinations: destinations.docs, trips: trips.docs, programs: programs.docs }
    } catch {
      return { destinations: [], trips: [], programs: [] }
    }
  },
  ['gift-voucher-options'],
  { tags: ['destinations', 'trips', 'programs'], revalidate: 3600 },
)

async function GiftVouchersContent() {
  const { destinations, trips, programs } = await getVoucherOptions()

  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-3">Give the Gift of Adventure</h1>
        <p className="text-gray-500 text-lg">Choose a destination, trip, or program — or let them pick their own.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          <h2 className="text-xl font-semibold mb-6">Voucher options</h2>
          <div className="space-y-3">
            <div className="rounded-lg border p-4 hover:border-gray-900 transition-colors cursor-pointer">
              <p className="font-semibold">Open Value</p>
              <p className="text-sm text-gray-500">Valid for any booking — recipient chooses</p>
            </div>
            {destinations.slice(0, 3).map((dest: any) => (
              <div key={dest.id} className="rounded-lg border p-4 hover:border-gray-900 transition-colors cursor-pointer">
                <p className="font-semibold">{dest.name}</p>
                <p className="text-sm text-gray-500">Destination voucher</p>
              </div>
            ))}
            {trips.slice(0, 3).map((trip: any) => {
              const dest = typeof trip.destination === 'object' ? trip.destination : null
              return (
                <div key={trip.id} className="rounded-lg border p-4 hover:border-gray-900 transition-colors cursor-pointer">
                  <p className="font-semibold">{trip.title ?? dest?.name}</p>
                  <p className="text-sm text-gray-500">Trip · {trip.startDate ? new Date(trip.startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : ''}</p>
                </div>
              )
            })}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-6">Customise your gift</h2>
          <GiftVoucherPurchaseForm destinations={destinations} trips={trips} programs={programs} />
        </div>
      </div>
    </main>
  )
}

export default function GiftVouchersPage() {
  return (
    <Suspense>
      <GiftVouchersContent />
    </Suspense>
  )
}
