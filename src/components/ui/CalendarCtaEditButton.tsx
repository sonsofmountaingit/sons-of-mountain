'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export function CalendarCtaEditButton() {
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    fetch('/api/users/me').then(r => r.json()).then(d => {
      if (d?.user?.role === 'admin' || d?.user?.collection === 'users') setIsAdmin(true)
    }).catch(() => {})
  }, [])

  if (!isAdmin) return null

  return (
    <Link
      href="/puck/calendar-cta"
      style={{
        position: 'fixed',
        bottom: '5rem',
        right: '1.5rem',
        zIndex: 9999,
        background: '#c0442a',
        color: '#fff',
        padding: '0.5rem 1rem',
        borderRadius: '2rem',
        fontSize: '0.8rem',
        fontWeight: 600,
        textDecoration: 'none',
        boxShadow: '0 2px 12px rgba(0,0,0,0.3)',
      }}
    >
      Edit CTA
    </Link>
  )
}
