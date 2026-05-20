import Link from 'next/link'
import { CameraIcon } from './icons/CameraIcon'
import { GlobeIcon } from './icons/GlobeIcon'
import { CityIcon } from './icons/CityIcon'

export type WtuwItem = {
  icon: 'camera' | 'globe' | 'city'
  title: string
  body: string
}

// camera → fire (passion/community), globe → earth (horizons), city → tree (nature)
const ICONS = {
  camera: CameraIcon,
  globe: GlobeIcon,
  city: CityIcon,
}

const DEFAULT_ITEMS = [
  {
    icon: 'globe' as const,
    title: 'Отвъд познатото',
    body: 'Откриваш нови места и разширяваш хоризонтите си.',
  },
  {
    icon: 'camera' as const,
    title: 'Общност от активни хора',
    body: 'Срещаш приятели със същата любов и страст към планината.',
  },
  {
    icon: 'city' as const,
    title: 'Потапяне в природата',
    body: 'Преживявания, след които се връщаш дълбоко променен.',
  },
]

export function WhyTravelWithUsBlock({
  heading,
  items,
  ctaLabel = 'Научи повече',
  ctaHref = '/about',
}: {
  heading: string
  items: WtuwItem[]
  ctaLabel?: string
  ctaHref?: string
}) {
  return (
    <section className="py-20 px-6 bg-white text-[#1a1a1a]">
      <div className="max-w-[1100px] mx-auto">

        {/* eyebrow */}
        <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#1a1a1a]/50 mb-6">
          {heading}
        </p>

        {/* big blockquote headline */}
        <div className="flex gap-6 mb-8">
          <div className="w-1 shrink-0 bg-[#c47a3a] rounded-full" />
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
            Знаем, че обичаш да организираш сам своите пътувания.
          </h2>
        </div>

        {/* body paragraph + cta */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-16">
          <p className="text-base md:text-lg text-[#444] leading-relaxed max-w-2xl">
            Ние също. Затова ще ти спестим това време и ще се погрижим за всички непредвидени обстоятелства, които могат да се появят.
          </p>
          <Link
            href={ctaHref}
            className="shrink-0 inline-block border border-[#c47a3a] text-[#c47a3a] hover:bg-[#c47a3a] hover:text-white font-semibold text-sm px-8 py-3 rounded transition-colors"
          >
            {ctaLabel}
          </Link>
        </div>

        {/* icons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {(items?.length ? items : DEFAULT_ITEMS).map((item, i) => {
            const Icon = ICONS[item.icon] ?? GlobeIcon
            return (
              <div key={i} className="flex flex-col items-center text-center gap-5">
                <div className="w-24 h-24 flex items-center justify-center">
                  <Icon />
                </div>
                <h3 className="text-base font-bold tracking-wide">{item.title}</h3>
                <p className="text-sm text-[#555] leading-relaxed max-w-[220px]">{item.body}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
