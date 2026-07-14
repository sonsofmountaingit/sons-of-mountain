import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import type { CartItem } from '@/lib/cart-store'
import { resolvePaymentPlan } from '@/lib/pricing/payment-plan'
import { auth } from '@/lib/auth'

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
      participationType,
      carpool,
      carpoolRideId,
    } = body

    const base = process.env.NEXT_PUBLIC_SERVER_URL ?? 'http://localhost:3000'
    const payload = await getPayload({ config })

    const authSession = await auth.api.getSession({ headers: req.headers }).catch(() => null)
    if (!authSession) return NextResponse.json({ error: 'Трябва да влезете в профила си, за да завършите резервацията.' }, { status: 401 })
    const betterAuthUserId = authSession.user.id

    const customerResult = await payload
      .find({ collection: 'customers', where: { betterAuthId: { equals: betterAuthUserId } }, limit: 1, depth: 0 })
      .catch(() => null)
    const linkedCustomerId = customerResult?.docs[0]?.id ?? null

    const shopSettings = await payload.findGlobal({ slug: 'shop', depth: 0 }).catch(() => null)
    const bnplMin = (shopSettings as any)?.bnplMinOrderAmount ?? 100

    // Legacy single-item checkout (registrations, vouchers, orders)
    if (type !== 'cart') {
      const id = recordId ?? orderId
      if (!id || !amount) return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })

      // Server-side amount validation: look up the record and verify the price
      const collection = COLLECTION_MAP[type] ?? 'registrations'
      let resolvedPaymentModeLegacy = 'full'
      let firstInstallmentAmount: number | undefined
      try {
        const record = await payload.findByID({ collection, id, overrideAccess: true, depth: 0 })
        const storedAmount =
          (record as any).totalAmount ??
          (record as any).amount ??
          (record as any).price
        if (storedAmount != null && Math.abs(amount - storedAmount) > 0.01) {
          return NextResponse.json({ error: 'Amount mismatch with server record' }, { status: 400 })
        }
        resolvedPaymentModeLegacy = (record as any).paymentMode ?? 'full'
        const recordInstallments = (record as any).installments as Array<{ amount: number }> | undefined
        firstInstallmentAmount = recordInstallments?.[0]?.amount
      } catch {
        // Record not found — let Stripe handle the error downstream
      }

      const paymentMethods: any[] = ['card']

      const chargeAmount = resolvedPaymentModeLegacy === 'installments' && firstInstallmentAmount != null
        ? firstInstallmentAmount
        : resolvedPaymentModeLegacy === 'deposit'
          ? (firstInstallmentAmount ?? body.depositAmount ?? amount)
          : amount

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
        payment_intent_data: { setup_future_usage: 'off_session' },
        metadata: { recordId: id, type, tripId: tripId ?? '', paymentMode: resolvedPaymentModeLegacy },
        customer_email: customerEmail,
      })

      await payload.update({
        collection,
        id,
        data: { stripeSessionId: session.id, betterAuthUserId, customer: linkedCustomerId ?? undefined } as any,
      }).catch(() => null)
      return NextResponse.json({ url: session.url })
    }

    // Multi-item cart checkout
    if (!items?.length) return NextResponse.json({ error: 'Cart is empty' }, { status: 400 })

    // Server-side price validation for each cart item
    for (const item of items as CartItem[]) {
      try {
        const collectionMap: Record<string, string> = {
          trip: 'trips', product: 'products', program: 'programs', destination: 'destinations', bundle: 'bundles',
        }
        const col = collectionMap[item.type]
        const docId = item.tripId ?? item.productId ?? item.programId ?? item.destinationId ?? item.bundleId
        if (col && docId && !Number.isNaN(Number(docId))) {
          const doc = await payload.findByID({ collection: col as any, id: docId, overrideAccess: true, depth: 0 }).catch(() => null)
          if (!doc) {
            return NextResponse.json({
              error: `"${item.title}" вече не е достъпен. Моля, премахнете го от количката и опитайте отново.`,
            }, { status: 400 })
          }
          const expectedPrice =
            (doc as any)?.price ??
            (doc as any)?.bundlePrice ??
            (doc as any)?.pricePerPerson
          const expectedEarlyBirdPrice = (doc as any)?.earlyBirdPrice
          const priceMatchesRegular = expectedPrice != null && Math.abs(item.unitPrice - expectedPrice) <= 0.01
          const priceMatchesBreakdown =
            item.priceBreakdown &&
            Math.abs(item.priceBreakdown.totalPrice / item.quantity - item.unitPrice) <= 0.01 &&
            (item.priceBreakdown.earlyBirdCount === 0 || item.priceBreakdown.earlyBirdPrice === expectedEarlyBirdPrice) &&
            item.priceBreakdown.regularPrice === expectedPrice
          if (expectedPrice != null && !priceMatchesRegular && !priceMatchesBreakdown) {
            return NextResponse.json({
              error: `Price mismatch for "${item.title}": expected €${expectedPrice.toFixed(2)}, got €${item.unitPrice.toFixed(2)}`,
            }, { status: 400 })
          }
        }
      } catch {
        // Item not found — skip validation, Stripe will handle downstream
      }
    }

    // Resolve the authoritative payment plan server-side from the booked item's config —
    // never trust the client for payment mode/amounts, same principle as the price validation above.
    let resolvedPaymentMode: string = paymentMode ?? 'full'
    let resolvedInstallments: Array<{ label: string; amount: number; dueDate: string }> = []
    const bookableItem = (items as CartItem[]).find((i) => i.type === 'trip' || i.type === 'program' || i.type === 'destination')
    if (bookableItem) {
      const collectionMap: Record<string, string> = { trip: 'trips', program: 'programs', destination: 'destinations' }
      const col = collectionMap[bookableItem.type]
      const docId = bookableItem.tripId ?? bookableItem.programId ?? bookableItem.destinationId
      if (col && docId && !Number.isNaN(Number(docId))) {
        const doc = await payload.findByID({ collection: col as any, id: docId, depth: 0 }).catch(() => null)
        if (doc) {
          const plan = resolvePaymentPlan(doc as any, new Date())
          resolvedPaymentMode = plan.mode === 'installments3' ? 'installments' : plan.mode
          resolvedInstallments = plan.installments.map((inst) => ({
            label: inst.label,
            amount: inst.amount,
            dueDate: inst.dueDate.toISOString(),
          }))
        }
      }
    }

    // Build line items — use stored Stripe Price IDs where available
    const lineItems: any[] = await Promise.all((items as CartItem[]).map(async (item) => {
      let stripePriceId: string | null = null
      try {
        const collectionMap: Record<string, string> = {
          trip: 'trips', product: 'products', program: 'programs', destination: 'destinations', bundle: 'bundles',
        }
        const col = collectionMap[item.type]
        const docId = item.tripId ?? item.productId ?? item.programId ?? item.destinationId ?? item.bundleId
        if (col && docId && !Number.isNaN(Number(docId))) {
          const doc = await payload.findByID({ collection: col as any, id: docId, depth: 0 }).catch(() => null)
          stripePriceId = (doc as any)?.stripePriceId ?? null
        }
      } catch {}

      if (stripePriceId) return { price: stripePriceId, quantity: item.quantity }
      return {
        price_data: {
          currency,
          product_data: {
            name: item.title,
            metadata: { itemType: item.type, itemId: item.tripId ?? item.productId ?? item.programId ?? item.destinationId ?? item.bundleId ?? '' },
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
        betterAuthUserId,
        customer: linkedCustomerId ?? undefined,
        currency: currency.toUpperCase(),
        totalAmount: orderTotal ?? 0,
        discountCode: discountCodeId ?? null,
        giftVoucher: giftVoucherId ?? null,
        loyaltyPointsRedeemed: loyaltyPointsRedeemed ?? 0,
        paymentMode: resolvedPaymentMode,
        installments: resolvedPaymentMode === 'installments' || resolvedPaymentMode === 'deposit' ? resolvedInstallments : undefined,
        depositPaid: undefined,
        remainingBalance: resolvedPaymentMode === 'deposit' ? resolvedInstallments[1]?.amount : undefined,
        remainingDueDate: resolvedPaymentMode === 'deposit' ? resolvedInstallments[1]?.dueDate : undefined,
        shippingAddress: shippingAddress ?? undefined,
        corporatePeopleCount: corporatePeopleCount ?? 1,
        items: (items as CartItem[]).map((item) => {
          const toId = (v: string | undefined | null) =>
            v != null && !Number.isNaN(Number(v)) ? Number(v) : null
          return {
          itemType: item.type,
          trip: toId(item.tripId),
          product: toId(item.productId),
          program: toId(item.programId),
          destination: toId(item.destinationId),
          bundle: toId(item.bundleId),
          variantId: item.variantId ?? null,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          earlyBirdCount: item.priceBreakdown?.earlyBirdCount ?? null,
          earlyBirdPrice: item.priceBreakdown?.earlyBirdPrice ?? null,
          regularCount: item.priceBreakdown?.regularCount ?? null,
          regularPrice: item.priceBreakdown?.regularPrice ?? null,
        }}),
        participationType: participationType ?? 'solo',
      },
    })

    // Handle carpool: create ride (organizer) or add passenger (join)
    let resolvedCarpoolRideId: string | null = null
    if (participationType === 'organizer' && carpool) {
      try {
        const organizerName = `${body.firstName ?? ''} ${body.lastName ?? ''}`.trim()
        const rawTripId = carpool.tripId
        const rawProgramId = carpool.programId
        const validTripId = rawTripId && !Number.isNaN(Number(rawTripId)) ? rawTripId : undefined
        const validProgramId = rawProgramId && !Number.isNaN(Number(rawProgramId)) ? rawProgramId : undefined
        const ride = await payload.create({
          collection: 'carpool-rides',
          data: {
            vehicleType: carpool.vehicleType,
            seatsAvailable: carpool.seatsAvailable,
            departureFrom: carpool.departureFrom,
            departureTime: carpool.departureTime ?? null,
            notes: carpool.notes ?? null,
            organizerName: organizerName ?? null,
            organizerEmail: customerEmail ?? null,
            organizerPhone: body.phone ?? null,
            ...(validTripId ? { trip: validTripId } : {}),
            ...(validProgramId ? { program: validProgramId } : {}),
            status: 'open',
            source: 'registration',
          } as any,
        })
        resolvedCarpoolRideId = ride.id as string
      } catch (e) {
        console.error('Failed to create carpool ride:', e)
      }
    } else if (participationType === 'join' && carpoolRideId) {
      resolvedCarpoolRideId = carpoolRideId
      try {
        const existing = await payload.findByID({ collection: 'carpool-rides', id: carpoolRideId, overrideAccess: true, depth: 0 }) as any
        const passengers = existing.passengers ?? []
        await payload.update({
          collection: 'carpool-rides',
          id: carpoolRideId,
          data: {
            passengers: [...passengers, {
              name: `${body.firstName ?? ''} ${body.lastName ?? ''}`.trim(),
              email: customerEmail ?? '',
              phone: body.phone ?? '',
            }],
          } as any,
          overrideAccess: true,
        })
      } catch (e) {
        console.error('Failed to add carpool passenger:', e)
      }
    }

    if (resolvedCarpoolRideId) {
      await payload.update({ collection: 'orders', id: orderRecord.id, data: { carpoolRide: resolvedCarpoolRideId } as any }).catch(() => null)
    }

    const paymentMethods: any[] = ['card']

    // Resolve Stripe customer ID for saved payment methods
    let stripeCustomerId: string | undefined
    if (customerEmail) {
      const custResult = await payload.find({ collection: 'customers', where: { email: { equals: customerEmail } }, limit: 1, depth: 0 }).catch(() => null)
      stripeCustomerId = (custResult?.docs[0] as any)?.stripeCustomerId ?? undefined
    }

    // For deposit/installment plans, charge only the first installment now — the rest is
    // collected later off-session by the balance-charge cron using the saved payment method.
    const chargeNowLineItems = resolvedInstallments.length > 0
      ? [{
          price_data: {
            currency,
            product_data: { name: `${bookableItem?.title ?? 'Sons of Mountains'} — ${resolvedInstallments[0].label}` },
            unit_amount: Math.round(resolvedInstallments[0].amount * 100),
          },
          quantity: 1,
        }]
      : lineItems

    if (!stripeCustomerId && resolvedInstallments.length > 1 && customerEmail) {
      const created = await stripe.customers.create({
        email: customerEmail,
        name: `${body.firstName ?? ''} ${body.lastName ?? ''}`.trim() || undefined,
      })
      stripeCustomerId = created.id
      await payload.update({
        collection: 'customers',
        where: { email: { equals: customerEmail } },
        data: { stripeCustomerId } as any,
      }).catch(() => null)
    }

    const sessionParams: any = {
      mode: 'payment',
      payment_method_types: paymentMethods,
      line_items: chargeNowLineItems,
      success_url: `${base}/shop/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${base}/shop/cancel`,
      customer_email: stripeCustomerId ? undefined : customerEmail,
      customer: stripeCustomerId,
      payment_intent_data: {
        setup_future_usage: stripeCustomerId || resolvedInstallments.length > 1 ? 'off_session' : undefined,
        metadata: { orderId: orderRecord.id },
      },
      metadata: {
        orderId: orderRecord.id,
        type: 'cart',
        paymentMode: resolvedPaymentMode,
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
