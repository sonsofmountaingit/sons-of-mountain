'use client'

import React, { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'

function NetinskyCredit() {
  const ref = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    if (!ref.current) return
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 3 })
    tl.to(ref.current, { x: 2, y: -1, rotate: 1.5, duration: 0.07, ease: 'power1.inOut' })
      .to(ref.current, { x: -2, y: 1, rotate: -1.5, duration: 0.07, ease: 'power1.inOut' })
      .to(ref.current, { x: 1.5, y: -0.5, rotate: 1, duration: 0.06, ease: 'power1.inOut' })
      .to(ref.current, { x: -1, y: 0.5, rotate: -1, duration: 0.06, ease: 'power1.inOut' })
      .to(ref.current, { x: 0, y: 0, rotate: 0, duration: 0.05, ease: 'power1.out' })
    return () => { tl.kill() }
  }, [])

  return (
    <a
      ref={ref}
      href="https://netinsky.com"
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: 'inline-block',
        color: 'rgba(255,255,255,0.9)',
        textDecoration: 'none',
        fontWeight: 700,
      }}
    >
      NETINSKY
    </a>
  )
}

export function AdminLoginBackground() {
  const [bgUrl, setBgUrl] = useState<string | null>(null)
  const [bgType, setBgType] = useState<'image' | 'video' | null>(null)

  useEffect(() => {
    fetch('/api/site-settings-public')
      .then((r) => r.json())
      .then((data) => {
        if (data?.loginBackgroundUrl) {
          setBgUrl(data.loginBackgroundUrl)
          setBgType(data.loginBackgroundType ?? 'image')
        }
      })
      .catch(() => {})
  }, [])

  return (
    <>
      {bgUrl && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 0,
            overflow: 'hidden',
            pointerEvents: 'none',
          }}
        >
          {bgType === 'video' ? (
            <video
              src={bgUrl}
              autoPlay
              muted
              loop
              playsInline
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={bgUrl}
              alt=""
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          )}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(0,0,0,0.55)',
            }}
          />
        </div>
      )}

      <div
        style={{
          position: 'fixed',
          bottom: '1.5rem',
          right: '1.5rem',
          zIndex: 9999,
          fontSize: '0.72rem',
          color: 'rgba(255,255,255,0.25)',
          pointerEvents: 'auto',
        }}
      >
        Дизайн и разработка от{' '}
        <NetinskyCredit />
      </div>
    </>
  )
}
