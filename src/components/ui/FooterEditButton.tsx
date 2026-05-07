'use client'

import { useEffect, useState } from 'react'

export function FooterEditButton() {
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    fetch('/api/users/me', { credentials: 'include' })
      .then((r) => r.json())
      .then((d) => {
        if (d?.user) setIsAdmin(true)
      })
      .catch(() => {})
  }, [])

  if (!isAdmin) return null

  return (
    <a
      href="/puck/footer"
      target="_blank"
      rel="noopener noreferrer"
      style={{
        position: 'fixed',
        bottom: '1.5rem',
        right: '1.5rem',
        zIndex: 9999,
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.4rem',
        padding: '0.5rem 1rem',
        backgroundColor: '#ffffff',
        color: '#111111',
        fontSize: '0.8rem',
        fontWeight: 600,
        borderRadius: '2rem',
        textDecoration: 'none',
        boxShadow: '0 2px 12px rgba(0,0,0,0.4)',
        opacity: 1,
        transition: 'opacity 0.2s',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.8' }}
      onMouseLeave={(e) => { e.currentTarget.style.opacity = '1' }}
    >
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
      </svg>
      Edit Footer
    </a>
  )
}
