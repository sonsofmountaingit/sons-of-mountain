import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import type { CartItem } from '@/lib/cart-store'
import { getDynamicPrice, getEarlyBirdPrice } from '@/lib/pricing/dynamic'

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
        if (trip.status === 'soldOut' || trip.spotsAvailable < item.quantity) {
          validated.push({ ...item, outOfStock: true, warning: `Only ${trip.spotsAvailable} spots left` })
          continue
        }
        const { price: ebPrice } = getEarlyBirdPrice(trip.price, trip.earlyBirdPrice, trip.earlyBirdUntil, trip.earlyBirdSpots, trip.spotsAvailable)
        const dynamicPrice = getDynamicPrice(ebPrice, trip.spotsTotal, trip.spotsAvailable)
        validated.push({ ...item, unitPrice: dynamicPrice, spotsAvailable: trip.spotsAvailable })

      } else if (item.type === 'program' && item.programId) {
        const program = await payload.findByID({ collection: 'programs', id: item.programId }).catch(() => null)
        if (!program) { validated.push({ ...item, outOfStock: true, warning: 'Program not found' }); continue }
        if (program.status === 'Sold Out' || program.spotsAvailable < item.quantity) {
          validated.push({ ...item, outOfStock: true, warning: `Only ${program.spotsAvailable} spots left` })
          continue
        }
        const { price: ebPrice } = getEarlyBirdPrice(program.price, program.earlyBirdPrice, program.earlyBirdUntil, program.earlyBirdSpots, program.spotsAvailable)
        validated.push({ ...item, unitPrice: ebPrice, spotsAvailable: program.spotsAvailable })

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
