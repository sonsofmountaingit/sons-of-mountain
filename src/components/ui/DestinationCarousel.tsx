import { getPayload } from 'payload'
import config from '@payload-config'
import { unstable_cache } from 'next/cache'
import { cookies } from 'next/headers'
import { mediaUrl } from '@/lib/media-url'
import { DestinationCarouselBlock } from '@/components/blocks/destination-carousel/DestinationCarouselBlock'
import { DestinationCarouselEditButton } from './DestinationCarouselEditButton'
import { translations, type Language } from '@/lib/translations'

type RelatedItem = {
  id?: string
  // destinations use `name`, trips/programs use `title`
  name?: string
  title?: string
  slug?: string
  heroImage?: { url?: string | null } | null
  month?: string
  availableSpots?: number | null
  spotsAvailable?: number | null
  price?: number | null
}

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
  selectedItems?: Array<{
    item?: { relationTo: 'destinations' | 'trips' | 'programs'; value: RelatedItem } | null
    overrideTitle?: string | null
    overrideDescription?: string | null
    overrideButtonText?: string | null
  }>
  /** @deprecated use selectedItems */
  selectedDestinations?: Array<{
    destination?: RelatedItem | null
    overrideTitle?: string | null
    overrideDescription?: string | null
    overrideButtonText?: string | null
  }>
}

const COLLECTION_TO_PATH: Record<'destinations' | 'trips' | 'programs', string> = {
  destinations: 'destinations',
  trips: 'trips',
  programs: 'programs',
}

interface DestinationDoc {
  id: string
  name: string
  slug: string
  kind: 'destinations' | 'trips' | 'programs'
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

      const manualItems = carousel.selectedItems?.length
        ? carousel.selectedItems
        : carousel.selectedDestinations?.map((row) => ({
            item: row.destination ? { relationTo: 'destinations' as const, value: row.destination } : null,
            overrideTitle: row.overrideTitle,
            overrideDescription: row.overrideDescription,
            overrideButtonText: row.overrideButtonText,
          })) ?? []

      if (carousel.destinationSource === 'manual' && manualItems.length) {
        destinations = manualItems
          .filter((row) => row.item?.value?.id)
          .map((row) => {
            const d = row.item!.value
            return {
              id: `${row.item!.relationTo}-${d.id}`,
              name: d.name ?? d.title ?? '',
              slug: d.slug ?? '',
              kind: row.item!.relationTo,
              heroImage: d.heroImage
                ? { url: d.heroImage.url ? mediaUrl(d.heroImage.url) : null }
                : null,
              month: d.month,
              availableSpots: d.availableSpots ?? d.spotsAvailable ?? null,
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
            id: `destinations-${doc.id}`,
            name: doc.name ?? '',
            slug: doc.slug ?? '',
            kind: 'destinations' as const,
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
  const cookieStore = await cookies()
  const stored = cookieStore.get('language')?.value as Language | undefined
  const language: Language = stored === 'BG' || stored === 'EN' ? stored : 'BG'
  const t = translations[language]

  const mapped = destinations.map((d) => ({
    id: d.id,
    name: d.name,
    slug: d.slug,
    href: `/${COLLECTION_TO_PATH[d.kind]}/${d.slug}`,
    heroImage: d.heroImage,
    month: d.month,
    spotsLabel: d.availableSpots != null ? `${t.common.available}: ${d.availableSpots}` : undefined,
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
    buttonText: carousel.introSlideButtonText ?? t.destination_page.explore,
  } : undefined

  return (
    <>
      <DestinationCarouselBlock
        sectionTitle={carousel?.sectionTitle ?? t.destination_page.destinations_title}
        headline={carousel?.headline}
        subheading={carousel?.subheading}
        destinationButtonText={carousel?.destinationButtonText ?? t.destination_page.explore}
        destinations={mapped}
        emptyMessage={t.destination_page.no_data}
        introSlide={introSlide}
      />
      <DestinationCarouselEditButton />
    </>
  )
}
