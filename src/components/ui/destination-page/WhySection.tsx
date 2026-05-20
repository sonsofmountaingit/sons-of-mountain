'use client'

import Image from 'next/image'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { useState, useEffect, useRef } from 'react'

interface WhyImage {
  url: string
  alt?: string
}

interface Props {
  name: string
  whyImages?: WhyImage[]
  heading?: string | null
  content?: Record<string, unknown> | null
}

export function WhySection({ name, whyImages = [], heading, content }: Props) {
  if (!heading && !content && whyImages.length === 0) return null

  const [current, setCurrent] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const gsapRef = useRef<{ gsap: typeof import('gsap')['gsap'] } | null>(null)
  const imgRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    if (whyImages.length <= 1) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    import('gsap').then(({ gsap }) => {
      gsapRef.current = { gsap }

      timerRef.current = setInterval(() => {
        setCurrent((prev) => {
          const next = (prev + 1) % whyImages.length
          const prevEl = imgRefs.current[prev]
          const nextEl = imgRefs.current[next]
          if (prevEl && nextEl) {
            gsap.to(prevEl, { opacity: 0, duration: 0.8, ease: 'power2.inOut' })
            gsap.fromTo(nextEl, { opacity: 0 }, { opacity: 1, duration: 0.8, ease: 'power2.inOut' })
          }
          return next
        })
      }, 4000)
    })

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [whyImages.length])

  const hasImages = whyImages.length > 0

  return (
    <section className="py-20 px-4 sm:px-6 bg-white text-black">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        {hasImages && (
          <div className="flex flex-col gap-3">
            <div className="relative aspect-square rounded-lg overflow-hidden">
              {whyImages.map((img, i) => (
                <div
                  key={i}
                  ref={(el) => { imgRefs.current[i] = el }}
                  className="absolute inset-0"
                  style={{ opacity: i === 0 ? 1 : 0 }}
                >
                  <Image
                    src={img.url}
                    alt={img.alt ?? name}
                    fill
                    loading={i === 0 ? 'eager' : 'lazy'}
                    quality={80}
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              ))}
            </div>
            {whyImages.length > 1 && (
              <div className="flex gap-2 justify-center">
                {whyImages.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      const prevEl = imgRefs.current[current]
                      const nextEl = imgRefs.current[i]
                      if (gsapRef.current && prevEl && nextEl && i !== current) {
                        gsapRef.current.gsap.to(prevEl, { opacity: 0, duration: 0.6, ease: 'power2.inOut' })
                        gsapRef.current.gsap.fromTo(nextEl, { opacity: 0 }, { opacity: 1, duration: 0.6, ease: 'power2.inOut' })
                      }
                      setCurrent(i)
                      if (timerRef.current) {
                        clearInterval(timerRef.current)
                        if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                          timerRef.current = setInterval(() => {
                            setCurrent((prev) => {
                              const next = (prev + 1) % whyImages.length
                              const p = imgRefs.current[prev]
                              const n = imgRefs.current[next]
                              if (gsapRef.current && p && n) {
                                gsapRef.current.gsap.to(p, { opacity: 0, duration: 0.8, ease: 'power2.inOut' })
                                gsapRef.current.gsap.fromTo(n, { opacity: 0 }, { opacity: 1, duration: 0.8, ease: 'power2.inOut' })
                              }
                              return next
                            })
                          }, 4000)
                        }
                      }
                    }}
                    aria-label={`Снимка ${i + 1}`}
                    className={`w-2 h-2 rounded-full transition-colors duration-300 ${i === current ? 'bg-black' : 'bg-black/25'}`}
                  />
                ))}
              </div>
            )}
          </div>
        )}
        <div
          className={hasImages ? '' : 'md:col-span-2'}
          data-animate="fade-up"
        >
          <p className="text-xs font-semibold tracking-widest text-black/60 uppercase mb-4">
            ЗАЩО {name.toUpperCase()}?
          </p>
          {heading && (
            <h2 className="text-3xl md:text-4xl font-bold leading-tight mb-6 border-l-4 border-black pl-4">
              {heading}
            </h2>
          )}
          {content && (
            <div className="prose prose-lg text-black/70 max-w-none">
              <RichText data={content as unknown as Parameters<typeof RichText>[0]["data"]} />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
