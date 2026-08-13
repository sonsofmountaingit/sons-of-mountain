// Capacity must never change the advertised or charged price. Keep this helper as
// the shared pricing boundary so existing callers always receive the base price.
export function getDynamicPrice(basePrice: number, _spotsTotal: number, _spotsAvailable: number): number {
  return basePrice
}

export function getDynamicPriceLabel(_spotsTotal: number, _spotsAvailable: number): string | null {
  return null
}

export function getEarlyBirdPrice(
  basePrice: number,
  earlyBirdPrice: number | null | undefined,
  earlyBirdUntil: string | null | undefined,
  earlyBirdSpotsRemaining: number | null | undefined,
): { price: number; isEarlyBird: boolean } {
  if (!earlyBirdPrice || !earlyBirdUntil) return { price: basePrice, isEarlyBird: false }
  const now = new Date()
  const deadline = new Date(earlyBirdUntil)
  if (now > deadline) return { price: basePrice, isEarlyBird: false }
  if (earlyBirdSpotsRemaining != null && earlyBirdSpotsRemaining <= 0) return { price: basePrice, isEarlyBird: false }
  return { price: earlyBirdPrice, isEarlyBird: true }
}

export interface PriceBreakdown {
  earlyBirdCount: number
  earlyBirdPrice: number
  regularCount: number
  regularPrice: number
  totalPrice: number
}

// Splits a quantity purchase across the remaining early-bird allocation and the regular price.
// earlyBirdSpotsRemaining is the live count of early-bird-priced spots left to sell,
// decremented on each purchase — independent of overall spotsAvailable.
export function getPriceBreakdown(
  quantity: number,
  basePrice: number,
  earlyBirdPrice: number | null | undefined,
  earlyBirdUntil: string | null | undefined,
  earlyBirdSpotsRemaining: number | null | undefined,
): PriceBreakdown {
  const noEarlyBird = (): PriceBreakdown => ({
    earlyBirdCount: 0,
    earlyBirdPrice: basePrice,
    regularCount: quantity,
    regularPrice: basePrice,
    totalPrice: basePrice * quantity,
  })

  if (!earlyBirdPrice || !earlyBirdUntil || earlyBirdSpotsRemaining == null) return noEarlyBird()

  const now = new Date()
  const deadline = new Date(earlyBirdUntil)
  if (now > deadline) return noEarlyBird()

  const earlyBirdRemaining = Math.max(0, earlyBirdSpotsRemaining)
  const earlyBirdCount = Math.min(quantity, earlyBirdRemaining)
  const regularCount = quantity - earlyBirdCount

  return {
    earlyBirdCount,
    earlyBirdPrice,
    regularCount,
    regularPrice: basePrice,
    totalPrice: earlyBirdCount * earlyBirdPrice + regularCount * basePrice,
  }
}
