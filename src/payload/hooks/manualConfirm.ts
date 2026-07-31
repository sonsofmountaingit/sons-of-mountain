import type { CollectionBeforeChangeHook } from 'payload'

export const manualConfirmPaidBeforeChange: CollectionBeforeChangeHook = ({ data, originalDoc }) => {
  if (data.manualConfirmPaid && !originalDoc?.manualConfirmPaid) {
    data.status = 'paid'
    data.paidAt = new Date().toISOString()
    data.manualConfirmPaid = false
  }
  return data
}
