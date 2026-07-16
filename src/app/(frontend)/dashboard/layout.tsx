import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'
import { DashboardNav } from './DashboardNav'

async function DashboardShell({ children }: { children: React.ReactNode }) {
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: await headers() })
  if (!user || user.collection !== 'customers') redirect('/login?redirect=/dashboard')

  return (
    <div className="min-h-[calc(100vh-5rem)] mt-20 bg-black text-white flex items-start">
      <DashboardNav name={(user.name as string) ?? ''} email={user.email as string} />
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  )
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div className="min-h-[calc(100vh-5rem)] mt-20 bg-black" />}>
      <DashboardShell>{children}</DashboardShell>
    </Suspense>
  )
}
