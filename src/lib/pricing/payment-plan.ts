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

  if (mode === 'deposit') {
    const depositPercent = record.depositPercent ?? 30
    const depositAmount = Math.round(record.price * (depositPercent / 100) * 100) / 100
    const remainingBalance = Math.round((record.price - depositAmount) * 100) / 100
    const balanceDueDate = startDate ? new Date(startDate.getTime() - lateBookingThresholdDays * 86400000) : bookingDate
    return {
      mode,
      installments: [
        { label: 'Депозит', amount: depositAmount, dueDate: bookingDate },
        { label: 'Остатък', amount: remainingBalance, dueDate: balanceDueDate },
      ],
    }
  }

  // installments3
  const plan = record.installmentPlan ?? {}
  const secondPaymentPercent = plan.secondPaymentPercent ?? 50
  const secondPaymentDeadlineDays = plan.secondPaymentDeadlineDays ?? 30
  const secondPaymentBeforeTripDays = plan.secondPaymentBeforeTripDays ?? 60
  const finalPaymentBeforeTripDays = plan.finalPaymentBeforeTripDays ?? 45

  const depositAmount = record.depositAmount ?? Math.min(100, record.price * 0.1)
  const secondPaymentAmount = Math.round((record.price * (secondPaymentPercent / 100) - depositAmount) * 100) / 100
  const finalPaymentAmount = Math.round((record.price - depositAmount - secondPaymentAmount) * 100) / 100

  const byDaysAfterBooking = new Date(bookingDate.getTime() + secondPaymentDeadlineDays * 86400000)
  const byDaysBeforeTrip = startDate
    ? new Date(startDate.getTime() - secondPaymentBeforeTripDays * 86400000)
    : byDaysAfterBooking
  const secondPaymentDueDate = byDaysAfterBooking < byDaysBeforeTrip ? byDaysAfterBooking : byDaysBeforeTrip

  const finalPaymentDueDate = startDate
    ? new Date(startDate.getTime() - finalPaymentBeforeTripDays * 86400000)
    : secondPaymentDueDate

  return {
    mode,
    installments: [
      { label: 'Депозит', amount: depositAmount, dueDate: bookingDate },
      { label: '2ро плащане', amount: secondPaymentAmount, dueDate: secondPaymentDueDate },
      { label: 'Финално плащане', amount: finalPaymentAmount, dueDate: finalPaymentDueDate },
    ],
  }
}
