import type { Metadata } from 'next'
import { TermsAndConditions } from '@/components/ui/TermsAndConditions'
import { buildStaticMetadata } from '@/lib/metadata'

export async function generateMetadata(): Promise<Metadata> {
  return buildStaticMetadata('/legal/terms', {
    title: 'Общи условия — Sons of Mountains',
    description: 'Общи условия за използване на Sons of Mountains.',
  })
}

export default function TermsPage() {
  return <TermsAndConditions />
}
