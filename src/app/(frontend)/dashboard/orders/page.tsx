import type { Metadata } from 'next'
import { Suspense } from 'react'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'
import { OrdersClient } from './OrdersClient'

export const dynamic = 'force-dynamic'


export const metadata: Metadata = {
  title: 'Моите поръчки — Sons of Mountains',
  robots: { index: false },
}

async function OrdersContent() {
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: await headers() })
  if (!user || user.collection !== 'customers') redirect('/login?redirect=/dashboard/orders')

  const result = await payload.find({
    collection: 'orders',
    where: { customer: { equals: user.id } },
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
