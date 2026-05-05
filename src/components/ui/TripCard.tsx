interface TripCardProps {
  startDate: string
  endDate: string
  spotsAvailable: number
  spotsTotal: number
  price: number
  currency: string
  status: 'active' | 'soldOut' | 'draft'
  tags?: string[]
  onBook?: () => void
}

export function TripCard({
  startDate,
  endDate,
  spotsAvailable,
  spotsTotal,
  price,
  currency,
  status,
  tags = [],
  onBook,
}: TripCardProps) {
  const isSoldOut = status === 'soldOut' || spotsAvailable === 0
  const dateRange = `${new Date(startDate).toLocaleDateString('bg-BG', { day: 'numeric', month: 'long' })} — ${new Date(endDate).toLocaleDateString('bg-BG', { day: 'numeric', month: 'long', year: 'numeric' })}`

  return (
    <div className="border border-white/10 rounded-lg p-5 bg-white/5">
      <div className="flex items-start justify-between gap-4 mb-3">
        <p className="text-sm text-white/70">{dateRange}</p>
        {isSoldOut ? (
          <span className="flex-shrink-0 px-2.5 py-1 text-xs font-medium bg-white/10 text-white/40 rounded-full">
            НЯМА МЕСТА
          </span>
        ) : (
          <span className="flex-shrink-0 px-2.5 py-1 text-xs font-semibold bg-white text-black rounded-full">
            САМО {spotsAvailable} МЕСТА
          </span>
        )}
      </div>
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {tags.map((tag) => (
            <span key={tag} className="px-2 py-0.5 text-xs border border-white/20 rounded text-white/60">
              {tag}
            </span>
          ))}
        </div>
      )}
      <div className="flex items-center justify-between">
        <p className="text-sm text-white/50">
          от <span className="text-white font-semibold">{price} {currency}</span>
        </p>
        <button
          onClick={onBook}
          disabled={isSoldOut}
          className="px-4 py-2 text-sm font-semibold bg-white text-black rounded hover:bg-white/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          ЗАПИШИ СЕ
        </button>
      </div>
    </div>
  )
}
