import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

function formatDate(date: string | Date): string {
  const d = new Date(date)
  return d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '').slice(0, 15) + 'Z'
}

function escapeIcal(str: string): string {
  return str.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n')
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ destinationSlug_ics: string }> }) {
  const resolvedParams = await params
  const slug = resolvedParams.destinationSlug_ics?.replace('_ics', '')
  if (!slug) return new NextResponse('Not found', { status: 404 })

  const payload = await getPayload({ config })
  const destResult = await payload.find({ collection: 'destinations', where: { slug: { equals: slug } }, limit: 1 })
  const dest = destResult.docs[0]
  if (!dest) return new NextResponse('Destination not found', { status: 404 })

  const trips = await payload.find({
    collection: 'trips',
    where: { and: [{ destination: { equals: dest.id } }, { status: { not_equals: 'draft' } }] },
    limit: 100,
  })

  const base = process.env.NEXT_PUBLIC_SERVER_URL ?? 'http://localhost:3000'
  const vevents: string[] = []

  for (const trip of trips.docs) {
    if (!trip.startDate || !trip.endDate) continue
    vevents.push([
      'BEGIN:VEVENT',
      `UID:trip-${trip.id}@sonsofmountains`,
      `DTSTART:${formatDate(trip.startDate)}`,
      `DTEND:${formatDate(trip.endDate)}`,
      `SUMMARY:${escapeIcal(trip.title ?? dest.name ?? '')}`,
      `DESCRIPTION:${escapeIcal(`${trip.spotsAvailable} spots • €${trip.price}`)}`,
      `URL:${base}/destinations/${dest.slug}`,
      `LOCATION:${escapeIcal(dest.name ?? '')}`,
      'END:VEVENT',
    ].join('\r\n'))
  }

  const ical = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Sons of Mountains//Adventures//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:${escapeIcal(dest.name ?? slug)} - Sons of Mountains`,
    ...vevents,
    'END:VCALENDAR',
  ].join('\r\n')

  return new NextResponse(ical, {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
      'Content-Disposition': `attachment; filename="${slug}.ics"`,
    },
  })
}
