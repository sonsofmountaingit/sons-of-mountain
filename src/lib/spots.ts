export function getSpotsLabel(
  spotsAvailable: number | null | undefined,
  spotsTotal: number | null | undefined,
): number | null {
  if (spotsAvailable == null || spotsTotal == null || spotsTotal <= 0) return null
  return spotsAvailable <= spotsTotal * 0.5 ? spotsAvailable : spotsTotal
}

export function isSpotsLow(
  spotsAvailable: number | null | undefined,
  spotsTotal: number | null | undefined,
): boolean {
  if (spotsAvailable == null || spotsTotal == null || spotsTotal <= 0) return false
  return spotsAvailable <= spotsTotal * 0.5
}
