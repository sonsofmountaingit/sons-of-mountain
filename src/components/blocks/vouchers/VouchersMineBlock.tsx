type Props = {
  mineSignInPrompt?: string
  mineSignInButtonLabel?: string
  mineEmptyLabel?: string
}

export function VouchersMineBlock({
  mineSignInPrompt = 'Sign in to view your vouchers.',
  mineSignInButtonLabel = 'Sign In',
  mineEmptyLabel = 'No vouchers yet.',
}: Props) {
  return (
    <div className="text-center py-16 opacity-40 pointer-events-none">
      <p className="text-white/40 text-sm mb-6">{mineSignInPrompt}</p>
      <div className="inline-block text-xs tracking-widest uppercase border border-white/30 px-6 py-3 text-white/70 rounded-sm">{mineSignInButtonLabel}</div>
      <p className="text-white/30 text-sm mt-8">{mineEmptyLabel}</p>
    </div>
  )
}
