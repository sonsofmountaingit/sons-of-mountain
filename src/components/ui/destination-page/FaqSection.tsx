'use client'

import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { useTranslations } from '@/lib/use-translations'

gsap.registerPlugin(ScrollTrigger)

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
  const { t } = useTranslations()
  const sectionRef = useRef<HTMLElement>(null)
  const headRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const ctx = gsap.context(() => {
      if (headRef.current) {
        gsap.from(headRef.current, { opacity: 0, y: 40, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: headRef.current, start: 'top 85%', once: true } })
      }
      if (listRef.current) {
        gsap.from(Array.from(listRef.current.children), { opacity: 0, y: 24, duration: 0.5, stagger: 0.08, ease: 'power2.out', scrollTrigger: { trigger: listRef.current, start: 'top 85%', once: true } })
      }
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  if (!faq?.length) return null

  return (
    <section ref={sectionRef} className="py-12 sm:py-16 lg:py-24 px-4 sm:px-6 bg-white text-black">
      <div className="max-w-5xl mx-auto">
        <div ref={headRef} className="mb-8 sm:mb-10 lg:mb-16">
          <p className="text-xs font-semibold tracking-[0.2em] text-black/40 uppercase mb-3 sm:mb-4">FAQ</p>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 sm:gap-6">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight tracking-tight max-w-md">
              {t.destination_page.faq_title}<br />{t.destination_page.faq_title_line2}
            </h2>
            {(email || phone) && (
              <div className="flex flex-col gap-1.5 sm:gap-2 sm:text-right">
                <p className="text-xs text-black/40 uppercase tracking-widest mb-0.5 sm:mb-1">{t.destination_page.faq_unclear_prompt}</p>
                {email && (
                  <a href={`mailto:${email}`} className="text-xs sm:text-sm text-black/60 hover:text-black transition-colors underline underline-offset-4 decoration-black/20 hover:decoration-black break-all">
                    {email}
                  </a>
                )}
                {phone && (
                  <a href={`tel:${phone}`} className="text-xs sm:text-sm text-black/60 hover:text-black transition-colors underline underline-offset-4 decoration-black/20 hover:decoration-black">
                    {phone}
                  </a>
                )}
              </div>
            )}
          </div>
        </div>

        <div ref={listRef} className="grid grid-cols-1 md:grid-cols-2 gap-x-12">
          {faq.map((item, i) => (
            <details
              key={i}
              className="group border-t border-black/10 py-5"
              name="faq"
            >
              <summary className="flex items-start justify-between cursor-pointer list-none gap-4">
                <span className="text-sm font-semibold leading-snug pt-0.5">{item.question}</span>
                <span className="flex-shrink-0 mt-0.5 text-black/35 group-open:text-black transition-colors duration-200">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="transition-transform duration-200 group-open:rotate-45">
                    <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </span>
              </summary>
              {item.answer && (
                <div className="pt-3 prose prose-sm text-black/50 max-w-none leading-relaxed">
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
