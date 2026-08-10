import { getPayload } from 'payload'
import config from '@payload-config'
import { hasTravelEnded } from '@/lib/travel-status'

export async function runSyncSoldOut(): Promise<{ ok: true; updated: number }> {
  const payload = await getPayload({ config })

  const { docs: trips } = await payload.find({
    collection: 'trips',
    where: { and: [{ status: { not_equals: 'draft' } }, { status: { not_equals: 'archived' } }] },
    limit: 500,
    pagination: false,
  })

  let updated = 0
  for (const trip of trips) {
    const t = trip as { id: string; spotsAvailable?: number; endDate?: string | null }
    const status = hasTravelEnded(t.endDate) ? 'archived' : (t.spotsAvailable ?? 1) === 0 ? 'soldOut' : null
    if (status) {
      await payload.update({ collection: 'trips', id: t.id, data: { status } })
      updated++
    }
  }

  const { docs: programs } = await payload.find({
    collection: 'programs',
    where: { and: [{ status: { not_equals: 'draft' } }, { status: { not_equals: 'archived' } }] },
    limit: 500,
    pagination: false,
  })

  for (const program of programs) {
    const p = program as { id: string; spotsAvailable?: number; endDate?: string | null }
    const status = hasTravelEnded(p.endDate) ? 'archived' : (p.spotsAvailable ?? 1) === 0 ? 'soldOut' : null
    if (status) {
      await payload.update({ collection: 'programs', id: p.id, data: { status } })
      updated++
    }
  }

  return { ok: true, updated }
}
