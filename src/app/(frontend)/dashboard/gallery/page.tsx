import type { Metadata } from 'next'
import { Suspense } from 'react'
import { GalleryDashboardClient } from './GalleryDashboardClient'

export const metadata: Metadata = {
  title: 'Галерии — Sons of Mountains',
  robots: { index: false },
}

export default function GalleryDashboardPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <GalleryDashboardClient />
    </Suspense>
  )
}
