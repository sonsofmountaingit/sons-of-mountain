import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import type { CartItem } from '@/lib/cart-store'
import { resolvePaymentPlan } from '@/lib/pricing/payment-plan'
import { getDynamicPrice, getPriceBreakdown } from '@/lib/pricing/dynamic'
import { isBookingDeadlinePassed } from '@/lib/booking-deadline'
import { z } from 'zod'
import { claimIdempotencyKey, enforceRateLimit, getClientIp, getIdempotencyValue, setIdempotencyValue } from '@/lib/security/rate-limit'
import { verifyTurnstile } from '@/lib/security/turnstile'

const cartCheckoutContactSchema = z.object({
  customerEmail: z.string().trim().email(),
  confirmEmail: z.string().trim().email(),
}).refine(
  ({ customerEmail, confirmEmail }) => customerEmail.toLowerCase() === confirmEmail.toLowerCase(),
  { message: 'Email addresses do not match', path: ['confirmEmail'] },
)

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
    // New clients send an idempotency key. Generate a request-scoped fallback
    // for legacy clients so existing integrations continue to work; only the
    // explicit key can deduplicate a retry across requests.
    const suppliedIdempotencyKey = req.headers.get('idempotency-key')?.trim()
    if (suppliedIdempotencyKey && suppliedIdempotencyKey.length > 128) {
      return NextResponse.json({ error: 'Invalid Idempotency-Key' }, { status: 400 })
    }
    const idempotencyKey = suppliedIdempotencyKey || crypto.randomUUID()
    const cachedCheckoutUrl = await getIdempotencyValue(idempotencyKey)
    if (cachedCheckoutUrl && cachedCheckoutUrl !== '__processing__') return NextResponse.json({ url: cachedCheckoutUrl })
    if (cachedCheckoutUrl === '__processing__' || !await claimIdempotencyKey(idempotencyKey)) {
      return NextResponse.json({ error: 'This checkout request is already being processed.' }, { status: 409 })
    }
    const requestLimit = await enforceRateLimit(`checkout:ip:${getClientIp(req)}`, 20, 3600)
    if (!requestLimit.allowed) {
      return NextResponse.json({ error: 'Too many checkout attempts. Please try again later.' }, { status: 429, headers: { 'Retry-After': String(requestLimit.retryAfterSeconds) } })
    }
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
      participationType,
      carpool,
      carpoolRideId,
      captchaToken,
    } = body

    const base = process.env.NEXT_PUBLIC_SERVER_URL ?? 'http://localhost:3000'
    const payload = await getPayload({ config })

    const { user: authUser } = await payload.auth({ headers: req.headers }).catch(() => ({ user: null }))
    if (!authUser && type === 'cart' && !await verifyTurnstile(captchaToken, req)) {
      return NextResponse.json({ error: 'Please complete the security check.' }, { status: 400 })
    }
    if (typeof customerEmail === 'string' && customerEmail.trim()) {
      const emailLimit = await enforceRateLimit(`checkout:email:${customerEmail.trim().toLowerCase()}`, 10, 3600)
      if (!emailLimit.allowed) {
        return NextResponse.json({ error: 'Too many checkout attempts. Please try again later.' }, { status: 429, headers: { 'Retry-After': String(emailLimit.retryAfterSeconds) } })
      }
    }
    let linkedCustomerId = authUser?.collection === 'customers' ? authUser.id : null
    if (!linkedCustomerId && customerEmail) {
      const existingCust = await payload.find({
        collection: 'customers',
        where: { email: { equals: customerEmail } },
        limit: 1,
        depth: 0,
      }).catch(() => null)
      if (existingCust?.docs?.[0]) {
        linkedCustomerId = existingCust.docs[0].id
      }
    }

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
      }, { idempotencyKey: `checkout:${idempotencyKey}` })

      await payload.update({
        collection,
        id,
        data: { stripeSessionId: session.id, customer: linkedCustomerId ?? undefined } as any,
      }).catch(() => null)
      if (session.url) await setIdempotencyValue(idempotencyKey, session.url)
      return NextResponse.json({ url: session.url })
    }

    // Multi-item cart checkout
    if (!items?.length) return NextResponse.json({ error: 'Cart is empty' }, { status: 400 })

    const contact = cartCheckoutContactSchema.safeParse({ customerEmail, confirmEmail: body.confirmEmail })
    if (!contact.success) {
      return NextResponse.json({ error: 'Please enter matching valid email addresses' }, { status: 400 })
    }
    body.customerEmail = contact.data.customerEmail.toLowerCase()



    // Server-side price validation/recomputation for each cart item — never trust the
    // client's unitPrice/priceBreakdown (it may be stale, e.g. cart added before early-bird
    // spots ran out). For bookable items (trip/program/destination) we recompute the
    // authoritative breakdown from the live record and overwrite the item in place.
    const bookableCollectionMap: Record<string, string> = { trip: 'trips', program: 'programs', destination: 'destinations' }
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

          if (bookableCollectionMap[item.type]) {
            const spotsAvailable = (doc as any)?.spotsAvailable
            if (spotsAvailable != null && spotsAvailable < item.quantity) {
              return NextResponse.json({
                error: `Only ${spotsAvailable} spots left for "${item.title}".`,
              }, { status: 400 })
            }
            if (isBookingDeadlinePassed((doc as any)?.bookingDeadline)) {
              return NextResponse.json({
                error: `Booking deadline has passed for "${item.title}".`,
              }, { status: 400 })
            }
            const basePrice = (doc as any)?.spotsTotal != null && spotsAvailable != null
              ? getDynamicPrice((doc as any).price, (doc as any).spotsTotal, spotsAvailable)
              : (doc as any)?.price
            const breakdown = getPriceBreakdown(
              item.quantity,
              basePrice,
              (doc as any)?.earlyBirdPrice,
              (doc as any)?.earlyBirdUntil,
              (doc as any)?.earlyBirdSpotsRemaining,
            )
            item.unitPrice = breakdown.totalPrice / item.quantity
            item.priceBreakdown = breakdown
            continue
          }

          const expectedPrice =
            (doc as any)?.price ??
            (doc as any)?.bundlePrice ??
            (doc as any)?.pricePerPerson
          const priceMatchesRegular = expectedPrice != null && Math.abs(item.unitPrice - expectedPrice) <= 0.01
          if (expectedPrice != null && !priceMatchesRegular) {
            return NextResponse.json({
              error: `Price mismatch for "${item.title}": expected €${expectedPrice.toFixed(2)}, got €${item.unitPrice.toFixed(2)}`,
            }, { status: 400 })
          }
        }
      } catch {
        // Item not found — skip validation, Stripe will handle downstream
      }
    }
    // Server-side discount/voucher/loyalty validation — never trust the client's
    // discountAmount/voucherAmount/orderTotal (it may not reflect real eligibility).
    const cartSubtotal = (items as CartItem[]).reduce(
      (sum, item) => sum + (item.priceBreakdown?.totalPrice ?? item.unitPrice * item.quantity),
      0,
    )

    let serverDiscountAmount = 0
    let validatedDiscountCodeId: string | null = null
    if (discountCodeId) {
      const dc = await payload.findByID({ collection: 'discount-codes', id: discountCodeId, depth: 0 }).catch(() => null)
      if (dc && (dc as any).isActive) {
        const now = new Date()
        const startsAt = (dc as any).startsAt ? new Date((dc as any).startsAt) : null
        const expiresAt = (dc as any).expiresAt ? new Date((dc as any).expiresAt) : null
        const maxUses = (dc as any).maxUses
        const usedCount = (dc as any).usedCount ?? 0
        const minOrderAmount = (dc as any).minOrderAmount
        const notExpired = (!startsAt || startsAt <= now) && (!expiresAt || expiresAt >= now)
        const underMaxUses = maxUses == null || usedCount < maxUses
        const meetsMin = minOrderAmount == null || cartSubtotal >= minOrderAmount
        if (notExpired && underMaxUses && meetsMin) {
          const value = (dc as any).value ?? 0
          serverDiscountAmount = (dc as any).type === 'percent'
            ? Math.round(cartSubtotal * (value / 100) * 100) / 100
            : Math.min(value, cartSubtotal)
          validatedDiscountCodeId = discountCodeId
        }
      }
    }

    let serverVoucherAmount = 0
    let validatedGiftVoucherId: string | null = null
    if (giftVoucherId) {
      const gv = await payload.findByID({ collection: 'gift-vouchers', id: giftVoucherId, depth: 0 }).catch(() => null)
      if (!gv || !(gv as any).paidAt || (gv as any).status !== 'active') {
        return NextResponse.json({ error: 'This voucher is invalid or its payment has not been confirmed.' }, { status: 400 })
      }

      const expiresAt = (gv as any).expiresAt ? new Date((gv as any).expiresAt) : null
      if (expiresAt && expiresAt < new Date()) {
        return NextResponse.json({ error: 'This voucher has expired.' }, { status: 400 })
      }

      const matchesRestrictedOffering = (items as CartItem[]).some((item) =>
        ((gv as any).forDestination && item.destinationId === String((gv as any).forDestination)) ||
        ((gv as any).forTrip && item.tripId === String((gv as any).forTrip)) ||
        ((gv as any).forProgram && item.programId === String((gv as any).forProgram)),
      )
      const isRestricted = (gv as any).forDestination || (gv as any).forTrip || (gv as any).forProgram
      if (isRestricted && !matchesRestrictedOffering) {
        return NextResponse.json({ error: 'This voucher is valid only for its selected destination, trip, or program.' }, { status: 400 })
      }

      const afterDiscount = Math.max(0, cartSubtotal - serverDiscountAmount)
      serverVoucherAmount = Math.min((gv as any).amount ?? 0, afterDiscount)
      validatedGiftVoucherId = giftVoucherId
    }

    // Validate loyalty point redemption against the customer's actual balance
    let serverLoyaltyPoints = 0
    if (loyaltyPointsRedeemed && customerEmail) {
      const custResult = await payload.find({ collection: 'customers', where: { email: { equals: customerEmail } }, limit: 1, depth: 0 }).catch(() => null)
      const availablePoints = (custResult?.docs[0] as any)?.loyaltyPoints ?? 0
      serverLoyaltyPoints = Math.max(0, Math.min(Number(loyaltyPointsRedeemed) || 0, availablePoints))
    }
    const loyaltyDiscountAmount = serverLoyaltyPoints / 100

    const totalDeduction = serverDiscountAmount + serverVoucherAmount + loyaltyDiscountAmount
    const serverTotal = Math.max(0, cartSubtotal - totalDeduction)

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
          // Client may opt into full payment when the resolved plan would otherwise be
          // deposit/installments — this only ever narrows toward full, never fabricates a
          // cheaper plan than the record's own config, so it's safe to trust from the client.
          const payInFull = paymentMode === 'full'
          // Resolve against the actual charged amount (early-bird mix, quantity), already
          // validated above against the record's regular/early-bird prices — not the record's
          // flat regular price — so deposit/installment splits sum to what's really being charged.
          const chargedAmount = bookableItem.priceBreakdown?.totalPrice ?? bookableItem.unitPrice * bookableItem.quantity
          const record = { ...(doc as any), price: chargedAmount }
          const plan = resolvePaymentPlan(record, new Date(), payInFull)
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
        customer: linkedCustomerId ?? undefined,
        currency: currency.toUpperCase(),
        totalAmount: serverTotal,
        discountCode: validatedDiscountCodeId ?? null,
        giftVoucher: validatedGiftVoucherId ?? null,
        loyaltyPointsRedeemed: serverLoyaltyPoints,
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
          participantCount: item.quantity,
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
        const rawDestinationId = carpool.destinationId
        const validTripId = rawTripId && !Number.isNaN(Number(rawTripId)) ? rawTripId : undefined
        const validProgramId = rawProgramId && !Number.isNaN(Number(rawProgramId)) ? rawProgramId : undefined
        const validDestinationId = rawDestinationId && !Number.isNaN(Number(rawDestinationId)) ? rawDestinationId : undefined
        const seatsAvailable = Number(carpool.seatsAvailable)
        const ride = await payload.create({
          collection: 'carpool-rides',
          overrideAccess: true,
          data: {
            vehicleType: carpool.vehicleType,
            seatsAvailable: Number.isFinite(seatsAvailable) && seatsAvailable > 0 ? seatsAvailable : 1,
            departureFrom: carpool.departureFrom,
            departureTime: carpool.departureTime ?? null,
            notes: carpool.notes ?? null,
            organizerName: organizerName ?? null,
            organizerEmail: customerEmail ?? null,
            organizerPhone: body.phone ?? null,
            ...(validTripId ? { trip: Number(validTripId) } : {}),
            ...(validProgramId ? { program: Number(validProgramId) } : {}),
            ...(validDestinationId ? { destination: Number(validDestinationId) } : {}),
            status: 'open',
            source: 'registration',
          } as any,
        })
        resolvedCarpoolRideId = String(ride.id)
        await payload.update({
          collection: 'orders',
          id: orderRecord.id,
          data: { carpoolRide: resolvedCarpoolRideId },
          overrideAccess: true,
        })
      } catch (e) {
        console.error('Failed to create carpool ride:', e instanceof Error ? e.stack ?? e.message : e)
        return NextResponse.json({ error: 'Could not save the shared ride. Please try again.' }, { status: 500 })
      }
    } else if (participationType === 'join' && carpoolRideId) {
      try {
        const existing = await payload.findByID({ collection: 'carpool-rides', id: carpoolRideId, overrideAccess: true, depth: 0 }) as any
        const passengers = existing.passengers ?? []
        const seatsAvailable = Number(existing.seatsAvailable) || 0
        if (existing.status !== 'open' || passengers.length >= seatsAvailable) {
          return NextResponse.json({ error: 'This shared ride is no longer available.' }, { status: 400 })
        }
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
        resolvedCarpoolRideId = String(carpoolRideId)
        await payload.update({
          collection: 'orders',
          id: orderRecord.id,
          data: { carpoolRide: resolvedCarpoolRideId },
          overrideAccess: true,
        })
      } catch (e) {
        console.error('Failed to add carpool passenger:', e instanceof Error ? e.stack ?? e.message : e)
        return NextResponse.json({ error: 'Could not join the shared ride. Please try again.' }, { status: 500 })
      }
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
    // Discount/voucher/loyalty deductions are applied to whatever is charged right now
    // (first installment or full total) — never to the record's flat/regular price.
    const firstChargeAmount = resolvedInstallments.length > 0
      ? Math.max(0, resolvedInstallments[0].amount - totalDeduction)
      : serverTotal

    const chargeNowLineItems = resolvedInstallments.length > 0 || totalDeduction > 0
      ? [{
          price_data: {
            currency,
            product_data: {
              name: resolvedInstallments.length > 0
                ? `${bookableItem?.title ?? 'Sons of Mountains'} — ${resolvedInstallments[0].label}`
                : 'Sons of Mountains — Order',
            },
            unit_amount: Math.round(firstChargeAmount * 100),
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
        discountCodeId: validatedDiscountCodeId ?? '',
        giftVoucherId: validatedGiftVoucherId ?? '',
        loyaltyPointsRedeemed: String(serverLoyaltyPoints),
      },
    }
    const session = await stripe.checkout.sessions.create(sessionParams, { idempotencyKey: `checkout:${idempotencyKey}` })

    await payload.update({ collection: 'orders', id: orderRecord.id, data: { stripeSessionId: session.id } })
    if (session.url) await setIdempotencyValue(idempotencyKey, session.url)

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('[checkout] CAUGHT ERROR:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
