import { getPayload } from 'payload'
import config from '@payload-config'
import { Suspense } from 'react'
import { DestinationCarousel } from '@/components/ui/DestinationCarousel'
import { WhyTravelWithUs } from '@/components/ui/WhyTravelWithUs'
import { FeaturedTravels } from '@/components/ui/FeaturedTravels'
import { Testimonials } from '@/components/ui/Testimonials'
import { CalendarCta } from '@/components/ui/CalendarCta'
import { ScrollReveal } from '@/components/ui/ScrollReveal'
import { PuckRender } from '@/components/blocks/PuckRender'
import { unstable_cache } from 'next/cache'
import type { Data } from '@puckeditor/core'

export const dynamic = 'force-dynamic'

const getHomePage = unstable_cache(
  async () => {
    try {
      const payload = await getPayload({ config })
      return await payload.findGlobal({ slug: 'home-page', depth: 0, overrideAccess: true })
    } catch { return null }
  },
  ['home-page-global'],
  { tags: ['home-page'], revalidate: false },
)

export default async function HomePage() {
  const d = (await getHomePage()) as any
  const puckData = d?.puckData as Data | null | undefined

  if (puckData?.content?.length) {
    return <PuckRender data={puckData} />
  }

  return (
    <div>
      <ScrollReveal delay={0}>
        <Suspense fallback={null}>
          <DestinationCarousel />
        </Suspense>
      </ScrollReveal>

      <ScrollReveal delay={0.05}>
        <Suspense fallback={null}>
          <WhyTravelWithUs />
        </Suspense>
      </ScrollReveal>

      <ScrollReveal delay={0.05}>
        <Suspense fallback={null}>
          <FeaturedTravels />
        </Suspense>
      </ScrollReveal>

      <ScrollReveal delay={0.05}>
        <Suspense fallback={null}>
          <Testimonials />
        </Suspense>
      </ScrollReveal>

      <ScrollReveal delay={0.05}>
        <Suspense fallback={null}>
          <CalendarCta />
        </Suspense>
      </ScrollReveal>
    </div>
  )
}
