import Link from 'next/link'

const CONTENT = {
  media: {
    heading: 'Сподели своите спомени',
    body: 'Качването на снимки и видеа е достъпно само за участници в наши програми. Регистрирай се за дестинация или пътуване и след потвърждение ще можеш да споделяш моментите си с общността.',
    cta1: { label: 'РАЗГЛЕДАЙ ДЕСТИНАЦИИ', href: '/destinations' },
    cta2: { label: 'ВИЖДАЙ ПРОГРАМИ', href: '/calendar' },
  },
  ratings: {
    heading: 'Твоят опит има значение',
    body: 'Оценките са достъпни само за хора, преживели нашите приключения. Регистрирай се за дестинация или програма — след потвърждение ще можеш да споделяш впечатленията си и да помогнеш на следващите.',
    cta1: { label: 'РАЗГЛЕДАЙ ДЕСТИНАЦИИ', href: '/destinations' },
    cta2: { label: 'ВИЖДАЙ ПРОГРАМИ', href: '/calendar' },
  },
}

export function NoRegistrationGate({ type }: { type: 'media' | 'ratings' }) {
  const c = CONTENT[type]
  return (
    <div className="px-6 lg:px-10 py-16 max-w-xl">
      <div className="mb-8">
        <div className="w-12 h-px bg-white/20 mb-8" />
        <h1 className="text-2xl font-light tracking-wider text-white mb-4">{c.heading}</h1>
        <p className="text-sm text-white/50 leading-relaxed">{c.body}</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mt-10">
        <Link
          href={c.cta1.href}
          className="text-xs tracking-widest border border-white/30 text-white/70 hover:text-white hover:border-white/60 transition-colors px-6 py-3 rounded-sm text-center"
        >
          {c.cta1.label}
        </Link>
        <Link
          href={c.cta2.href}
          className="text-xs tracking-widest bg-white text-black hover:bg-white/90 transition-colors px-6 py-3 rounded-sm text-center"
        >
          {c.cta2.label}
        </Link>
      </div>

      <p className="text-xs text-white/25 mt-8 leading-relaxed">
        Вече имаш регистрация? Тя може да е в статус &quot;чакащо потвърждение&quot;.{' '}
        <Link href="/dashboard/registrations" className="text-white/40 hover:text-white/70 transition-colors underline underline-offset-2">
          Виж регистрациите си
        </Link>
        .
      </p>
    </div>
  )
}
