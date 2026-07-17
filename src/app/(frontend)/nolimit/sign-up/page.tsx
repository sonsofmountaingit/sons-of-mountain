import type { Metadata } from 'next'
import { ContactForm } from '@/components/forms/ContactForm'

export const metadata: Metadata = {
  title: 'Sign up — NoLimit Yacht Festival',
  description: 'Register for NoLimit Yacht Festival 2026.',
  robots: { index: false, follow: false },
}

export default function NolimitSignUpPage() {
  return (
    <div className="pt-24 pb-20 px-6 min-h-screen">
      <div className="max-w-xl mx-auto">
        <h1 className="text-5xl font-bold mb-4">Sign up</h1>
        <p className="text-white/50 mb-12">Fill out the form and we'll be in touch.</p>
        <ContactForm />
      </div>
    </div>
  )
}
