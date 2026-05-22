import { getPayload } from 'payload'
import config from '@payload-config'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import type { Metadata } from 'next'
import { cacheTag } from 'next/dist/server/use-cache/cache-tag'
import { cacheLife } from 'next/dist/server/use-cache/cache-life'
import { mediaUrl } from '@/lib/media-url'
import { HeroSection } from '@/components/ui/destination-page/HeroSection'
import { WhySection } from '@/components/ui/destination-page/WhySection'
import { IsThisForYouSection } from '@/components/ui/destination-page/IsThisForYouSection'
import { TravelTransportSection } from '@/components/ui/destination-page/TravelTransportSection'
import { ItinerarySection } from '@/components/ui/destination-page/ItinerarySection'
import EquipmentSection from '@/components/ui/destination-page/EquipmentSection'
import ReadinessChecklistSection from '@/components/ui/destination-page/ReadinessChecklistSection'
import GuidesSection from '@/components/ui/destination-page/GuidesSection'
import { AccommodationsSection } from '@/components/ui/destination-page/AccommodationsSection'
import { AdventureCtaSection } from '@/components/ui/destination-page/AdventureCtaSection'
import { BookingCtaSection } from '@/components/ui/destination-page/BookingCtaSection'
import { FaqSection } from '@/components/ui/destination-page/FaqSection'
import { OtherDestinationsSection } from '@/components/ui/destination-page/OtherDestinationsSection'
import { WhyTravelWithUsSection } from '@/components/ui/destination-page/WhyTravelWithUsSection'
import { DestinationPageAnimator } from '@/components/ui/destination-page/DestinationPageAnimator'
import { FloatingBookingBar } from '@/components/ui/destination-page/FloatingBookingBar'


interface Props { params: Promise<{ slug: string }> }


async function getProgramData(slug: string) {
  'use cache'
  cacheTag('programs')
  cacheLife('days')
  try {
    const payload = await getPayload({ config })

    const { docs } = await payload.find({
      collection: 'programs',
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 2,
    })
    const program = docs[0] ?? null
    if (!program) return null

    const [siblingsResult, settings] = await Promise.all([
      payload.find({
        collection: 'programs',
        where: { slug: { not_equals: slug } },
        limit: 3,
        depth: 1,
      }),
      payload.findGlobal({ slug: 'site-settings', depth: 0 }),
    ])

    return { program, siblings: siblingsResult.docs, settings }
  } catch {
    return null
  }
}

export const metadata: Metadata = {
  title: 'Програма — Sons of Mountains',
}

async function ProgramContent({ params }: Props) {
  const { slug } = await params
  const data = await getProgramData(slug)
  if (!data) notFound()

  const { program, siblings, settings } = data
  const p = program as Record<string, unknown>

  const heroImage = program.heroImage as { url?: string | null; alt?: string } | null
  const whyImage = p.whyImage as { url?: string | null; alt?: string } | null
  const whyImagesRaw = p.whyImages as { image: { url?: string | null; alt?: string } | null; alt?: string }[] | null
  const travelImage = p.travelImage as { url?: string | null; alt?: string } | null
  const transportImage = p.transportImage as { url?: string | null; alt?: string } | null
  const fitnessRatings = p.fitnessRatings as { difficulty?: number; comfort?: number; nature?: number; culture?: number } | null
  const itinerary = program.itinerary as { day: number; title: string; content?: Record<string, unknown> | null; image?: { url?: string | null; alt?: string } | null; stats?: { ascent?: string | null; descent?: string | null; distance?: string | null; duration?: string | null; accommodation?: string | null; meals?: string | null } | null }[] | null
  const accommodations = p.accommodations as { locationLabel?: string | null; name?: string | null; description?: Record<string, unknown> | null; learnMoreUrl?: string | null; gallery?: { image: { url?: string | null; alt?: string } | null; alt?: string }[] | null }[] | null
  const communityPhotos = p.communityPhotos as { photo?: { url?: string | null; alt?: string } | null }[] | null
  const faq = p.faq as { question?: string | null; answer?: Record<string, unknown> | null }[] | null
  const included = program.included as { item?: string | null }[] | null
  const notIncluded = program.notIncluded as { item?: string | null }[] | null
  const equipmentList = program.equipmentList as { item: string }[] | null
  const readinessChecklist = program.readinessChecklist as { category: string; items: { item: string }[] }[] | null
  const guides = program.guides as { id: string; name: string; photo?: { url?: string | null; alt?: string } | null; bio?: string | null; instagram?: string | null; specializations?: { item: string }[] | null; yearsExperience?: number | null }[] | null

  const programAsTripSummary = [{
    id: String(program.id),
    startDate: program.startDate as string,
    endDate: program.endDate as string,
    spotsAvailable: program.spotsAvailable ?? 0,
    spotsTotal: program.spotsTotal ?? 0,
    price: program.price ?? 0,
    currency: (program.currency ?? 'EUR') as string,
    status: (program.status ?? 'active') as string,
  }]

  const siblingCards = siblings.map((s) => ({
    name: s.title,
    slug: s.slug ?? String(s.id),
    heroImage: s.heroImage as { url?: string | null; alt?: string } | null,
    month: null,
  }))

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: program.title,
    description: program.shortDescription ?? undefined,
    startDate: program.startDate,
    endDate: program.endDate,
    image: mediaUrl(heroImage?.url) ?? undefined,
    offers: {
      '@type': 'Offer',
      price: program.price,
      priceCurrency: program.currency ?? 'EUR',
      availability: program.spotsAvailable ? 'https://schema.org/InStock' : 'https://schema.org/SoldOut',
    },
  }

  const whyImages = [
    ...((whyImagesRaw ?? [])
      .filter((w) => w.image?.url)
      .map((w) => ({ url: mediaUrl(w.image!.url)!, alt: w.alt ?? w.image?.alt }))),
    ...(whyImagesRaw?.length ? [] : whyImage?.url ? [{ url: mediaUrl(whyImage.url)!, alt: whyImage.alt }] : []),
  ]

  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <DestinationPageAnimator />
      <FloatingBookingBar
        month={program.startDate ? new Date(program.startDate as string).toLocaleDateString('bg-BG', { month: 'long' }) : null}
        maxParticipants={p.maxParticipants as number | null}
        durationDays={p.durationDays as number | null}
        price={program.price ?? 0}
        currency={(program.currency ?? 'EUR') as string}
        tripId={String(program.id)}
        tripTitle={program.title as string}
        itemType="program"
        spotsAvailable={program.spotsAvailable as number | null}
        depositAmount={program.depositAmount as number | null}
      />

      <HeroSection
        title={program.title ?? ''}
        subtitle={program.shortDescription}
        heroImage={mediaUrl(heroImage?.url)!}
        heroImageAlt={heroImage?.alt ?? program.title}
      />

      <WhySection
        name={program.title ?? ''}
        whyImages={whyImages}
        heading={p.fitnessSummaryHeading as string | null}
        content={program.description as Record<string, unknown> | null}
      />

      <IsThisForYouSection
        fitnessRatings={fitnessRatings}
        summaryHeading={p.fitnessSummaryHeading as string | null}
        summaryText={p.fitnessSummaryText as Record<string, unknown> | null}
        upcomingTrips={programAsTripSummary}
        thumbnailImage={mediaUrl(heroImage?.url)}
        thumbnailImageAlt={heroImage?.alt}
      />

      <TravelTransportSection
        travelTitle={p.travelTitle as string | null}
        travelDescription={p.travelDescription as Record<string, unknown> | null}
        travelImage={mediaUrl(travelImage?.url)}
        travelImageAlt={travelImage?.alt}
        transportTitle={p.transportTitle as string | null}
        transportDescription={p.transportDescription as Record<string, unknown> | null}
        transportImage={mediaUrl(transportImage?.url)}
        transportImageAlt={transportImage?.alt}
      />

      <ItinerarySection itinerary={itinerary ?? []} />
        <EquipmentSection items={(equipmentList ?? []).map(e => e.item)} />
        <ReadinessChecklistSection categories={readinessChecklist ?? []} />
        <GuidesSection guides={guides ?? []} />

      <AccommodationsSection accommodations={accommodations} />

      <AdventureCtaSection
        durationDays={p.durationDays as number | null}
        maxParticipants={p.maxParticipants as number | null}
        price={program.price ?? 0}
        currency={(program.currency ?? 'EUR') as string}
        priceIncludes={p.priceIncludes as string | null}
        communityPhotos={communityPhotos}
      />

      <BookingCtaSection
        name={program.title ?? ''}
        trips={programAsTripSummary}
        included={included ?? []}
        notIncluded={notIncluded ?? []}
        bgImage={mediaUrl(heroImage?.url)}
        bgImageAlt={heroImage?.alt}
        bookingHref={`/programs/${program.slug ?? String(program.id)}#booking`}
      />

      <FaqSection
        faq={faq}
        email={(settings as Record<string, unknown>).contactEmail as string | null}
        phone={(settings as Record<string, unknown>).contactPhone as string | null}
      />

      <OtherDestinationsSection
        continent={p.continent as string | null}
        destinations={siblingCards}
      />

      <WhyTravelWithUsSection />
    </article>
  )
}

export default function ProgramPage({ params }: Props) {
  return (
    <Suspense fallback={null}>
      <ProgramContent params={params} />
    </Suspense>
  )
}
