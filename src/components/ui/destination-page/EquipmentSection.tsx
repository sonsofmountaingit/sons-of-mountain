type Props = {
  items: string[]
}

export default function EquipmentSection({ items }: Props) {
  if (!items?.length) return null

  const third = Math.ceil(items.length / 3)
  const col1 = items.slice(0, third)
  const col2 = items.slice(third, third * 2)
  const col3 = items.slice(third * 2)

  return (
    <section className="py-16 px-4 sm:px-6 bg-white text-black">
      <div className="max-w-5xl mx-auto">
        <p className="text-xs font-semibold tracking-widest text-black/60 uppercase mb-3" data-animate="fade-up">
          ЕКИПИРОВКА
        </p>
        <h2 className="text-3xl font-bold mb-10" data-animate="fade-up">
          Необходима лична екипировка
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-12 gap-y-0 border-t border-black/10 pt-8" data-animate="stagger-children">
          {[col1, col2, col3].map((col, ci) => (
            <ul key={ci} className="space-y-0">
              {col.map((item, i) => (
                <li key={i} className="flex items-start gap-3 py-3 border-b border-black/8">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full border border-black/30 flex items-center justify-center mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-black/40 block" />
                  </span>
                  <span className="text-sm text-black/80 leading-snug">{item}</span>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  )
}
