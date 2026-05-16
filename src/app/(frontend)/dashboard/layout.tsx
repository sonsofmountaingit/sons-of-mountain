import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import { auth } from '@/lib/auth'
import { DashboardNav } from './DashboardNav'

async function DashboardShell({ children }: { children: React.ReactNode }) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login?redirect=/dashboard')

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-black text-white flex items-start">
      <DashboardNav name={session.user.name ?? ''} email={session.user.email} />
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  )
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div className="min-h-[calc(100vh-4rem)] bg-black" />}>
      <DashboardShell>{children}</DashboardShell>
    </Suspense>
  )
}
