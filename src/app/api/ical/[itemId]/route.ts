import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

function pad(n: number) { return String(n).padStart(2, '0') }

function toIcalDate(dateStr: string) {
  const d = new Date(dateStr)
  return `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}`
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ itemId: string }> }) {
  const { itemId } = await params
  const url = new URL(req.url)
  const itemType = url.searchParams.get('type') ?? 'trip'

  const payload = await getPayload({ config })

  let title = ''
  let startDate = ''
  let endDate = ''
  let description = ''
  let location = ''

  try {
    if (itemType === 'program') {
      const doc = await payload.findByID({ collection: 'programs', id: itemId, overrideAccess: true })
      const d = doc as { title?: string; startDate?: string; endDate?: string; shortDescription?: string; location?: string }
      title = d.title ?? 'Програма'
      startDate = d.startDate ?? ''
      endDate = d.endDate ?? ''
      description = d.shortDescription ?? ''
      location = d.location ?? ''
    } else {
      const doc = await payload.findByID({ collection: 'trips', id: itemId, depth: 1, overrideAccess: true })
      const d = doc as { title?: string; startDate?: string; endDate?: string; destination?: { name?: string } | string }
      title = d.title ?? 'Пътуване'
      startDate = d.startDate ?? ''
      endDate = d.endDate ?? ''
      const dest = d.destination
      location = typeof dest === 'object' ? (dest?.name ?? '') : ''
    }
  } catch {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const uid = `${itemType}-${itemId}@sons-of-mountains`
  const now = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'

  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Sons of Mountains//Calendar//BG',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${now}`,
    `DTSTART;VALUE=DATE:${toIcalDate(startDate)}`,
    `DTEND;VALUE=DATE:${toIcalDate(endDate)}`,
    `SUMMARY:${title}`,
    description ? `DESCRIPTION:${description}` : '',
    location ? `LOCATION:${location}` : '',
    'END:VEVENT',
    'END:VCALENDAR',
  ].filter(Boolean).join('\r\n')

  return new NextResponse(ics, {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': `attachment; filename="${itemType}-${itemId}.ics"`,
    },
  })
}
