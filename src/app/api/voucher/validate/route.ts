import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function POST(req: NextRequest) {
  try {
    const { code } = await req.json()
    if (!code) return NextResponse.json({ error: 'Изисква се код' }, { status: 400 })

    const payload = await getPayload({ config })
    const result = await payload.find({
      collection: 'gift-vouchers',
      where: { code: { equals: String(code).toUpperCase().trim() } },
      limit: 1,
    })

    const voucher = result.docs[0]
    if (!voucher) return NextResponse.json({ error: 'Невалиден или неактивен код за ваучер' }, { status: 404 })
    if (!voucher.paidAt) return NextResponse.json({ error: 'Плащането за ваучера все още не е потвърдено' }, { status: 400 })
    if (voucher.status !== 'active') return NextResponse.json({ error: 'Ваучерът не е активен' }, { status: 400 })

    const now = new Date()
    if (voucher.expiresAt && new Date(voucher.expiresAt) < now) {
      await payload.update({ collection: 'gift-vouchers', id: voucher.id, data: { status: 'expired' } })
      return NextResponse.json({ error: 'Ваучерът е изтекъл' }, { status: 400 })
    }

    // Payload may return an unpopulated relationship as null. `typeof null`
    // is "object", so guard it before accessing `.id`.
    const relationId = (relation: unknown) =>
      relation && typeof relation === 'object' ? (relation as { id?: string | number }).id ?? null : relation ?? null

    return NextResponse.json({
      valid: true,
      id: voucher.id,
      code: voucher.code,
      amount: voucher.amount,
      currency: voucher.currency,
      forDestination: relationId(voucher.forDestination),
      forTrip: relationId(voucher.forTrip),
      forProgram: relationId(voucher.forProgram),
    })
  } catch (err) {
    console.error('Voucher validate error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
