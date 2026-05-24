'use client'

import { useEffect } from 'react'
import { useAuth } from '@payloadcms/ui'

export function AdminAfterLogin() {
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      window.location.href = '/admin'
    }
  }, [user])

  return null
}
