import { getPayload } from 'payload'
import config from '@payload-config'
import { WhyTravelWithUsBlock } from '@/components/blocks/why-travel-with-us/WhyTravelWithUsBlock'
import { WhyTravelWithUsEditButton } from './WhyTravelWithUsEditButton'
import { mediaUrl } from '@/lib/media-url'

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
}

async function getData() {
  const payload = await getPayload({ config })
  const global = await payload.findGlobal({ slug: 'why-travel-with-us', depth: 1, overrideAccess: true }) as any
  return { global }
}

export async function WhyTravelWithUs() {
  const { global: g } = await getData()

  const heading = g?.heading ?? 'ЗАЩО ДА ПЪТУВАШ С НАС?'
  const ctaLabel = g?.ctaLabel ?? 'Научи повече'
  const ctaHref = g?.ctaHref ?? '/about'
  const items = g?.items ?? [
    { icon: 'camera', title: 'Автентичност', body: 'Пътувания, в които се сливаш с мястото, не просто го снимаш.' },
    { icon: 'globe', title: 'Общност', body: 'Малки групи от хора със сходен дух и жажда за приключения.' },
    { icon: 'city', title: 'Смисъл', body: 'Моменти, които остават в съзнанието дълго след като се приберeш.' },
  ]

  const videoCards: VideoCard[] = (g?.videoCards ?? [])
    .filter((c: any) => c.video?.url)
    .map((c: any) => ({
      id: c.tripId ?? String(c.id),
      itemType: (c.itemType ?? 'trip') as VideoCard['itemType'],
      title: c.title ?? '',
      price: c.price ?? 0,
      currency: c.currency ?? 'EUR',
      spotsAvailable: c.spotsAvailable ?? null,
      difficulty: c.difficulty ?? null,
      depositAmount: c.depositAmount ?? null,
      startDate: c.startDate ?? null,
      endDate: c.endDate ?? null,
      durationDays: c.durationDays ?? null,
      month: c.month ?? null,
      videoUrl: mediaUrl(c.video.url),
      posterUrl: c.poster?.url ? mediaUrl(c.poster.url) : null,
    }))

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
