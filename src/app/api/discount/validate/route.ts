import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function POST(req: NextRequest) {
  try {
    const { code, cartTotal, cartItems, customerId, peopleCount } = await req.json()
    if (!code) return NextResponse.json({ error: 'Code required' }, { status: 400 })

    const payload = await getPayload({ config })
    const result = await payload.find({
      collection: 'discount-codes',
      where: {
        and: [
          { code: { equals: code.toUpperCase().trim() } },
          { isActive: { equals: true } },
        ],
      },
      limit: 1,
    })

    const discount = result.docs[0]
    if (!discount) return NextResponse.json({ error: 'Invalid or inactive code' }, { status: 404 })

    const now = new Date()
    if (discount.startsAt && new Date(discount.startsAt) > now) {
      return NextResponse.json({ error: 'Code not yet active' }, { status: 400 })
    }
    if (discount.expiresAt && new Date(discount.expiresAt) < now) {
      return NextResponse.json({ error: 'Code has expired' }, { status: 400 })
    }
    if (discount.maxUses && discount.usedCount >= discount.maxUses) {
      return NextResponse.json({ error: 'Code usage limit reached' }, { status: 400 })
    }
    if (discount.minOrderAmount && cartTotal < discount.minOrderAmount) {
      return NextResponse.json({ error: `Minimum order of €${discount.minOrderAmount} required` }, { status: 400 })
    }
    if (discount.onePerCustomer && customerId) {
      const alreadyUsed = (discount.usedByCustomers as any[])?.some((u: any) =>
        (typeof u.customer === 'string' ? u.customer : u.customer?.id) === customerId
      )
      if (alreadyUsed) return NextResponse.json({ error: 'Code already used by this account' }, { status: 400 })
    }

    let discountAmount = 0

    if (discount.type === 'corporate' && peopleCount) {
      const tiers = ((discount.corporateTiers as any[]) ?? []).sort((a: any, b: any) => b.minPeople - a.minPeople)
      const tier = tiers.find((t: any) => peopleCount >= t.minPeople)
      if (tier) {
        discountAmount = Math.round(cartTotal * (tier.discountPercent / 100) * 100) / 100
      }
    } else if (discount.type === 'percent' || discount.type === 'referral') {
      discountAmount = Math.round(cartTotal * ((discount.value ?? 0) / 100) * 100) / 100
    } else if (discount.type === 'fixed') {
      discountAmount = Math.min(discount.value ?? 0, cartTotal)
    }

    return NextResponse.json({
      valid: true,
      discountAmount,
      code: discount.code,
      type: discount.type,
      value: discount.value,
      label: discount.label,
    })
  } catch (err) {
    console.error('Discount validate error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}

