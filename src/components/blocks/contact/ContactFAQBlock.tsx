interface FAQItem { question: string; answer: string }

interface Props {
  heading?: string
  faqItems?: FAQItem[]
}

export function ContactFAQBlock({ heading = 'Frequently asked questions', faqItems = [] }: Props) {
  return (
    <div className="px-6 pb-12">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold mb-8">{heading}</h2>
        <div className="space-y-2">
          {faqItems.map((item, i) => (
            <details key={i} className="group border border-white/10 rounded-lg overflow-hidden">
              <summary className="flex items-center justify-between px-6 py-4 cursor-pointer text-sm font-medium hover:bg-white/5 transition-colors list-none">
                {item.question}
                <span className="flex-shrink-0 ml-4 text-white/40 group-open:rotate-45 transition-transform duration-200">+</span>
              </summary>
              <div className="px-6 pb-5 text-sm text-white/60 leading-relaxed">{item.answer}</div>
            </details>
          ))}
        </div>
      </div>
    </div>
  )
}
