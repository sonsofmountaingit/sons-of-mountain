import { getPayload } from 'payload'
import config from '@payload-config'
import { Suspense } from 'react'
import { Hero } from '@/components/ui/Hero'
import { DestinationCarousel } from '@/components/ui/DestinationCarousel'
import { StoriesCarouselSection } from '@/components/ui/StoriesCarouselSection'
import { WhyTravelWithUs } from '@/components/ui/WhyTravelWithUs'
import { FeaturedTravels } from '@/components/ui/FeaturedTravels'
import { WhyTravelWithUsSection } from '@/components/ui/destination-page/WhyTravelWithUsSection'
import { Testimonials } from '@/components/ui/Testimonials'
import { CalendarCta } from '@/components/ui/CalendarCta'

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
      <div className="relative">
        <Suspense fallback={null}>
          <Hero />
        </Suspense>
        <Suspense fallback={null}>
          <DestinationCarousel />
        </Suspense>
      </div>

      <Suspense fallback={null}>
        <WhyTravelWithUs />
      </Suspense>

      <Suspense fallback={null}>
        <FeaturedTravels />
      </Suspense>

      {/* <Suspense fallback={null}>
        <StoriesSection />
      </Suspense> */}

      <Suspense fallback={null}>
        <Testimonials />
      </Suspense>

      <Suspense fallback={null}>
        <CalendarCta />
      </Suspense>

      <WhyTravelWithUsSection />
    </div>
  )
}
