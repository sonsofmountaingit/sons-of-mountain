interface OfferItem {
  title: string
  description: string
  icon?: string
}

interface Props {
  offerHeading?: string
  offerSubtext?: string
  offerItems?: OfferItem[]
}

export function IndividualProgramsOfferBlock({
  offerHeading = 'Какво предлагаме',
  offerSubtext = 'Индивидуална програма, изградена изцяло около теб — от идеята до последния ден.',
  offerItems = [],
}: Props) {
  return (
    <section className="bg-[#0a0a0a] px-4 py-12 sm:px-8 sm:py-24">
      <div className="mx-auto max-w-[1280px]">
        <h2 className="m-0 mb-4 text-[clamp(2rem,4vw,3rem)] font-black tracking-[-0.02em] text-white">
          {offerHeading}
        </h2>
        <p className="m-0 mb-12 max-w-[60ch] text-[1.1rem] text-white/60">
          {offerSubtext}
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {offerItems.map((item, i) => (
            <div
              key={i}
              className="flex items-start gap-4 rounded-2xl border border-white/8 bg-white/[0.04] p-6 transition-colors hover:border-white/16 hover:bg-white/[0.06] lg:flex-col lg:items-start lg:gap-0"
            >
              {item.icon && (
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/8 text-xl lg:mb-4">
                  {item.icon}
                </div>
              )}
              <div>
                <h3 className="m-0 mb-2 text-[1.05rem] font-bold text-white">{item.title}</h3>
                <p className="m-0 text-[0.95rem] leading-relaxed text-white/60">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
