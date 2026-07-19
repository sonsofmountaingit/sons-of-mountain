import { getPayload } from 'payload'
import config from '@payload-config'
import { sendFlow } from '@/lib/email-flows'

export async function runReviewRequests() {
  const payload = await getPayload({ config })
  const now = Date.now()
  const start = new Date(now - 4 * 86400_000).toISOString()
  const end = new Date(now - 2 * 86400_000).toISOString()

  const regs = await payload.find({
    collection: 'registrations',
    where: {
      and: [
        { status: { in: ['paid', 'confirmed'] } },
        { 'trip.endDate': { greater_than_equal: start } },
        { 'trip.endDate': { less_than_equal: end } },
      ],
    } as any,
    depth: 2,
    limit: 500,
  })

  for (const reg of regs.docs as any[]) {
    if (!reg.email) continue
    const customerId = typeof reg.customer === 'string' ? reg.customer : reg.customer?.id
    const tripId = typeof reg.trip === 'string' ? reg.trip : reg.trip?.id

    if (customerId && tripId) {
      const rating = await payload.find({
        collection: 'customer-ratings',
        where: { and: [{ customer: { equals: customerId } }, { trip: { equals: tripId } }] } as any,
        limit: 1,
      })
      if (rating.docs.length > 0) continue
    }

    const existingLog = await payload.find({
      collection: 'email-logs',
      where: { and: [{ trigger: { equals: 'registration_review_request' } }, { recipient: { equals: reg.email } }] },
      limit: 1,
    })
    if (existingLog.docs.length > 0) continue

    await sendFlow('registration_review_request', { email: reg.email, firstName: reg.firstName }, {
      tripTitle: reg.trip?.title ?? '',
    }, payload)
  }
}
