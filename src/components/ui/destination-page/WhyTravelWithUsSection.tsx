import Link from 'next/link'

export function WhyTravelWithUsSection() {
  return (
    <section className="py-16 px-6 bg-black text-white">
      <div className="max-w-5xl mx-auto bg-white text-black rounded-2xl p-10 md:p-16 text-center relative overflow-hidden">
        <p className="text-xs font-semibold tracking-widest text-black/60 uppercase mb-4">
          ЗАЩО ДА ПЪТУВАШ С НАС?
        </p>
        <h2 className="text-3xl md:text-4xl font-bold mb-6">Кои сме ние?</h2>
        <p className="text-black/60 max-w-xl mx-auto mb-8 leading-relaxed">
          Sons of Mountains не е комерсиална туристическа агенция. Ние не ти предлагаме спокойствие, билети и настаняване в all inclusive хотел с бели покривки. Ние сме тарзан турист и организираме пътешествия на трудно достъпни места, срещаме се с дивата природа, придвижваме се с кемпери, катамарани, off road джипове и дори хеликоптери.
        </p>
        <Link
          href="/about"
          className="inline-block bg-orange-700 hover:bg-orange-800 text-white font-bold px-8 py-3 rounded-lg transition-colors"
        >
          Научи повече за нас
        </Link>
        <div className="mt-10 flex flex-wrap justify-center gap-6 items-center">
          {['btv', 'БНТ1', 'NOVA', 'КАПИТАЛ', 'Forbes', 'EVA'].map((logo) => (
            <span key={logo} className="text-sm font-bold tracking-wide text-black/60">{logo}</span>
          ))}
        </div>
      </div>
    </section>
  )
}
