'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import gsap from 'gsap'

interface Destination {
  id: string
  name: string
  slug: string
  heroImage?: { url?: string | null } | null
  month?: string
  spotsLabel?: string
}

interface DestinationCarouselBlockProps {
  sectionTitle?: string
  destinations?: Destination[]
}

function DestCard({ dest, index }: { dest: Destination; index: number }) {
  const cardRef = useRef<HTMLAnchorElement>(null)
  const [hovered, setHovered] = useState(false)

  useEffect(() => {
    if (!cardRef.current) return
    gsap.fromTo(
      cardRef.current,
      { opacity: 0, y: 40, scale: 0.96 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        ease: 'power3.out',
        delay: index * 0.08,
        scrollTrigger: undefined,
      },
    )
  }, [index])

  return (
    <Link
      ref={cardRef}
      href={`/destinations/${dest.slug}`}
      className="group relative flex-shrink-0 w-[300px] md:w-[340px] rounded-2xl overflow-hidden block cursor-pointer"
      style={{ aspectRatio: '3/4' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {dest.heroImage?.url ? (
        <Image
          src={dest.heroImage.url}
          alt={dest.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="340px"
        />
      ) : (
        <div className="absolute inset-0 bg-white/10" />
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

      {hovered && (
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{ boxShadow: '0 0 0 2px #3b82f6' }}
        />
      )}

      {dest.spotsLabel && (
        <div className="absolute top-3 left-3">
          <span className="px-3 py-1 text-xs font-bold bg-[#f5d000] text-black rounded-full uppercase tracking-wide">
            {dest.spotsLabel}
          </span>
        </div>
      )}

      <div className="absolute bottom-0 left-0 right-0 p-5">
        <h3 className="text-xl font-bold text-white leading-tight">{dest.name}</h3>
        {dest.month && (
          <p className="text-sm text-white/60 mt-0.5 lowercase">{dest.month}</p>
        )}
      </div>
    </Link>
  )
}

export function DestinationCarouselBlock({
  sectionTitle = 'Дестинации',
  destinations = [],
}: DestinationCarouselBlockProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const isDragging = useRef(false)
  const startX = useRef(0)
  const scrollLeft = useRef(0)

  function onMouseDown(e: React.MouseEvent) {
    isDragging.current = true
    startX.current = e.pageX - (trackRef.current?.offsetLeft ?? 0)
    scrollLeft.current = trackRef.current?.scrollLeft ?? 0
  }

  function onMouseMove(e: React.MouseEvent) {
    if (!isDragging.current || !trackRef.current) return
    e.preventDefault()
    const x = e.pageX - (trackRef.current.offsetLeft ?? 0)
    trackRef.current.scrollLeft = scrollLeft.current - (x - startX.current)
  }

  function onMouseUp() { isDragging.current = false }

  return (
    <section className="relative z-10 -mt-56 pb-16 overflow-hidden bg-transparent">
      <div
        ref={trackRef}
        className="flex gap-4 px-6 md:px-16 overflow-x-auto pb-4 select-none"
        style={{ scrollbarWidth: 'none', cursor: isDragging.current ? 'grabbing' : 'grab' }}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
      >
        {destinations.map((dest, i) => (
          <DestCard key={dest.id} dest={dest} index={i} />
        ))}
      </div>
    </section>
  )
}
