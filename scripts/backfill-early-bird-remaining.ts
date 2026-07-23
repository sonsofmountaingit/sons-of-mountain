#!/usr/bin/env bun
import { getPayload } from 'payload'
import config from '@payload-config'

const payload = await getPayload({ config })

type ItemType = 'trips' | 'programs' | 'destinations'

const paidOrderStatuses = new Set(['paid', 'partial'])
const paidRegistrationStatuses = new Set(['paid', 'partial'])

async function consumedFromOrders(itemType: 'trip' | 'program' | 'destination', id: number | string): Promise<number> {
  const { docs } = await payload.find({
    collection: 'orders',
    where: { [`items.${itemType}`]: { equals: id } },
    depth: 0,
    overrideAccess: true,
    limit: 0,
  })

  let consumed = 0
  for (const order of docs as any[]) {
    if (!paidOrderStatuses.has(order.status)) continue
    for (const item of order.items ?? []) {
      const itemRelId = typeof item[itemType] === 'object' ? item[itemType]?.id : item[itemType]
      if (String(itemRelId) !== String(id)) continue
      if (item.earlyBirdCount != null) {
        consumed += item.earlyBirdCount
      } else if (item.earlyBirdPrice != null && item.unitPrice === item.earlyBirdPrice) {
        consumed += item.participantCount ?? item.quantity ?? 1
      }
    }
  }
  return consumed
}

async function consumedFromRegistrations(field: 'trip' | 'program' | 'destination', id: number | string, earlyBirdSpots: number): Promise<number> {
  if (field !== 'trip') return 0 // Registrations collection only links trip/program/destination directly; early-bird count isn't tracked per-registration
  const { docs } = await payload.find({
    collection: 'registrations',
    where: { [field]: { equals: id } },
    depth: 0,
    overrideAccess: true,
    limit: 0,
  })

  let consumed = 0
  for (const reg of docs as any[]) {
    if (!paidRegistrationStatuses.has(reg.status)) continue
    consumed += reg.participantCount ?? 1
    if (consumed >= earlyBirdSpots) return earlyBirdSpots
  }
  return consumed
}

async function backfill(collection: ItemType, relField: 'trip' | 'program' | 'destination') {
  const { docs } = await payload.find({
    collection,
    where: { earlyBirdSpots: { greater_than: 0 } },
    depth: 0,
    overrideAccess: true,
    limit: 0,
  })

  for (const doc of docs as any[]) {
    const allocation = doc.earlyBirdSpots ?? 0
    const consumedOrders = await consumedFromOrders(relField, doc.id)
    const consumedRegs = await consumedFromRegistrations(relField, doc.id, allocation)
    const consumed = consumedOrders + consumedRegs
    const remaining = Math.max(0, allocation - consumed)

    if (doc.earlyBirdSpotsRemaining === remaining) {
      console.log(`${collection}/${doc.id} (${doc.title ?? doc.name ?? doc.slug}): already ${remaining}, skip`)
      continue
    }

    await payload.update({
      collection,
      id: doc.id,
      overrideAccess: true,
      data: { earlyBirdSpotsRemaining: remaining } as any,
    })
    console.log(`${collection}/${doc.id} (${doc.title ?? doc.name ?? doc.slug}): allocation=${allocation} consumed=${consumed} → remaining=${remaining}`)
  }
}

await backfill('trips', 'trip')
await backfill('programs', 'program')
await backfill('destinations', 'destination')

console.log('Backfill complete')
process.exit(0)
