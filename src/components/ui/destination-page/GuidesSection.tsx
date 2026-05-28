'use client'

import Image from 'next/image'
import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { mediaUrl } from '@/lib/media-url'

gsap.registerPlugin(ScrollTrigger)

type Guide = {
  id: string
  name: string
  photo?: { url?: string | null; alt?: string } | null
  bio?: string | null
  instagram?: string | null
  specializations?: { item: string }[] | null
  yearsExperience?: number | null
}

type Props = {
  guides: Guide[]
}

const CARD_COLORS = [
  'bg-[#e8f5e9]',
  'bg-[#ffe0b2]',
  'bg-[#e8eaf6]',
  'bg-[#fce4ec]',
  'bg-[#e0f7fa]',
]

export default function GuidesSection({ guides }: Props) {
  const sectionRef = useRef<HTMLElement>(null)
  const leftRef = useRef<HTMLDivElement>(null)
  const rightRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const ctx = gsap.context(() => {
      if (leftRef.current) {
        gsap.from(leftRef.current, { opacity: 0, x: -40, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: leftRef.current, start: 'top 85%', once: true } })
      }
      if (rightRef.current) {
        gsap.from(rightRef.current, { opacity: 0, x: 40, duration: 0.9, ease: 'power3.out', delay: 0.15, scrollTrigger: { trigger: rightRef.current, start: 'top 85%', once: true } })
      }
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  if (!guides?.length) return null

  const eyebrow = guides.length === 1 ? 'ВАШИЯТ ВОДАЧ' : 'ВАШИТЕ ВОДАЧИ'
  const heading = guides.length === 1 ? 'Кой ще ви води?' : 'Кои ще са вашите водачи?'

  return (
    <section ref={sectionRef} className="py-14 sm:py-20 px-4 sm:px-6 bg-white text-black">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-stretch">

          {/* Left */}
          <div ref={leftRef} className="flex flex-col">
            {/* Header */}
            <div className="mb-10">
              <span className="inline-block text-[9px] font-black tracking-[0.3em] text-black/30 uppercase border border-black/10 rounded-full px-3 py-1 mb-5">
                {eyebrow}
              </span>
              <h2 className="text-[2.6rem] sm:text-[3.2rem] font-black leading-[1.05] tracking-tight">
                {heading}
              </h2>
            </div>

            {/* Guide entries */}
            <div className="flex flex-col gap-0 flex-1 justify-center divide-y divide-black/6">
              {guides.map((guide, idx) => (
                <div key={guide.id} className="py-5 flex gap-5 items-start">
                  {/* Index number */}
                  <span className="text-[11px] font-black text-black/20 tracking-widest pt-0.5 w-5 shrink-0">
                    {String(idx + 1).padStart(2, '0')}
                  </span>

                  <div className="flex-1 min-w-0">
                    {/* Name + exp inline */}
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="text-lg font-black tracking-tight leading-none">{guide.name}</h3>
                      {guide.yearsExperience ? (
                        <span className="text-[9px] font-bold text-black/30 uppercase tracking-[0.2em] bg-black/5 rounded-full px-2 py-0.5">
                          {guide.yearsExperience}+ г.
                        </span>
                      ) : null}
                    </div>

                    {/* Specializations */}
                    {guide.specializations?.length ? (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {guide.specializations.map((s, i) => (
                          <span
                            key={i}
                            className="text-[8px] font-bold tracking-[0.18em] uppercase text-black/35"
                          >
                            {i > 0 && <span className="mr-1 text-black/15">·</span>}{s.item}
                          </span>
                        ))}
                      </div>
                    ) : null}

                    {guide.bio && (
                      <p className="text-[13px] text-black/45 leading-relaxed line-clamp-2">
                        {guide.bio.split('\n\n')[0]}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: photo cards */}
          <div ref={rightRef} className="flex gap-3 items-stretch">
            {guides.map((guide, idx) => {
              const photoUrl = mediaUrl(guide.photo?.url)
              const color = CARD_COLORS[idx % CARD_COLORS.length]
              return (
                <div
                  key={guide.id}
                  className={`relative rounded-2xl overflow-hidden flex-1 ${color}`}
                  style={{ minHeight: 280 }}
                >
                  <div className="absolute top-3 left-3 right-3 z-10 bg-black/70 backdrop-blur-sm rounded-xl px-3 py-2">
                    <p className="text-white text-[11px] font-black tracking-tight leading-tight">{guide.name}</p>
                    {guide.specializations?.[0] && (
                      <p className="text-white/45 text-[9px] leading-tight mt-0.5 tracking-wide">{guide.specializations[0].item}</p>
                    )}
                  </div>

                  {photoUrl ? (
                    <Image
                      src={photoUrl}
                      alt={guide.photo?.alt ?? guide.name}
                      fill
                      className="object-cover object-top"
                      sizes="(max-width: 1024px) 50vw, 25vw"
                      quality={80}
                    />
                  ) : (
                    <div className="absolute inset-0" />
                  )}
                </div>
              )
            })}
          </div>

        </div>
      </div>
    </section>
  )
}
