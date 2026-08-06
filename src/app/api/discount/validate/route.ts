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

    const scope = discount.applicableTo
    if (scope && scope !== 'all') {
      const items: Array<{ type?: string; tripId?: string; programId?: string; destinationId?: string }> = Array.isArray(cartItems) ? cartItems : []
      const idOf = (rel: unknown) => (typeof rel === 'string' ? rel : (rel as { id?: string } | null | undefined)?.id ?? null)
      const matchesScope = (() => {
        if (scope === 'trips') return items.some((i) => i.type === 'trip')
        if (scope === 'programs') return items.some((i) => i.type === 'program')
        if (scope === 'destinations') return items.some((i) => i.type === 'destination')
        if (scope === 'products') return items.some((i) => i.type === 'product')
        if (scope === 'specific-trip') return items.some((i) => i.type === 'trip' && i.tripId === idOf(discount.specificTrip))
        if (scope === 'specific-program') return items.some((i) => i.type === 'program' && i.programId === idOf(discount.specificProgram))
        if (scope === 'specific-destination') return items.some((i) => i.type === 'destination' && i.destinationId === idOf(discount.specificDestination))
        return true
      })()
      if (!matchesScope) return NextResponse.json({ error: 'Code not applicable to items in cart' }, { status: 400 })
    }

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
      id: discount.id,
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

