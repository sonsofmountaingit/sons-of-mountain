'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { mediaUrl } from '@/lib/media-url'

gsap.registerPlugin(ScrollTrigger)

interface DestinationCard {
  name: string
  slug: string
  heroImage?: { url?: string | null; alt?: string } | null
  month?: string | null
}

interface Props {
  continent?: string | null
  destinations: DestinationCard[]
}

// Heights follow the visual rhythm: short, tall, medium, tallest+wide, short, tall
// Cards are center-aligned vertically so tops/bottoms stagger naturally
const CARD_CONFIG = [
  { flex: 'flex-[1.2]', height: 280 },
  { flex: 'flex-[1]',   height: 340 },
  { flex: 'flex-[1]',   height: 310 },
  { flex: 'flex-[1.6]', height: 380 },
  { flex: 'flex-[0.9]', height: 270 },
  { flex: 'flex-[1]',   height: 340 },
]

export function OtherDestinationsSection({ continent, destinations }: Props) {
  const sectionRef = useRef<HTMLElement>(null)
  const mobileListRef = useRef<HTMLDivElement>(null)
  const desktopListRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const ctx = gsap.context(() => {
      for (const ref of [mobileListRef, desktopListRef]) {
        if (ref.current) {
          gsap.from(Array.from(ref.current.children), { opacity: 0, scale: 0.95, duration: 0.65, stagger: 0.1, ease: 'power2.out', scrollTrigger: { trigger: ref.current, start: 'top 85%', once: true } })
        }
      }
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  if (!destinations?.length) return null

  return (
    <section ref={sectionRef} className="py-12 sm:py-16 px-4 sm:px-6 bg-white text-black overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-center text-3xl sm:text-4xl md:text-5xl font-bold leading-tight tracking-tight mb-8 sm:mb-10">
          Други пътешествия{continent ? ` в ${continent}` : ''}
        </h2>
        {/* Mobile: horizontal scroll strip */}
        <div ref={mobileListRef} className="flex sm:hidden gap-3 overflow-x-auto pb-3 -mx-4 px-4 snap-x snap-mandatory">
          {destinations.map((dest) => (
            <Link
              key={dest.slug}
              href={`/destinations/${dest.slug}`}
              className="relative rounded-2xl overflow-hidden flex-shrink-0 w-48 h-64 snap-start block group"
            >
              {mediaUrl(dest.heroImage?.url) ? (
                <Image src={mediaUrl(dest.heroImage!.url)!} alt={dest.heroImage?.alt ?? dest.name} fill loading="lazy" quality={75} className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="192px" />
              ) : (
                <div className="w-full h-full bg-gray-200" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 right-3">
                <p className="text-white font-semibold text-sm leading-tight">{dest.name}</p>
                {dest.month && <p className="text-white/60 text-xs mt-0.5">{dest.month}</p>}
              </div>
            </Link>
          ))}
        </div>
        {/* Desktop: staggered flex layout */}
        <div ref={desktopListRef} className="hidden sm:flex gap-3 items-center">
          {destinations.map((dest, i) => {
            const cfg = CARD_CONFIG[i % CARD_CONFIG.length]
            return (
              <Link
                key={dest.slug}
                href={`/destinations/${dest.slug}`}
                style={{ height: cfg.height }}
                className={`relative rounded-2xl overflow-hidden ${cfg.flex} min-w-0 block group`}
              >
                {mediaUrl(dest.heroImage?.url) ? (
                  <Image
                    src={mediaUrl(dest.heroImage!.url)!}
                    alt={dest.heroImage?.alt ?? dest.name}
                    fill
                    loading="lazy"
                    quality={75}
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 50vw, 16vw"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 right-3">
                  <p className="text-white font-semibold text-sm leading-tight">{dest.name}</p>
                  {dest.month && (
                    <p className="text-white/60 text-xs mt-0.5">{dest.month}</p>
                  )}
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
