import type { Metadata } from 'next'
import { TermsAndConditions } from '@/components/ui/TermsAndConditions'

export const metadata: Metadata = {
  title: 'Общи условия — Sons of Mountains',
  description: 'Общи условия за използване на Sons of Mountains.',
  alternates: { canonical: `${process.env.NEXT_PUBLIC_SERVER_URL ?? 'https://sonsofmountains.com'}/legal/terms` },
  robots: { index: true, follow: true },
}

export default function TermsPage() {
  return <TermsAndConditions />
}
