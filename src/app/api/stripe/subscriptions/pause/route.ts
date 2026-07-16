import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

import { headers } from 'next/headers'

export async function POST(req: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const { user } = await payload.auth({ headers: await headers() })
    if (!user || user.collection !== 'customers') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { subscriptionId } = await req.json()
    if (!subscriptionId) return NextResponse.json({ error: 'subscriptionId required' }, { status: 400 })

    const { stripe: _stripeImport } = await import('@/lib/stripe'); const stripe = _stripeImport!
    await stripe.subscriptions.update(subscriptionId, {
      pause_collection: { behavior: 'mark_uncollectible' },
    } as any)

    const existing = await payload.find({
      collection: 'subscriptions',
      where: { stripeSubscriptionId: { equals: subscriptionId } },
      limit: 1,
    })
    if (existing.docs.length > 0) {
      await payload.update({
        collection: 'subscriptions',
        id: existing.docs[0].id,
        data: { pausedAt: new Date().toISOString() } as any,
      })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
