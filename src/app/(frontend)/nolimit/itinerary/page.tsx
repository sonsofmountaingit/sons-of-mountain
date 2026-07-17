import type { Metadata } from 'next'
import { buildStaticMetadata } from '@/lib/metadata'

export async function generateMetadata(): Promise<Metadata> {
  return buildStaticMetadata('/nolimit/itinerary', {
    title: 'Itinerary — NoLimit Yacht Festival',
    description: '7-day NoLimit Yacht Festival itinerary in the Red Sea. Islands, coral reefs, night parties, and unforgettable sunsets.',
  })
}

const DAYS = [
  { day: 1, title: 'Departure — Hurghada', desc: 'Yacht check-in, welcome cocktail.' },
  { day: 2, title: 'Islands — Karambishi', desc: 'Diving, beach, sunset on board.' },
  { day: 3, title: 'Utaya Island', desc: 'Snorkeling, beach lunch, night party.' },
  { day: 4, title: 'Free day', desc: 'Fishing, SUP, relax.' },
  { day: 5, title: 'El Fanadir Island', desc: 'Scuba diving, barbecue.' },
  { day: 6, title: 'Final night', desc: 'Main party with all artists.' },
  { day: 7, title: 'Return', desc: 'Breakfast, check-out, transfer.' },
]

export default function NolimitItineraryPage() {
  return (
    <div className="pt-24 pb-20 px-6 min-h-screen">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-5xl font-bold mb-4">Itinerary</h1>
        <p className="text-white/50 mb-12">7 days in the Red Sea</p>
        <div className="space-y-6">
          {DAYS.map((day) => (
            <div key={day.day} className="flex gap-6 border-b border-white/10 pb-6">
              <div className="flex-shrink-0 w-12 h-12 border border-white/20 rounded-full flex items-center justify-center text-sm font-bold">{day.day}</div>
              <div>
                <h3 className="font-semibold mb-1">{day.title}</h3>
                <p className="text-sm text-white/50">{day.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
