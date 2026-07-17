import type { Metadata } from 'next'
import Link from 'next/link'
import { buildStaticMetadata } from '@/lib/metadata'

export async function generateMetadata(): Promise<Metadata> {
  return buildStaticMetadata('/nolimit', {
    title: 'NoLimit Yacht Festival — Sons of Mountains',
    description: 'NoLimit is a yacht festival in the Red Sea — 7 days on a yacht, music, islands and unforgettable adventures. Sons of Mountains × NoLimit 2026.',
  })
}

const SECTIONS = [
  { title: 'Islands and beaches', desc: 'Untouched beaches, crystal waters and unforgettable sunsets.' },
  { title: 'Wild parties', desc: 'Nights on the yacht under the stars — music without limits.' },
  { title: 'Food', desc: 'The freshest seafood and local cuisine on board.' },
  { title: 'Community', desc: 'People you\'ll stay friends with forever.' },
]

export default function NolimitPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Festival',
    name: 'NoLimit Yacht Festival',
    url: `${process.env.NEXT_PUBLIC_SERVER_URL ?? 'https://sonsofmountains.com'}/nolimit`,
    description: 'Yacht festival in the Red Sea — music, islands and adventures.',
    organizer: { '@type': 'Organization', name: 'Sons of Mountains' },
    location: { '@type': 'Place', name: 'Red Sea, Egypt' },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    <div className="min-h-screen">
      <div className="relative h-screen flex items-end">
        <div className="absolute inset-0 bg-gradient-to-b from-teal-950/30 to-black/80" />
        <div className="relative z-10 px-8 md:px-16 pb-16">
          <p className="text-xs font-semibold tracking-widest text-white/40 uppercase mb-4">Yacht Festival</p>
          <h1 className="text-5xl md:text-8xl font-bold mb-4">NoLimit</h1>
          <p className="text-xl text-white/60 mb-8 max-w-2xl">Push the boundaries of experience — islands, music, sea.</p>
          <Link href="/nolimit/sign-up" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black font-semibold text-sm rounded hover:bg-white/90 transition-colors">
            Sign up
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
