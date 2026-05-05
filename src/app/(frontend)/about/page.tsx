import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'За нас' }

export default function AboutPage() {
  return (
    <div className="pt-24 pb-20 px-6 min-h-screen">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-bold mb-8">За нас</h1>
        <div className="prose prose-invert max-w-none">
          <p className="text-xl text-white/70 leading-relaxed mb-6">
            Ние сме тарзан турист и организираме пътешествия на трудно достъпни места — там, където комфортът среща приключението.
          </p>
          <p className="text-white/60 leading-relaxed mb-6">
            Panic Frame е основан с една цел: да покаже на хората, че светът е по-голям, по-красив и по-вълнуващ, отколкото си мислят. От 2018 г. организираме групови пътувания до дестинации, за които повечето хора само мечтаят.
          </p>
          <p className="text-white/60 leading-relaxed">
            Уганда, Азорски острови, Бразилия, Мароко, Намибия — всяко пътуване е внимателно планирано, за да получиш максимума от преживяването, без да жертваш комфорта.
          </p>
        </div>
      </div>
    </div>
  )
}
