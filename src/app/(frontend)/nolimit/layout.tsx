import { NolimitNavbar } from '@/components/ui/NolimitNavbar'
import { Footer } from '@/components/ui/Footer'
import { Suspense } from 'react'

export default function NolimitLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <NolimitNavbar />
      <main>{children}</main>
      <Suspense fallback={null}>
        <Footer />
      </Suspense>
    </>
  )
}
