import type { Metadata } from 'next'
import { PrivacyPolicy } from '@/components/ui/PrivacyPolicy'

export const metadata: Metadata = {
  title: 'Политика за поверителност — Sons of Mountains',
  description: 'Политика за поверителност на Sons of Mountains.',
  alternates: { canonical: `${process.env.NEXT_PUBLIC_SERVER_URL ?? 'https://sonsofmountains.com'}/legal/cookies` },
  robots: { index: true, follow: true },
}

export default function CookiesPage() {
  return <PrivacyPolicy />
}
