import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import type { CartItem } from '@/lib/cart-store'

type CheckoutType = 'registration' | 'order' | 'voucher' | 'cart' | 'deposit' | 'bundle'

const COLLECTION_MAP: Record<string, 'registrations' | 'orders' | 'gift-vouchers'> = {
  registration: 'registrations',
  order: 'orders',
  voucher: 'gift-vouchers',
  cart: 'orders',
  deposit: 'registrations',
  bundle: 'orders',
}

export async function POST(req: NextRequest) {
  try {
    const { stripe: stripeClient } = await import('@/lib/stripe')
    const stripe = stripeClient!
    const body = await req.json()
    const {
      type = 'cart' as CheckoutType,
      recordId,
      orderId,
      tripId,
      amount,
      currency = 'eur',
      description,
      successPath,
      cancelPath,
      // Cart checkout fields
      items,
      discountCodeId,
      giftVoucherId,
      loyaltyPointsRedeemed,
      paymentMode,
      shippingAddress,
      corporatePeopleCount,
      customerEmail,
      enableBnpl,
      orderTotal,
    } = body

    const base = process.env.NEXT_PUBLIC_SERVER_URL ?? 'http://localhost:3000'
    const payload = await getPayload({ config })

    const shopSettings = await payload.findGlobal({ slug: 'shop' }).catch(() => null)
    const bnplMin = (shopSettings as any)?.bnplMinOrderAmount ?? 100

    // Legacy single-item checkout (registrations, vouchers, orders)
    if (type !== 'cart') {
      const id = recordId ?? orderId
      if (!id || !amount) return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })

      const paymentMethods: any[] = ['card']

      const chargeAmount = paymentMode === 'deposit' ? (body.depositAmount ?? amount) : amount

      const session = await stripe.checkout.sessions.create({
        mode: 'payment',
        payment_method_types: paymentMethods,
        line_items: [
          {
            price_data: {
              currency,
              product_data: { name: description ?? 'Sons of Mountains' },
              unit_amount: Math.round(chargeAmount * 100),
            },
            quantity: 1,
          },
        ],
        success_url: successPath
          ? `${base}${successPath}?session_id={CHECKOUT_SESSION_ID}`
          : `${base}/shop/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: cancelPath ? `${base}${cancelPath}` : `${base}/shop/cancel`,
        metadata: { recordId: id, type, tripId: tripId ?? '', paymentMode: paymentMode ?? 'full' },
        customer_email: customerEmail,
      })

      const collection = COLLECTION_MAP[type] ?? 'registrations'
      await payload.update({ collection, id, data: { stripeSessionId: session.id } }).catch(() => null)
      return NextResponse.json({ url: session.url })
    }

    // Multi-item cart checkout
    if (!items?.length) return NextResponse.json({ error: 'Cart is empty' }, { status: 400 })

    // Build line items — use stored Stripe Price IDs where available
    const lineItems: any[] = await Promise.all((items as CartItem[]).map(async (item) => {
      let stripePriceId: string | null = null
      try {
        const collectionMap: Record<string, string> = {
          trip: 'trips', product: 'products', program: 'programs', bundle: 'bundles',
        }
        const col = collectionMap[item.type]
        const docId = item.tripId ?? item.productId ?? item.programId ?? item.bundleId
        if (col && docId) {
          const doc = await payload.findByID({ collection: col as any, id: docId }).catch(() => null)
          stripePriceId = (doc as any)?.stripePriceId ?? null
        }
      } catch {}

      if (stripePriceId) return { price: stripePriceId, quantity: item.quantity }
      return {
        price_data: {
          currency,
          product_data: {
            name: item.title,
            metadata: { itemType: item.type, itemId: item.tripId ?? item.productId ?? item.programId ?? item.bundleId ?? '' },
          },
          unit_amount: Math.round(item.unitPrice * 100),
        },
        quantity: item.quantity,
      }
    }))

    // Create pending order record
    const orderRecord = await payload.create({
      collection: 'orders',
      data: {
        status: 'pending',
        email: customerEmail ?? '',
        firstName: body.firstName ?? '',
        lastName: body.lastName ?? '',
        phone: body.phone ?? '',
        currency: currency.toUpperCase(),
        totalAmount: orderTotal ?? 0,
        discountCode: discountCodeId ?? null,
        giftVoucher: giftVoucherId ?? null,
        loyaltyPointsRedeemed: loyaltyPointsRedeemed ?? 0,
        paymentMode: paymentMode ?? 'full',
        shippingAddress: shippingAddress ?? undefined,
        corporatePeopleCount: corporatePeopleCount ?? 1,
        items: (items as CartItem[]).map((item) => ({
          itemType: item.type,
          trip: item.tripId ?? null,
          product: item.productId ?? null,
          program: item.programId ?? null,
          bundle: item.bundleId ?? null,
          variantId: item.variantId ?? null,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
        })),
      },
    })

    const paymentMethods: any[] = ['card']

    // Resolve Stripe customer ID for saved payment methods
    let stripeCustomerId: string | undefined
    if (customerEmail) {
      const custResult = await payload.find({ collection: 'customers', where: { email: { equals: customerEmail } }, limit: 1 }).catch(() => null)
      stripeCustomerId = (custResult?.docs[0] as any)?.stripeCustomerId ?? undefined
    }

    const sessionParams: any = {
      mode: 'payment',
      payment_method_types: paymentMethods,
      line_items: lineItems,
      success_url: `${base}/shop/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${base}/shop/cancel`,
      customer_email: stripeCustomerId ? undefined : customerEmail,
      customer: stripeCustomerId,
      payment_intent_data: {
        setup_future_usage: stripeCustomerId ? 'off_session' : undefined,
        metadata: { orderId: orderRecord.id },
      },
      metadata: {
        orderId: orderRecord.id,
        type: 'cart',
        paymentMode: paymentMode ?? 'full',
        discountCodeId: discountCodeId ?? '',
        giftVoucherId: giftVoucherId ?? '',
        loyaltyPointsRedeemed: String(loyaltyPointsRedeemed ?? 0),
      },
    }

    const session = await stripe.checkout.sessions.create(sessionParams)

    await payload.update({ collection: 'orders', id: orderRecord.id, data: { stripeSessionId: session.id } })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('Checkout error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
