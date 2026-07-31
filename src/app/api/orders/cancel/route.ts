import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { headers } from 'next/headers'
import { freeSpotAndNotifyWaitlist } from '@/lib/cron/grace-period'

export async function POST(req: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const { user } = await payload.auth({ headers: await headers() })
    if (!user || user.collection !== 'users' || (user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { orderId, registrationId, amount } = await req.json()

    let collection: 'orders' | 'registrations'
    let docId: string
    if (orderId) {
      collection = 'orders'
      docId = orderId
    } else if (registrationId) {
      collection = 'registrations'
      docId = registrationId
    } else {
      return NextResponse.json({ error: 'orderId or registrationId required' }, { status: 400 })
    }

    const doc = await payload.findByID({ collection, id: docId })
    if (!doc) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    if ((doc as any).status === 'cancelled') {
      return NextResponse.json({ error: 'Already cancelled' }, { status: 400 })
    }

    const paymentIntentId = (doc as any).stripePaymentIntentId ?? null
    const capturedStatuses = ['paid', 'partial']
    const shouldRefund = paymentIntentId && capturedStatuses.includes((doc as any).status)

    const updateData: Record<string, unknown> = { status: 'cancelled' }

    if (shouldRefund) {
      const { stripe: _stripeImport } = await import('@/lib/stripe')
      const stripe = _stripeImport!
      const refundParams: any = { payment_intent: paymentIntentId }
      if (amount) refundParams.amount = Math.round(amount * 100)
      const refund = await stripe.refunds.create(refundParams)
      updateData.stripeRefundId = refund.id
      updateData.refundAmount = refund.amount / 100
    }

    const updated = await payload.update({ collection, id: docId, data: updateData as any })

    await freeSpotAndNotifyWaitlist(payload, updated, collection)

    return NextResponse.json({
      ok: true,
      status: 'cancelled',
      refunded: shouldRefund,
      refundId: (updateData.stripeRefundId as string) ?? null,
      refundAmount: (updateData.refundAmount as number) ?? null,
    })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
