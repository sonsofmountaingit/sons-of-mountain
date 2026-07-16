import type { Metadata } from 'next'
import { Suspense } from 'react'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'
import { ProfileClient } from './ProfileClient'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Профил — Sons of Mountains',
  robots: { index: false },
}

async function ProfileContent() {
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: await headers() })
  if (!user || user.collection !== 'users') redirect('/login?redirect=/dashboard/profile')
  return <ProfileClient name={(user.name as string) ?? ''} email={user.email as string} />
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <ProfileContent />
    </Suspense>
  )
}
