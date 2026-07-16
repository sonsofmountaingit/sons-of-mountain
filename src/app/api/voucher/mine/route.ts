import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function GET(req: NextRequest) {
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: req.headers })
  if (!user || user.collection !== 'customers') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const result = await payload.find({
    collection: 'gift-vouchers',
    where: { customer: { equals: user.id } },
    limit: 50,
    sort: '-createdAt',
  })

  return NextResponse.json({ vouchers: result.docs })
}
