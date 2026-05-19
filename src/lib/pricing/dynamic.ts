export function getDynamicPrice(basePrice: number, spotsTotal: number, spotsAvailable: number): number {
  if (spotsTotal <= 0) return basePrice
  const fillRate = (spotsTotal - spotsAvailable) / spotsTotal
  if (fillRate >= 0.95) return Math.round(basePrice * 1.10 * 100) / 100
  if (fillRate >= 0.80) return Math.round(basePrice * 1.05 * 100) / 100
  return basePrice
}

export function getDynamicPriceLabel(spotsTotal: number, spotsAvailable: number): string | null {
  if (spotsTotal <= 0) return null
  const fillRate = (spotsTotal - spotsAvailable) / spotsTotal
  if (fillRate >= 0.95) return 'Almost full'
  if (fillRate >= 0.80) return 'Filling fast'
  return null
}

export function getEarlyBirdPrice(
  basePrice: number,
  earlyBirdPrice: number | null | undefined,
  earlyBirdUntil: string | null | undefined,
  earlyBirdSpots: number | null | undefined,
  spotsAvailable: number,
): { price: number; isEarlyBird: boolean } {
  if (!earlyBirdPrice || !earlyBirdUntil) return { price: basePrice, isEarlyBird: false }
  const now = new Date()
  const deadline = new Date(earlyBirdUntil)
  if (now > deadline) return { price: basePrice, isEarlyBird: false }
  if (earlyBirdSpots != null && spotsAvailable > earlyBirdSpots) return { price: basePrice, isEarlyBird: false }
  return { price: earlyBirdPrice, isEarlyBird: true }
}
