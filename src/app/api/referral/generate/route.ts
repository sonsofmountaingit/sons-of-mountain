import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { headers } from 'next/headers'

export async function POST(req: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const { user } = await payload.auth({ headers: await headers() })
    if (!user || user.collection !== 'customers') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const cust = await payload.findByID({ collection: 'customers', id: user.id, depth: 1 }).catch(() => null)
    if (!cust) return NextResponse.json({ error: 'Customer not found' }, { status: 404 })

    if (cust.referralCode) {
      const existing = await payload.findByID({ collection: 'discount-codes', id: typeof cust.referralCode === 'string' ? cust.referralCode : (cust.referralCode as any).id }).catch(() => null)
      if (existing) return NextResponse.json({ code: existing.code, discountPercent: existing.value })
    }

    const code = `REF-${cust.id.toString().slice(-4).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`
    const discountCode = await payload.create({
      collection: 'discount-codes',
      data: {
        code,
        label: `Referral code for ${cust.email}`,
        type: 'referral',
        value: 10,
        isActive: true,
        onePerCustomer: true,
        applicableTo: 'all',
        referredBy: cust.id,
      },
    })

    await payload.update({
      collection: 'customers',
      id: cust.id,
      data: { referralCode: discountCode.id },
    })

    return NextResponse.json({ code: discountCode.code, discountPercent: discountCode.value })
  } catch (err) {
    console.error('Referral generate error:', err)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
