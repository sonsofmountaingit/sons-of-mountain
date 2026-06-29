'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface ImageEntry {
  url: string
  alt?: string | null
  focalPoint?: string | null
  focalX?: number | null
  focalY?: number | null
}

interface Props {
  images?: ImageEntry[]
  heading?: string | null
  subtext?: string | null
  ctaLabel?: string | null
  ctaHref?: string | null
}

export function WhyTravelWithUsSection({
  images = [],
  heading,
  subtext,
  ctaLabel,
  ctaHref,
}: Props) {
  const img1 = images[0]
  const img2 = images[1] ?? images[0]
  const sectionRef = useRef<HTMLElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const subRef = useRef<HTMLParagraphElement>(null)
  const btnRef = useRef<HTMLAnchorElement>(null)

  const resolvedHeading = heading ?? 'Направи крачката и изследвай света, който те чака.'
  const resolvedSubtext = subtext ?? 'Пътуването те променя. Виждаш нови места, срещаш нови хора и ставаш нова версия на себе си.'
  const resolvedCtaLabel = ctaLabel ?? 'Научи повече за нас'
  const resolvedCtaHref = ctaHref ?? '/about'

  // Split heading into segments around the two inline images
  // Format: "...text1... [img1] ...text2... [img2] ...text3..."
  // We split on " | " as separator if provided, otherwise use full heading as single block
  const headingParts = resolvedHeading.split('|').map((s) => s.trim())
  const part1 = headingParts[0] ?? resolvedHeading
  const part2 = headingParts[1] ?? null
  const part3 = headingParts[2] ?? null

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

  const inlineImg = (img: ImageEntry, width: number) => {
    const objectPosition = (img.focalX != null && img.focalY != null)
      ? `${img.focalX}% ${img.focalY}%`
      : (img.focalPoint ?? 'center')
    return (
      <span style={{ display: 'inline-block', width, height: 56, borderRadius: 999, overflow: 'hidden', position: 'relative', verticalAlign: 'middle', flexShrink: 0 }}>
        <Image
          src={img.url}
          alt={img.alt ?? ''}
          fill
          sizes={`${width}px`}
          style={{ objectFit: 'cover', objectPosition }}
        />
      </span>
    )
  }

  return (
    <section ref={sectionRef} className="py-16 sm:py-24 px-4 sm:px-6 bg-black">
      <div className="max-w-5xl mx-auto text-center">
        <h2 ref={headingRef} className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
          {/* Mobile: simple text */}
          <span className="block sm:hidden">{resolvedHeading.replace(/\|/g, '')}</span>
          {/* Desktop: inline images */}
          <span className="hidden sm:inline">
            {part2 !== null ? (
              <>
                <span className="inline-flex flex-wrap justify-center items-center gap-x-4 gap-y-3">
                  <span>{part1}</span>
                  {img1 && inlineImg(img1, 176)}
                  {part2 && <span>{part2}</span>}
                </span>
                {part3 !== null && (
                  <span className="inline-flex flex-wrap justify-center items-center gap-x-4 gap-y-3 mt-2">
                    {img2 && img2 !== img1 && inlineImg(img2, 152)}
                    <span>{part3}</span>
                  </span>
                )}
              </>
            ) : (
              <span className="inline-flex flex-wrap justify-center items-center gap-x-4 gap-y-3">
                {img1 && inlineImg(img1, 176)}
                <span>{part1}</span>
                {img2 && img2 !== img1 && inlineImg(img2, 152)}
              </span>
            )}
          </span>
        </h2>

        <p ref={subRef} className="text-white/50 text-base sm:text-lg max-w-2xl mx-auto mt-6 sm:mt-8 mb-8 sm:mb-10 leading-relaxed">
          {resolvedSubtext}
        </p>

        <Link
          ref={btnRef}
          href={resolvedCtaHref}
          className="inline-block bg-orange-700 hover:bg-orange-800 text-white font-bold px-6 sm:px-8 py-3 rounded-lg transition-colors"
        >
          {resolvedCtaLabel}
        </Link>
      </div>
    </section>
  )
}
