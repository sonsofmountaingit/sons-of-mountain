import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { auth } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers })
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'gift-vouchers',
    where: { betterAuthUserId: { equals: session.user.id } },
    limit: 50,
    sort: '-createdAt',
  })

  return NextResponse.json({ vouchers: result.docs })
}
