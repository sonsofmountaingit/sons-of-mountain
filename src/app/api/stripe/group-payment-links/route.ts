import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

import { auth } from '@/lib/auth'
import { headers } from 'next/headers'

interface Participant {
  name: string
  email: string
  shareAmount: number
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { orderId, participants } = await req.json() as { orderId: string; participants: Participant[] }
    if (!orderId || !participants?.length) return NextResponse.json({ error: 'orderId and participants required' }, { status: 400 })

    const payload = await getPayload({ config })
    const order = await payload.findByID({ collection: 'orders', id: orderId }) as any
    if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 })

    const { stripe: _stripeImport } = await import('@/lib/stripe'); const stripe = _stripeImport!
    const { resend } = await import('@/lib/resend')
    const base = process.env.NEXT_PUBLIC_SERVER_URL ?? 'http://localhost:3000'
    const results = []

    for (const p of participants) {
      const link = await (stripe.paymentLinks.create as any)({
        line_items: [{
          price_data: {
            currency: 'eur',
            product_data: { name: `Sons of Mountains — Group Booking (${p.name})` },
            unit_amount: Math.round(p.shareAmount * 100),
          },
          quantity: 1,
        }],
        metadata: { groupOrderId: orderId, participantEmail: p.email, participantName: p.name },
      })

      results.push({ email: p.email, url: link.url, linkId: link.id, shareAmount: p.shareAmount })

      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL ?? 'noreply@panicframe.com',
        to: p.email,
        subject: 'Your group booking payment link — Sons of Mountains',
        html: `<p>Hi ${p.name},</p><p>Your share for the group booking is €${p.shareAmount.toFixed(2)}. <a href="${link.url}">Pay now</a></p><p>Questions? Visit <a href="${base}">${base}</a></p>`,
      }).catch(() => {})
    }

    // Update participantLinks on the order
    const existingLinks = order.participantLinks ?? []
    const updatedLinks = [
      ...existingLinks,
      ...results.map((r) => ({
        email: r.email,
        stripeLink: r.url,
        paid: false,
      })),
    ]
    await payload.update({ collection: 'orders', id: orderId, data: { participantLinks: updatedLinks } as any })

    return NextResponse.json({ participants: results })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
