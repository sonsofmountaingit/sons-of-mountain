import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import type { CartItem } from '@/lib/cart-store'
import { getDynamicPrice, getPriceBreakdown } from '@/lib/pricing/dynamic'
import { isBookingDeadlinePassed } from '@/lib/booking-deadline'
import { isTravelBookable } from '@/lib/travel-status'

export async function POST(req: NextRequest) {
  try {
    const { items } = await req.json() as { items: CartItem[] }
    if (!items?.length) return NextResponse.json({ valid: true, items: [] })

    const payload = await getPayload({ config })
    const validated: (CartItem & { warning?: string; outOfStock?: boolean })[] = []

    for (const item of items) {
      if (item.type === 'trip' && item.tripId) {
        const trip = await payload.findByID({ collection: 'trips', id: item.tripId }).catch(() => null)
        if (!trip) { validated.push({ ...item, outOfStock: true, warning: 'Trip not found' }); continue }
        if (!isTravelBookable(trip as any)) {
          validated.push({ ...item, outOfStock: true, warning: 'This trip is no longer available' })
          continue
        }
        if (trip.spotsAvailable < item.quantity) {
          validated.push({ ...item, outOfStock: true, warning: `Only ${trip.spotsAvailable} spots left` })
          continue
        }
        if (isBookingDeadlinePassed((trip as any).bookingDeadline)) {
          validated.push({ ...item, outOfStock: true, warning: 'Booking deadline has passed' })
          continue
        }
        const dynamicPrice = getDynamicPrice(trip.price, trip.spotsTotal, trip.spotsAvailable)
        const breakdown = getPriceBreakdown(item.quantity, dynamicPrice, trip.earlyBirdPrice, trip.earlyBirdUntil, trip.earlyBirdSpotsRemaining)
        validated.push({ ...item, unitPrice: breakdown.totalPrice / item.quantity, priceBreakdown: breakdown, spotsAvailable: trip.spotsAvailable })

      } else if (item.type === 'program' && item.programId) {
        const program = await payload.findByID({ collection: 'programs', id: item.programId }).catch(() => null)
        if (!program) { validated.push({ ...item, outOfStock: true, warning: 'Program not found' }); continue }
        if (!isTravelBookable(program as any)) {
          validated.push({ ...item, outOfStock: true, warning: 'This program is no longer available' })
          continue
        }
        if (program.spotsAvailable < item.quantity) {
          validated.push({ ...item, outOfStock: true, warning: `Only ${program.spotsAvailable} spots left` })
          continue
        }
        if (isBookingDeadlinePassed((program as any).bookingDeadline)) {
          validated.push({ ...item, outOfStock: true, warning: 'Booking deadline has passed' })
          continue
        }
        const breakdown = getPriceBreakdown(item.quantity, program.price, program.earlyBirdPrice, program.earlyBirdUntil, program.earlyBirdSpotsRemaining)
        validated.push({ ...item, unitPrice: breakdown.totalPrice / item.quantity, priceBreakdown: breakdown, spotsAvailable: program.spotsAvailable })

      } else if (item.type === 'destination' && item.destinationId) {
        const destination = await payload.findByID({ collection: 'destinations', id: item.destinationId }).catch(() => null)
        if (!destination) { validated.push({ ...item, outOfStock: true, warning: 'Destination not found' }); continue }
        const spotsAvailable = (destination as any).spotsAvailable
        if ((destination as any).bookingStatus === 'soldOut' || (destination as any).bookingStatus === 'archived' || (spotsAvailable != null && spotsAvailable < item.quantity)) {
          validated.push({ ...item, outOfStock: true, warning: `Only ${spotsAvailable ?? 0} spots left` })
          continue
        }
        if (isBookingDeadlinePassed((destination as any).bookingDeadline)) {
          validated.push({ ...item, outOfStock: true, warning: 'Booking deadline has passed' })
          continue
        }
        const breakdown = getPriceBreakdown(item.quantity, (destination as any).price, (destination as any).earlyBirdPrice, (destination as any).earlyBirdUntil, (destination as any).earlyBirdSpotsRemaining)
        validated.push({ ...item, unitPrice: breakdown.totalPrice / item.quantity, priceBreakdown: breakdown, spotsAvailable })

      } else if (item.type === 'product' && item.productId) {
        const product = await payload.findByID({ collection: 'products', id: item.productId }).catch(() => null)
        if (!product || product.status !== 'active') { validated.push({ ...item, outOfStock: true, warning: 'Product not available' }); continue }

        if (item.variantId) {
          const variant = (product.variants as any[])?.find((v: any) => v.id === item.variantId)
          if (!variant || variant.stock < item.quantity) {
            validated.push({ ...item, outOfStock: true, warning: 'Variant out of stock' })
            continue
          }
          validated.push({ ...item, unitPrice: variant.price ?? product.price, stock: variant.stock })
        } else {
          if (product.stock < item.quantity) {
            validated.push({ ...item, outOfStock: true, warning: `Only ${product.stock} in stock` })
            continue
          }
          validated.push({ ...item, unitPrice: product.price, stock: product.stock })
        }

      } else {
        validated.push(item)
      }
    }

    const hasOutOfStock = validated.some((i) => i.outOfStock)
    return NextResponse.json({ valid: !hasOutOfStock, items: validated })
  } catch (err) {
    console.error('Cart validate error:', err)
    return NextResponse.json({ error: 'Validation failed' }, { status: 500 })
  }
}
