import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { auth } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: req.headers })

    const body = await req.json()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { recipientEmail, recipientName, amount, currency = 'EUR', message, forDestination, forTrip, forProgram, senderName, senderEmail, isGift } = body

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 })
    }

    const payload = await getPayload({ config })

    let customerDocId: string | undefined
    let betterAuthUserId: string | undefined

    if (session) {
      betterAuthUserId = session.user.id
      const existing = await payload.find({
        collection: 'customers',
        where: { betterAuthId: { equals: session.user.id } },
        limit: 1,
      })
      customerDocId = existing.docs[0]?.id as string | undefined
    }

    const expiresAt = new Date()
    expiresAt.setFullYear(expiresAt.getFullYear() + 1)

    const voucher = await payload.create({
      collection: 'gift-vouchers',
      data: {
        ...(betterAuthUserId ? { betterAuthUserId } : {}),
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
      },
    })

    return NextResponse.json({ ok: true, voucherId: voucher.id, code: voucher.code })
  } catch (err) {
    console.error('Voucher create error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: req.headers })
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { searchParams } = req.nextUrl
    const code = searchParams.get('code')
    if (!code) return NextResponse.json({ error: 'Missing code' }, { status: 400 })

    const payload = await getPayload({ config })
    const result = await payload.find({
      collection: 'gift-vouchers',
      where: { code: { equals: code } },
      limit: 1,
    })

    const voucher = result.docs[0]
    if (!voucher) return NextResponse.json({ error: 'Voucher not found' }, { status: 404 })
    if (voucher.status !== 'active') return NextResponse.json({ error: 'Voucher is not active' }, { status: 400 })

    const now = new Date()
    if (voucher.expiresAt && new Date(voucher.expiresAt) < now) {
      await payload.update({ collection: 'gift-vouchers', id: voucher.id, data: { status: 'expired' } })
      return NextResponse.json({ error: 'Voucher expired' }, { status: 400 })
    }

    // Redeem
    const existing = await payload.find({
      collection: 'customers',
      where: { betterAuthId: { equals: session.user.id } },
      limit: 1,
    })

    await payload.update({
      collection: 'gift-vouchers',
      id: voucher.id,
      data: {
        status: 'redeemed',
        redeemedAt: now.toISOString(),
        redeemedByCustomerId: session.user.id,
      },
    })

    return NextResponse.json({ ok: true, voucher: { id: voucher.id, code: voucher.code, amount: voucher.amount, currency: voucher.currency } })
  } catch (err) {
    console.error('Voucher redeem error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
