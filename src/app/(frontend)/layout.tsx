import type { Metadata } from 'next'
import { Space_Grotesk, Dancing_Script } from 'next/font/google'
import { Suspense } from 'react'
import { cookies } from 'next/headers'
import { LanguageProvider } from '@/lib/language-context'
import type { Language } from '@/lib/translations'
import { Navigation } from '@/components/ui/Navigation'
import { Footer } from '@/components/ui/Footer'
import { GoogleAnalytics } from '@/components/analytics/GoogleAnalytics'
import { CookieConsentBanner } from '@/components/analytics/CookieConsentBanner'
import { Toaster } from 'sonner'
import '../globals.css'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-space-grotesk',
  display: 'swap',
  preload: true,
  adjustFontFallback: true,
  weight: ['400', '500', '600', '700'],
})

const dancingScript = Dancing_Script({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-dancing-script',
  display: 'swap',
  preload: false,
  adjustFontFallback: true,
  weight: ['400', '700'],
})

export const metadata: Metadata = {
  title: {
    template: '%s | Sons of Mountains',
    default: 'Sons of Mountains — Hikes, journeys, and expeditions in Bulgaria and around the world',
  },
  description: 'Travel with Sons of Mountains where comfort meets adventure.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SERVER_URL ?? 'http://localhost:3000'),
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  openGraph: {
    siteName: 'Sons of Mountains',
    locale: 'bg_BG',
    type: 'website',
  },
  icons: {
    icon: [
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [{ url: '/apple-icon.png', sizes: '180x180', type: 'image/png' }],
  },
}

export default async function FrontendLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  const stored = cookieStore.get('language')?.value as Language | undefined
  const initialLanguage: Language = stored === 'BG' || stored === 'EN' ? stored : 'BG'

  return (
    <html lang="bg" className={`${spaceGrotesk.variable} ${dancingScript.variable}`} data-scroll-behavior="smooth" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <GoogleAnalytics />
        <CookieConsentBanner />
        <LanguageProvider initialLanguage={initialLanguage}>
          <Navigation />
          <main className="pt-[72px] md:pt-[88px]">{children}</main>
          <Suspense fallback={null}>
            <Footer />
          </Suspense>
          <Toaster position="bottom-right" richColors closeButton duration={4000} />
        </LanguageProvider>
      </body>
    </html>
  )
}
