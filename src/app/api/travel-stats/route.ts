import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

interface Occupant {
  name: string
  email: string | null
  phone: string | null
  participantCount: number
  status: string
  source: 'registration' | 'order'
  recordId: string
}

interface StatRow {
  id: string
  kind: 'trip' | 'destination' | 'program'
  title: string
  spotsTotal: number | null
  spotsAvailable: number | null
  spotsTaken: number
  occupants: Occupant[]
}

const ACTIVE_REG_STATUSES = ['pending', 'confirmed', 'paid']
// A spot is occupied only after payment. Pending Checkout records are deliberately
// excluded: they may expire or be abandoned and must not make availability disagree
// with the inventory shown to customers.
const ACTIVE_ORDER_STATUSES = ['paid']

export async function GET(req: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const { user } = await payload.auth({ headers: req.headers })
    const isAdmin = !!(user && user.collection === 'users' && (user as { role?: string }).role === 'admin')
    if (!isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const [trips, programs, destinations, registrations, orders] = await Promise.all([
      payload.find({ collection: 'trips', limit: 0, pagination: false, depth: 0 }),
      payload.find({ collection: 'programs', limit: 0, pagination: false, depth: 0 }),
      payload.find({ collection: 'destinations', limit: 0, pagination: false, depth: 0 }),
      payload.find({
        collection: 'registrations',
        where: { status: { in: ACTIVE_REG_STATUSES } },
        limit: 0,
        pagination: false,
        depth: 0,
      }),
      payload.find({
        collection: 'orders',
        where: { status: { in: ACTIVE_ORDER_STATUSES } },
        limit: 0,
        pagination: false,
        depth: 0,
      }),
    ])

    const rows = new Map<string, StatRow>()

    const idOf = (v: unknown): string | null => {
      if (v == null) return null
      return typeof v === 'object' ? String((v as { id?: unknown }).id ?? '') || null : String(v)
    }

    for (const t of trips.docs as Record<string, unknown>[]) {
      rows.set(`trip:${t.id}`, {
        id: String(t.id),
        kind: 'trip',
        title: String(t.title ?? ''),
        spotsTotal: (t.spotsTotal as number) ?? null,
        spotsAvailable: (t.spotsAvailable as number) ?? null,
        spotsTaken: 0,
        occupants: [],
      })
    }
    for (const p of programs.docs as Record<string, unknown>[]) {
      rows.set(`program:${p.id}`, {
        id: String(p.id),
        kind: 'program',
        title: String(p.title ?? ''),
        spotsTotal: (p.spotsTotal as number) ?? null,
        spotsAvailable: (p.spotsAvailable as number) ?? null,
        spotsTaken: 0,
        occupants: [],
      })
    }
    for (const d of destinations.docs as Record<string, unknown>[]) {
      rows.set(`destination:${d.id}`, {
        id: String(d.id),
        kind: 'destination',
        title: String(d.name ?? ''),
        spotsTotal: (d.spotsTotal as number) ?? null,
        spotsAvailable: (d.spotsAvailable as number) ?? null,
        spotsTaken: 0,
        occupants: [],
      })
    }

    for (const r of registrations.docs as Record<string, unknown>[]) {
      const tripId = idOf(r.trip)
      const programId = idOf(r.program)
      const destinationId = idOf(r.destination)
      const key = tripId ? `trip:${tripId}` : programId ? `program:${programId}` : destinationId ? `destination:${destinationId}` : null
      if (!key) continue
      const row = rows.get(key)
      if (!row) continue
      const count = (r.participantCount as number) ?? 1
      row.spotsTaken += count
      row.occupants.push({
        name: [r.firstName, r.lastName].filter(Boolean).join(' ') || String(r.email ?? ''),
        email: (r.email as string) ?? null,
        phone: (r.phone as string) ?? null,
        participantCount: count,
        status: String(r.status ?? ''),
        source: 'registration',
        recordId: String(r.id),
      })
    }

    for (const o of orders.docs as Record<string, unknown>[]) {
      const items = (o.items as Record<string, unknown>[]) ?? []
      for (const item of items) {
        const tripId = idOf(item.trip)
        const programId = idOf(item.program)
        const destinationId = idOf(item.destination)
        const key = tripId ? `trip:${tripId}` : programId ? `program:${programId}` : destinationId ? `destination:${destinationId}` : null
        if (!key) continue
        const row = rows.get(key)
        if (!row) continue
        const count = (item.participantCount as number) ?? (item.quantity as number) ?? 1
        row.spotsTaken += count
        row.occupants.push({
          name: [o.firstName, o.lastName].filter(Boolean).join(' ') || String(o.email ?? ''),
          email: (o.email as string) ?? null,
          phone: (o.phone as string) ?? null,
          participantCount: count,
          status: String(o.status ?? ''),
          source: 'order',
          recordId: String(o.id),
        })
      }
    }

    const result = Array.from(rows.values()).sort((a, b) => a.title.localeCompare(b.title))
    return NextResponse.json({ rows: result })
  } catch (err) {
    console.error('Failed to build travel stats:', err)
    return NextResponse.json({ error: 'Failed to load statistics' }, { status: 500 })
  }
}
