import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const payload = await getPayload({ config })
    const betterAuthUserId = (session.user as any).id

    const customer = await payload.find({
      collection: 'customers',
      where: { betterAuthId: { equals: betterAuthUserId } },
      limit: 1,
      depth: 1,
    })

    const cust = customer.docs[0]
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
