import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { sendRegistrationFormsFor } from '@/lib/send-registration-forms'

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  if (!authHeader || authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const payload = await getPayload({ config })

  const { docs: destinations } = await payload.find({
    collection: 'destinations',
    where: { 'freeTransfer.peak': { exists: true } },
    limit: 0,
    pagination: false,
    depth: 0,
    overrideAccess: true,
  })
  const { docs: trips } = await payload.find({
    collection: 'trips',
    where: { 'freeTransfer.peak': { exists: true } },
    limit: 0,
    pagination: false,
    depth: 0,
    overrideAccess: true,
  })

  let processed = 0
  let sent = 0
  let skipped = 0

  for (const destination of destinations) {
    const result = await sendRegistrationFormsFor({ payload, destinationId: destination.id })
    processed += result.processed
    sent += result.sent
    skipped += result.skipped
  }
  for (const trip of trips) {
    const result = await sendRegistrationFormsFor({ payload, tripId: trip.id })
    processed += result.processed
    sent += result.sent
    skipped += result.skipped
  }

  return NextResponse.json({ processed, sent, skipped })
}
