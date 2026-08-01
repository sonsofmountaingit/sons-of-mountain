export function isBookingDeadlinePassed(bookingDeadline: string | null | undefined): boolean {
  if (!bookingDeadline) return false
  return new Date(bookingDeadline).getTime() < Date.now()
}
