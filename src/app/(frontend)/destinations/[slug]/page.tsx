import { getPayload } from 'payload'
import config from '@payload-config'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { Suspense } from 'react'
import { mediaUrl } from '@/lib/media-url'
import { TrackRecentlyViewed } from '@/components/ui/TrackRecentlyViewed'
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


async function getPageData(slug: string) {
  try {
    const payload = await getPayload({ config })

    const { docs } = await payload.find({
      collection: 'destinations',
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 2,
      overrideAccess: true,
    })
    const destination = docs[0] ?? null
    if (!destination) return null

    const [tripsResult, siblingsResult, settings] = await Promise.all([
      payload.find({
        collection: 'trips',
        where: { and: [{ destination: { equals: destination.id } }, { status: { not_equals: 'draft' } }] },
        sort: 'startDate',
        limit: 5,
        depth: 0,
        overrideAccess: true,
      }),
      payload.find({
        collection: 'destinations',
        where: { and: [{ slug: { not_equals: slug } }, { type: { equals: destination.type } }] },
        limit: 3,
        depth: 1,
        overrideAccess: true,
      }),
      payload.findGlobal({ slug: 'site-settings', depth: 0, overrideAccess: true }),
    ])

    return { destination, trips: tripsResult.docs, siblings: siblingsResult.docs, settings }
  } catch {
    return null
  }
}

export const metadata: Metadata = {
  title: 'Дестинация — Sons of Mountains',
}

async function DestinationContent({ params }: Props) {
  const { slug } = await params
  const data = await getPageData(slug)
  if (!data) notFound()

  const { destination, trips, siblings, settings } = data

  const heroImage = destination.heroImage as { url?: string | null; alt?: string } | null
  const whyImage = destination.whyImage as { url?: string | null; alt?: string } | null
  const whyImagesRaw = destination.whyImages as { image: { url?: string | null; alt?: string } | null; alt?: string }[] | null
  const travelImage = destination.travelImage as { url?: string | null; alt?: string } | null
  const transportImage = destination.transportImage as { url?: string | null; alt?: string } | null
  const whyVisit = destination.whyVisit as { heading?: string; content?: Record<string, unknown> } | null
  const fitnessRatings = destination.fitnessRatings as { difficulty?: number; comfort?: number; nature?: number; culture?: number } | null
  const itinerary = destination.itinerary as { day: number; title: string; content?: Record<string, unknown> | null; image?: { url?: string | null; alt?: string } | null; stats?: { ascent?: string | null; descent?: string | null; distance?: string | null; duration?: string | null; accommodation?: string | null; meals?: string | null } | null }[] | null
  const accommodations = destination.accommodations as { locationLabel?: string | null; name?: string | null; description?: Record<string, unknown> | null; learnMoreUrl?: string | null; gallery?: { image: { url?: string | null; alt?: string } | null; alt?: string }[] | null }[] | null
  const communityPhotos = destination.communityPhotos as { photo?: { url?: string | null; alt?: string } | null }[] | null
  const faq = destination.faq as { question?: string | null; answer?: Record<string, unknown> | null }[] | null
  const included = destination.included as { item?: string | null }[] | null
  const notIncluded = destination.notIncluded as { item?: string | null }[] | null
  const equipmentList = destination.equipmentList as { item: string }[] | null
  const readinessChecklist = destination.readinessChecklist as { category: string; items: { item: string }[] }[] | null
  const guides = destination.guides as { id: string; name: string; photo?: { url?: string | null; alt?: string } | null; bio?: string | null; instagram?: string | null; specializations?: { item: string }[] | null; yearsExperience?: number | null }[] | null

  const tripSummaries = trips.map((t) => ({
    id: String(t.id),
    title: t.title as string,
    startDate: t.startDate as string,
    endDate: t.endDate as string,
    spotsAvailable: t.spotsAvailable ?? 0,
    spotsTotal: t.spotsTotal ?? 0,
    price: t.price ?? 0,
    currency: t.currency ?? 'EUR',
    status: t.status as string,
    depositAmount: (t.depositAmount as number | null) ?? null,
  }))

  const firstTrip = tripSummaries[0]

  const siblingCards = siblings.map((s) => ({
    name: s.name,
    slug: s.slug,
    heroImage: s.heroImage as { url?: string | null; alt?: string } | null,
    month: s.month ?? null,
  }))

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TouristDestination',
    name: destination.name,
    description: destination.introText,
    image: mediaUrl(heroImage?.url) ?? undefined,
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
      <TrackRecentlyViewed id={String(destination.id)} />
      {firstTrip && (
        <FloatingBookingBar
          month={(destination as Record<string, unknown>).month as string | null}
          maxParticipants={(destination as Record<string, unknown>).maxParticipants as number | null}
          durationDays={(destination as Record<string, unknown>).durationDays as number | null}
          price={firstTrip.price}
          currency={firstTrip.currency}
          tripId={firstTrip.id}
          tripTitle={firstTrip.title}
          spotsAvailable={firstTrip.spotsAvailable}
          depositAmount={firstTrip.depositAmount}
        />
      )}

      <HeroSection
        title={destination.name}
        subtitle={destination.introText}
        heroImage={mediaUrl(heroImage?.url)!}
        heroImageAlt={heroImage?.alt ?? destination.name}
      />

      <WhySection
        name={destination.name}
        whyImages={whyImages}
        heading={whyVisit?.heading}
        content={whyVisit?.content}
      />

      <IsThisForYouSection
        fitnessRatings={fitnessRatings}
        summaryHeading={(destination as Record<string, unknown>).fitnessSummaryHeading as string | null}
        summaryText={(destination as Record<string, unknown>).fitnessSummaryText as Record<string, unknown> | null}
        upcomingTrips={tripSummaries}
        thumbnailImage={mediaUrl(heroImage?.url)}
        thumbnailImageAlt={heroImage?.alt}
      />

      <TravelTransportSection
        travelTitle={(destination as Record<string, unknown>).travelTitle as string | null}
        travelDescription={(destination as Record<string, unknown>).travelDescription as Record<string, unknown> | null}
        travelImage={mediaUrl(travelImage?.url)}
        travelImageAlt={travelImage?.alt}
        transportTitle={(destination as Record<string, unknown>).transportTitle as string | null}
        transportDescription={(destination as Record<string, unknown>).transportDescription as Record<string, unknown> | null}
        transportImage={mediaUrl(transportImage?.url)}
        transportImageAlt={transportImage?.alt}
      />

      <ItinerarySection itinerary={itinerary ?? []} />
        <EquipmentSection items={(equipmentList ?? []).map(e => e.item)} />
        <ReadinessChecklistSection categories={readinessChecklist ?? []} />
        <GuidesSection guides={guides ?? []} />

      <AccommodationsSection accommodations={accommodations} />

      <AdventureCtaSection
        durationDays={(destination as Record<string, unknown>).durationDays as number | null}
        maxParticipants={(destination as Record<string, unknown>).maxParticipants as number | null}
        price={firstTrip?.price ?? 0}
        currency={firstTrip?.currency ?? 'EUR'}
        priceIncludes={(destination as Record<string, unknown>).priceIncludes as string | null}
        communityPhotos={communityPhotos}
      />

      <BookingCtaSection
        name={destination.name}
        trips={tripSummaries}
        included={included ?? []}
        notIncluded={notIncluded ?? []}
        bgImage={mediaUrl(heroImage?.url)}
        bgImageAlt={heroImage?.alt}
      />

      <FaqSection
        faq={faq}
        email={(settings as Record<string, unknown>).contactEmail as string | null}
        phone={(settings as Record<string, unknown>).contactPhone as string | null}
      />

      <OtherDestinationsSection
        continent={(destination as Record<string, unknown>).continent as string | null}
        destinations={siblingCards}
      />

      <WhyTravelWithUsSection />
    </article>
  )
}

export default function DestinationPage({ params }: Props) {
  return (
    <Suspense fallback={null}>
      <DestinationContent params={params} />
    </Suspense>
  )
}
