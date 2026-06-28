import { getPayload } from 'payload'
import config from '@payload-config'
import { Suspense } from 'react'
import type { Metadata } from 'next'
import { DestinationCarousel } from '@/components/ui/DestinationCarousel'
import { WhyTravelWithUs } from '@/components/ui/WhyTravelWithUs'
import { FeaturedTravels } from '@/components/ui/FeaturedTravels'
import { Testimonials } from '@/components/ui/Testimonials'
import { CalendarCta } from '@/components/ui/CalendarCta'
import { ScrollReveal } from '@/components/ui/ScrollReveal'
import { PuckRender } from '@/components/blocks/PuckRender'
import { unstable_cache } from 'next/cache'
import type { Data } from '@puckeditor/core'
import { buildMetadata } from '@/lib/metadata'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: 'Sons of Mountains — Преоткривай света с нас',
    description: 'Организираме пътешествия до трудно достъпни места — там, където комфортът среща приключението. Групови пътувания, индивидуални програми и фотографски експедиции.',
    slug: '',
  })
}

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

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'Sons of Mountains',
      url: process.env.NEXT_PUBLIC_SERVER_URL ?? 'https://sonsofmountains.com',
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${process.env.NEXT_PUBLIC_SERVER_URL ?? 'https://sonsofmountains.com'}/destinations?q={search_term_string}`,
        },
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'TravelAgency',
      name: 'Sons of Mountains',
      url: process.env.NEXT_PUBLIC_SERVER_URL ?? 'https://sonsofmountains.com',
      logo: `${process.env.NEXT_PUBLIC_SERVER_URL ?? 'https://sonsofmountains.com'}/logo.png`,
      description: 'Организираме пътешествия до трудно достъпни места — там, където комфортът среща приключението.',
      sameAs: [
        'https://www.facebook.com/sonsofmountains',
        'https://www.instagram.com/sonsofmountains',
      ],
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'customer service',
        availableLanguage: 'Bulgarian',
      },
    },
  ]

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
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
    </>
  )
}
