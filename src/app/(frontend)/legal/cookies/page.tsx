import type { Metadata } from 'next'
import { PrivacyPolicy } from '@/components/ui/PrivacyPolicy'
import { buildStaticMetadata } from '@/lib/metadata'

export async function generateMetadata(): Promise<Metadata> {
  return buildStaticMetadata('/legal/cookies', {
    title: 'Политика за поверителност — Sons of Mountains',
    description: 'Политика за поверителност на Sons of Mountains.',
  })
}

export default function CookiesPage() {
  return <PrivacyPolicy />
}
