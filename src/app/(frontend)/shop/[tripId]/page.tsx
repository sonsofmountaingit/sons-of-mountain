import { getPayload } from 'payload'
import config from '@payload-config'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import type { Metadata } from 'next'
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


interface Props { params: Promise<{ tripId: string }> }


async function getTripData(tripId: string) {
  try {
    const payload = await getPayload({ config })

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let trip: any = null
    try {
      trip = await payload.findByID({ collection: 'trips', id: tripId, depth: 2, overrideAccess: true })
    } catch {
      return null
    }
    if (!trip) return null

    const destination = trip.destination as Record<string, unknown> | null

    const [siblingsResult, settings] = await Promise.all([
      destination
        ? payload.find({
            collection: 'destinations',
            where: { and: [{ slug: { not_equals: (destination.slug as string) ?? '' } }, { type: { equals: destination.type } }] },
            limit: 3,
            depth: 1,
            overrideAccess: true,
          })
        : Promise.resolve({ docs: [] }),
      payload.findGlobal({ slug: 'site-settings', depth: 0, overrideAccess: true }),
    ])

    return { trip, destination, siblings: siblingsResult.docs, settings }
  } catch {
    return null
  }
}

export const metadata: Metadata = {
  title: 'Резервация — Sons of Mountains',
}

async function ShopTripContent({ params }: Props) {
  const { tripId } = await params
  const data = await getTripData(tripId)
  if (!data) notFound()

  const { trip, destination, siblings, settings } = data
  const d = destination as Record<string, unknown> | null

  const heroImage = d?.heroImage as { url?: string | null; alt?: string } | null
  const whyImage = d?.whyImage as { url?: string | null; alt?: string } | null
  const whyImagesRaw = d?.whyImages as { image: { url?: string | null; alt?: string } | null; alt?: string }[] | null
  const travelImage = d?.travelImage as { url?: string | null; alt?: string } | null
  const transportImage = d?.transportImage as { url?: string | null; alt?: string } | null
  const whyVisit = d?.whyVisit as { heading?: string; content?: Record<string, unknown> } | null
  const fitnessRatings = d?.fitnessRatings as { difficulty?: number; comfort?: number; nature?: number; culture?: number } | null
  const itinerary = d?.itinerary as { day: number; title: string; content?: Record<string, unknown> | null; image?: { url?: string | null; alt?: string } | null; stats?: { ascent?: string | null; descent?: string | null; distance?: string | null; duration?: string | null; accommodation?: string | null; meals?: string | null } | null }[] | null
  const accommodations = d?.accommodations as { locationLabel?: string | null; name?: string | null; description?: Record<string, unknown> | null; learnMoreUrl?: string | null; gallery?: { image: { url?: string | null; alt?: string } | null; alt?: string }[] | null }[] | null
  const communityPhotos = d?.communityPhotos as { photo?: { url?: string | null; alt?: string } | null }[] | null
  const faq = d?.faq as { question?: string | null; answer?: Record<string, unknown> | null }[] | null
  const included = d?.included as { item?: string | null }[] | null
  const notIncluded = d?.notIncluded as { item?: string | null }[] | null
  const equipmentList = trip.equipmentList as { item: string }[] | null
  const readinessChecklist = trip.readinessChecklist as { category: string; items: { item: string }[] }[] | null
  const guides = trip.guides as { id: string; name: string; photo?: { url?: string | null; alt?: string } | null; bio?: string | null; instagram?: string | null; specializations?: { item: string }[] | null; yearsExperience?: number | null }[] | null

  const destName = (d?.name as string) ?? ''

  const thisTrip = {
    id: String(trip.id),
    startDate: trip.startDate as string,
    endDate: trip.endDate as string,
    spotsAvailable: trip.spotsAvailable ?? 0,
    spotsTotal: trip.spotsTotal ?? 0,
    price: trip.price ?? 0,
    currency: (trip.currency ?? 'EUR') as string,
    status: trip.status as string,
  }

  const siblingCards = siblings.map((s) => ({
    name: s.name,
    slug: s.slug,
    heroImage: s.heroImage as { url?: string | null; alt?: string } | null,
    month: s.month ?? null,
  }))

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: destName,
    startDate: trip.startDate,
    endDate: trip.endDate,
    image: mediaUrl(heroImage?.url) ?? undefined,
    offers: {
      '@type': 'Offer',
      price: trip.price,
      priceCurrency: trip.currency ?? 'EUR',
      availability: trip.spotsAvailable ? 'https://schema.org/InStock' : 'https://schema.org/SoldOut',
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
        month={trip.startDate ? new Date(trip.startDate as string).toLocaleDateString('bg-BG', { month: 'long' }) : (d?.month as string | null)}
        maxParticipants={d?.maxParticipants as number | null}
        durationDays={d?.durationDays as number | null}
        price={trip.price ?? 0}
        currency={(trip.currency ?? 'EUR') as string}
        tripId={String(trip.id)}
        tripTitle={trip.title as string}
        spotsAvailable={trip.spotsAvailable as number | null}
        depositAmount={trip.depositAmount as number | null}
      />

      <HeroSection
        title={destName}
        subtitle={d?.introText as string | null}
        heroImage={mediaUrl(heroImage?.url)!}
        heroImageAlt={heroImage?.alt ?? destName}
      />

      <WhySection
        name={destName}
        whyImages={whyImages}
        heading={whyVisit?.heading}
        content={whyVisit?.content}
      />

      <IsThisForYouSection
        fitnessRatings={fitnessRatings}
        summaryHeading={d?.fitnessSummaryHeading as string | null}
        summaryText={d?.fitnessSummaryText as Record<string, unknown> | null}
        upcomingTrips={[thisTrip]}
        thumbnailImage={mediaUrl(heroImage?.url)}
        thumbnailImageAlt={heroImage?.alt}
      />

      <TravelTransportSection
        travelTitle={d?.travelTitle as string | null}
        travelDescription={d?.travelDescription as Record<string, unknown> | null}
        travelImage={mediaUrl(travelImage?.url)}
        travelImageAlt={travelImage?.alt}
        transportTitle={d?.transportTitle as string | null}
        transportDescription={d?.transportDescription as Record<string, unknown> | null}
        transportImage={mediaUrl(transportImage?.url)}
        transportImageAlt={transportImage?.alt}
      />

      <ItinerarySection itinerary={itinerary ?? []} />
        <EquipmentSection items={(equipmentList ?? []).map(e => e.item)} />
        <ReadinessChecklistSection categories={readinessChecklist ?? []} />
        <GuidesSection guides={guides ?? []} />

      <AccommodationsSection accommodations={accommodations} />

      <AdventureCtaSection
        durationDays={d?.durationDays as number | null}
        maxParticipants={d?.maxParticipants as number | null}
        price={trip.price ?? 0}
        currency={(trip.currency ?? 'EUR') as string}
        priceIncludes={d?.priceIncludes as string | null}
        communityPhotos={communityPhotos}
      />

      <BookingCtaSection
        name={destName}
        trips={[thisTrip]}
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
        continent={d?.continent as string | null}
        destinations={siblingCards}
      />

      <WhyTravelWithUsSection />
    </article>
  )
}

export default function ShopTripPage({ params }: Props) {
  return (
    <Suspense fallback={null}>
      <ShopTripContent params={params} />
    </Suspense>
  )
}
