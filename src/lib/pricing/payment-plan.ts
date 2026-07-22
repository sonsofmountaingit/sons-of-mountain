export type PaymentPlanMode = 'full' | 'deposit' | 'installments3'

export type PlannedInstallment = {
  label: string
  amount: number
  dueDate: Date
}

export type PaymentPlan = {
  mode: PaymentPlanMode
  installments: PlannedInstallment[]
}

type Bookable = {
  price: number
  durationDays?: number | null
  startDate?: string | Date | null
  paymentPlanType?: 'auto' | 'full' | 'deposit' | 'installments3' | null
  depositPercent?: number | null
  lateBookingThresholdDays?: number | null
  depositAmount?: number | null
  installmentPlan?: {
    secondPaymentPercent?: number | null
    secondPaymentDeadlineDays?: number | null
    secondPaymentBeforeTripDays?: number | null
    finalPaymentBeforeTripDays?: number | null
  } | null
}

const daysBetween = (a: Date, b: Date) => Math.round((a.getTime() - b.getTime()) / (1000 * 60 * 60 * 24))
const addDays = (d: Date, days: number) => new Date(d.getTime() + days * 86400000)

// Hard floor: every plan must be fully paid at least this many days before departure —
// no exceptions, regardless of how close to departure the booking happens.
const MIN_DAYS_BEFORE_TRIP_FOR_FULL_PAYMENT = 15
// Minimum spacing between any two consecutive due dates in an installment plan, so a
// customer never sees two charges back-to-back with no time to prepare.
const MIN_GAP_DAYS = 14

function resolveMode(record: Bookable): PaymentPlanMode {
  const configured = record.paymentPlanType ?? 'auto'
  if (configured !== 'auto') return configured
  const duration = record.durationDays ?? 1
  if (duration <= 1) return 'full'
  if (duration <= 3) return 'deposit'
  return 'installments3'
}

export function resolvePaymentPlan(record: Bookable, bookingDate: Date = new Date(), payInFull = false): PaymentPlan {
  const lateBookingThresholdDays = record.lateBookingThresholdDays ?? 30
  const startDate = record.startDate ? new Date(record.startDate) : null
  const daysUntilStart = startDate ? daysBetween(startDate, bookingDate) : Infinity

  let mode = payInFull ? 'full' : resolveMode(record)

  // Late booking override: force full payment if within threshold of departure
  if (mode !== 'full' && startDate && daysUntilStart <= lateBookingThresholdDays) {
    mode = 'full'
  }

  if (mode === 'full') {
    return { mode, installments: [{ label: 'Пълно плащане', amount: record.price, dueDate: bookingDate }] }
  }

  // Every plan must be fully settled at least MIN_DAYS_BEFORE_TRIP_FOR_FULL_PAYMENT days
  // before departure — this is a hard floor, independent of the configured "before trip"
  // offsets, which may otherwise be too close to departure for a very late booking.
  const mustBePaidBy = startDate ? addDays(startDate, -MIN_DAYS_BEFORE_TRIP_FOR_FULL_PAYMENT) : null

  if (mode === 'deposit') {
    const depositPercent = record.depositPercent ?? 30
    const depositAmount = Math.round(record.price * (depositPercent / 100) * 100) / 100
    const remainingBalance = Math.round((record.price - depositAmount) * 100) / 100
    const naturalBalanceDueDate = startDate ? addDays(startDate, -lateBookingThresholdDays) : bookingDate
    const latestAllowed = mustBePaidBy ?? naturalBalanceDueDate
    // Balance due date must be after the deposit (with breathing room) and never later
    // than the hard "must be paid by" floor.
    const earliestAllowed = addDays(bookingDate, MIN_GAP_DAYS)
    const balanceDueDate = new Date(
      Math.min(Math.max(naturalBalanceDueDate.getTime(), earliestAllowed.getTime()), latestAllowed.getTime()),
    )
    return {
      mode,
      installments: [
        { label: 'Депозит', amount: depositAmount, dueDate: bookingDate },
        { label: 'Остатък', amount: remainingBalance, dueDate: balanceDueDate },
      ],
    }
  }

  // installments3 — deposit at booking, 2nd payment mid-way, final payment settled at
  // least MIN_DAYS_BEFORE_TRIP_FOR_FULL_PAYMENT days before departure. Both gaps
  // (deposit -> 2nd, 2nd -> final) must be at least MIN_GAP_DAYS. If the window between
  // booking and the hard floor is too short to fit 3 spaced-out payments, degrade to a
  // 2-installment (deposit) plan, and if even that doesn't fit, fall back to full payment.
  const plan = record.installmentPlan ?? {}
  const secondPaymentPercent = plan.secondPaymentPercent ?? 50
  const secondPaymentDeadlineDays = plan.secondPaymentDeadlineDays ?? 30
  const secondPaymentBeforeTripDays = plan.secondPaymentBeforeTripDays ?? 60
  const finalPaymentBeforeTripDays = plan.finalPaymentBeforeTripDays ?? 45

  const depositAmount = record.depositAmount ?? Math.min(100, record.price * 0.1)

  const naturalFinalPaymentDueDate = startDate ? addDays(startDate, -finalPaymentBeforeTripDays) : null
  // The configured "N days before trip" offset can land at or before the booking date
  // itself for a booking made not-quite-that-far in advance (e.g. booking 45 days out
  // with a 45-day-before-trip default) — that leaves no room for installments even
  // though the trip is comfortably outside the late-booking window. In that case, use
  // as much of the available room as the hard floor allows instead of the configured
  // offset, so installments are only abandoned when there truly is no room at all.
  const finalPaymentDueDate = mustBePaidBy && naturalFinalPaymentDueDate
    ? naturalFinalPaymentDueDate.getTime() > addDays(bookingDate, MIN_GAP_DAYS * 2).getTime()
      ? new Date(Math.min(naturalFinalPaymentDueDate.getTime(), mustBePaidBy.getTime()))
      : mustBePaidBy
    : mustBePaidBy ?? naturalFinalPaymentDueDate ?? addDays(bookingDate, secondPaymentDeadlineDays * 2)

  const windowDays = daysBetween(finalPaymentDueDate, bookingDate)

  if (windowDays < MIN_GAP_DAYS * 2) {
    // Not enough room for 3 spaced-out payments — degrade to deposit + balance, still
    // respecting the hard floor.
    const depositPercent = record.depositPercent ?? 30
    const fallbackDeposit = Math.round(record.price * (depositPercent / 100) * 100) / 100
    const fallbackBalance = Math.round((record.price - fallbackDeposit) * 100) / 100
    if (windowDays < MIN_GAP_DAYS) {
      return { mode: 'full', installments: [{ label: 'Пълно плащане', amount: record.price, dueDate: bookingDate }] }
    }
    return {
      mode: 'deposit',
      installments: [
        { label: 'Депозит', amount: fallbackDeposit, dueDate: bookingDate },
        { label: 'Остатък', amount: fallbackBalance, dueDate: finalPaymentDueDate },
      ],
    }
  }

  const secondPaymentAmount = Math.round((record.price * (secondPaymentPercent / 100) - depositAmount) * 100) / 100
  const finalPaymentAmount = Math.round((record.price - depositAmount - secondPaymentAmount) * 100) / 100

  const byDaysAfterBooking = addDays(bookingDate, secondPaymentDeadlineDays)
  const byDaysBeforeTrip = startDate ? addDays(startDate, -secondPaymentBeforeTripDays) : byDaysAfterBooking

  // Preferred 2nd-payment date: one month after booking, or N days before trip start,
  // whichever is earlier — but only among candidates that actually leave room after the
  // deposit and before the final payment.
  const earliestAllowedSecond = addDays(bookingDate, MIN_GAP_DAYS)
  const latestAllowedSecond = addDays(finalPaymentDueDate, -MIN_GAP_DAYS)
  const preferredCandidates = [byDaysAfterBooking, byDaysBeforeTrip].filter(
    (d) => d.getTime() >= earliestAllowedSecond.getTime() && d.getTime() <= latestAllowedSecond.getTime(),
  )
  const secondPaymentDueDate = preferredCandidates.length
    ? new Date(Math.min(...preferredCandidates.map((d) => d.getTime())))
    // No configured candidate fits the window — split the gap evenly instead.
    : new Date(Math.round((bookingDate.getTime() + finalPaymentDueDate.getTime()) / 2))

  return {
    mode,
    installments: [
      { label: 'Депозит', amount: depositAmount, dueDate: bookingDate },
      { label: '2ро плащане', amount: secondPaymentAmount, dueDate: secondPaymentDueDate },
      { label: 'Финално плащане', amount: finalPaymentAmount, dueDate: finalPaymentDueDate },
    ],
  }
}
