import { getPayload } from 'payload'
import config from '@payload-config'
import { escapeHtml } from '@/lib/escape-html'
import { notifyWaitlist } from '@/lib/stripe-webhooks'

type BasePayload = ReturnType<typeof getPayload> extends Promise<infer T> ? T : never

export const BOOKABLE_COLLECTIONS = { trip: 'trips', program: 'programs', destination: 'destinations' } as const

async function getGracePeriodDays(payload: BasePayload, doc: any, collection: 'orders' | 'registrations'): Promise<number> {
  try {
    let bookable: { collection: string; id: string } | null = null
    const relId = (rel: any) => (typeof rel === 'string' ? rel : rel?.id)
    if (collection === 'registrations') {
      if (doc.trip) bookable = { collection: 'trips', id: relId(doc.trip) }
      else if (doc.program) bookable = { collection: 'programs', id: relId(doc.program) }
      else if (doc.destination) bookable = { collection: 'destinations', id: relId(doc.destination) }
    } else {
      const item = (doc.items ?? []).find((i: any) => i.itemType in BOOKABLE_COLLECTIONS)
      if (item) {
        const id = relId(item[item.itemType])
        if (id) bookable = { collection: (BOOKABLE_COLLECTIONS as any)[item.itemType], id }
      }
    }
    if (!bookable) return 5
    const record = await payload.findByID({ collection: bookable.collection as any, id: bookable.id }).catch(() => null)
    return (record as any)?.graceperiodDays ?? 5
  } catch {
    return 5
  }
}

export async function freeSpotAndNotifyWaitlist(payload: BasePayload, doc: any, collection: 'orders' | 'registrations') {
  const relId = (rel: any) => (typeof rel === 'string' ? rel : rel?.id)
  const bump = async (bookableCollection: 'trips' | 'programs' | 'destinations', id: string, participantCount: number) => {
    const record = await payload.findByID({ collection: bookableCollection, id }).catch(() => null)
    if (!record) return
    const newSpots = ((record as any).spotsAvailable ?? 0) + participantCount
    const statusField = bookableCollection === 'destinations' ? 'bookingStatus' : 'status'
    const activeValue = bookableCollection === 'programs' ? 'active' : 'active'
    await payload.update({
      collection: bookableCollection,
      id,
      data: { spotsAvailable: newSpots, [statusField]: activeValue } as any,
    })
    await notifyWaitlist(payload, bookableCollection === 'trips' ? 'trip' : bookableCollection === 'programs' ? 'program' : 'destination', id)
  }

  if (collection === 'registrations') {
    const participantCount = doc.participantCount ?? 1
    if (doc.trip) await bump('trips', relId(doc.trip), participantCount)
    else if (doc.program) await bump('programs', relId(doc.program), participantCount)
    else if (doc.destination) await bump('destinations', relId(doc.destination), participantCount)
  } else {
    for (const item of (doc.items ?? []) as any[]) {
      if (!(item.itemType in BOOKABLE_COLLECTIONS)) continue
      const id = relId(item[item.itemType])
      if (!id) continue
      await bump((BOOKABLE_COLLECTIONS as any)[item.itemType], id, item.participantCount ?? item.quantity ?? 1)
    }
  }
}

async function cancelAndFreeSpot(payload: BasePayload, doc: any, collection: 'orders' | 'registrations') {
  await payload.update({ collection, id: doc.id, data: { status: 'cancelled' } as any })
  await freeSpotAndNotifyWaitlist(payload, doc, collection)
}

// Run daily — sends overdue notices for failed installments, then auto-cancels once the
// configured grace period has elapsed with no successful retry. Also honors manualCancelRequested.
export async function runGracePeriodCheck() {
  const payload = await getPayload({ config })
  const { resend } = await import('@/lib/resend')
  const from = process.env.RESEND_FROM_EMAIL ?? 'noreply@sonsofmountain.com'
  const now = new Date()

  for (const collection of ['orders', 'registrations'] as const) {
    // Manual override — admin-requested immediate cancellation
    const manualDocs = await payload.find({
      collection,
      where: { and: [{ manualCancelRequested: { equals: true } }, { status: { not_equals: 'cancelled' } }] },
      limit: 50,
    })
    for (const doc of manualDocs.docs as any[]) {
      await cancelAndFreeSpot(payload, doc, collection)
    }

    // Automated grace-period flow for failed installments
    const docs = await payload.find({
      collection,
      where: {
        and: [
          { paymentMode: { equals: 'installments' } },
          { status: { not_equals: 'cancelled' } },
        ],
      },
      limit: 100,
    })

    for (const doc of docs.docs as any[]) {
      const installments = (doc.installments ?? []) as any[]
      const failedRow = installments.find((r) => r.status === 'failed' && r.firstFailedAt)
      if (!failedRow) continue

      if (!failedRow.overdueNoticeSent && doc.email) {
        const safeFirstName = escapeHtml(String(doc.firstName ?? ''))
        await resend.emails.send({
          from,
          to: doc.email,
          subject: `Payment overdue — action required`,
          html: `<p>Hi ${safeFirstName},</p><p>We were unable to charge your payment method for the <strong>${escapeHtml(failedRow.label)}</strong> installment of <strong>€${failedRow.amount.toFixed(2)}</strong>. Please update your payment details within the grace period to avoid cancellation.</p>`,
        }).catch(() => {})

        const idx = installments.findIndex((r) => r === failedRow)
        installments[idx] = { ...failedRow, overdueNoticeSent: true }
        await payload.update({ collection, id: doc.id, data: { installments } as any })
        continue
      }

      const gracePeriodDays = await getGracePeriodDays(payload, doc, collection)
      const firstFailedAt = new Date(failedRow.firstFailedAt)
      const daysSinceFailed = Math.floor((now.getTime() - firstFailedAt.getTime()) / 86400000)

      if (daysSinceFailed >= gracePeriodDays) {
        await cancelAndFreeSpot(payload, doc, collection)
      }
    }
  }
}
