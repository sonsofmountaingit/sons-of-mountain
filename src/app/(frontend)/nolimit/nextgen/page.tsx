import type { Metadata } from 'next'
import { buildStaticMetadata } from '@/lib/metadata'

export async function generateMetadata(): Promise<Metadata> {
  return buildStaticMetadata('/nolimit/nextgen', {
    title: 'NextGen — NoLimit Yacht Festival',
    description: 'Специална програма за пътешественици под 30 години. NoLimit NextGen — по-достъпни цени, същото незабравимо изживяване.',
  })
}

export default function NolimitNextgenPage() {
  return (
    <div className="pt-24 pb-20 px-6 min-h-screen">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-5xl font-bold mb-6">NextGen</h1>
        <p className="text-white/60 text-lg leading-relaxed">
          Специална програма за млади пътешественици под 30 години. Специални условия, нови приятелства, незабравими преживявания.
        </p>
      </div>
    </div>
  )
}
