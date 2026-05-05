import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function POST(req: NextRequest) {
  try {
    const { email, firstName } = await req.json()

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email required' }, { status: 400 })
    }

    const payload = await getPayload({ config })

    const existing = await payload.find({
      collection: 'subscribers',
      where: { email: { equals: email } },
      limit: 1,
    })

    if (existing.docs.length > 0) {
      if (existing.docs[0].status === 'unsubscribed') {
        await payload.update({
          collection: 'subscribers',
          id: existing.docs[0].id,
          data: { status: 'active' },
        })
      }
      return NextResponse.json({ ok: true })
    }

    await payload.create({
      collection: 'subscribers',
      data: {
        email,
        firstName: firstName ?? '',
        status: 'active',
        source: 'footer_form',
        subscribedAt: new Date().toISOString(),
      },
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Subscribe error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
