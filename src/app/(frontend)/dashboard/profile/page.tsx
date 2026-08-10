import type { Metadata } from 'next'
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

export default async function ProfilePage() {
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: await headers() })
  if (!user || user.collection !== 'customers') redirect('/login?redirect=/dashboard/profile')

  const customer = await payload.findByID({ collection: 'customers', id: user.id, depth: 0 })
  return <ProfileClient initialProfile={{
    name: customer.name ?? '',
    email: customer.email,
    phone: customer.phone ?? '',
    preferredLang: customer.preferredLang ?? 'BG',
    dateOfBirth: customer.dateOfBirth ? String(customer.dateOfBirth).slice(0, 10) : '',
    address: customer.address ?? '',
  }} />
}
