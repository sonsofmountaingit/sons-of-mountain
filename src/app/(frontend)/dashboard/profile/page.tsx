import type { Metadata } from 'next'
import { Suspense } from 'react'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { ProfileClient } from './ProfileClient'

export const metadata: Metadata = {
  title: 'Профил — Sons of Mountains',
  robots: { index: false },
}

async function ProfileContent() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login?redirect=/dashboard/profile')
  return <ProfileClient name={session.user.name ?? ''} email={session.user.email} />
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <ProfileContent />
    </Suspense>
  )
}
