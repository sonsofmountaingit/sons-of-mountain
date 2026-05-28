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

export const dynamic = 'force-dynamic'

interface Props { params: Promise<{ slug: string }> }

async function getTripData(slug: string) {
  try {
    const payload = await getPayload({ config })
    const { docs } = await payload.find({
      collection: 'trips',
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 1,
      overrideAccess: true,
    })
    const trip = docs[0] ?? null
    if (!trip) return null

    const [otherTrips, settings] = await Promise.all([
      payload.find({
        collection: 'trips',
        where: { and: [{ slug: { not_equals: slug } }, { status: { equals: 'active' } }] },
        limit: 3,
        depth: 1,
        overrideAccess: true,
      }),
      payload.findGlobal({ slug: 'site-settings', depth: 0, overrideAccess: true }),
    ])

    return { trip, otherTrips: otherTrips.docs, settings }
  } catch {
    return null
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const data = await getTripData(slug)
  if (!data) return { title: 'Пътуване — Sons of Mountains' }
  const t = data.trip as Record<string, unknown>
  return {
    title: `${data.trip.title} — Sons of Mountains`,
    description: t.shortDescription as string ?? undefined,
  }
}

async function TripContent({ params }: Props) {
  const { slug } = await params
  const data = await getTripData(slug)
  if (!data) notFound()

  const { trip, otherTrips, settings } = data
  const t = trip as Record<string, unknown>

  const heroImage = t.heroImage as { url?: string | null; alt?: string } | null
  const whyImagesRaw = t.whyImages as { image: { url?: string | null; alt?: string } | null; alt?: string }[] | null
  const travelImage = t.travelImage as { url?: string | null; alt?: string } | null
  const transportImage = t.transportImage as { url?: string | null; alt?: string } | null
  const whyVisit = t.whyVisit as { heading?: string; content?: Record<string, unknown> } | null
  const fitnessRatings = t.fitnessRatings as { difficulty?: number; comfort?: number; nature?: number; culture?: number } | null
  const itinerary = (t.itinerary as { day: number; title: string; content?: Record<string, unknown> | null; image?: { url?: string | null; alt?: string } | null; stats?: { ascent?: string | null; descent?: string | null; distance?: string | null; duration?: string | null; accommodation?: string | null; meals?: string | null } | null }[] | null) ?? []
  const accommodations = t.accommodations as { locationLabel?: string | null; name?: string | null; description?: Record<string, unknown> | null; learnMoreUrl?: string | null; gallery?: { image: { url?: string | null; alt?: string } | null; alt?: string }[] | null }[] | null
  const communityPhotos = t.communityPhotos as { photo?: { url?: string | null; alt?: string } | null }[] | null
  const faq = t.faq as { question?: string | null; answer?: Record<string, unknown> | null }[] | null
  const included = t.included as { item?: string | null }[] | null
  const notIncluded = t.notIncluded as { item?: string | null }[] | null
  const equipmentList = t.equipmentList as { item: string }[] | null
  const readinessChecklist = t.readinessChecklist as { category: string; items: { item: string }[] }[] | null
  const guides = t.guides as { id: string; name: string; photo?: { url?: string | null; alt?: string } | null; bio?: string | null; instagram?: string | null; specializations?: { item: string }[] | null; yearsExperience?: number | null }[] | null

  const title = trip.title as string
  const subtitle = t.shortDescription as string | null

  const whyImages = (() => {
    const explicit = (whyImagesRaw ?? [])
      .filter((w) => w.image?.url)
      .map((w) => ({ url: mediaUrl(w.image!.url)!, alt: w.alt ?? w.image?.alt ?? undefined }))
    if (explicit.length >= 2) return explicit
    const pool: { url: string; alt?: string }[] = [...explicit]
    const itineraryImgs = (itinerary ?? [])
      .filter((i) => i.image?.url)
      .map((i) => ({ url: mediaUrl(i.image!.url)!, alt: i.image?.alt ?? undefined }))
    pool.push(...itineraryImgs)
    if (heroImage?.url) pool.push({ url: mediaUrl(heroImage.url)!, alt: heroImage.alt ?? undefined })
    return pool.slice(0, 2)
  })()

  const durationDays = trip.startDate && trip.endDate
    ? Math.ceil((new Date(trip.endDate as string).getTime() - new Date(trip.startDate as string).getTime()) / 86400000)
    : null

  const thisTrip = {
    id: String(trip.id),
    title,
    startDate: trip.startDate as string,
    endDate: trip.endDate as string,
    spotsAvailable: trip.spotsAvailable ?? 0,
    spotsTotal: trip.spotsTotal ?? 0,
    price: trip.price ?? 0,
    currency: (trip.currency ?? 'EUR') as string,
    status: trip.status as string,
    depositAmount: (t.depositAmount as number | null) ?? null,
  }

  const siblingCards = otherTrips.map((s) => {
    const st = s as Record<string, unknown>
    return {
      name: s.title as string,
      slug: s.slug as string,
      heroImage: st.heroImage as { url?: string | null; alt?: string } | null,
      month: s.startDate ? new Date(s.startDate as string).toLocaleDateString('bg-BG', { month: 'long' }) : null,
    }
  })

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: title,
    description: subtitle ?? undefined,
    startDate: trip.startDate,
    endDate: trip.endDate,
    location: (t.location as string | null) || undefined,
    image: mediaUrl(heroImage?.url) ?? undefined,
    offers: {
      '@type': 'Offer',
      price: trip.price,
      priceCurrency: trip.currency ?? 'EUR',
      availability: trip.spotsAvailable ? 'https://schema.org/InStock' : 'https://schema.org/SoldOut',
    },
  }

  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <DestinationPageAnimator />
      <TrackRecentlyViewed id={String(trip.id)} />
      <FloatingBookingBar
        month={trip.startDate ? new Date(trip.startDate as string).toLocaleDateString('bg-BG', { month: 'long' }) : null}
        maxParticipants={t.maxParticipantsPerRegistration as number | null}
        durationDays={durationDays}
        price={trip.price ?? 0}
        currency={(trip.currency ?? 'EUR') as string}
        tripId={String(trip.id)}
        tripTitle={title}
        spotsAvailable={trip.spotsAvailable as number | null}
        depositAmount={t.depositAmount as number | null}
      />

      <HeroSection
        title={title}
        subtitle={subtitle}
        heroImage={mediaUrl(heroImage?.url)!}
        heroImageAlt={heroImage?.alt ?? title}
      />

      <WhySection
        name={title}
        whyImages={whyImages}
        heading={whyVisit?.heading}
        content={whyVisit?.content}
      />

      <IsThisForYouSection
        fitnessRatings={fitnessRatings}
        summaryHeading={t.fitnessSummaryHeading as string | null}
        summaryText={t.fitnessSummaryText as Record<string, unknown> | null}
        upcomingTrips={[thisTrip]}
        thumbnailImage={mediaUrl(heroImage?.url)}
        thumbnailImageAlt={heroImage?.alt}
      />

      <TravelTransportSection
        travelTitle={t.travelTitle as string | null}
        travelDescription={t.travelDescription as Record<string, unknown> | null}
        travelImage={mediaUrl(travelImage?.url)}
        travelImageAlt={travelImage?.alt}
        transportTitle={t.transportTitle as string | null}
        transportDescription={t.transportDescription as Record<string, unknown> | null}
        transportImage={mediaUrl(transportImage?.url)}
        transportImageAlt={transportImage?.alt}
      />

      <ItinerarySection itinerary={itinerary} />
      <EquipmentSection items={(equipmentList ?? []).map(e => e.item)} />
      <ReadinessChecklistSection categories={readinessChecklist ?? []} />
      <GuidesSection guides={guides ?? []} />

      <AccommodationsSection accommodations={accommodations} />

      <AdventureCtaSection
        durationDays={durationDays}
        maxParticipants={t.maxParticipantsPerRegistration as number | null}
        price={trip.price ?? 0}
        currency={(trip.currency ?? 'EUR') as string}
        priceIncludes={t.priceIncludes as string | null}
        communityPhotos={communityPhotos}
      />

      <BookingCtaSection
        name={title}
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
        continent={t.continent as string | null}
        destinations={siblingCards}
      />

      <WhyTravelWithUsSection images={whyImages.length ? whyImages : heroImage?.url ? [{ url: mediaUrl(heroImage.url)!, alt: heroImage.alt }] : []} />
    </article>
  )
}

export default function TripPage({ params }: Props) {
  return (
    <Suspense fallback={null}>
      <TripContent params={params} />
    </Suspense>
  )
}
