import { getPayload } from 'payload'
import config from '@payload-config'
import { unstable_cache } from 'next/cache'
import { mediaUrl } from '@/lib/media-url'
import { FeaturedTravelsBlock, type FeaturedTravelItem } from '@/components/blocks/featured-travels/FeaturedTravelsBlock'
import { FeaturedTravelsEditButton } from './FeaturedTravelsEditButton'

const BG_MONTHS = ['Януари', 'Февруари', 'Март', 'Април', 'Май', 'Юни', 'Юли', 'Август', 'Септември', 'Октомври', 'Ноември', 'Декември']

function monthFromDate(date: string | null | undefined): string | null {
  if (!date) return null
  const d = new Date(date)
  if (isNaN(d.getTime())) return null
  return BG_MONTHS[d.getMonth()] ?? null
}

function durationDays(start: string | null | undefined, end: string | null | undefined): number | null {
  if (!start || !end) return null
  const ms = new Date(end).getTime() - new Date(start).getTime()
  if (isNaN(ms) || ms <= 0) return null
  return Math.round(ms / 86400000)
}

const getData = unstable_cache(
  async () => {
    const payload = await getPayload({ config })
    const g = await payload.findGlobal({ slug: 'featured-travels', depth: 2, overrideAccess: true }) as any

    const rawItems: any[] = g?.items ?? []

    const items: FeaturedTravelItem[] = rawItems.map((rel: any) => {
      if (!rel || typeof rel !== 'object') return null
      const kind = rel.relationTo as string
      const doc = rel.value as any
      if (!doc || typeof doc !== 'object') return null

      if (kind === 'destinations') {
        return {
          id: String(doc.id),
          kind: 'destination' as const,
          title: doc.name ?? '',
          subtitle: doc.introText ?? '',
          image: doc.heroImage?.url ? mediaUrl(doc.heroImage.url) : null,
          location: doc.name ?? '',
          month: doc.month ?? null,
          durationDays: null,
          price: null,
          currency: 'EUR',
          spotsAvailable: doc.availableSpots ?? null,
          href: `/destinations/${doc.slug}`,
        }
      }
      if (kind === 'trips') {
        const dest = doc.destination as any
        return {
          id: String(doc.id),
          kind: 'trip' as const,
          title: doc.title ?? '',
          subtitle: dest?.introText ?? '',
          image: dest?.heroImage?.url ? mediaUrl(dest.heroImage.url) : null,
          location: dest?.name ?? '',
          month: monthFromDate(doc.startDate),
          durationDays: durationDays(doc.startDate, doc.endDate),
          price: doc.price ?? null,
          currency: doc.currency ?? 'EUR',
          spotsAvailable: doc.spotsAvailable ?? null,
          href: `/shop/${doc.id}`,
        }
      }
      if (kind === 'programs') {
        return {
          id: String(doc.id),
          kind: 'program' as const,
          title: doc.title ?? '',
          subtitle: doc.shortDescription ?? '',
          image: doc.heroImage?.url ? mediaUrl(doc.heroImage.url) : null,
          location: doc.location ?? '',
          month: monthFromDate(doc.startDate),
          durationDays: durationDays(doc.startDate, doc.endDate),
          price: doc.price ?? null,
          currency: doc.currency ?? 'EUR',
          spotsAvailable: doc.spotsAvailable ?? null,
          href: doc.slug ? `/programs/${doc.slug}` : `/programs/${doc.id}`,
        }
      }
      return null
    }).filter(Boolean) as FeaturedTravelItem[]

    return { heading: g?.heading ?? 'ИЗБЕРИ СВОЕТО ПЪТУВАНЕ', items }
  },
  ['featured-travels'],
  { tags: ['featured-travels'], revalidate: 3600 },
)

export async function FeaturedTravels() {
  const { heading, items } = await getData()
  if (!items.length) return null
  return (
    <>
      <FeaturedTravelsBlock heading={heading} items={items} />
      <FeaturedTravelsEditButton />
    </>
  )
}
