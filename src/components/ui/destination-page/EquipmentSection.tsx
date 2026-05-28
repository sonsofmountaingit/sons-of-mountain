type Props = {
  items: string[]
}

export default function EquipmentSection({ items }: Props) {
  if (!items?.length) return null

  return (
    <div className="px-5 sm:px-8 lg:px-16 py-10 sm:py-0 border-b sm:border-b-0 sm:border-r border-white/10">
      <p className="text-xs font-semibold tracking-widest text-white/40 uppercase mb-3" data-animate="fade-up">
        Екипировка
      </p>
      <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 leading-tight" data-animate="fade-up">
        Необходима лична<br />екипировка
      </h2>

      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8" data-animate="stagger-children">
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-3 py-3 border-b border-white/10 group">
            <span className="flex-shrink-0 w-6 h-6 rounded-full border border-white/20 flex items-center justify-center text-white/30 text-xs font-mono group-hover:border-white/50 group-hover:text-white/60 transition-colors duration-150">
              {String(i + 1).padStart(2, '0')}
            </span>
            <span className="text-sm text-white/70 leading-snug group-hover:text-white transition-colors duration-150">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
