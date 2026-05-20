import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

import { auth } from '@/lib/auth'
import { headers } from 'next/headers'

const COLLECTION_MAP: Record<string, string> = {
  trip: 'trips',
  program: 'programs',
  bundle: 'bundles',
  product: 'products',
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { type, id, quantity = 1 } = await req.json()
    const collection = COLLECTION_MAP[type]
    if (!collection) return NextResponse.json({ error: 'Invalid type' }, { status: 400 })

    const payload = await getPayload({ config })
    const doc = await payload.findByID({ collection, id }) as any
    if (!doc) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const { stripe: _stripeImport } = await import('@/lib/stripe'); const stripe = _stripeImport!

    let lineItem: any
    if (doc.stripePriceId) {
      lineItem = { price: doc.stripePriceId, quantity }
    } else {
      const priceEur = doc.price ?? doc.bundlePrice ?? 0
      lineItem = {
        price_data: {
          currency: 'eur',
          product_data: { name: doc.title ?? doc.name ?? 'Sons of Mountains' },
          unit_amount: Math.round(priceEur * 100),
        } as any,
        quantity,
      }
    }

    const link = await stripe.paymentLinks.create({
      line_items: [lineItem],
      metadata: { payloadCollection: collection, payloadId: id, type },
    })

    await payload.update({
      collection,
      id,
      data: { stripePaymentLinkId: link.id, stripePaymentLinkUrl: link.url } as any,
    })

    return NextResponse.json({ url: link.url, id: link.id })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { searchParams } = new URL(req.url)
    const linkId = searchParams.get('id')
    if (!linkId) return NextResponse.json({ error: 'id required' }, { status: 400 })

    const { stripe: _stripeImport } = await import('@/lib/stripe'); const stripe = _stripeImport!
    const link = await stripe.paymentLinks.retrieve(linkId)
    return NextResponse.json({ active: link.active, url: link.url })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id, active } = await req.json()
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

    const { stripe: _stripeImport } = await import('@/lib/stripe'); const stripe = _stripeImport!
    const link = await stripe.paymentLinks.update(id, { active })
    return NextResponse.json({ active: link.active })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
