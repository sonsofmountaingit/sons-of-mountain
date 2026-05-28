'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

interface Props {
  whoHeading?: string
  whoDescription?: string
  whoImage1Url?: string
  whoImage2Url?: string
}

export function AboutWhoWeAreBlock({
  whoHeading = 'Кои сме ние?',
  whoDescription = 'Ние сме приключенци като теб. Търсим нови изживявания в непознатото, организираме триповете си сами, пътуваме само с добри приятели.',
  whoImage1Url,
  whoImage2Url,
}: Props) {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      const els = sectionRef.current?.querySelectorAll('[data-animate]') ?? []
      gsap.fromTo(
        els,
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.15,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
          },
        }
      )
    })

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      style={{
        background: '#0a0a0a',
        padding: '8rem 2rem',
        overflow: 'hidden',
      }}
    >
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '4rem', maxWidth: 560 }}>
          <h2
            data-animate
            style={{
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              fontWeight: 900,
              letterSpacing: '-0.03em',
              color: '#ffffff',
              margin: '0 0 1.25rem',
              lineHeight: 1.05,
            }}
          >
            {whoHeading}
          </h2>
          <p
            data-animate
            style={{
              fontSize: 'clamp(1rem, 1.5vw, 1.15rem)',
              color: 'rgba(255,255,255,0.6)',
              lineHeight: 1.7,
              margin: 0,
            }}
          >
            {whoDescription}
          </p>
        </div>

        {/* Photo grid — staggered */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1.4fr',
            gap: '1.5rem',
            alignItems: 'start',
            maxWidth: 900,
          }}
        >
          {/* Left image — offset lower */}
          <div
            data-animate
            style={{
              position: 'relative',
              aspectRatio: '3/4',
              borderRadius: 20,
              overflow: 'hidden',
              marginTop: '4rem',
              background: '#1a1a1a',
            }}
          >
            {whoImage1Url ? (
              <Image
                src={whoImage1Url}
                alt="Кои сме ние — снимка 1"
                fill
                sizes="(max-width: 900px) 50vw, 350px"
                style={{ objectFit: 'cover', objectPosition: 'center top' }}
              />
            ) : (
              <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #1a1a1a, #2a2a2a)' }} />
            )}
          </div>

          {/* Right image — offset higher */}
          <div
            data-animate
            style={{
              position: 'relative',
              aspectRatio: '4/5',
              borderRadius: 20,
              overflow: 'hidden',
              background: '#1a1a1a',
            }}
          >
            {whoImage2Url ? (
              <Image
                src={whoImage2Url}
                alt="Кои сме ние — снимка 2"
                fill
                sizes="(max-width: 900px) 50vw, 450px"
                style={{ objectFit: 'cover', objectPosition: 'center' }}
              />
            ) : (
              <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #1a1a1a, #2a2a2a)' }} />
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
