import { NolimitNavbar } from '@/components/ui/NolimitNavbar'
import { Footer } from '@/components/ui/Footer'

export default function NolimitLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <NolimitNavbar />
      <main>{children}</main>
      <Footer />
    </>
  )
}
