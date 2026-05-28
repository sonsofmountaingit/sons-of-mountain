'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

interface Props {
  adventureHeading?: string
  adventureSubtext?: string
  adventureActivities?: string
  adventureQuote?: string
  adventureQuoteBody?: string
}

export function AboutAdventureBlock({
  adventureHeading = 'Хвърли се в приключение!',
  adventureSubtext = 'Не знаеш как? Спокой, ще ти дадем парашут или като минимум най-добрия маршрут!',
  adventureActivities = 'Каякинг · Риболов · Палатки · Хайкинг · Кемпер · Готвене на открито',
  adventureQuote = 'Не обичаме да ни слагат в рамки и all inclusive програми — обичаме ние да си избираме пътя, по който да минем.',
  adventureQuoteBody = 'Затова създадохме нашата нестандартна концепция — за да ви заведем там, където сме били лично и сме останали без думи.',
}: Props) {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      const els = sectionRef.current?.querySelectorAll('[data-animate]') ?? []
      gsap.fromTo(
        els,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.12,
          duration: 0.9,
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

  const activities = adventureActivities.split('·').map((a) => a.trim()).filter(Boolean)

  return (
    <section
      ref={sectionRef}
      style={{
        background: '#f5f0e8',
        padding: '8rem 2rem',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Subtle map pattern overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(0,0,0,0.04) 1px, transparent 0)',
        backgroundSize: '32px 32px',
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: 900, margin: '0 auto', position: 'relative' }}>
        <h2
          data-animate
          style={{
            fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
            fontWeight: 900,
            letterSpacing: '-0.03em',
            color: '#0a0a0a',
            margin: '0 0 1.5rem',
            lineHeight: 1.05,
          }}
        >
          {adventureHeading}
        </h2>

        <p
          data-animate
          style={{
            fontSize: 'clamp(1rem, 1.5vw, 1.2rem)',
            color: '#3a3a3a',
            margin: '0 0 3rem',
            lineHeight: 1.7,
            maxWidth: '60ch',
          }}
        >
          {adventureSubtext}
        </p>

        {/* Activity pills */}
        <div
          data-animate
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.75rem',
            margin: '0 0 4rem',
          }}
        >
          {activities.map((a, i) => (
            <span
              key={i}
              style={{
                padding: '8px 18px',
                background: 'rgba(0,0,0,0.07)',
                borderRadius: 50,
                fontSize: '0.9rem',
                fontWeight: 600,
                color: '#1a1a1a',
                letterSpacing: '0.01em',
              }}
            >
              {a}
            </span>
          ))}
        </div>

        {/* Bold quote block */}
        <div
          data-animate
          style={{
            borderLeft: '4px solid #e8501a',
            paddingLeft: '2rem',
            margin: '0',
          }}
        >
          <p
            style={{
              fontSize: 'clamp(1.1rem, 1.8vw, 1.35rem)',
              fontWeight: 700,
              color: '#0a0a0a',
              lineHeight: 1.55,
              margin: '0 0 1.25rem',
            }}
          >
            {adventureQuote}
          </p>
          <p
            style={{
              fontSize: '1rem',
              color: '#4a4a4a',
              lineHeight: 1.7,
              margin: 0,
            }}
          >
            {adventureQuoteBody}
          </p>
        </div>
      </div>
    </section>
  )
}
