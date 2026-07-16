import type { Metadata } from 'next'
import { Suspense } from 'react'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'
import { MediaClient } from './MediaClient'
import { NoRegistrationGate } from '../NoRegistrationGate'

export const dynamic = 'force-dynamic'


export const metadata: Metadata = {
  title: 'Моята медия — Sons of Mountains',
  robots: { index: false },
}

async function MediaContent() {
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: await headers() })
  if (!user || user.collection !== 'customers') redirect('/login?redirect=/dashboard/media')

  const customer = { id: user.id }

  const registrations = await payload.find({
    collection: 'registrations',
    where: {
      and: [
        { customer: { equals: user.id } },
        { status: { in: ['confirmed', 'paid'] } },
      ],
    },
    limit: 1,
  })

  if (registrations.totalDocs === 0) {
    return <NoRegistrationGate type="media" />
  }

  const [mediaResult, destinations, trips] = await Promise.all([
    payload.find({
      collection: 'customer-media',
      where: { customer: { equals: customer.id } },
      sort: '-createdAt',
      limit: 100,
      depth: 2,
    }),
    payload.find({ collection: 'destinations', limit: 200, sort: 'name' }),
    payload.find({ collection: 'trips', limit: 200, sort: 'title' }),
  ])

  return (
    <MediaClient
      initialMedia={mediaResult.docs as any[]}
      destinations={destinations.docs as any[]}
      trips={trips.docs as any[]}
    />
  )
}

export default function MediaPage() {
  return (
    <Suspense fallback={<div className="px-6 lg:px-10 py-10 animate-pulse" />}>
      <MediaContent />
    </Suspense>
  )
}
