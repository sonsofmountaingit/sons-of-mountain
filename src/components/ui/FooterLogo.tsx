'use client'

import Image from 'next/image'
import { useState } from 'react'

export function FooterLogo() {
  const [hovered, setHovered] = useState(false)
  return (
    <Image
      src={hovered ? '/colored-logo.svg' : '/white-logo.svg'}
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
