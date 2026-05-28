'use client'

import { useEffect, useState } from 'react'

export function AboutEditButton() {
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
      href="/puck/about"
      style={{
        position: 'fixed',
        bottom: '1.5rem',
        right: '1.5rem',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '10px 16px',
        background: '#e8501a',
        borderRadius: 50,
        color: '#ffffff',
        fontWeight: 700,
        fontSize: 13,
        textDecoration: 'none',
        boxShadow: '0 4px 20px rgba(232,80,26,0.4)',
      }}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
      </svg>
      Edit About
    </a>
  )
}
