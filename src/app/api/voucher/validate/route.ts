import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function POST(req: NextRequest) {
  try {
    const { code } = await req.json()
    if (!code) return NextResponse.json({ error: 'Code required' }, { status: 400 })

    const payload = await getPayload({ config })
    const result = await payload.find({
      collection: 'gift-vouchers',
      where: { code: { equals: String(code).toUpperCase().trim() } },
      limit: 1,
    })

    const voucher = result.docs[0]
    if (!voucher) return NextResponse.json({ error: 'Invalid or inactive voucher code' }, { status: 404 })
    if (voucher.status !== 'active') return NextResponse.json({ error: 'Voucher is not active' }, { status: 400 })

    const now = new Date()
    if (voucher.expiresAt && new Date(voucher.expiresAt) < now) {
      await payload.update({ collection: 'gift-vouchers', id: voucher.id, data: { status: 'expired' } })
      return NextResponse.json({ error: 'Voucher has expired' }, { status: 400 })
    }

    return NextResponse.json({
      valid: true,
      id: voucher.id,
      code: voucher.code,
      amount: voucher.amount,
      currency: voucher.currency,
    })
  } catch (err) {
    console.error('Voucher validate error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
