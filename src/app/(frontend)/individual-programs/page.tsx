import type { Metadata } from 'next'
import { unstable_cache } from 'next/cache'
import { getPayload } from 'payload'
import config from '@payload-config'
import { mediaUrl } from '@/lib/media-url'
import { buildStaticMetadata } from '@/lib/metadata'
import { IndividualProgramsPage as IndividualProgramsView } from '@/components/ui/IndividualProgramsPage'
import { PuckRender } from '@/components/blocks/PuckRender'
import type { Data } from '@puckeditor/core'

export const dynamic = 'force-dynamic'

const getIndividualProgramsMeta = unstable_cache(
  async () => {
    try {
      const payload = await getPayload({ config })
      return await payload.findGlobal({ slug: 'individual-programs-page', depth: 1, overrideAccess: true })
    } catch {
      return null
    }
  },
  ['individual-programs-page-meta'],
  { tags: ['individual-programs-page'], revalidate: false },
)

export async function generateMetadata(): Promise<Metadata> {
  const d = (await getIndividualProgramsMeta()) as any
  const heroImage = typeof d?.heroImage === 'object' ? d?.heroImage : null
  return buildStaticMetadata('/individual-programs', {
    title: 'Индивидуални програми — Sons of Mountains',
    description: d?.heroSubtext ?? 'Пътуване, скроено изцяло по твоите желания — дестинация, дати, темпо и хора по твой избор.',
    image: mediaUrl(heroImage?.url) ?? undefined,
  })
}

export default async function IndividualProgramsPage() {
  const d = (await getIndividualProgramsMeta()) as any
  const puckData = d?.puckData as Data | null | undefined

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: 'Individual Travel Program',
    provider: {
      '@type': 'TravelAgency',
      name: 'Sons of Mountains',
      url: process.env.NEXT_PUBLIC_SERVER_URL ?? 'https://sonsofmountains.com',
    },
    description: 'Индивидуални, персонализирани пътувания, изградени по желанията на клиента.',
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {puckData?.content?.length ? <PuckRender data={puckData} /> : <IndividualProgramsView />}
    </>
  )
}
