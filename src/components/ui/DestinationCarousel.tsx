import { unstable_cache } from 'next/cache'
import { getPayload } from 'payload'
import config from '@payload-config'
import { DestinationCarouselBlock } from '@/components/blocks/destination-carousel/DestinationCarouselBlock'
import { DestinationCarouselEditButton } from './DestinationCarouselEditButton'

const getCarouselData = unstable_cache(
  async () => {
    try {
      const payload = await getPayload({ config })
      const [carousel, { docs: destinations }] = await Promise.all([
        payload.findGlobal({ slug: 'destination-carousel', depth: 2 }),
        payload.find({ collection: 'destinations', limit: 50, sort: 'name', depth: 2 }),
      ])
      return { carousel, destinations }
    } catch {
      return { carousel: null, destinations: [] }
    }
  },
  ['destination-carousel-global'],
  { tags: ['destination-carousel', 'destinations'], revalidate: 3600 },
)

export async function DestinationCarousel() {
  const { carousel, destinations } = await getCarouselData()

  const mapped = destinations.map((d: any) => ({
    id: d.id,
    name: d.name,
    slug: d.slug,
    heroImage: typeof d.heroImage === 'object' ? d.heroImage : null,
    month: d.month ?? undefined,
    spotsLabel: d.availableSpots != null ? `Само ${d.availableSpots} места` : undefined,
  }))

  return (
    <>
      <DestinationCarouselBlock
        sectionTitle={carousel?.sectionTitle ?? 'Дестинации'}
        destinations={mapped}
      />
      <DestinationCarouselEditButton />
    </>
  )
}
