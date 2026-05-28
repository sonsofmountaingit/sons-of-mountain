import { getPayload } from 'payload'
import config from '@payload-config'
import { Suspense } from 'react'
import { DestinationCarousel } from '@/components/ui/DestinationCarousel'
import { StoriesCarouselSection } from '@/components/ui/StoriesCarouselSection'
import { WhyTravelWithUs } from '@/components/ui/WhyTravelWithUs'
import { FeaturedTravels } from '@/components/ui/FeaturedTravels'
import { WhyTravelWithUsSection } from '@/components/ui/destination-page/WhyTravelWithUsSection'
import { Testimonials } from '@/components/ui/Testimonials'
import { CalendarCta } from '@/components/ui/CalendarCta'
import { ScrollReveal } from '@/components/ui/ScrollReveal'

export const dynamic = 'force-dynamic'


async function getStoriesData() {
  let stories: any[] = []
  try {
    const payload = await getPayload({ config })
    const { docs } = await payload.find({ collection: 'stories', limit: 10, sort: '-createdAt' })
    stories = docs
  } catch {}
  return { stories }
}

async function StoriesSection() {
  const { stories } = await getStoriesData()
  return (
    <StoriesCarouselSection
      stories={stories as Parameters<typeof StoriesCarouselSection>[0]['stories']}
    />
  )
}

export default function HomePage() {
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

      {/* <Suspense fallback={null}>
        <StoriesSection />
      </Suspense> */}

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
