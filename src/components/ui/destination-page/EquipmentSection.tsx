type Props = {
  items: string[]
  fullWidth?: boolean
}

export default function EquipmentSection({ items, fullWidth }: Props) {
  if (!items?.length) return null

  return (
    <div className={`px-4 sm:px-8 lg:px-16 py-8 sm:py-0 border-b sm:border-b-0 sm:border-r border-white/10${fullWidth ? ' lg:col-span-2 lg:border-r-0' : ''}`}>
      <p className="text-xs font-semibold tracking-widest text-white/40 uppercase mb-2 sm:mb-3" data-animate="fade-up">
        Екипировка
      </p>
      <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-3 sm:mb-4 leading-tight" data-animate="fade-up">
        Необходима лична<br />екипировка
      </h2>

      <ul className="grid gap-x-4 sm:gap-x-8 grid-cols-1 sm:grid-cols-2" data-animate="stagger-children">
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-2 sm:gap-3 py-2.5 sm:py-3 border-b border-white/10 group">
            <span className="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 rounded-full border border-white/20 flex items-center justify-center text-white/30 text-xs font-mono group-hover:border-white/50 group-hover:text-white/60 transition-colors duration-150">
              {String(i + 1).padStart(2, '0')}
            </span>
            <span className="text-xs sm:text-sm text-white/70 leading-snug group-hover:text-white transition-colors duration-150">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
