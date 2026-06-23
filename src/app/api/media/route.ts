import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const limit = parseInt(searchParams.get('limit') || '40')
  const depth = parseInt(searchParams.get('depth') || '0')
  const where = searchParams.get('where[alt][contains]')

  try {
    const payload = await getPayload({ config })
    const query: any = {
      collection: 'media',
      limit,
      depth,
    }

    if (where) {
      query.where = { alt: { contains: where } }
    }

    const result = await payload.find(query)
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error fetching media:', error)
    return NextResponse.json({ error: 'Failed to fetch media' }, { status: 500 })
  }
}
