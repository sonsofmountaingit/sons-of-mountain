import { getPayload } from 'payload'
import config from '@payload-config'
import Link from 'next/link'
import { Suspense } from 'react'
import { HeroSection } from '@/components/ui/HeroSection'
import { DestinationCarouselSection } from '@/components/ui/DestinationCarouselSection'
import { StoriesCarouselSection } from '@/components/ui/StoriesCarouselSection'

async function getHomeData() {
  'use cache'
  const payload = await getPayload({ config })
  const [{ docs: destinations }, { docs: stories }] = await Promise.all([
    payload.find({ collection: 'destinations', limit: 20, sort: 'name' }),
    payload.find({ collection: 'stories', limit: 10, sort: '-createdAt' }),
  ])
  return { destinations, stories }
}

async function DestinationsSection() {
  const { destinations } = await getHomeData()
  return (
    <DestinationCarouselSection
      destinations={destinations as Parameters<typeof DestinationCarouselSection>[0]['destinations']}
    />
  )
}

async function StoriesSection() {
  const { stories } = await getHomeData()
  return (
    <StoriesCarouselSection
      stories={stories as Parameters<typeof StoriesCarouselSection>[0]['stories']}
    />
  )
}

export default function HomePage() {
  return (
    <div>
      <HeroSection />
      <Suspense fallback={null}>
        <DestinationsSection />
      </Suspense>

      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">ЗАЩО ДА ПЪТУВАШ С НАС?</h2>
          <p className="text-lg text-white/60 leading-relaxed mb-8">
            Ние сме тарзан турист и организираме пътешествия на трудно достъпни места — там, където комфортът среща приключението. От Уганда до Азорски острови, от Намибия до Бразилия.
          </p>
          <Link href="/about" className="inline-flex items-center gap-2 text-sm font-medium text-white border-b border-white/30 pb-0.5 hover:border-white transition-colors">
            Научи повече за нас →
          </Link>
        </div>
      </section>

      <section className="py-12 px-6 border-y border-white/10">
        <div className="max-w-[1440px] mx-auto">
          <p className="text-xs font-semibold tracking-widest text-white/30 uppercase text-center mb-8">Говорят за нас</p>
          <div className="flex items-center justify-center gap-12 flex-wrap">
            {['BTV', 'BNT', 'YouTube'].map((name) => (
              <div key={name} className="text-lg font-bold text-white/30 hover:text-white/60 transition-colors cursor-pointer">
                {name}
              </div>
            ))}
          </div>
        </div>
      </section>

      <Suspense fallback={null}>
        <StoriesSection />
      </Suspense>

      <section className="py-20 px-6 bg-[#0d0d0d]">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          <Link href="/empire" className="group relative aspect-[4/3] rounded-xl overflow-hidden block">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 to-black/80" />
            <div className="absolute inset-0 flex flex-col justify-end p-8">
              <p className="text-xs font-semibold tracking-widest text-white/50 uppercase mb-2">14-21 Ноември 2026</p>
              <h3 className="text-2xl md:text-3xl font-bold mb-2">Empire of Corals</h3>
              <p className="text-sm text-white/60">Хургада, Египет — Мегаяхтен фестивал за електронна музика</p>
            </div>
          </Link>
          <Link href="/nolimit" className="group relative aspect-[4/3] rounded-xl overflow-hidden block">
            <div className="absolute inset-0 bg-gradient-to-br from-teal-900/40 to-black/80" />
            <div className="absolute inset-0 flex flex-col justify-end p-8">
              <p className="text-xs font-semibold tracking-widest text-white/50 uppercase mb-2">NoLimit Yacht Festival</p>
              <h3 className="text-2xl md:text-3xl font-bold mb-2">ХУРГАДА, ЕГИПЕТ</h3>
              <p className="text-sm text-white/60">Острови, диви партита, незабравими преживявания</p>
            </div>
          </Link>
        </div>
      </section>
    </div>
  )
}
