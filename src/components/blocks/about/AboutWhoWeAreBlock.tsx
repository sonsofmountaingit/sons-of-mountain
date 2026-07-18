'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

interface Props {
  whoHeading?: string
  whoDescription?: string
  whoImage1Url?: string
  whoImage1Caption?: string
  whoImage1Instagram?: string
  whoImage2Url?: string
  whoImage2Caption?: string
  whoImage2Instagram?: string
}

export function AboutWhoWeAreBlock({
  whoHeading = 'Кои сме ние?',
  whoDescription = 'Ние сме приключенци като теб. Търсим нови изживявания в непознатото, организираме триповете си сами, пътуваме само с добри приятели.',
  whoImage1Url,
  whoImage1Caption,
  whoImage1Instagram,
  whoImage2Url,
  whoImage2Caption,
  whoImage2Instagram,
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
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '2rem',
            marginBottom: '4rem',
          }}
        >
        <div style={{ maxWidth: 560, flex: '0 1 auto' }}>
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

        <div
          data-animate
          style={{
            flex: '1 1 auto',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Image
            src="/aph-uimla-logo.png"
            alt="Асоциация на планинските водачи и българи"
            width={120}
            height={120}
            style={{ flexShrink: 0, opacity: 0.9 }}
          />
        </div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1.4fr',
            gap: '1.5rem',
            alignItems: 'start',
            maxWidth: 900,
          }}
        >
          <div data-animate style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '4rem' }}>
            <div
              style={{
                position: 'relative',
                aspectRatio: '3/4',
                borderRadius: 20,
                overflow: 'hidden',
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
            {(whoImage1Caption || whoImage1Instagram) && (
              <div style={{ paddingLeft: 4 }}>
                {whoImage1Caption && (
                  <p style={{ margin: 0, fontSize: '0.875rem', color: 'rgba(255,255,255,0.55)', lineHeight: 1.5 }}>
                    {whoImage1Caption}
                  </p>
                )}
                {whoImage1Instagram && (
                  <a
                    href={`https://instagram.com/${whoImage1Instagram.replace(/^@/, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.35)', textDecoration: 'none', fontWeight: 500 }}
                  >
                    @{whoImage1Instagram.replace(/^@/, '')}
                  </a>
                )}
              </div>
            )}
          </div>

          <div data-animate style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div
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
            {(whoImage2Caption || whoImage2Instagram) && (
              <div style={{ paddingLeft: 4 }}>
                {whoImage2Caption && (
                  <p style={{ margin: 0, fontSize: '0.875rem', color: 'rgba(255,255,255,0.55)', lineHeight: 1.5 }}>
                    {whoImage2Caption}
                  </p>
                )}
                {whoImage2Instagram && (
                  <a
                    href={`https://instagram.com/${whoImage2Instagram.replace(/^@/, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.35)', textDecoration: 'none', fontWeight: 500 }}
                  >
                    @{whoImage2Instagram.replace(/^@/, '')}
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
