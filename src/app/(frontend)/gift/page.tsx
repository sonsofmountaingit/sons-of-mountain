import type { Metadata } from 'next'
import { GiftVoucherForm } from '@/components/forms/GiftVoucherForm'

export const metadata: Metadata = { title: 'Подари ваучер' }

export default function GiftPage() {
  return (
    <div className="pt-24 pb-20 px-6 min-h-screen">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-bold mb-4">Подари нещо, което остава завинаги.</h1>
        <p className="text-white/50 mb-4 text-lg">Подари ваучер за пътуване — за всяка стойност, за всяка дестинация.</p>
        <p className="text-sm text-white/30 mb-12">За момента приемаме плащания само по банков път.</p>
        <GiftVoucherForm />
      </div>
    </div>
  )
}
