import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const limit = parseInt(searchParams.get('limit') || '10')
  const depth = parseInt(searchParams.get('depth') || '0')
  const sort = searchParams.get('sort')

  try {
    const payload = await getPayload({ config })
    const query: any = {
      collection: 'destinations',
      limit,
      depth,
    }

    if (sort) {
      query.sort = sort
    }

    const result = await payload.find(query)
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error fetching destinations:', error)
    return NextResponse.json({ error: 'Failed to fetch destinations' }, { status: 500 })
  }
}
