export const EUR_TO_BGN = 1.95583

export function formatPrice(amountEur: number, opts?: { decimals?: number }): string {
  const decimals = opts?.decimals ?? 2
  const bgn = amountEur * EUR_TO_BGN
  return `€${amountEur.toFixed(decimals)} | ${bgn.toFixed(decimals)} лв.`
}
