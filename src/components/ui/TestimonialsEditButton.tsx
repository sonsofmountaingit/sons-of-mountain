'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export function TestimonialsEditButton() {
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    fetch('/api/users/me').then(r => r.json()).then(d => {
      if (d?.user?.role === 'admin' || d?.user?.collection === 'users') setIsAdmin(true)
    }).catch(() => {})
  }, [])

  if (!isAdmin) return null

  return (
    <Link
      href="/puck/testimonials"
      style={{
        position: 'fixed',
        bottom: '8rem',
        right: '1.5rem',
        zIndex: 9999,
        background: '#111111',
        color: '#fff',
        padding: '0.5rem 1rem',
        borderRadius: '2rem',
        fontSize: '0.8rem',
        fontWeight: 600,
        textDecoration: 'none',
        border: '1px solid rgba(255,255,255,0.2)',
        boxShadow: '0 2px 12px rgba(0,0,0,0.3)',
      }}
    >
      Edit Testimonials
    </Link>
  )
}
