'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import Link from 'next/link'

interface GalleryHeroBlockProps {
  heading: string
  subheading: string
  ctaLabel: string
  ctaHref?: string
}

export function GalleryHeroBlock({ heading, subheading, ctaLabel, ctaHref = '/gallery' }: GalleryHeroBlockProps) {
  const headingRef = useRef<HTMLHeadingElement>(null)
  const subRef = useRef<HTMLParagraphElement>(null)
  const ctaRef = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from([headingRef.current, subRef.current, ctaRef.current], {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out',
      })
    })
    return () => ctx.revert()
  }, [])

  return (
    <div className="text-center pt-20 pb-16 px-6">
      <h1
        ref={headingRef}
        className="text-5xl md:text-7xl font-bold text-white leading-[1.1] mb-6 max-w-3xl mx-auto"
      >
        {heading}
      </h1>
      <p
        ref={subRef}
        className="text-white/60 text-lg md:text-xl max-w-xl mx-auto mb-10 leading-relaxed"
      >
        {subheading}
      </p>
      <Link
        ref={ctaRef}
        href={ctaHref}
        className="inline-flex items-center gap-2 bg-[#e05a2b] hover:bg-[#c94e22] text-white font-semibold px-8 py-3.5 rounded-full transition-colors duration-200 text-sm"
      >
        {ctaLabel}
      </Link>
    </div>
  )
}
