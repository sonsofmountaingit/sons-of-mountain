import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

import { headers } from 'next/headers'

export async function POST(req: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const { user } = await payload.auth({ headers: await headers() })
    if (!user || user.collection !== 'customers') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const customer = await payload.findByID({ collection: 'customers', id: user.id }).catch(() => null) as any
    if (!customer?.stripeCustomerId) {
      return NextResponse.json({ error: 'No Stripe customer on file' }, { status: 400 })
    }

    const { stripe: _stripeImport } = await import('@/lib/stripe'); const stripe = _stripeImport!
    const base = process.env.NEXT_PUBLIC_SERVER_URL ?? 'http://localhost:3000'
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customer.stripeCustomerId,
      return_url: `${base}/dashboard`,
    })

    return NextResponse.json({ url: portalSession.url })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
