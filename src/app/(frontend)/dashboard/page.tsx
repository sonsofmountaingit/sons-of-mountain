import type { Metadata } from 'next'
import { Suspense } from 'react'
import { headers } from 'next/headers'
import { getPayload } from 'payload'
import config from '@payload-config'
import { auth } from '@/lib/auth'
import { DashboardClient } from './DashboardClient'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Моят акаунт — Sons of Mountains',
  robots: { index: false },
}

async function DashboardContent() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return null

  const payload = await getPayload({ config })
  const betterAuthId = session.user.id

  const customerResult = await payload.find({
    collection: 'customers',
    where: { betterAuthId: { equals: betterAuthId } },
    limit: 1,
  })
  const customer = customerResult.docs[0]
  const customerId = customer?.id

  const [registrations, orders, vouchers, media, ratingsDocs, confirmedRegs] = await Promise.all([
    payload.find({ collection: 'registrations', where: { betterAuthUserId: { equals: betterAuthId } }, limit: 10, sort: '-createdAt' }),
    payload.find({ collection: 'orders', where: { betterAuthUserId: { equals: betterAuthId } }, limit: 10, sort: '-createdAt' }),
    payload.find({ collection: 'gift-vouchers', where: { betterAuthUserId: { equals: betterAuthId } }, limit: 10, sort: '-createdAt' }),
    customerId ? payload.find({ collection: 'customer-media', where: { customer: { equals: customerId } }, limit: 0 }) : Promise.resolve({ totalDocs: 0 }),
    customerId ? payload.find({ collection: 'customer-ratings', where: { customer: { equals: customerId } }, limit: 0 }) : Promise.resolve({ totalDocs: 0 }),
    payload.find({ collection: 'registrations', where: { and: [{ betterAuthUserId: { equals: betterAuthId } }, { status: { in: ['confirmed', 'paid'] } }] }, limit: 1 }),
  ])

  return (
    <DashboardClient
      name={session.user.name ?? ''}
      email={session.user.email}
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
