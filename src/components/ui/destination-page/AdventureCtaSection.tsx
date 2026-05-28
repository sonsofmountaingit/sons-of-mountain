'use client'

import Image from 'next/image'
import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { mediaUrl } from '@/lib/media-url'

gsap.registerPlugin(ScrollTrigger)

interface CommunityPhoto {
  photo?: { url?: string | null; alt?: string } | null
}

interface Props {
  durationDays?: number | null
  maxParticipants?: number | null
  price: number
  currency: string
  priceIncludes?: string | null
  communityPhotos?: CommunityPhoto[] | null
}

function formatPrice(price: number, currency: string) {
  const sym = currency === 'EUR' ? '€' : currency === 'USD' ? '$' : 'лв.'
  return `${sym}${price.toLocaleString('bg-BG')}`
}

export function AdventureCtaSection({ durationDays, maxParticipants, price, currency, priceIncludes, communityPhotos }: Props) {
  const photos = (communityPhotos ?? []).filter((p) => mediaUrl(p.photo?.url))
  const communityCount = Math.floor(photos.length / 10) * 10 + 10

  const sectionRef = useRef<HTMLElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const priceRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  const communityRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', once: true } })
      tl.from(headingRef.current, { opacity: 0, y: 60, duration: 0.9, ease: 'power3.out' })
        .from(priceRef.current, { opacity: 0, scale: 0.8, duration: 0.7, ease: 'back.out(1.4)' }, '-=0.4')
        .from(ctaRef.current, { opacity: 0, y: 20, duration: 0.5, ease: 'power2.out' }, '-=0.3')
      if (communityRef.current) {
        const avatars = communityRef.current.querySelectorAll('.community-avatar')
        gsap.from(avatars, { opacity: 0, scale: 0, duration: 0.4, stagger: 0.07, ease: 'back.out(2)', scrollTrigger: { trigger: communityRef.current, start: 'top 90%', once: true } })
      }
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="py-16 sm:py-20 px-4 sm:px-6 border-t border-black/10 bg-white text-black">
      <div className="max-w-3xl mx-auto flex flex-col items-center text-center gap-6 sm:gap-8">

        <div className="w-full">
          <p className="text-xs font-bold tracking-[0.3em] text-black/40 uppercase mb-4">Готов ли си?</p>
          <h2 ref={headingRef} className="text-4xl sm:text-5xl md:text-6xl font-black uppercase leading-[0.9] tracking-tight mb-6 sm:mb-8">
            Хвърли се в приключение
          </h2>

          {(durationDays || maxParticipants) && (
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {durationDays && (
                <span className="border border-black/20 rounded-full px-4 py-1.5 text-sm font-semibold text-black/70">
                  {durationDays} дни
                </span>
              )}
              {maxParticipants && (
                <span className="border border-black/20 rounded-full px-4 py-1.5 text-sm font-semibold text-black/70">
                  {maxParticipants} пътешественика
                </span>
              )}
            </div>
          )}
        </div>

        <div className="w-full">
          <p className="text-xs font-bold tracking-[0.25em] text-black/40 uppercase mb-2">Цена на човек</p>
          <div ref={priceRef} className="text-6xl sm:text-7xl md:text-8xl font-black leading-none tracking-tighter mb-3">
            {formatPrice(price, currency)}
          </div>
          {priceIncludes && (
            <p className="text-sm text-black/50 leading-relaxed mb-6 sm:mb-8 max-w-sm mx-auto">{priceIncludes}</p>
          )}
          <div ref={ctaRef}>
          <a
            href="#booking"
            className="inline-flex items-center gap-3 bg-black text-white font-black text-sm uppercase tracking-widest px-6 sm:px-8 py-3.5 sm:py-4 hover:bg-black/80 transition-colors"
          >
            Резервирай сега
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
          </div>
        </div>

        {photos.length > 0 && (
          <div ref={communityRef} className="flex items-center justify-center gap-3">
            <div className="flex -space-x-2.5">
              {photos.slice(0, 6).map((p, i) => (
                <div
                  key={i}
                  className="community-avatar relative w-9 h-9 rounded-full overflow-hidden ring-2 ring-white flex-shrink-0"
                  style={{ zIndex: 6 - i }}
                >
                  <Image
                    src={mediaUrl(p.photo!.url)!}
                    alt={p.photo?.alt ?? `Пътешественик ${i + 1}`}
                    fill
                    loading="lazy"
                    quality={60}
                    className="object-cover"
                    sizes="36px"
                  />
                </div>
              ))}
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-black">Нашата общност</p>
              <p className="text-xs text-black/40">Над {communityCount} пътешественика</p>
            </div>
          </div>
        )}

      </div>
    </section>
  )
}
