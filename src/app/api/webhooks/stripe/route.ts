import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import Stripe from 'stripe'
import { revalidatePath, revalidateTag } from 'next/cache'

async function creditLoyaltyPoints(payload: Awaited<ReturnType<typeof getPayload>>, customerId: string | null | undefined, amountEur: number) {
  if (!customerId) return
  try {
    const shopSettings = await payload.findGlobal({ slug: 'shop' }).catch(() => null)
    const rate = (shopSettings as any)?.loyaltyPointsPerEur ?? 1
    const pointsToAdd = Math.floor(amountEur * rate)
    if (pointsToAdd <= 0) return

    const cust = await payload.findByID({ collection: 'customers', id: customerId }).catch(() => null)
    if (!cust) return

    const newPoints = ((cust as any).loyaltyPoints ?? 0) + pointsToAdd
    const tier = newPoints >= 5000 ? 'platinum' : newPoints >= 1500 ? 'gold' : newPoints >= 500 ? 'silver' : 'bronze'
    const oldTier = (cust as any).loyaltyTier ?? 'bronze'

    await payload.update({ collection: 'customers', id: customerId, data: { loyaltyPoints: newPoints, loyaltyTier: tier } })

    // Send tier upgrade email if tier changed
    if (tier !== oldTier) {
      const { resend } = await import('@/lib/resend')
      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL ?? 'noreply@panicframe.com',
        to: (cust as any).email,
        subject: `You reached ${tier.charAt(0).toUpperCase() + tier.slice(1)} tier!`,
        html: `<p>Congratulations! You've earned enough points to reach <strong>${tier}</strong> tier. Keep adventuring!</p>`,
      }).catch(() => {})
    }
  } catch {}
}

async function notifyWaitlist(payload: Awaited<ReturnType<typeof getPayload>>, itemType: string, itemId: string) {
  try {
    const next = await payload.find({
      collection: 'waitlist',
      where: {
        and: [
          { itemType: { equals: itemType } },
          { [itemType]: { equals: itemId } },
          { status: { equals: 'waiting' } },
        ],
      },
      sort: 'position',
      limit: 3,
    })

    for (const entry of next.docs) {
      const { resend } = await import('@/lib/resend')
      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL ?? 'noreply@panicframe.com',
        to: (entry as any).email,
        subject: 'A spot is available!',
        html: `<p>Great news, ${(entry as any).name ?? 'adventurer'}! A spot just opened up. <a href="${process.env.NEXT_PUBLIC_SERVER_URL}/shop">Book now</a> before it's gone.</p>`,
      }).catch(() => {})

      await payload.update({ collection: 'waitlist', id: entry.id, data: { status: 'notified', notifiedAt: new Date().toISOString() } })
    }
  } catch {}
}

export async function POST(req: NextRequest) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? 'sk_test_placeholder', {
    apiVersion: '2026-04-22.dahlia',
  })
  const body = await req.text()
  const sig = req.headers.get('stripe-signature') ?? ''

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET ?? '')
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const payload = await getPayload({ config })

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const meta = session.metadata ?? {}
    const { orderId, type, tripId, recordId, paymentMode, discountCodeId, giftVoucherId, loyaltyPointsRedeemed } = meta

    // Cart checkout
    if (type === 'cart' && orderId) {
      const order = await payload.findByID({ collection: 'orders', id: orderId, depth: 2 }).catch(() => null)
      if (!order) return NextResponse.json({ ok: true })

      await payload.update({
        collection: 'orders',
        id: orderId,
        data: {
          status: 'paid',
          paidAt: new Date().toISOString(),
          stripePaymentIntentId: session.payment_intent as string ?? null,
        },
      })

      // Decrement stock for each item
      for (const item of ((order as any).items ?? []) as any[]) {
        if (item.itemType === 'trip' && item.trip) {
          const tripId = typeof item.trip === 'string' ? item.trip : item.trip.id
          const trip = await payload.findByID({ collection: 'trips', id: tripId }).catch(() => null)
          if (trip) {
            const newSpots = Math.max(0, (trip as any).spotsAvailable - (item.participantCount ?? item.quantity ?? 1))
            await payload.update({
              collection: 'trips',
              id: tripId,
              data: { spotsAvailable: newSpots, status: newSpots === 0 ? 'soldOut' : 'active' },
            })
          }
        }
        if (item.itemType === 'product' && item.product) {
          const productId = typeof item.product === 'string' ? item.product : item.product.id
          const product = await payload.findByID({ collection: 'products', id: productId }).catch(() => null)
          if (product) {
            if (item.variantId) {
              const variants = ((product as any).variants ?? []).map((v: any) =>
                v.id === item.variantId ? { ...v, stock: Math.max(0, v.stock - item.quantity) } : v
              )
              await payload.update({ collection: 'products', id: productId, data: { variants } })
            } else {
              const newStock = Math.max(0, (product as any).stock - item.quantity)
              await payload.update({ collection: 'products', id: productId, data: { stock: newStock } })
            }
          }
        }
        if (item.itemType === 'program' && item.program) {
          const programId = typeof item.program === 'string' ? item.program : item.program.id
          const program = await payload.findByID({ collection: 'programs', id: programId }).catch(() => null)
          if (program) {
            const newSpots = Math.max(0, (program as any).spotsAvailable - (item.participantCount ?? item.quantity ?? 1))
            await payload.update({
              collection: 'programs',
              id: programId,
              data: { spotsAvailable: newSpots, status: newSpots === 0 ? 'Sold Out' : 'Active' },
            })
          }
        }
        if (item.itemType === 'bundle' && item.bundle) {
          const bundleId = typeof item.bundle === 'string' ? item.bundle : item.bundle.id
          const bundle = await payload.findByID({ collection: 'bundles', id: bundleId }).catch(() => null)
          if (bundle) {
            await payload.update({ collection: 'bundles', id: bundleId, data: { usedCount: ((bundle as any).usedCount ?? 0) + 1 } })
          }
        }
      }

      // Mark discount code used
      if (discountCodeId) {
        const dc = await payload.findByID({ collection: 'discount-codes', id: discountCodeId }).catch(() => null)
        if (dc) {
          const customerId = typeof (order as any).customer === 'string' ? (order as any).customer : (order as any).customer?.id
          await payload.update({
            collection: 'discount-codes',
            id: discountCodeId,
            data: {
              usedCount: ((dc as any).usedCount ?? 0) + 1,
              usedByCustomers: customerId
                ? [...((dc as any).usedByCustomers ?? []), { customer: customerId, usedAt: new Date().toISOString() }]
                : (dc as any).usedByCustomers,
            },
          })
          // Referral reward: create gift voucher for referrer
          if ((dc as any).type === 'referral' && (dc as any).referredBy) {
            const referrerId = typeof (dc as any).referredBy === 'string' ? (dc as any).referredBy : (dc as any).referredBy?.id
            const referrer = await payload.findByID({ collection: 'customers', id: referrerId }).catch(() => null)
            if (referrer) {
              await payload.create({
                collection: 'gift-vouchers',
                data: {
                  code: `REW-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 5).toUpperCase()}`,
                  customer: referrerId,
                  recipientEmail: (referrer as any).email,
                  recipientName: (referrer as any).name ?? '',
                  amount: 20,
                  currency: 'EUR',
                  status: 'active',
                  message: 'Referral reward — thank you for spreading the adventure!',
                },
              })
            }
          }
        }
      }

      // Mark gift voucher redeemed
      if (giftVoucherId) {
        const customerId = typeof (order as any).customer === 'string' ? (order as any).customer : (order as any).customer?.id
        await payload.update({
          collection: 'gift-vouchers',
          id: giftVoucherId,
          data: { status: 'redeemed', redeemedAt: new Date().toISOString(), redeemedByCustomerId: customerId ?? '' },
        }).catch(() => {})
      }

      // Deduct loyalty points if redeemed
      const pointsRedeemed = parseInt(loyaltyPointsRedeemed ?? '0', 10)
      const customerId = typeof (order as any).customer === 'string' ? (order as any).customer : (order as any).customer?.id
      if (pointsRedeemed > 0 && customerId) {
        const cust = await payload.findByID({ collection: 'customers', id: customerId }).catch(() => null)
        if (cust) {
          const newPoints = Math.max(0, ((cust as any).loyaltyPoints ?? 0) - pointsRedeemed)
          await payload.update({ collection: 'customers', id: customerId, data: { loyaltyPoints: newPoints } })
        }
      }

      // Credit loyalty points earned
      const amountTotal = (session.amount_total ?? 0) / 100
      await creditLoyaltyPoints(payload, customerId, amountTotal)

      // Mark abandoned cart as recovered
      const sessionIdCookie = session.metadata?.sessionId
      if (sessionIdCookie) {
        const abandoned = await payload.find({ collection: 'abandoned-carts', where: { sessionId: { equals: sessionIdCookie } }, limit: 1 })
        if (abandoned.docs.length > 0) {
          await payload.update({ collection: 'abandoned-carts', id: abandoned.docs[0].id, data: { status: 'recovered' } })
        }
      }

      revalidateTag('products', { expire: 0 })
      revalidateTag('trips', { expire: 0 })
      void revalidatePath('/shop')
      return NextResponse.json({ ok: true })
    }

    // Legacy single-item (registration, voucher)
    const id = recordId ?? orderId
    if (!id) return NextResponse.json({ ok: true })

    if (type === 'registration' || type === 'deposit') {
      const paymentModeValue = paymentMode ?? 'full'
      const updateData: Record<string, unknown> = { status: 'paid', paidAt: new Date().toISOString() }
      if (paymentModeValue === 'deposit') {
        updateData.paymentMode = 'deposit'
        updateData.depositPaid = (session.amount_total ?? 0) / 100
      }
      await payload.update({ collection: 'registrations', id, data: updateData })

      if (tripId) {
        const reg = await payload.findByID({ collection: 'registrations', id }).catch(() => null)
        const trip = await payload.findByID({ collection: 'trips', id: tripId }).catch(() => null)
        if (trip && reg) {
          const newSpots = Math.max(0, (trip as any).spotsAvailable - ((reg as any).participantCount ?? 1))
          await payload.update({
            collection: 'trips',
            id: tripId,
            data: { spotsAvailable: newSpots, status: newSpots === 0 ? 'soldOut' : 'active' },
          })
          if (newSpots > 0) await notifyWaitlist(payload, 'trip', tripId)
          revalidateTag('trips', { expire: 0 })
          void revalidatePath('/destinations')
        }
      }
    } else if (type === 'order') {
      await payload.update({ collection: 'orders', id, data: { status: 'paid', paidAt: new Date().toISOString() } })
    } else if (type === 'voucher') {
      await payload.update({ collection: 'gift-vouchers', id, data: { paidAt: new Date().toISOString(), status: 'active' } })
    }
  }

  // Handle subscription events
  if (event.type === 'customer.subscription.created' || event.type === 'customer.subscription.updated') {
    const sub = event.data.object as Stripe.Subscription
    try {
      const existing = await payload.find({
        collection: 'subscriptions',
        where: { stripeSubscriptionId: { equals: sub.id } },
        limit: 1,
      })
      const status = sub.status === 'active' || sub.status === 'trialing' ? sub.status : 'cancelled'
      if (existing.docs.length > 0) {
        await payload.update({
          collection: 'subscriptions',
          id: existing.docs[0].id,
          data: { status, currentPeriodEnd: new Date((sub as any).current_period_end * 1000).toISOString(), cancelAtPeriodEnd: sub.cancel_at_period_end },
        })
      } else {
        await payload.create({
          collection: 'subscriptions',
          data: {
            stripeSubscriptionId: sub.id,
            stripeCustomerId: sub.customer as string,
            plan: 'monthly',
            status,
            currentPeriodEnd: new Date((sub as any).current_period_end * 1000).toISOString(),
          },
        })
      }
    } catch {}
  }

  if (event.type === 'customer.subscription.deleted') {
    const sub = event.data.object as Stripe.Subscription
    try {
      const existing = await payload.find({
        collection: 'subscriptions',
        where: { stripeSubscriptionId: { equals: sub.id } },
        limit: 1,
      })
      if (existing.docs.length > 0) {
        await payload.update({ collection: 'subscriptions', id: existing.docs[0].id, data: { status: 'cancelled' } })
        const discountId = typeof (existing.docs[0] as any).discountCode === 'string'
          ? (existing.docs[0] as any).discountCode
          : (existing.docs[0] as any).discountCode?.id
        if (discountId) {
          await payload.update({ collection: 'discount-codes', id: discountId, data: { isActive: false } }).catch(() => {})
        }
      }
    } catch {}
  }

  return NextResponse.json({ ok: true })
}
