'use client'

import { useEffect, useState } from 'react'

export function HeroEditButton() {
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    fetch('/api/users/me', { credentials: 'include' })
      .then((r) => r.json())
      .then((d) => { if (d?.user) setIsAdmin(true) })
      .catch(() => {})
  }, [])

  if (!isAdmin) return null

  return (
    <a
      href="/puck/hero"
      target="_blank"
      rel="noopener noreferrer"
      style={{
        position: 'fixed',
        bottom: 80,
        right: 20,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        padding: '8px 14px',
        background: '#1a1a1a',
        border: '1px solid rgba(255,255,255,0.2)',
        borderRadius: 8,
        color: '#ffffff',
        fontWeight: 600,
        fontSize: 12,
        textDecoration: 'none',
        boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
      }}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
      </svg>
      Edit Hero
    </a>
  )
}
