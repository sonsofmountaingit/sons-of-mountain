import { getPayload } from 'payload'
import config from '@payload-config'
import { unstable_cache } from 'next/cache'
import { mediaUrl } from '@/lib/media-url'
import { DestinationCarouselBlock } from '@/components/blocks/destination-carousel/DestinationCarouselBlock'
import { DestinationCarouselEditButton } from './DestinationCarouselEditButton'

interface CarouselGlobal {
  sectionTitle?: string
  headline?: string
  subheading?: string
  introSlideHeadline?: string
  introSlideSubheading?: string
  introSlideBackgroundImage?: { url?: string | null } | null
  introSlideButtonText?: string
  destinationButtonText?: string
  destinationSource?: 'auto' | 'manual'
  selectedDestinations?: Array<{
    destination?: {
      id?: string
      name?: string
      slug?: string
      heroImage?: { url?: string | null } | null
      month?: string
      availableSpots?: number | null
      price?: number | null
    } | null
    overrideTitle?: string | null
    overrideDescription?: string | null
    overrideButtonText?: string | null
  }>
}

interface DestinationDoc {
  id: string
  name: string
  slug: string
  heroImage?: { url?: string | null } | null
  month?: string
  availableSpots?: number | null
  price?: number | null
  overrideTitle?: string
  overrideDescription?: string
  overrideButtonText?: string
}

interface CarouselData {
  carousel: CarouselGlobal | null
  destinations: DestinationDoc[]
}

const getCarouselData = unstable_cache(
  async (): Promise<CarouselData> => {
    try {
      const payload = await getPayload({ config })
      const carousel = await payload.findGlobal({ slug: 'destination-carousel', depth: 2, overrideAccess: true }) as CarouselGlobal

      let destinations: DestinationDoc[] = []

      if (carousel.destinationSource === 'manual' && carousel.selectedDestinations?.length) {
        destinations = carousel.selectedDestinations
          .filter((row) => row.destination?.id)
          .map((row) => {
            const d = row.destination!
            return {
              id: String(d.id),
              name: d.name ?? '',
              slug: d.slug ?? '',
              heroImage: d.heroImage
                ? { url: d.heroImage.url ? mediaUrl(d.heroImage.url) : null }
                : null,
              month: d.month,
              availableSpots: d.availableSpots ?? null,
              price: d.price ?? null,
              overrideTitle: row.overrideTitle ?? undefined,
              overrideDescription: row.overrideDescription ?? undefined,
              overrideButtonText: row.overrideButtonText ?? undefined,
            }
          })
      } else {
        const { docs } = await payload.find({ collection: 'destinations', limit: 50, sort: 'name', depth: 2, draft: true, overrideAccess: true })
        destinations = docs.map((d) => {
          const doc = d as unknown as DestinationDoc & { heroImage?: { url?: string | null } | null }
          return {
            id: String(doc.id),
            name: doc.name ?? '',
            slug: doc.slug ?? '',
            heroImage: doc.heroImage
              ? { url: doc.heroImage.url ? mediaUrl(doc.heroImage.url) : null }
              : null,
            month: doc.month,
            availableSpots: doc.availableSpots ?? null,
            price: doc.price ?? null,
          }
        })
      }

      return { carousel, destinations }
    } catch (e) {
      console.error('[DestinationCarousel] fetch error:', e)
      return { carousel: null, destinations: [] }
    }
  },
  ['destination-carousel-data'],
  { tags: ['destination-carousel', 'destinations'], revalidate: false },
)

export async function DestinationCarousel() {
  const { carousel, destinations } = await getCarouselData()

  const mapped = destinations.map((d) => ({
    id: d.id,
    name: d.name,
    slug: d.slug,
    heroImage: d.heroImage,
    month: d.month,
    spotsLabel: d.availableSpots != null ? `Само ${d.availableSpots} места` : undefined,
    availableSpots: d.availableSpots ?? undefined,
    price: d.price ?? undefined,
    overrideTitle: d.overrideTitle,
    overrideDescription: d.overrideDescription,
    overrideButtonText: d.overrideButtonText,
  }))

  const introSlide = carousel?.introSlideHeadline && carousel?.introSlideSubheading ? {
    headline: carousel.introSlideHeadline,
    subheading: carousel.introSlideSubheading,
    backgroundImageUrl: carousel.introSlideBackgroundImage?.url ? mediaUrl(carousel.introSlideBackgroundImage.url) ?? undefined : undefined,
    buttonText: carousel.introSlideButtonText ?? 'Разгледај',
  } : undefined

  return (
    <>
      <DestinationCarouselBlock
        sectionTitle={carousel?.sectionTitle ?? 'Дестинации'}
        headline={carousel?.headline}
        subheading={carousel?.subheading}
        destinationButtonText={carousel?.destinationButtonText ?? 'Разгледай'}
        destinations={mapped}
        emptyMessage="В момента няма данни"
        introSlide={introSlide}
      />
      <DestinationCarouselEditButton />
    </>
  )
}
