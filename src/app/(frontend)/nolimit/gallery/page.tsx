import type { Metadata } from 'next'
import { buildStaticMetadata } from '@/lib/metadata'

export async function generateMetadata(): Promise<Metadata> {
  return buildStaticMetadata('/nolimit/gallery', {
    title: 'Галерия — NoLimit Yacht Festival',
    description: 'Снимки от NoLimit Yacht Festival — яхти, острови, хора и незабравими мигове в Червено море.',
  })
}

export default function NolimitGalleryPage() {
  return (
    <div className="pt-24 pb-20 px-6 min-h-screen">
      <div className="max-w-[1440px] mx-auto">
        <h1 className="text-5xl font-bold mb-12">Галерия</h1>
        <p className="text-white/30 text-center py-20">Снимките ще бъдат добавени скоро.</p>
      </div>
    </div>
  )
}
