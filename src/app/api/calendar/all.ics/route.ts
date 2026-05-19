import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

function formatDate(date: string | Date): string {
  const d = new Date(date)
  return d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '').replace('T', 'T').slice(0, 15) + 'Z'
}

function escapeIcal(str: string): string {
  return str.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n')
}

export async function GET() {
  const payload = await getPayload({ config })

  const [trips, programs] = await Promise.all([
    payload.find({ collection: 'trips', where: { status: { not_equals: 'draft' } }, limit: 200, depth: 1 }),
    payload.find({ collection: 'programs', where: { status: { not_equals: 'draft' } }, limit: 200, depth: 1 }),
  ])

  const base = process.env.NEXT_PUBLIC_SERVER_URL ?? 'http://localhost:3000'
  const vevents: string[] = []

  for (const trip of trips.docs) {
    if (!trip.startDate || !trip.endDate) continue
    const dest = typeof trip.destination === 'object' ? trip.destination : null
    const url = dest?.slug ? `${base}/destinations/${dest.slug}` : base
    vevents.push([
      'BEGIN:VEVENT',
      `UID:trip-${trip.id}@sonsofmountains`,
      `DTSTART:${formatDate(trip.startDate)}`,
      `DTEND:${formatDate(trip.endDate)}`,
      `SUMMARY:${escapeIcal(trip.title ?? '')}`,
      `DESCRIPTION:${escapeIcal(`${trip.spotsAvailable} spots available • €${trip.price}`)}`,
      `URL:${url}`,
      `LOCATION:${escapeIcal(typeof trip.destination === 'object' ? (trip.destination as any)?.name ?? '' : '')}`,
      'END:VEVENT',
    ].join('\r\n'))
  }

  for (const prog of programs.docs) {
    if (!prog.startDate || !prog.endDate) continue
    const url = `${base}/programs/${prog.slug}`
    vevents.push([
      'BEGIN:VEVENT',
      `UID:program-${prog.id}@sonsofmountains`,
      `DTSTART:${formatDate(prog.startDate)}`,
      `DTEND:${formatDate(prog.endDate)}`,
      `SUMMARY:${escapeIcal(prog.title ?? '')}`,
      `DESCRIPTION:${escapeIcal(`${prog.spotsAvailable} spots available • €${prog.price}`)}`,
      `URL:${url}`,
      `LOCATION:${escapeIcal(prog.location ?? '')}`,
      'END:VEVENT',
    ].join('\r\n'))
  }

  const ical = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Sons of Mountains//Adventures//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:Sons of Mountains Adventures',
    ...vevents,
    'END:VCALENDAR',
  ].join('\r\n')

  return new NextResponse(ical, {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
      'Content-Disposition': 'attachment; filename="sons-of-mountains.ics"',
    },
  })
}
