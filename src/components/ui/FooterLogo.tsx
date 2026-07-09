'use client'

import Image from 'next/image'
import { useState } from 'react'

export function FooterLogo({ logoUrl, logoColoredUrl }: { logoUrl?: string | null; logoColoredUrl?: string | null }) {
  const [hovered, setHovered] = useState(false)
  const src = hovered
    ? (logoColoredUrl || '/colored-logo.svg')
    : (logoUrl || '/white-logo.svg')
  return (
    <Image
      src={src}
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
