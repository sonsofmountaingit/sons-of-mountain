export function formatPrice(amountEur: number, opts?: { decimals?: number }): string {
  const decimals = opts?.decimals ?? 2
  return `€${amountEur.toFixed(decimals)}`
}
