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

/**
 * Returns the correct word for spots depending on count and language:
 * - BG: 1 -> "място", != 1 -> "места"
 * - EN: 1 -> "spot", != 1 -> "spots"
 */
export function getSpotWord(count: number, language: 'BG' | 'EN' = 'BG'): string {
  if (language === 'EN') {
    return count === 1 ? 'spot' : 'spots'
  }
  return count === 1 ? 'място' : 'места'
}

/**
 * Returns uppercase variant for badges:
 * - BG: 1 -> "МЯСТО", != 1 -> "МЕСТА"
 * - EN: 1 -> "SPOT", != 1 -> "SPOTS"
 */
export function getSpotWordUpper(count: number, language: 'BG' | 'EN' = 'BG'): string {
  if (language === 'EN') {
    return count === 1 ? 'SPOT' : 'SPOTS'
  }
  return count === 1 ? 'МЯСТО' : 'МЕСТА'
}

/**
 * Formats spots count with the right word:
 * e.g. formatSpots(1, 'BG') -> "1 място"
 *      formatSpots(3, 'BG') -> "3 места"
 */
export function formatSpots(count: number, language: 'BG' | 'EN' = 'BG'): string {
  return `${count} ${getSpotWord(count, language)}`
}
