import { cookies, headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import { auth } from '@/lib/auth'
import { WishlistClient } from './WishlistClient'

export const metadata = { title: 'Любими' }

async function WishlistContent() {
  const h = await headers()
  const session = await auth.api.getSession({ headers: h })
  if (!session?.user) redirect('/login')

  const cookieStore = await cookies()
  const cookieHeader = cookieStore.toString()

  const base = process.env.NEXT_PUBLIC_SERVER_URL ?? 'http://localhost:3000'
  const res = await fetch(`${base}/api/wishlist`, {
    headers: { cookie: cookieHeader },
    cache: 'no-store',
  })
  const data = await res.json() as { wishlist?: unknown[] }
  const wishlist = data.wishlist ?? []

  return <WishlistClient wishlist={wishlist} />
}

export default function WishlistPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <WishlistContent />
    </Suspense>
  )
}
