import { getPayload } from 'payload'
import config from '@payload-config'
import { unstable_cache } from 'next/cache'
import { WhyTravelWithUsBlock } from '@/components/blocks/why-travel-with-us/WhyTravelWithUsBlock'
import { WhyTravelWithUsEditButton } from './WhyTravelWithUsEditButton'
import { mediaUrl } from '@/lib/media-url'

interface WhyItem {
  icon?: 'camera' | 'globe' | 'city'
  title?: string
  body?: string
}

interface WhyVideoCard {
  id?: string
  tripId?: string
  itemType?: 'trip' | 'destination' | 'program'
  title?: string
  video?: { url?: string | null }
  poster?: { url?: string | null }
  price?: number
  currency?: string
  spotsAvailable?: number | null
  difficulty?: number | null
  depositAmount?: number | null
  startDate?: string | null
  endDate?: string | null
  durationDays?: number | null
  month?: string | null
}

interface WhyGlobal {
  heading?: string
  ctaLabel?: string
  ctaHref?: string
  items?: WhyItem[]
  videoCards?: WhyVideoCard[]
}

export type VideoCard = {
  id: string
  itemType: 'trip' | 'destination' | 'program'
  title: string
  price: number
  currency: string
  spotsAvailable: number | null
  difficulty: number | null
  depositAmount: number | null
  startDate: string | null
  endDate: string | null
  durationDays: number | null
  month: string | null
  videoUrl: string | null
  posterUrl: string | null
  earlyBirdPrice: number | null
  earlyBirdUntil: string | null
}

interface TripPriceData {
  price: number
  currency: string
  spotsAvailable: number | null
  depositAmount: number | null
  startDate: string | null
  endDate: string | null
  earlyBirdPrice: number | null
  earlyBirdUntil: string | null
}

const getData = unstable_cache(
  async () => {
    try {
      const payload = await getPayload({ config })
      const global = await payload.findGlobal({ slug: 'why-travel-with-us', depth: 1, overrideAccess: true })
      const g = global as unknown as WhyGlobal

      const tripIds = (g?.videoCards ?? [])
        .map((c) => c.tripId)
        .filter((id): id is string => !!id)

      const tripMap: Record<string, TripPriceData> = {}
      if (tripIds.length) {
        const { docs } = await payload.find({
          collection: 'trips',
          where: { id: { in: tripIds } },
          limit: tripIds.length,
          depth: 0,
          overrideAccess: true,
        })
        for (const t of docs) {
          const tr = t as Record<string, unknown>
          tripMap[String(t.id)] = {
            price: (t.price as number) ?? 0,
            currency: (t.currency as string) ?? 'EUR',
            spotsAvailable: (t.spotsAvailable as number | null) ?? null,
            depositAmount: (tr.depositAmount as number | null) ?? null,
            startDate: (t.startDate as string | null) ?? null,
            endDate: (t.endDate as string | null) ?? null,
            earlyBirdPrice: (tr.earlyBirdPrice as number | null) ?? null,
            earlyBirdUntil: (tr.earlyBirdUntil as string | null) ?? null,
          }
        }
      }

      return { global: g, tripMap }
    } catch {
      return { global: null as WhyGlobal | null, tripMap: {} as Record<string, TripPriceData> }
    }
  },
  ['why-travel-with-us'],
  { tags: ['why-travel-with-us'], revalidate: false },
)

export async function WhyTravelWithUs() {
  const { global: g, tripMap } = await getData()

  const heading = g?.heading ?? 'ЗАЩО ДА ПЪТУВАШ С НАС?'
  const ctaLabel = g?.ctaLabel ?? 'Научи повече'
  const ctaHref = g?.ctaHref ?? '/about'
  const VALID_ICONS = new Set<string>(['camera', 'globe', 'city'])
  const defaultItems = [
    { icon: 'camera' as const, title: 'Автентичност', body: 'Пътувания, в които се сливаш с мястото, не просто го снимаш.' },
    { icon: 'globe' as const, title: 'Общност', body: 'Малки групи от хора със сходен дух и жажда за приключения.' },
    { icon: 'city' as const, title: 'Смисъл', body: 'Моменти, които остават в съзнанието дълго след като се приберeш.' },
  ]
  const items = (g?.items ?? defaultItems).map((item) => ({
    icon: (VALID_ICONS.has(item.icon ?? '') ? item.icon : 'camera') as 'camera' | 'globe' | 'city',
    title: item.title ?? '',
    body: item.body ?? '',
  }))

  const videoCards: VideoCard[] = (g?.videoCards ?? [])
    .filter((c) => c.video?.url)
    .map((c) => {
      const trip = c.tripId ? (tripMap[c.tripId] ?? null) : null
      return {
        id: c.tripId ?? String(c.id),
        itemType: (c.itemType ?? 'trip') as VideoCard['itemType'],
        title: c.title ?? '',
        price: trip?.price ?? c.price ?? 0,
        currency: trip?.currency ?? c.currency ?? 'EUR',
        spotsAvailable: trip?.spotsAvailable ?? c.spotsAvailable ?? null,
        difficulty: c.difficulty ?? null,
        depositAmount: trip?.depositAmount ?? c.depositAmount ?? null,
        startDate: trip?.startDate ?? c.startDate ?? null,
        endDate: trip?.endDate ?? c.endDate ?? null,
        durationDays: c.durationDays ?? null,
        month: c.month ?? null,
        videoUrl: mediaUrl(c.video!.url!),
        posterUrl: c.poster?.url ? mediaUrl(c.poster.url) : null,
        earlyBirdPrice: trip?.earlyBirdPrice ?? null,
        earlyBirdUntil: trip?.earlyBirdUntil ?? null,
      }
    })

  return (
    <>
      <WhyTravelWithUsBlock
        heading={heading}
        items={items}
        ctaLabel={ctaLabel}
        ctaHref={ctaHref}
        videoCards={videoCards}
      />
      <WhyTravelWithUsEditButton />
    </>
  )
}
