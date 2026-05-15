import type { Metadata } from 'next'
import { Suspense } from 'react'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'
import { auth } from '@/lib/auth'
import { DashboardClient } from './DashboardClient'

export const metadata: Metadata = {
  title: 'Моят акаунт — Sons of Mountains',
  robots: { index: false },
}

async function DashboardContent() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login?redirect=/dashboard')

  const payload = await getPayload({ config })
  const customerId = session.user.id

  const [registrations, orders, vouchers] = await Promise.all([
    payload.find({ collection: 'registrations', where: { betterAuthUserId: { equals: customerId } }, limit: 10, sort: '-createdAt' }),
    payload.find({ collection: 'orders', where: { betterAuthUserId: { equals: customerId } }, limit: 10, sort: '-createdAt' }),
    payload.find({ collection: 'gift-vouchers', where: { betterAuthUserId: { equals: customerId } }, limit: 10, sort: '-createdAt' }),
  ])

  return (
    <DashboardClient
      name={session.user.name ?? ''}
      email={session.user.email}
      registrations={registrations.docs as any}
      orders={orders.docs as any}
      vouchers={vouchers.docs as any}
    />
  )
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <DashboardContent />
    </Suspense>
  )
}
