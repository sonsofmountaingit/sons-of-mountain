import { getPayload } from 'payload'
import config from '@payload-config'

export async function runSyncSoldOut(): Promise<{ ok: true; updated: number }> {
  const payload = await getPayload({ config })

  const { docs: trips } = await payload.find({
    collection: 'trips',
    where: { status: { equals: 'active' } },
    limit: 500,
    pagination: false,
  })

  let updated = 0
  for (const trip of trips) {
    const t = trip as { id: string; spotsAvailable?: number }
    if ((t.spotsAvailable ?? 1) === 0) {
      await payload.update({ collection: 'trips', id: t.id, data: { status: 'soldOut' } })
      updated++
    }
  }

  const { docs: programs } = await payload.find({
    collection: 'programs',
    where: { status: { equals: 'active' } },
    limit: 500,
    pagination: false,
  })

  for (const program of programs) {
    const p = program as { id: string; spotsAvailable?: number }
    if ((p.spotsAvailable ?? 1) === 0) {
      await payload.update({ collection: 'programs', id: p.id, data: { status: 'soldOut' } })
      updated++
    }
  }

  return { ok: true, updated }
}
