import { NextRequest, NextResponse } from 'next/server'


export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const currency = searchParams.get('currency') ?? 'eur'
    if (currency === 'eur') return NextResponse.json({ rate: 1, currency: 'eur' })

    const { stripe: _stripeImport } = await import('@/lib/stripe'); const stripe = _stripeImport!
    const rates = await stripe.exchangeRates.retrieve(currency)
    const rate = rates.rates?.eur ? 1 / rates.rates.eur : null
    return NextResponse.json({ rate, currency })
  } catch {
    return NextResponse.json({ rate: null, currency: 'eur' })
  }
}
