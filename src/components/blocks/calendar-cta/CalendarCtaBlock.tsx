'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface Props {
  heading?: string
  subheading?: string
  buttonText?: string
  buttonUrl?: string
  destinationImages?: string[]
}

// Fixed 5-slot layout: left-edge, left, center, right, right-edge
const SLOTS = [
  { leftPct: 27, rotate: -14, scaleW: 0.82, scaleH: 0.82, bottomPx: -80,  zIndex: 1 },
  { leftPct: 38, rotate: -8,  scaleW: 0.91, scaleH: 0.91, bottomPx: -56, zIndex: 2 },
  { leftPct: 50, rotate: 0,   scaleW: 1,    scaleH: 1,    bottomPx: -26, zIndex: 5 },
  { leftPct: 62, rotate: 8,   scaleW: 0.91, scaleH: 0.91, bottomPx: -56, zIndex: 2 },
  { leftPct: 73, rotate: 14,  scaleW: 0.82, scaleH: 0.82, bottomPx: -80,  zIndex: 1 },
]

const BASE_W = 320
const BASE_H = 500

export function CalendarCtaBlock({
  heading = 'Търсиш следващото приключение?',
  subheading = 'Разгледай всички предстоящи пътувания.',
  buttonText = 'Виж календара',
  buttonUrl = '/calendar',
  destinationImages = [],
}: Props) {
  const images: (string | null)[] = Array.from({ length: 5 }, (_, i) => destinationImages[i] ?? null)

  const sectionRef = useRef<HTMLElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const fansRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Heading + button
      if (textRef.current) {
        gsap.from(Array.from(textRef.current.children), {
          opacity: 0,
          y: 40,
          duration: 0.75,
          ease: 'power3.out',
          stagger: 0.1,
          scrollTrigger: { trigger: textRef.current, start: 'top 88%', once: true },
        })
      }

      // Fan cards stagger from below, center-out
      if (fansRef.current) {
        const cards = Array.from(fansRef.current.children).filter(
          (el) => !(el as HTMLElement).style.pointerEvents,
        )
        gsap.from(cards, {
          opacity: 0,
          y: 120,
          duration: 0.85,
          ease: 'power3.out',
          stagger: { each: 0.07, from: 'center' },
          scrollTrigger: { trigger: fansRef.current, start: 'top 90%', once: true },
        })
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="calcta-section" style={{ backgroundColor: '#111111', textAlign: 'center', overflow: 'hidden' }}>
      <style>{`
        .calcta-section { padding: 5rem 1.5rem 0; }
        .calcta-fans { position: relative; margin-top: 3rem; height: 500px; }
        .calcta-fans-mobile { display: none; }
        @media (max-width: 767px) {
          .calcta-section { padding: 3.5rem 1.25rem 0; }
          .calcta-fans { display: none; }
          .calcta-fans-mobile {
            display: flex;
            gap: 10px;
            margin-top: 2.5rem;
            overflow-x: auto;
            padding: 0 1.25rem 1.5rem;
            scrollbar-width: none;
            -webkit-overflow-scrolling: touch;
          }
          .calcta-fans-mobile::-webkit-scrollbar { display: none; }
        }
      `}</style>

      <div ref={textRef} style={{ maxWidth: '640px', margin: '0 auto' }}>
        <h2 style={{ fontSize: 'clamp(1.5rem, 5vw, 2.5rem)', fontWeight: 700, color: '#ffffff', margin: '0 0 1rem 0', lineHeight: 1.2 }}>
          {heading}
        </h2>
        <p style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.55)', margin: '0 0 2rem 0', lineHeight: 1.6 }}>
          {subheading}
        </p>
        <Link
          href={buttonUrl ?? '/calendar'}
          style={{
            display: 'inline-block',
            backgroundColor: '#c0442a',
            color: '#ffffff',
            fontWeight: 600,
            fontSize: '0.95rem',
            padding: '0.85rem 2rem',
            borderRadius: '2rem',
            textDecoration: 'none',
          }}
        >
          {buttonText}
        </Link>
      </div>

      {/* Desktop fan layout */}
      <div ref={fansRef} className="calcta-fans">
        {images.map((src, i) => {
          const slot = SLOTS[i]
          const w = BASE_W * slot.scaleW
          const h = BASE_H * slot.scaleH
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: `${slot.leftPct}%`,
                bottom: `${slot.bottomPx}px`,
                transform: `translateX(-50%) rotate(${slot.rotate}deg)`,
                transformOrigin: 'bottom center',
                zIndex: slot.zIndex,
                width: `${w}px`,
                height: `${h}px`,
                borderRadius: '1.25rem',
                overflow: 'hidden',
                boxShadow: '0 20px 60px rgba(0,0,0,0.7)',
                backgroundColor: '#222',
                willChange: 'transform, opacity',
              }}
            >
              {src && (
                <Image
                  src={src}
                  alt=""
                  fill
                  style={{ objectFit: 'cover' }}
                  sizes="22vw"
                />
              )}
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to bottom, transparent 45%, #111111 100%)',
              }} />
            </div>
          )
        })}
        <div style={{
          position: 'absolute',
          bottom: 0, left: 0, right: 0,
          height: '180px',
          background: 'linear-gradient(to bottom, transparent, #111111)',
          pointerEvents: 'none',
          zIndex: 10,
        }} />
      </div>

      {/* Mobile horizontal scroll strip */}
      <div className="calcta-fans-mobile">
        {images.filter(Boolean).map((src, i) => (
          <div
            key={i}
            style={{
              position: 'relative',
              flexShrink: 0,
              width: '42vw',
              maxWidth: 180,
              aspectRatio: '9/14',
              borderRadius: '1rem',
              overflow: 'hidden',
              backgroundColor: '#222',
              boxShadow: '0 12px 32px rgba(0,0,0,0.6)',
            }}
          >
            {src && (
              <Image
                src={src}
                alt=""
                fill
                style={{ objectFit: 'cover' }}
                sizes="42vw"
              />
            )}
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to bottom, transparent 45%, #111111 100%)',
            }} />
          </div>
        ))}
      </div>
    </section>
  )
}
