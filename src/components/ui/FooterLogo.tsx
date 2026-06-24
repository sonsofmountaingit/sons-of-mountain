'use client'

import Image from 'next/image'
import { useState } from 'react'

export function FooterLogo({ logoUrl }: { logoUrl?: string | null }) {
  const [hovered, setHovered] = useState(false)
  const defaultSrc = hovered ? '/colored-logo.svg' : '/white-logo.svg'
  return (
    <Image
      src={logoUrl ?? defaultSrc}
      alt="Logo"
      width={72}
      height={72}
      unoptimized
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ cursor: 'pointer' }}
    />
  )
}
