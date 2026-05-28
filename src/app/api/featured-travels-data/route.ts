import { getPayload } from 'payload'
import config from '@payload-config'
import { mediaUrl } from '@/lib/media-url'

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

export async function GET() {
  const payload = await getPayload({ config })
  const g = await payload.findGlobal({ slug: 'featured-travels', depth: 2, overrideAccess: true, draft: true }) as any

  const rawItems: any[] = g?.items ?? []

  const items = rawItems.map((rel: any) => {
    if (!rel || typeof rel !== 'object') return null

    // Payload polymorphic relationships are returned as { relationTo, value }
    const kind = rel.relationTo as string
    const doc = rel.value as any

    if (!doc || typeof doc !== 'object') return null

    if (kind === 'destinations') {
      const image = doc.heroImage?.url ? mediaUrl(doc.heroImage.url) : null
      return {
        id: doc.id,
        kind: 'destination' as const,
        title: doc.name ?? '',
        subtitle: doc.introText ?? '',
        image,
        location: doc.name ?? '',
        month: doc.month ?? null,
        durationDays: null,
        price: null,
        currency: 'EUR',
        spotsAvailable: doc.availableSpots ?? null,
        slug: doc.slug,
        href: `/destinations/${doc.slug}`,
      }
    }

    if (kind === 'trips') {
      const dest = doc.destination as any
      const image = dest?.heroImage?.url ? mediaUrl(dest.heroImage.url) : null
      return {
        id: doc.id,
        kind: 'trip' as const,
        title: doc.title ?? '',
        subtitle: dest?.introText ?? '',
        image,
        location: dest?.name ?? '',
        month: monthFromDate(doc.startDate),
        durationDays: durationDays(doc.startDate, doc.endDate),
        price: doc.price ?? null,
        currency: doc.currency ?? 'EUR',
        spotsAvailable: doc.spotsAvailable ?? null,
        slug: doc.id,
        href: `/shop/${doc.id}`,
      }
    }

    if (kind === 'programs') {
      const image = doc.heroImage?.url ? mediaUrl(doc.heroImage.url) : null
      return {
        id: doc.id,
        kind: 'program' as const,
        title: doc.title ?? '',
        subtitle: doc.shortDescription ?? '',
        image,
        location: doc.location ?? '',
        month: monthFromDate(doc.startDate),
        durationDays: durationDays(doc.startDate, doc.endDate),
        price: doc.price ?? null,
        currency: doc.currency ?? 'EUR',
        spotsAvailable: doc.spotsAvailable ?? null,
        slug: doc.slug ?? doc.id,
        href: doc.slug ? `/programs/${doc.slug}` : `/programs/${doc.id}`,
      }
    }

    return null
  }).filter(Boolean)

  return Response.json({ heading: g?.heading ?? 'ИЗБЕРИ СВОЕТО ПЪТУВАНЕ', items })
}
