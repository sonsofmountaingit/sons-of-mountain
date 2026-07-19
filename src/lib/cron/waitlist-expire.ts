import { getPayload } from 'payload'
import config from '@payload-config'
import { sendFlow } from '@/lib/email-flows'
import { waitlistItemTitle } from '@/lib/featured-content'

export async function runWaitlistExpire() {
  const payload = await getPayload({ config })
  const cutoff = new Date(Date.now() - 48 * 3600_000).toISOString()

  const entries = await payload.find({
    collection: 'waitlist',
    where: { and: [{ status: { equals: 'notified' } }, { notifiedAt: { less_than: cutoff } }] },
    limit: 500,
    depth: 1,
  })

  for (const entry of entries.docs as any[]) {
    await payload.update({ collection: 'waitlist', id: entry.id, data: { status: 'expired' } })
    if (!entry.email) continue
    await sendFlow('waitlist_expired', { email: entry.email, firstName: entry.name }, {
      itemTitle: waitlistItemTitle(entry),
      bookNowUrl: `${process.env.NEXT_PUBLIC_SERVER_URL}/shop`,
    }, payload)
  }
}
