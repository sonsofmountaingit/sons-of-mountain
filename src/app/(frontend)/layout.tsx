import type { Metadata } from 'next'
import { Space_Grotesk } from 'next/font/google'
import { Suspense } from 'react'
import { Navigation } from '@/components/ui/Navigation'
import { Footer } from '@/components/ui/Footer'
import '../globals.css'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    template: '%s | Panic Frame',
    default: 'Panic Frame — Преоткривай света с нас',
  },
  description: 'Пътувай с Panic Frame там, където комфортът среща приключението.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SERVER_URL ?? 'http://localhost:3000'),
}

export default function FrontendLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="bg" className={spaceGrotesk.variable} suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Navigation />
        <main>{children}</main>
        <Suspense fallback={null}>
          <Footer />
        </Suspense>
      </body>
    </html>
  )
}
