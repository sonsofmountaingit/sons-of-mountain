import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { resolvePaymentPlan } from '@/lib/pricing/payment-plan'

const COLLECTION_MAP: Record<string, 'trips' | 'programs' | 'destinations'> = {
  trip: 'trips',
  program: 'programs',
  destination: 'destinations',
}

export async function GET(req: NextRequest) {
  const itemType = req.nextUrl.searchParams.get('itemType') ?? ''
  const itemId = req.nextUrl.searchParams.get('itemId') ?? ''
  const payInFull = req.nextUrl.searchParams.get('payInFull') === 'true'
  const amountParam = req.nextUrl.searchParams.get('amount')
  const overrideAmount = amountParam != null ? Number(amountParam) : null

  const col = COLLECTION_MAP[itemType]
  if (!col || !itemId || Number.isNaN(Number(itemId))) {
    return NextResponse.json({ error: 'Invalid item' }, { status: 400 })
  }

  try {
    const payload = await getPayload({ config })
    const doc = await payload.findByID({ collection: col, id: itemId, depth: 0, overrideAccess: true }).catch(() => null)
    if (!doc) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    // The record's own `price` field is a unit price — the actual amount due can differ
    // (quantity, early-bird pricing, discount codes, vouchers). When the client supplies the
    // real cart total for this item, resolve the plan's percentages/splits against that instead,
    // so deposit + remaining always sums to what the customer is actually being charged.
    const record = overrideAmount != null && !Number.isNaN(overrideAmount)
      ? { ...(doc as any), price: overrideAmount }
      : (doc as any)

    const plan = resolvePaymentPlan(record, new Date(), payInFull)
    return NextResponse.json({
      mode: plan.mode === 'installments3' ? 'installments' : plan.mode,
      installments: plan.installments.map((inst) => ({
        label: inst.label,
        amount: inst.amount,
        dueDate: inst.dueDate.toISOString(),
      })),
    })
  } catch {
    return NextResponse.json({ error: 'Failed to resolve payment plan' }, { status: 500 })
  }
}
