import type { Metadata } from 'next'
import { Suspense } from 'react'
import { headers } from 'next/headers'
import { getPayload } from 'payload'
import config from '@payload-config'
import { DashboardClient } from './DashboardClient'

export const dynamic = 'force-dynamic'


export const metadata: Metadata = {
  title: 'Моят акаунт — Sons of Mountains',
  robots: { index: false },
}

async function DashboardContent() {
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: await headers() })
  if (!user || user.collection !== 'customers') return null

  const customerId = user.id

  const [registrations, orders, vouchers, media, ratingsDocs, confirmedRegs] = await Promise.all([
    payload.find({ collection: 'registrations', where: { customer: { equals: customerId } }, limit: 10, sort: '-createdAt' }),
    payload.find({ collection: 'orders', where: { customer: { equals: customerId } }, limit: 10, sort: '-createdAt' }),
    payload.find({ collection: 'gift-vouchers', where: { customer: { equals: customerId } }, limit: 10, sort: '-createdAt' }),
    payload.find({ collection: 'customer-media', where: { customer: { equals: customerId } }, limit: 0 }),
    payload.find({ collection: 'customer-ratings', where: { customer: { equals: customerId } }, limit: 0 }),
    payload.find({ collection: 'registrations', where: { and: [{ customer: { equals: customerId } }, { status: { in: ['confirmed', 'paid'] } }] }, limit: 1 }),
  ])

  return (
    <DashboardClient
      name={(user.name as string) ?? ''}
      email={user.email as string}
      registrations={registrations.docs as any}
      orders={orders.docs as any}
      vouchers={vouchers.docs as any}
      mediaCount={media.totalDocs}
      ratingsCount={ratingsDocs.totalDocs}
      hasConfirmedRegistration={confirmedRegs.totalDocs > 0}
    />
  )
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="px-6 lg:px-10 py-10 animate-pulse" />}>
      <DashboardContent />
    </Suspense>
  )
}
