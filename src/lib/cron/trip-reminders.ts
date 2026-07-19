import { getPayload } from 'payload'
import config from '@payload-config'
import { sendFlow } from '@/lib/email-flows'

export async function runTripReminders() {
  const payload = await getPayload({ config })
  const now = Date.now()

  const windows = [
    { trigger: 'registration_trip_reminder_7d', field: 'reminderSent7d', from: 6, to: 8 },
    { trigger: 'registration_trip_reminder_1d', field: 'reminderSent1d', from: 0, to: 2 },
  ] as const

  for (const w of windows) {
    const start = new Date(now + w.from * 86400_000).toISOString()
    const end = new Date(now + w.to * 86400_000).toISOString()
    const regs = await payload.find({
      collection: 'registrations',
      where: {
        and: [
          { status: { in: ['paid', 'confirmed'] } },
          { [w.field]: { equals: false } },
          { 'trip.startDate': { greater_than_equal: start } },
          { 'trip.startDate': { less_than_equal: end } },
        ],
      } as any,
      depth: 2,
      limit: 500,
    })

    for (const reg of regs.docs as any[]) {
      if (!reg.email) continue
      const trip = reg.trip
      await sendFlow(w.trigger, { email: reg.email, firstName: reg.firstName }, {
        tripTitle: trip?.title ?? '',
        tripStartDate: trip?.startDate ?? '',
        tripEndDate: trip?.endDate ?? '',
        tripLocation: trip?.location ?? '',
      }, payload)
      await payload.update({ collection: 'registrations', id: reg.id, data: { [w.field]: true } })
    }
  }
}
