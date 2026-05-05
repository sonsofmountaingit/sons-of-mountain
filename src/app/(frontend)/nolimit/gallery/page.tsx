import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Галерия — NoLimit Festival' }

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
