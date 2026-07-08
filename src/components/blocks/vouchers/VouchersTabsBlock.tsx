type Props = {
  buyTabLabel?: string
  redeemTabLabel?: string
  mineTabLabel?: string
}

export function VouchersTabsBlock({
  buyTabLabel = 'Buy a Voucher',
  redeemTabLabel = 'Redeem',
  mineTabLabel = 'My Vouchers',
}: Props) {
  return (
    <div className="flex gap-0 border border-white/10 rounded-sm mb-12 overflow-hidden opacity-40 pointer-events-none">
      {[buyTabLabel, redeemTabLabel, mineTabLabel].map((label) => (
        <div key={label} className="flex-1 py-3 text-xs tracking-widest uppercase text-white/40 text-center">
          {label}
        </div>
      ))}
    </div>
  )
}
