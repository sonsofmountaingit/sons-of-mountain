import type { Metadata } from 'next'
import { ContactForm } from '@/components/forms/ContactForm'

export const metadata: Metadata = { title: 'Запиши се — NoLimit Festival' }

export default function NolimitSignUpPage() {
  return (
    <div className="pt-24 pb-20 px-6 min-h-screen">
      <div className="max-w-xl mx-auto">
        <h1 className="text-5xl font-bold mb-4">Запиши се</h1>
        <p className="text-white/50 mb-12">Попълни формата и ние ще се свържем с теб.</p>
        <ContactForm />
      </div>
    </div>
  )
}
