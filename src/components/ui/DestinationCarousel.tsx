import { getPayload } from 'payload'
import config from '@payload-config'
import { DestinationCarouselBlock } from '@/components/blocks/destination-carousel/DestinationCarouselBlock'
import { DestinationCarouselEditButton } from './DestinationCarouselEditButton'

async function getCarouselData() {
  const payload = await getPayload({ config })
  const [carousel, { docs: destinations }] = await Promise.all([
    payload.findGlobal({ slug: 'destination-carousel', depth: 2, overrideAccess: true }),
    payload.find({ collection: 'destinations', limit: 50, sort: 'name', depth: 2, draft: true, overrideAccess: true }),
  ])
  return { carousel, destinations }
}

export async function DestinationCarousel() {
  const { carousel, destinations } = await getCarouselData()

  const mapped = destinations.map((d: any) => ({
    id: d.id,
    name: d.name,
    slug: d.slug,
    heroImage: typeof d.heroImage === 'object' ? d.heroImage : null,
    month: d.month ?? undefined,
    spotsLabel: d.availableSpots != null ? `Само ${d.availableSpots} места` : undefined,
    availableSpots: d.availableSpots ?? undefined,
    price: d.price ?? undefined,
  }))

  return (
    <>
      <DestinationCarouselBlock
        sectionTitle={carousel?.sectionTitle ?? 'Дестинации'}
        headline={carousel?.headline ?? undefined}
        subheading={carousel?.subheading ?? undefined}
        destinations={mapped}
      />
      <DestinationCarouselEditButton />
    </>
  )
}
