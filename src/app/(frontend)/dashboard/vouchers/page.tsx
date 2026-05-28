import type { Metadata } from 'next'
import { Suspense } from 'react'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'
import { auth } from '@/lib/auth'
import { VouchersClient } from './VouchersClient'

export const dynamic = 'force-dynamic'


export const metadata: Metadata = {
  title: 'Моите ваучери — Sons of Mountains',
  robots: { index: false },
}

async function VouchersContent() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login?redirect=/dashboard/vouchers')

  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'gift-vouchers',
    where: { betterAuthUserId: { equals: session.user.id } },
    limit: 50,
    sort: '-createdAt',
  })

  return <VouchersClient vouchers={result.docs as any} />
}

export default function VouchersPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <VouchersContent />
    </Suspense>
  )
}
