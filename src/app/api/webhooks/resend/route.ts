import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { type, data } = body

    const payload = await getPayload({ config })

    if (type === 'email.bounced') {
      const subscriber = await payload.find({
        collection: 'subscribers',
        where: { email: { equals: data.to } },
        limit: 1,
      })
      if (subscriber.docs.length > 0) {
        await payload.update({
          collection: 'subscribers',
          id: subscriber.docs[0].id,
          data: { status: 'bounced' },
        })
      }
    }

    if (type === 'email.unsubscribed') {
      const subscriber = await payload.find({
        collection: 'subscribers',
        where: { email: { equals: data.to } },
        limit: 1,
      })
      if (subscriber.docs.length > 0) {
        await payload.update({
          collection: 'subscribers',
          id: subscriber.docs[0].id,
          data: { status: 'unsubscribed' },
        })
      }
    }

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
