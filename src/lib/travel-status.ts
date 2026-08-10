/**
 * Dates for trips and programs are day-based. An item remains bookable for its
 * entire end date and becomes past at the start of the following UTC day.
 */
export function hasTravelEnded(endDate: string | null | undefined, now = new Date()): boolean {
  if (!endDate) return false

  const end = new Date(endDate)
  if (Number.isNaN(end.getTime())) return false

  end.setUTCHours(23, 59, 59, 999)
  return end.getTime() < now.getTime()
}

export function isTravelBookable(item: {
  status?: string | null
  endDate?: string | null
  bookingDeadline?: string | null
}, now = new Date()): boolean {
  return item.status !== 'archived'
    && item.status !== 'draft'
    && item.status !== 'soldOut'
    && !hasTravelEnded(item.endDate, now)
}
