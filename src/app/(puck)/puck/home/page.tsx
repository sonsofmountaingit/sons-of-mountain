import { getPayload } from 'payload'
import config from '@payload-config'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import type { Data } from '@puckeditor/core'
import { PuckHomeEditorClient } from './PuckHomeEditorClient'

export const dynamic = 'force-dynamic'

async function EditorContent() {
  const requestHeaders = await headers()
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: requestHeaders })
  if (!user) redirect('/admin')

  const [homePage, hero, destCarousel, whyTravel, featuredTravels, calendarCta, testimonials] = await Promise.all([
    payload.findGlobal({ slug: 'home-page', depth: 0 }).catch(() => null),
    payload.findGlobal({ slug: 'hero', depth: 0 }).catch(() => null),
    payload.findGlobal({ slug: 'destination-carousel', depth: 0 }).catch(() => null),
    payload.findGlobal({ slug: 'why-travel-with-us', depth: 0 }).catch(() => null),
    payload.findGlobal({ slug: 'featured-travels', depth: 0 }).catch(() => null),
    payload.findGlobal({ slug: 'calendar-cta', depth: 0 }).catch(() => null),
    payload.findGlobal({ slug: 'testimonials-section', depth: 0 }).catch(() => null),
  ]) as any[]

  const savedPuckData = (homePage as any)?.puckData as Data | null | undefined

  const puckData: Data = savedPuckData?.content?.length ? savedPuckData : {
    root: { props: {} },
    content: [
      {
        type: 'DestinationCarouselBlock',
        props: {
          id: 'home-dest-carousel',
          sectionTitle: (destCarousel as any)?.sectionTitle ?? 'Дестинации',
          limit: 10,
          _destinations: [],
        },
      },
      {
        type: 'WhyTravelWithUsBlock',
        props: {
          id: 'home-why-travel',
          heading: (whyTravel as any)?.heading ?? 'WHY TRAVEL WITH US?',
          items: (whyTravel as any)?.items ?? [],
        },
      },
      {
        type: 'FeaturedTravelsBlock',
        props: {
          id: 'home-featured-travels',
          heading: (featuredTravels as any)?.heading ?? 'CHOOSE YOUR JOURNEY',
        },
      },
      {
        type: 'TestimonialsMarqueeBlock',
        props: {
          id: 'home-testimonials',
          heading: (testimonials as any)?.heading ?? '',
          subheading: (testimonials as any)?.subheading ?? '',
        },
      },
      {
        type: 'CalendarCtaBlock',
        props: {
          id: 'home-calendar-cta',
          heading: (calendarCta as any)?.heading ?? "What's your next peak?",
          subheading: (calendarCta as any)?.subheading ?? 'Разгледай всички предстоящи програми.',
          buttonText: (calendarCta as any)?.buttonText ?? 'View calendar',
          buttonUrl: (calendarCta as any)?.buttonUrl ?? '/calendar',
        },
      },
    ],
  }

  return <PuckHomeEditorClient initialData={puckData} />
}

export default function PuckHomeEditorPage() {
  return (
    <Suspense fallback={<div style={{ height: '100dvh', background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.3)', fontSize: 14, fontFamily: 'sans-serif' }}>Loading Visual Editor…</div>}>
      <EditorContent />
    </Suspense>
  )
}
