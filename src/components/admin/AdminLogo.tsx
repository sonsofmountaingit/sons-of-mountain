'use client'

import React, { useState } from 'react'
import Image from 'next/image'

export function AdminLogo() {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      <Image
        src={hovered ? '/colored-logo.svg' : '/white-logo.svg'}
        alt="Sons of Mountains"
        width={160}
        height={48}
        priority
        style={{ transition: 'opacity 0.2s' }}
      />
    </div>
  )
}
