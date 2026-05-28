'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface Props {
  images?: { url: string; alt?: string | null }[]
}

export function WhyTravelWithUsSection({ images = [] }: Props) {
  const img1 = images[0]
  const img2 = images[1] ?? images[0]
  const sectionRef = useRef<HTMLElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const subRef = useRef<HTMLParagraphElement>(null)
  const btnRef = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', once: true } })
      tl.from(headingRef.current, { opacity: 0, y: 60, duration: 1, ease: 'power3.out' })
        .from(subRef.current, { opacity: 0, y: 30, duration: 0.7, ease: 'power2.out' }, '-=0.5')
        .from(btnRef.current, { opacity: 0, scale: 0.9, duration: 0.5, ease: 'back.out(1.4)' }, '-=0.3')
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="py-16 sm:py-24 px-4 sm:px-6 bg-black">
      <div className="max-w-5xl mx-auto text-center">
        <h2 ref={headingRef} className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
          {/* Mobile: simple text layout */}
          <span className="block sm:hidden">
            Направи крачката и изследвай света, който те чака.
          </span>
          {/* Desktop: fancy inline images */}
          <span className="hidden sm:inline">
            <span className="inline-flex flex-wrap justify-center items-center gap-x-4 gap-y-3">
              <span>Направи крачката и</span>
              {img1 && (
                <span style={{ display: 'inline-block', width: 176, height: 56, borderRadius: 999, overflow: 'hidden', position: 'relative', top: -4, flexShrink: 0 }}>
                  <Image src={img1.url} alt={img1.alt ?? ''} fill sizes="176px" style={{ objectFit: 'cover' }} />
                </span>
              )}
              <span>изследвай света,</span>
            </span>
            <span className="inline-flex flex-wrap justify-center items-center gap-x-4 gap-y-3 mt-2">
              <span>който те</span>
              {img2 && (
                <span style={{ display: 'inline-block', width: 152, height: 56, borderRadius: 999, overflow: 'hidden', position: 'relative', top: -4, flexShrink: 0 }}>
                  <Image src={img2.url} alt={img2.alt ?? ''} fill sizes="152px" style={{ objectFit: 'cover' }} />
                </span>
              )}
              <span>чака.</span>
            </span>
          </span>
        </h2>

        <p ref={subRef} className="text-white/50 text-base sm:text-lg max-w-2xl mx-auto mt-6 sm:mt-8 mb-8 sm:mb-10 leading-relaxed">
          Пътуването те променя. Виждаш нови места, срещаш нови хора и ставаш нова версия на себе си.
        </p>

        <Link
          ref={btnRef}
          href="/about"
          className="inline-block bg-orange-700 hover:bg-orange-800 text-white font-bold px-6 sm:px-8 py-3 rounded-lg transition-colors"
        >
          Научи повече за нас
        </Link>
      </div>
    </section>
  )
}
