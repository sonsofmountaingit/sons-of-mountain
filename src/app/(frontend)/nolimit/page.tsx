import type { Metadata } from 'next'
import Link from 'next/link'
import { buildMetadata } from '@/lib/metadata'

export const metadata: Metadata = buildMetadata({
  title: 'NoLimit Yacht Festival — Sons of Mountains',
  description: 'NoLimit е яхтен фестивал в Червено море — 7 дни на яхта, музика, острови и незабравими приключения. Sons of Mountains × NoLimit 2026.',
  slug: 'nolimit',
})

const SECTIONS = [
  { title: 'Острови и плажове', desc: 'Нетронати плажове, кристални води и незабравими залези.' },
  { title: 'Диви партита', desc: 'Нощи на яхтата под звездите — музика без граници.' },
  { title: 'Храна', desc: 'Най-свежите морски дарове и местна кухня на борда.' },
  { title: 'Общност', desc: 'Хора, с които ще останеш приятел завинаги.' },
]

export default function NolimitPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Festival',
    name: 'NoLimit Yacht Festival',
    url: `${process.env.NEXT_PUBLIC_SERVER_URL ?? 'https://sonsofmountains.com'}/nolimit`,
    description: 'Яхтен фестивал в Червено море — музика, острови и приключения.',
    organizer: { '@type': 'Organization', name: 'Sons of Mountains' },
    location: { '@type': 'Place', name: 'Червено море, Египет' },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    <div className="min-h-screen">
      <div className="relative h-screen flex items-end">
        <div className="absolute inset-0 bg-gradient-to-b from-teal-950/30 to-black/80" />
        <div className="relative z-10 px-8 md:px-16 pb-16">
          <p className="text-xs font-semibold tracking-widest text-white/40 uppercase mb-4">Яхтен Фестивал</p>
          <h1 className="text-5xl md:text-8xl font-bold mb-4">NoLimit</h1>
          <p className="text-xl text-white/60 mb-8 max-w-2xl">Провокирай границите на преживяването — острови, музика, море.</p>
          <Link href="/nolimit/sign-up" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black font-semibold text-sm rounded hover:bg-white/90 transition-colors">
            Запиши се
          </Link>
        </div>
      </div>

      <div className="py-20 px-6 md:px-16">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {SECTIONS.map((section) => (
            <div key={section.title} className="border border-white/10 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-3">{section.title}</h3>
              <p className="text-sm text-white/50 leading-relaxed">{section.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
    </>
  )
}
