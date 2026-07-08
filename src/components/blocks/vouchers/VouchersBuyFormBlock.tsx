type Props = {
  forMyselfLabel?: string
  giftSomeoneLabel?: string
  chooseAmountLabel?: string
  customAmountLabel?: string
  customAmountPlaceholder?: string
  forSpecificLabel?: string
  openTypeLabel?: string
  destinationTypeLabel?: string
  tripTypeLabel?: string
  programTypeLabel?: string
  recipientDetailsLabel?: string
  recipientNamePlaceholder?: string
  recipientEmailPlaceholder?: string
  personalMessageLabel?: string
  scheduleDeliveryLabel?: string
  submitButtonPrefix?: string
  submitButtonSuffix?: string
}

export function VouchersBuyFormBlock({
  forMyselfLabel = 'For myself',
  giftSomeoneLabel = 'Gift someone',
  chooseAmountLabel = 'Choose amount',
  customAmountLabel = 'Custom',
  forSpecificLabel = 'For a specific',
  openTypeLabel = 'Any adventure',
  recipientDetailsLabel = 'Recipient details',
  personalMessageLabel = 'Personal message',
  submitButtonPrefix = 'Purchase',
  submitButtonSuffix = 'Voucher',
}: Props) {
  return (
    <div className="space-y-6 opacity-40 pointer-events-none">
      <div className="flex gap-0 border border-white/10 rounded-sm overflow-hidden max-w-xs">
        <div className="flex-1 py-2.5 text-xs tracking-widest uppercase text-center bg-white text-black">{forMyselfLabel}</div>
        <div className="flex-1 py-2.5 text-xs tracking-widest uppercase text-center text-white/40">{giftSomeoneLabel}</div>
      </div>
      <p className="text-xs tracking-widest text-white/30 uppercase">{chooseAmountLabel} · {customAmountLabel}</p>
      <p className="text-xs tracking-widest text-white/30 uppercase">{forSpecificLabel} · {openTypeLabel}</p>
      <p className="text-xs tracking-widest text-white/30 uppercase">{recipientDetailsLabel}</p>
      <p className="text-xs tracking-widest text-white/30 uppercase">{personalMessageLabel}</p>
      <div className="inline-block py-3 px-6 text-xs tracking-widest uppercase border border-white text-white rounded-sm">
        {submitButtonPrefix} €100 {submitButtonSuffix}
      </div>
    </div>
  )
}
