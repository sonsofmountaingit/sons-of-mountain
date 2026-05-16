import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

function nameToColor(name: string): string {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  const colors = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#ef4444', '#06b6d4']
  return colors[Math.abs(hash) % colors.length]
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const ids = url.searchParams.get('ids')?.split(',').filter(Boolean) ?? []

  if (ids.length === 0) {
    return NextResponse.json({}, { headers: { 'Cache-Control': 'public, s-maxage=60' } })
  }

  const payload = await getPayload({ config })

  const result: Record<string, { count: number; participants: { initials: string; color: string }[] }> = {}

  await Promise.all(
    ids.map(async (id) => {
      const regs = await payload.find({
        collection: 'registrations',
        where: {
          and: [
            { or: [{ 'trip': { equals: id } }, { 'program': { equals: id } }] },
            { status: { not_in: ['cancelled', 'refunded'] } },
          ],
        },
        limit: 100,
      })

      const totalCount = regs.docs.reduce((sum, r) => sum + (r.participantCount ?? 1), 0)
      const participants = regs.docs.slice(0, 5).map((r) => ({
        initials: `${(r.firstName ?? '?')[0]}${(r.lastName ?? '')[0] ?? ''}`.toUpperCase(),
        color: nameToColor(`${r.firstName}${r.lastName}`),
      }))

      result[id] = { count: totalCount, participants }
    }),
  )

  return NextResponse.json(result, {
    headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120' },
  })
}
