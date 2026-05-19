import Image from 'next/image'
import Link from 'next/link'

interface TripSummary {
  id: string
  startDate: string
  endDate: string
  spotsAvailable: number
  spotsTotal: number
  price: number
  currency: string
  status: string
}

interface Props {
  name: string
  trips?: TripSummary[]
  included?: { item?: string | null }[]
  notIncluded?: { item?: string | null }[]
  bgImage?: string | null
  bgImageAlt?: string
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('bg-BG', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function formatPrice(price: number, currency: string) {
  const sym = currency === 'EUR' ? '€' : currency === 'USD' ? '$' : 'лв.'
  return `${sym}${price.toLocaleString('bg-BG')}`
}

export function BookingCtaSection({ name, trips = [], included = [], notIncluded = [], bgImage, bgImageAlt }: Props) {
  const activeTrip = trips.find((t) => t.status !== 'draft') ?? trips[0]

  const fillPct = activeTrip
    ? Math.round(((activeTrip.spotsTotal - activeTrip.spotsAvailable) / activeTrip.spotsTotal) * 100)
    : 0

  return (
    <section className="relative py-20 px-6 bg-black text-white overflow-hidden">
      {bgImage && (
        <>
          <Image
            src={bgImage}
            alt={bgImageAlt ?? name}
            fill
            loading="lazy"
            quality={60}
            className="object-cover opacity-30 blur-sm"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-black/60" />
        </>
      )}
      <div className="relative z-10 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-start" data-animate="fade-up">
        <div className="bg-black/80 rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-6">Хайде към {name}!</h2>

          {activeTrip && (
            <div className="mb-6">
              <p className="text-xs font-semibold tracking-widest text-white/60 uppercase mb-2">
                ПРЕДСТОЯЩИ ПЪТУВАНИЯ
              </p>
              <p className="text-green-400 font-semibold mb-2">
                📅 {formatDate(activeTrip.startDate)} – {formatDate(activeTrip.endDate)}
              </p>
              <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-green-400 rounded-full" style={{ width: `${fillPct}%` }} />
              </div>
            </div>
          )}

          {activeTrip && (
            <Link
              href={`/shop/${activeTrip.id}`}
              className="block w-full bg-orange-700 hover:bg-orange-800 text-white text-center font-black uppercase tracking-widest py-4 rounded-lg transition-colors mb-3"
            >
              ЗАПИШИ СЕ
            </Link>
          )}
          <p className="text-xs text-white/70 text-center mb-8">
            С натискането на бутон "Запиши се" се съгласяваш с нашите{' '}
            <a href="/terms" className="underline">Общи условия</a> и{' '}
            <a href="/privacy" className="underline">Политика за поверителност</a>.
          </p>

          <div>
            <p className="text-xs font-semibold tracking-widest text-white/60 uppercase mb-4">
              КАКЪВ Е ПРОЦЕСЪТ?
            </p>
            <ol className="space-y-4">
              {[
                'Попълни формата за записване. Ние ще ти се обадим за да се запознаем и ще очакваме нужните данни за договор и застраховка.',
                'Ще получиш договор, застраховка и фактура – плащаш 50% депозит, а остатъка ще очакваме до 45 дни преди заминаване.',
                'Месец преди експедицията ще ти напомним с детайлен информационен имейл за дестинацията, полетите и тн.',
              ].map((step, i) => (
                <li key={i} className="flex gap-4 text-sm text-white/60">
                  <span className="flex-shrink-0 w-7 h-7 rounded-full border border-white/20 flex items-center justify-center text-xs font-bold text-white">
                    {i + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="space-y-6">
          {included.length > 0 && (
            <div>
              <p className="text-xs font-semibold tracking-widest text-white/60 uppercase mb-4">
                В ЦЕНАТА СА ВКЛЮЧЕНИ:
              </p>
              <ul className="space-y-2">
                {included.map((it, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-white/80">
                    <span className="text-green-400 flex-shrink-0 mt-0.5">✓</span>
                    {it.item}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {notIncluded.length > 0 && (
            <div>
              <p className="text-xs font-semibold tracking-widest text-white/60 uppercase mb-4">
                В ЦЕНАТА НЕ СА ВКЛЮЧЕНИ:
              </p>
              <ul className="space-y-2">
                {notIncluded.map((it, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-white/70">
                    <span className="text-white/70 flex-shrink-0 mt-0.5">✓</span>
                    {it.item}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
