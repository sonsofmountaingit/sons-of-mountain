import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

import { auth } from '@/lib/auth'
import { headers } from 'next/headers'

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const payload = await getPayload({ config })
    const custResult = await payload.find({
      collection: 'customers',
      where: { email: { equals: session.user.email } },
      limit: 1,
    })
    const customer = custResult.docs[0] as any
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
