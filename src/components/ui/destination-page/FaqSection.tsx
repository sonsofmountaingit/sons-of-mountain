import { RichText } from '@payloadcms/richtext-lexical/react'

interface FaqItem {
  question?: string | null
  answer?: Record<string, unknown> | null
}

interface Props {
  faq?: FaqItem[] | null
  email?: string | null
  phone?: string | null
}

export function FaqSection({ faq, email, phone }: Props) {
  if (!faq?.length) return null

  return (
    <section className="py-20 px-4 sm:px-6 bg-white text-black">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-[280px_1fr] gap-16">
        <div>
          <p className="text-xs font-semibold tracking-widest text-black/60 uppercase mb-3">FAQ</p>
          <h2 className="text-3xl font-bold mb-6 leading-tight">Често Задавани Въпроси</h2>
          <p className="text-sm text-black/60 mb-4">Има нещо неясно?</p>
          {email && (
            <a href={`mailto:${email}`} className="flex items-center gap-2 text-sm text-black/60 hover:text-black mb-2">
              <span aria-hidden="true">✉</span> {email}
            </a>
          )}
          {phone && (
            <a href={`tel:${phone}`} className="flex items-center gap-2 text-sm text-black/60 hover:text-black">
              <span aria-hidden="true">📞</span> {phone}
            </a>
          )}
        </div>

        <div className="divide-y divide-black/10" data-animate="stagger-children">
          {faq.map((item, i) => (
            <details key={i} className="group py-5" name="faq">
              <summary className="flex items-center justify-between cursor-pointer list-none font-semibold text-base gap-4">
                <span>{item.question}</span>
                <span className="flex-shrink-0 w-11 h-11 flex items-center justify-center rounded-full border border-black/20 text-sm transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              {item.answer && (
                <div className="pt-4 prose text-black/60 text-sm max-w-none">
                  <RichText data={item.answer as unknown as Parameters<typeof RichText>[0]["data"]} />
                </div>
              )}
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
