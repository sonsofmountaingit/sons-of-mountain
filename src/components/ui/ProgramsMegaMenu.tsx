'use client'

import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'motion/react'

interface DestinationItem {
  name: string
  slug: string
  image: string | null
}

interface TripItem {
  title: string
  destinationSlug: string
  destinationName: string
  startDate: string
  spotsAvailable: number
  price: number
  currency: string
}

interface MegamenuData {
  bulgaria: DestinationItem[]
  abroad: DestinationItem[]
  trips: TripItem[]
}

type Tab = 'bulgaria' | 'abroad' | 'trips'

const TABS: { id: Tab; label: string }[] = [
  { id: 'bulgaria', label: 'В БЪЛГАРИЯ' },
  { id: 'abroad', label: 'В ЧУЖБИНА' },
  { id: 'trips', label: 'ИНДИВИДУАЛНО ПРИКЛЮЧЕНИЕ' },
]

function formatDate(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString('bg-BG', { day: 'numeric', month: 'long', year: 'numeric' })
}

interface ProgramsMegaMenuProps {
  open: boolean
  onClose: () => void
}

export function ProgramsMegaMenu({ open, onClose }: ProgramsMegaMenuProps) {
  const [data, setData] = useState<MegamenuData | null>(null)
  const [activeTab, setActiveTab] = useState<Tab>('bulgaria')
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open || data) return
    fetch('/api/megamenu').then((r) => r.json()).then(setData)
  }, [open, data])

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [onClose])

  const currentItems = data
    ? activeTab === 'trips'
      ? data.trips
      : activeTab === 'bulgaria'
        ? data.bulgaria
        : data.abroad
    : []

  const previewImage =
    hoveredSlug && data
      ? activeTab === 'bulgaria'
        ? data.bulgaria.find((d) => d.slug === hoveredSlug)?.image
        : activeTab === 'abroad'
          ? data.abroad.find((d) => d.slug === hoveredSlug)?.image
          : null
      : null

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-[var(--nav-height,80px)] left-0 right-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-xl border-b border-white/10"
          >
            <div className="mx-auto max-w-[1440px] px-6 py-8">
              <div className="flex gap-12">
                {/* Tab column */}
                <div className="flex flex-col gap-1 min-w-[260px] border-r border-white/10 pr-10">
                  {TABS.map((tab) => (
                    <button
                      key={tab.id}
                      onMouseEnter={() => setActiveTab(tab.id)}
                      onClick={() => setActiveTab(tab.id)}
                      className={[
                        'text-left px-3 py-3 text-xs tracking-widest font-medium transition-colors duration-150 rounded-sm flex items-center justify-between group',
                        activeTab === tab.id ? 'text-white bg-white/8' : 'text-white/50 hover:text-white/80',
                      ].join(' ')}
                    >
                      {tab.label}
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 12 12"
                        fill="none"
                        className={['transition-opacity', activeTab === tab.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-40'].join(' ')}
                      >
                        <path d="M2 6h8M6 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  ))}
                </div>

                {/* Items grid */}
                <div className="flex-1 min-h-[220px] min-w-0 overflow-hidden">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeTab}
                      initial={{ opacity: 0, x: 12 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -8 }}
                      transition={{ duration: 0.18 }}
                    >
                      {!data && (
                        <div className="flex items-center justify-center h-32 text-white/30 text-xs tracking-widest">Зарежда…</div>
                      )}

                      {data && activeTab !== 'trips' && (
                        <div className="grid grid-cols-3 gap-3">
                          {(currentItems as DestinationItem[]).map((dest) => (
                            <Link
                              key={dest.slug}
                              href={`/destinations/${dest.slug}`}
                              onClick={onClose}
                              onMouseEnter={() => setHoveredSlug(dest.slug)}
                              onMouseLeave={() => setHoveredSlug(null)}
                              className="group relative overflow-hidden rounded-sm aspect-[4/3] bg-white/5 flex items-end"
                            >
                              {dest.image && (
                                <Image
                                  src={dest.image}
                                  alt={dest.name}
                                  fill
                                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                                  sizes="240px"
                                  unoptimized
                                />
                              )}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                              <span className="relative z-10 px-3 py-2 text-xs font-medium tracking-widest text-white">{dest.name}</span>
                            </Link>
                          ))}
                          {(currentItems as DestinationItem[]).length === 0 && (
                            <p className="text-white/30 text-xs tracking-widest col-span-3">Няма добавени дестинации.</p>
                          )}
                        </div>
                      )}

                      {data && activeTab === 'trips' && (
                        <div style={{ overflowX: 'auto', width: '100%', scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.2) transparent', paddingBottom: '6px' }}>
                        <div style={{ display: 'grid', gap: '12px', gridTemplateColumns: `repeat(${Math.ceil((currentItems as TripItem[]).length / 2)}, 180px)`, gridTemplateRows: 'auto auto', gridAutoFlow: 'column', width: 'max-content' }}>
                          {(currentItems as TripItem[]).map((trip, i) => {
                            const destImg = data.abroad.find(d => d.slug === trip.destinationSlug)?.image
                              ?? data.bulgaria.find(d => d.slug === trip.destinationSlug)?.image
                              ?? null
                            return (
                              <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.2, delay: i * 0.03 }}
                                style={{ width: '180px' }}
                              >
                                <Link
                                  href={`/destinations/${trip.destinationSlug}`}
                                  onClick={onClose}
                                  className="group relative overflow-hidden rounded-xl flex flex-col bg-white/5 hover:bg-white/8 border border-white/8 hover:border-white/16 transition-all duration-200"
                                >
                                  {/* Image */}
                                  <div className="relative aspect-[16/9] overflow-hidden">
                                    {destImg ? (
                                      <Image
                                        src={destImg}
                                        alt={trip.destinationName}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                        sizes="240px"
                                        unoptimized
                                      />
                                    ) : (
                                      <div className="absolute inset-0 bg-white/5" />
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                    {trip.spotsAvailable > 0 && (
                                      <span className="absolute top-2 right-2 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/80 text-white backdrop-blur-sm">
                                        {trip.spotsAvailable} места
                                      </span>
                                    )}
                                    {trip.spotsAvailable === 0 && (
                                      <span className="absolute top-2 right-2 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-red-500/80 text-white backdrop-blur-sm">
                                        Няма места
                                      </span>
                                    )}
                                  </div>
                                  {/* Body */}
                                  <div className="px-3 py-2.5 flex flex-col gap-0.5">
                                    <p className="text-xs font-semibold text-white leading-snug line-clamp-2 group-hover:text-white/90 transition-colors">
                                      {trip.title}
                                    </p>
                                    <p className="text-[10px] text-white/40 mt-0.5">{formatDate(trip.startDate)}</p>
                                    <p className="text-xs font-medium text-[#c0442a] mt-1">{trip.price} {trip.currency}</p>
                                  </div>
                                </Link>
                              </motion.div>
                            )
                          })}
                          {(currentItems as TripItem[]).length === 0 && (
                            <p className="text-white/30 text-xs tracking-widest">Няма активни пътувания.</p>
                          )}
                        </div>
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
