import { getPayload } from 'payload'
import config from '@payload-config'
import { sendRegistrationFormsFor } from '@/lib/send-registration-forms'

export async function runSendRegistrationForms(): Promise<{ processed: number; sent: number; skipped: number }> {
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

  return { processed, sent, skipped }
}
