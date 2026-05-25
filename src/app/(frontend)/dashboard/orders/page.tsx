import type { Metadata } from 'next'
import { Suspense } from 'react'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'
import { auth } from '@/lib/auth'
import { OrdersClient } from './OrdersClient'


export const metadata: Metadata = {
  title: 'Моите поръчки — Sons of Mountains',
  robots: { index: false },
}

async function OrdersContent() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login?redirect=/dashboard/orders')

  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'orders',
    where: { betterAuthUserId: { equals: session.user.id } },
    limit: 50,
    sort: '-createdAt',
  })

  return <OrdersClient orders={result.docs as any} />
}

export default function OrdersPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <OrdersContent />
    </Suspense>
  )
}
