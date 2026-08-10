import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function POST(req: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const { user } = await payload.auth({ headers: req.headers })

    const body = await req.json()

    const { recipientEmail, recipientName, amount, currency = 'EUR', message, senderName, senderEmail, isGift } = body
    const forDestination = body.forDestination ? Number(body.forDestination) : undefined
    const forTrip = body.forTrip ? Number(body.forTrip) : undefined
    const forProgram = body.forProgram ? Number(body.forProgram) : undefined
    const deliveryDate = body.deliveryDate ? new Date(body.deliveryDate) : undefined

    if (!Number.isFinite(amount) || amount <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 })
    }
    if (!recipientName?.trim() || !recipientEmail?.trim() || !senderName?.trim() || !senderEmail?.trim()) {
      return NextResponse.json({ error: 'Recipient and sender details are required' }, { status: 400 })
    }
    if (currency !== 'EUR') return NextResponse.json({ error: 'Unsupported currency' }, { status: 400 })
    if (deliveryDate && Number.isNaN(deliveryDate.getTime())) {
      return NextResponse.json({ error: 'Invalid delivery date' }, { status: 400 })
    }

    const targets = [forDestination, forTrip, forProgram].filter((id) => id !== undefined)
    if (targets.length > 1 || targets.some((id) => !Number.isSafeInteger(id) || id! < 1)) {
      return NextResponse.json({ error: 'Select one valid destination, trip, or program' }, { status: 400 })
    }

    // Relationship IDs arrive from form controls as strings. Payload's Postgres
    // adapter requires numeric IDs; normalize and verify the selected offering
    // before creating a voucher that is restricted to it.
    const target = forDestination
      ? { collection: 'destinations' as const, id: forDestination }
      : forTrip
        ? { collection: 'trips' as const, id: forTrip }
        : forProgram
          ? { collection: 'programs' as const, id: forProgram }
          : null
    if (target) {
      const offering = await payload.findByID({ ...target, depth: 0, overrideAccess: true }).catch(() => null) as any
      const available = target.collection === 'destinations'
        ? offering?._status === 'published' && offering?.bookingStatus !== 'archived'
        : offering?.status !== 'draft' && offering?.status !== 'archived'
      if (!available) {
        return NextResponse.json({ error: 'The selected destination, trip, or program is unavailable' }, { status: 400 })
      }
    }

    const customerDocId = user?.collection === 'customers' ? (user.id as string) : undefined
    // Only account-owned vouchers ("for me") require an authenticated customer.
    // Gifts are paid guest checkouts and use the purchaser's supplied details.
    if (!isGift && !customerDocId) {
      return NextResponse.json({ error: 'Please sign in to purchase a voucher for yourself' }, { status: 401 })
    }

    const expiresAt = new Date()
    expiresAt.setFullYear(expiresAt.getFullYear() + 1)

    const voucher = await payload.create({
      collection: 'gift-vouchers',
      // The offering has been explicitly checked above. Bypass public read
      // access while resolving the relationship so valid destination, trip,
      // and program IDs are never rejected by Payload as relationship fields.
      overrideAccess: true,
      data: {
        ...(customerDocId ? { customer: customerDocId } : {}),
        recipientEmail,
        recipientName,
        senderName,
        senderEmail,
        amount,
        currency,
        message,
        status: 'active',
        isGift: !!isGift,
        expiresAt: expiresAt.toISOString(),
        ...(forDestination ? { forDestination } : {}),
        ...(forTrip ? { forTrip } : {}),
        ...(forProgram ? { forProgram } : {}),
        ...(deliveryDate ? { deliveryDate: deliveryDate.toISOString() } : {}),
      },
    })

    return NextResponse.json({ ok: true, voucherId: voucher.id, code: voucher.code })
  } catch (err) {
    console.error('Voucher create error:', err)
    const message = err instanceof Error && err.name === 'ValidationError'
      ? 'Please check the voucher details and selected offering'
      : 'Internal error'
    return NextResponse.json({ error: message }, { status: err instanceof Error && err.name === 'ValidationError' ? 400 : 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const { user } = await payload.auth({ headers: req.headers })
    if (!user || user.collection !== 'customers') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { searchParams } = req.nextUrl
    const code = searchParams.get('code')
    if (!code) return NextResponse.json({ error: 'Missing code' }, { status: 400 })

    const result = await payload.find({
      collection: 'gift-vouchers',
      where: { code: { equals: code } },
      limit: 1,
    })

    const voucher = result.docs[0]
    if (!voucher) return NextResponse.json({ error: 'Voucher not found' }, { status: 404 })
    if (!voucher.paidAt) return NextResponse.json({ error: 'Voucher payment has not been confirmed' }, { status: 400 })
    if (voucher.status !== 'active') return NextResponse.json({ error: 'Voucher is not active' }, { status: 400 })

    const now = new Date()
    if (voucher.expiresAt && new Date(voucher.expiresAt) < now) {
      await payload.update({ collection: 'gift-vouchers', id: voucher.id, data: { status: 'expired' } })
      return NextResponse.json({ error: 'Voucher expired' }, { status: 400 })
    }

    // Redeem
    await payload.update({
      collection: 'gift-vouchers',
      id: voucher.id,
      data: {
        status: 'redeemed',
        redeemedAt: now.toISOString(),
        redeemedByCustomerId: String(user.id),
      },
    })

    return NextResponse.json({ ok: true, voucher: { id: voucher.id, code: voucher.code, amount: voucher.amount, currency: voucher.currency } })
  } catch (err) {
    console.error('Voucher redeem error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
