import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

const BG_MONTHS = ['януари','февруари','март','април','май','юни','юли','август','септември','октомври','ноември','декември']

export async function GET() {
  try {
    const payload = await getPayload({ config })

    const [footerData, navData] = await Promise.all([
      payload.findGlobal({ slug: 'footer', depth: 2 }),
      payload.findGlobal({ slug: 'navigation', depth: 1 }),
    ])

    const d = footerData as any
    const source = d?.travelLinkSource ?? 'auto'
    const selectedTrips: { trip: any }[] = d?.selectedTrips ?? []
    const manualIds = selectedTrips.map((s) => typeof s.trip === 'object' ? s.trip?.id : s.trip).filter(Boolean)

    let allTrips: any[] = []
    if (source === 'manual' && manualIds.length > 0) {
      const { docs } = await payload.find({
        collection: 'trips',
        where: { status: { not_equals: 'draft' } },
        sort: 'startDate',
        limit: 100,
        depth: 1,
      })
      allTrips = docs
    } else {
      const { docs } = await payload.find({
        collection: 'trips',
        where: { status: { equals: 'active' } },
        sort: 'startDate',
        limit: 20,
        depth: 1,
      })
      allTrips = docs
    }

    const trips = source === 'manual' && manualIds.length > 0
      ? manualIds.map((id) => allTrips.find((t: any) => String(t.id) === String(id))).filter(Boolean)
      : allTrips

    const travelLinks = trips.map((trip: any) => {
      const dest = trip.destination
      const name = typeof dest === 'object' ? dest?.name : String(dest)
      const slug = typeof dest === 'object' ? dest?.slug : null
      const date = trip.startDate ? new Date(trip.startDate) : null
      const year = date ? date.getFullYear() : null
      const currentYear = new Date().getFullYear()
      const month = date ? BG_MONTHS[date.getMonth()] : ''
      const monthLabel = year && year > currentYear ? `${month} ${year}` : month
      return {
        label: monthLabel ? `${name ?? trip.title} / ${monthLabel}` : (name ?? trip.title),
        href: slug ? `/destinations/${slug}` : '/destinations',
      }
    })

    const navLinkSource = d?.navLinkSource ?? 'auto'
    const manualNavLinks: { label: string; href: string }[] = d?.navLinks ?? []
    const n = navData as any
    const autoNavLinks: { label: string; href: string }[] = [
      ...(n?.navLinksLeft ?? []),
      ...(n?.navLinksRight ?? []),
    ]
    const navLinks = navLinkSource === 'manual' ? manualNavLinks : autoNavLinks

    return NextResponse.json({
      ...d,
      travelLinks,
      navLinks,
    })
  } catch (err) {
    return NextResponse.json({}, { status: 500 })
  }
}
