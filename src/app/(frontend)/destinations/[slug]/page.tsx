import { getPayload } from 'payload'
import config from '@payload-config'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { Suspense } from 'react'
import { mediaUrl } from '@/lib/media-url'
import { fetchWeather } from '@/lib/weather'
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
import { DestinationBookingController } from '@/components/ui/destination-page/DestinationBookingController'

export const dynamic = 'force-dynamic'

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

    const [siblingsResult, settings, ratingsResult] = await Promise.all([
      payload.find({
        collection: 'destinations',
        where: { and: [{ slug: { not_equals: slug } }, { type: { equals: destination.type } }] },
        limit: 3,
        depth: 1,
        overrideAccess: true,
      }),
      payload.findGlobal({ slug: 'site-settings', depth: 0, overrideAccess: true }),
      payload.find({
        collection: 'customer-ratings',
        where: { destination: { equals: destination.id } },
        limit: 1000,
        depth: 0,
        overrideAccess: true,
      }).catch(() => ({ docs: [] })),
    ])

    const ratings = ratingsResult.docs as { rating?: number | null }[]
    const avgRating = ratings.length
      ? Math.round((ratings.reduce((s, r) => s + (r.rating ?? 0), 0) / ratings.length) * 10) / 10
      : null

    const lat = (destination as Record<string, unknown>).latitude as number | null
    const lon = (destination as Record<string, unknown>).longitude as number | null
    const weather = lat && lon ? await fetchWeather(lat, lon) : null

    return { destination, siblings: siblingsResult.docs, settings, avgRating, reviewCount: ratings.length, weather }
  } catch {
    return null
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const data = await getPageData(slug)
  if (!data) return { title: 'Дестинация — Sons of Mountains' }
  return {
    title: `${data.destination.name} — Sons of Mountains`,
    description: data.destination.introText ?? undefined,
  }
}

async function DestinationContent({ params }: Props) {
  const { slug } = await params
  const data = await getPageData(slug)
  if (!data) notFound()

  const { destination, siblings, settings, avgRating, reviewCount, weather } = data
  const d = destination as Record<string, unknown>

  const heroImage = destination.heroImage as { url?: string | null; alt?: string } | null
  const heroVideo = destination.heroVideo as { url?: string | null } | null
  const heroGalleryRaw = destination.heroGallery as { image: { url?: string | null; alt?: string } | null; alt?: string }[] | null
  const whyImage = destination.whyImage as { url?: string | null; alt?: string } | null
  const whyImagesRaw = destination.whyImages as { image: { url?: string | null; alt?: string } | null; alt?: string }[] | null
  const whyVideosRaw = destination.whyVideos as { video: { url?: string | null } | null; thumbnail: { url?: string | null; alt?: string } | null; label?: string | null }[] | null
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

  const durationDays = (d.startDate && d.endDate)
    ? Math.ceil((new Date(d.endDate as string).getTime() - new Date(d.startDate as string).getTime()) / 86400000)
    : (d.durationDays as number | null) ?? null

  const thisItem = {
    id: String(destination.id),
    title: destination.name,
    startDate: d.startDate as string,
    endDate: d.endDate as string,
    spotsAvailable: (d.spotsAvailable as number | null) ?? 0,
    spotsTotal: (d.spotsTotal as number | null) ?? 0,
    price: (d.price as number | null) ?? 0,
    currency: 'EUR',
    status: (d.bookingStatus as string | null) ?? 'active',
    depositAmount: (d.depositAmount as number | null) ?? null,
  }

  const siblingCards = siblings.map((s) => ({
    name: s.name,
    slug: s.slug,
    heroImage: s.heroImage as { url?: string | null; alt?: string } | null,
    month: (s as Record<string, unknown>).month as string | null ?? null,
  }))

  const whyImages = (() => {
    const pool: { url: string; alt?: string | undefined }[] = []
    const galleryImgs = (heroGalleryRaw ?? [])
      .filter((g) => g.image?.url)
      .map((g) => ({ url: mediaUrl(g.image!.url)!, alt: (g.alt ?? g.image?.alt) ?? undefined }))
    pool.push(...galleryImgs)
    const itineraryImgs = (itinerary ?? [])
      .filter((i) => i.image?.url)
      .map((i) => ({ url: mediaUrl(i.image!.url)!, alt: i.image?.alt ?? undefined }))
    pool.push(...itineraryImgs)
    if (heroImage?.url) pool.push({ url: mediaUrl(heroImage.url)!, alt: heroImage.alt ?? undefined })
    const explicit = (whyImagesRaw ?? [])
      .filter((w) => w.image?.url)
      .map((w) => ({ url: mediaUrl(w.image!.url)!, alt: (w.alt ?? w.image?.alt) ?? undefined }))
    pool.push(...explicit)
    // deduplicate by url
    const seen = new Set<string>()
    return pool.filter((img) => { if (seen.has(img.url)) return false; seen.add(img.url); return true }).slice(0, 2)
  })()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TouristDestination',
    name: destination.name,
    description: destination.introText,
    image: mediaUrl(heroImage?.url) ?? undefined,
  }

  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <DestinationPageAnimator />
      <TrackRecentlyViewed id={String(destination.id)} />
      <DestinationBookingController
        month={(d.month as string | null) ?? (d.startDate ? new Date(d.startDate as string).toLocaleDateString('bg-BG', { month: 'long' }) : null)}
        startDate={d.startDate as string | null}
        endDate={d.endDate as string | null}
        maxParticipants={(d.maxParticipantsPerRegistration as number | null) ?? (d.maxParticipants as number | null)}
        durationDays={durationDays}
        price={(d.price as number | null) ?? 0}
        currency="EUR"
        tripId={String(destination.id)}
        tripTitle={destination.name}
        spotsAvailable={(d.spotsAvailable as number | null)}
        depositAmount={(d.depositAmount as number | null)}
      />

      <HeroSection
        title={destination.name}
        subtitle={destination.introText}
        heroImage={mediaUrl(heroImage?.url)!}
        heroImageAlt={heroImage?.alt ?? destination.name}
        heroVideo={heroVideo?.url ? mediaUrl(heroVideo.url) : null}
        heroGallery={(heroGalleryRaw ?? [])
          .filter(g => g.image?.url)
          .map(g => ({ url: mediaUrl(g.image!.url)!, alt: g.alt ?? g.image?.alt }))}
        departureCity={d.departureCity as string | null}
        difficulty={fitnessRatings?.difficulty ?? null}
        spotsAvailable={(d.spotsAvailable as number | null)}
        spotsTotal={(d.spotsTotal as number | null)}
        avgRating={avgRating}
        reviewCount={reviewCount}
        weather={weather}
        startDate={d.startDate as string | null}
        endDate={d.endDate as string | null}
        tripId={String(destination.id)}
        tripTitle={destination.name}
        price={(d.price as number | null) ?? 0}
        currency="EUR"
        depositAmount={(d.depositAmount as number | null)}
        durationDays={durationDays}
        month={(d.month as string | null) ?? null}
      />

      <WhySection
        name={destination.name}
        whyImages={whyImages}
        whyVideos={(whyVideosRaw ?? [])
          .filter(v => v.video?.url)
          .map(v => ({
            videoUrl: mediaUrl(v.video!.url)!,
            thumbnailUrl: v.thumbnail?.url ? mediaUrl(v.thumbnail.url) : undefined,
            thumbnailAlt: v.thumbnail?.alt,
            label: v.label ?? undefined,
          }))}
        heading={whyVisit?.heading}
        content={whyVisit?.content}
        tripId={String(destination.id)}
        tripTitle={destination.name}
        price={(d.price as number | null) ?? 0}
        spotsAvailable={(d.spotsAvailable as number | null) ?? null}
        spotsTotal={(d.spotsTotal as number | null) ?? null}
        difficulty={(fitnessRatings?.difficulty as number | null) ?? null}
        startDate={d.startDate as string | null}
        endDate={d.endDate as string | null}
      />

      <IsThisForYouSection
        fitnessRatings={fitnessRatings}
        summaryHeading={d.fitnessSummaryHeading as string | null}
        summaryText={d.fitnessSummaryText as Record<string, unknown> | null}
        upcomingTrips={[thisItem]}
        thumbnailImage={mediaUrl(heroImage?.url)}
        thumbnailImageAlt={heroImage?.alt}
      />

      <TravelTransportSection
        travelTitle={d.travelTitle as string | null}
        travelDescription={d.travelDescription as Record<string, unknown> | null}
        travelImage={mediaUrl(travelImage?.url)}
        travelImageAlt={travelImage?.alt}
        transportTitle={d.transportTitle as string | null}
        transportDescription={d.transportDescription as Record<string, unknown> | null}
        transportImage={mediaUrl(transportImage?.url)}
        transportImageAlt={transportImage?.alt}
      />

      <ItinerarySection itinerary={itinerary ?? []} />
      <section className="bg-black text-white py-10 sm:py-20">
        <div className="w-full grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 divide-white/10">
          <EquipmentSection items={(equipmentList ?? []).map(e => e.item)} />
          <ReadinessChecklistSection categories={readinessChecklist ?? []} />
        </div>
      </section>
      <GuidesSection guides={guides ?? []} />

      <AccommodationsSection accommodations={accommodations} />

      <AdventureCtaSection
        durationDays={durationDays}
        maxParticipants={(d.maxParticipants as number | null)}
        price={(d.price as number | null) ?? 0}
        currency="EUR"
        priceIncludes={d.priceIncludes as string | null}
        communityPhotos={communityPhotos}
      />

      <BookingCtaSection
        name={destination.name}
        trips={[thisItem]}
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
        continent={d.continent as string | null}
        destinations={siblingCards}
      />

      <WhyTravelWithUsSection images={whyImages.length ? whyImages : heroImage?.url ? [{ url: mediaUrl(heroImage.url)!, alt: heroImage.alt }] : []} />
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
