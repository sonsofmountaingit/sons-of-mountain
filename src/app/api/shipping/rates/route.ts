import { NextRequest, NextResponse } from 'next/server'

interface ShippingRate {
  id: string
  label: string
  description: string
  price: number
  estimatedDays: number
}

export async function POST(req: NextRequest) {
  try {
    const { country, totalWeightGrams, orderTotal } = await req.json()

    const freeShippingThreshold = 100

    // Digital items only (trips, programs, vouchers) — no shipping needed
    if (!totalWeightGrams || totalWeightGrams === 0) {
      return NextResponse.json({ rates: [{ id: 'digital', label: 'Digital Delivery', description: 'Email confirmation', price: 0, estimatedDays: 0 }] })
    }

    const rates: ShippingRate[] = []

    if (orderTotal >= freeShippingThreshold) {
      rates.push({ id: 'free', label: 'Free Shipping', description: 'Standard delivery', price: 0, estimatedDays: 5 })
    }

    const isEU = ['AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE'].includes(country)

    if (isEU) {
      rates.push({ id: 'eu-standard', label: 'EU Standard', description: '5-8 business days', price: 8.99, estimatedDays: 7 })
      rates.push({ id: 'eu-express', label: 'EU Express', description: '2-3 business days', price: 19.99, estimatedDays: 3 })
    } else if (country === 'BG') {
      rates.push({ id: 'bg-standard', label: 'Speedy / Econt', description: '1-2 работни дни', price: 5.99, estimatedDays: 2 })
    } else {
      rates.push({ id: 'intl-standard', label: 'International Standard', description: '10-15 business days', price: 24.99, estimatedDays: 12 })
      rates.push({ id: 'intl-express', label: 'International Express', description: '4-6 business days', price: 49.99, estimatedDays: 5 })
    }

    return NextResponse.json({ rates })
  } catch {
    return NextResponse.json({ error: 'Failed to get rates' }, { status: 500 })
  }
}
