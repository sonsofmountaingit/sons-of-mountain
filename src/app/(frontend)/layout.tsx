import type { Metadata } from 'next'
import { Space_Grotesk, Dancing_Script } from 'next/font/google'
import { Suspense } from 'react'
import { Navigation } from '@/components/ui/Navigation'
import { Footer } from '@/components/ui/Footer'
import { Toaster } from 'sonner'
import '../globals.css'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
})

const dancingScript = Dancing_Script({
  subsets: ['latin'],
  variable: '--font-dancing-script',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    template: '%s | Sons of Mountains',
    default: 'Sons of Mountains — Преоткривай света с нас',
  },
  description: 'Пътувай с Sons of Mountains там, където комфортът среща приключението.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SERVER_URL ?? 'http://localhost:3000'),
}

export default function FrontendLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="bg" className={`${spaceGrotesk.variable} ${dancingScript.variable}`} data-scroll-behavior="smooth" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Navigation />
        <main>{children}</main>
        <Suspense fallback={null}>
          <Footer />
        </Suspense>
        <Toaster position="bottom-right" richColors closeButton duration={4000} />
      </body>
    </html>
  )
}
