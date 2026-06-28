import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Поръчка — Sons of Mountains',
  robots: { index: false, follow: false },
}

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return children
}
