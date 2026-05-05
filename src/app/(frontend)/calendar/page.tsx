import { getPayload } from 'payload'
import config from '@payload-config'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Календар' }

const MONTHS_BG = ['Януари','Февруари','Март','Април','Май','Юни','Юли','Август','Септември','Октомври','Ноември','Декември']

export default async function CalendarPage() {
  const payload = await getPayload({ config })

  const { docs: trips } = await payload.find({
    collection: 'trips',
    where: { status: { not_equals: 'draft' } },
    sort: 'startDate',
    limit: 200,
    depth: 2,
  })

  const byMonth: Record<string, typeof trips> = {}
  for (const trip of trips) {
    const date = new Date(trip.startDate)
    const key = `${date.getFullYear()}-${date.getMonth()}`
    if (!byMonth[key]) byMonth[key] = []
    byMonth[key].push(trip)
  }

  return (
    <div className="pt-24 pb-20 px-6 min-h-screen">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-bold mb-4">Календар</h1>
        <p className="text-white/50 mb-12 text-lg">Предстоящи пътувания по месец</p>
        {Object.entries(byMonth).map(([key, monthTrips]) => {
          const [year, month] = key.split('-').map(Number)
          return (
            <div key={key} className="mb-12">
              <h2 className="text-2xl font-bold mb-6 text-white/80">
                {MONTHS_BG[month]} {year}
              </h2>
              <div className="space-y-3">
                {monthTrips.map((trip) => {
                  const destination = typeof trip.destination === 'object' ? trip.destination as { name: string; slug: string } : null
                  return (
                    <Link
                      key={trip.id}
                      href={destination ? `/destinations/${destination.slug}` : '#'}
                      className="flex items-center justify-between p-4 border border-white/10 rounded-lg hover:border-white/30 transition-colors group"
                    >
                      <div>
                        <p className="font-medium group-hover:text-white/80 transition-colors">
                          {destination?.name ?? trip.title}
                        </p>
                        <p className="text-sm text-white/40 mt-0.5">
                          {new Date(trip.startDate).toLocaleDateString('bg-BG')} — {new Date(trip.endDate).toLocaleDateString('bg-BG')}
                        </p>
                      </div>
                      <div className="text-right">
                        {trip.spotsAvailable === 0 ? (
                          <span className="text-xs text-white/30">НЯМА МЕСТА</span>
                        ) : (
                          <span className="text-xs bg-white text-black px-2 py-0.5 rounded-full font-medium">
                            {trip.spotsAvailable} МЕСТА
                          </span>
                        )}
                        <p className="text-sm text-white/50 mt-1">{trip.price} {trip.currency}</p>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          )
        })}
        {Object.keys(byMonth).length === 0 && (
          <p className="text-white/30 text-center py-20">Скоро ще добавим пътувания.</p>
        )}
      </div>
    </div>
  )
}
