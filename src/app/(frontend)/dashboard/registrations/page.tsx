import type { Metadata } from 'next'
import { Suspense } from 'react'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'
import { auth } from '@/lib/auth'
import { RegistrationsClient } from './RegistrationsClient'

export const dynamic = 'force-dynamic'


export const metadata: Metadata = {
  title: 'Моите регистрации — Sons of Mountains',
  robots: { index: false },
}

async function RegistrationsContent() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login?redirect=/dashboard/registrations')

  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'registrations',
    where: { betterAuthUserId: { equals: session.user.id } },
    limit: 50,
    sort: '-createdAt',
  })

  return <RegistrationsClient registrations={result.docs as any} />
}

export default function RegistrationsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <RegistrationsContent />
    </Suspense>
  )
}
