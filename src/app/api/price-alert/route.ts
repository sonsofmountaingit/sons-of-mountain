import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function POST(req: NextRequest) {
  const body = await req.json() as { email: string; itemType: 'trip' | 'program'; itemId: string; currentPrice: number }
  const { email, itemType, itemId, currentPrice } = body

  if (!email || !itemId) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

  const payload = await getPayload({ config })
  const segment = `price-alert:${itemType}:${itemId}:${currentPrice}`

  const { docs: existing } = await payload.find({
    collection: 'subscribers',
    where: { email: { equals: email } },
    limit: 1,
  })

  if (existing[0]) {
    const sub = existing[0] as { segments?: { segment?: string }[] }
    const segments = sub.segments ?? []
    const hasSegment = segments.some((s) => s.segment === segment)
    if (!hasSegment) {
      await payload.update({
        collection: 'subscribers',
        id: existing[0].id,
        data: { segments: [...segments, { segment }] } as Record<string, unknown>,
      })
    }
  } else {
    await payload.create({
      collection: 'subscribers',
      data: { email, segments: [{ segment }], status: 'active' } as Record<string, unknown>,
    })
  }

  return NextResponse.json({ ok: true })
}
