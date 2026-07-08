type Props = {
  redeemPromptLabel?: string
  redeemCodePlaceholder?: string
  redeemButtonLabel?: string
}

export function VouchersRedeemBlock({
  redeemPromptLabel = 'Enter your voucher code',
  redeemCodePlaceholder = 'SOM-XXXX-XXXX',
  redeemButtonLabel = 'Redeem Voucher',
}: Props) {
  return (
    <div className="max-w-md mx-auto opacity-40 pointer-events-none space-y-4">
      <p className="text-xs tracking-widest text-white/30 uppercase">{redeemPromptLabel}</p>
      <div className="w-full bg-white/5 border border-white/10 rounded-sm px-4 py-3 text-sm font-mono text-white/30">{redeemCodePlaceholder}</div>
      <div className="w-full text-center py-3.5 text-xs tracking-widest uppercase border border-white text-white rounded-sm">{redeemButtonLabel}</div>
    </div>
  )
}
