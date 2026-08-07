'use client'

import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'motion/react'
import { useLanguage } from '@/lib/language-context'

interface DestinationItem {
  name: string
  slug: string
  image: string | null
}

interface ContentItem {
  kind: 'trip' | 'program'
  title: string
  slug: string
  image: string | null
  startDate: string | null
  spotsAvailable: number
  price: number
  currency: string
}

interface MegamenuData {
  bulgaria: DestinationItem[]
  abroad: DestinationItem[]
  bulgariaItems: ContentItem[]
  abroadItems: ContentItem[]
  individualItems: ContentItem[]
}

type Tab = 'bulgaria' | 'abroad' | 'individual'

function formatDate(iso: string, locale: string) {
  const d = new Date(iso)
  return d.toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' })
}

interface ProgramsMegaMenuProps {
  open: boolean
  onClose: () => void
  navHeight: number
}

export function ProgramsMegaMenu({ open, onClose, navHeight }: ProgramsMegaMenuProps) {
  const { language, t } = useLanguage()
  const locale = language === 'BG' ? 'bg-BG' : 'en-US'
  const TABS: { id: Tab; label: string }[] = [
    { id: 'bulgaria', label: t.megamenu.in_bulgaria },
    { id: 'abroad', label: t.megamenu.abroad },
    { id: 'individual', label: t.megamenu.custom_program },
  ]
  const [data, setData] = useState<MegamenuData | null>(null)
  const [activeTab, setActiveTab] = useState<Tab>('bulgaria')
  const panelRef = useRef<HTMLDivElement>(null)

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

  const destinations = data
    ? activeTab === 'bulgaria'
      ? data.bulgaria
      : activeTab === 'abroad'
        ? data.abroad
        : []
    : []

  const contentItems: ContentItem[] = data
    ? activeTab === 'bulgaria'
      ? data.bulgariaItems
      : activeTab === 'abroad'
        ? data.abroadItems
        : data.individualItems
    : []

  const trips = contentItems.filter((i) => i.kind === 'trip')
  const programs = contentItems.filter((i) => i.kind === 'program')
  const showDestinations = activeTab !== 'individual' && destinations.length > 0

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
            ref={panelRef}
            data-panel="megamenu"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            style={{ top: navHeight }}
            className="fixed left-0 right-0 z-[62] bg-[#0a0a0a]/97 backdrop-blur-xl border-b border-white/10 max-h-[calc(100vh-64px)] overflow-y-auto"
          >
            <div className="mx-auto max-w-[1440px] px-4 sm:px-6 py-6 sm:py-8">
              <div className="flex flex-col md:flex-row gap-6 md:gap-12">
                {/* Tab column */}
                <div className="flex flex-row md:flex-col gap-1 md:min-w-[260px] border-b md:border-b-0 md:border-r border-white/10 pb-2 md:pb-0 md:pr-10 overflow-x-auto">
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

                {/* Content */}
                <div className="flex-1 min-h-[220px] min-w-0 overflow-hidden">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeTab}
                      initial={{ opacity: 0, x: 12 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -8 }}
                      transition={{ duration: 0.18 }}
                      className="flex flex-col gap-8"
                    >
                      {!data && (
                        <div className="flex items-center justify-center h-32 text-white/30 text-xs tracking-widest">{t.megamenu.loading}</div>
                      )}

                      {/* Destinations row */}
                      {data && showDestinations && (
                        <div>
                          <p className="text-[10px] tracking-widest text-white/25 mb-3">{t.megamenu.destinations}</p>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 xl:grid-cols-6">
                            {destinations.map((dest) => (
                              <Link
                                key={dest.slug}
                                href={`/destinations/${dest.slug}`}
                                onClick={onClose}
                                className="group relative overflow-hidden rounded-sm aspect-[4/3] bg-white/5 flex items-end"
                              >
                                {dest.image && (
                                  <Image
                                    src={dest.image}
                                    alt={dest.name}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    sizes="(max-width: 1280px) 160px, 200px"
                                  />
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                                <span className="relative z-10 px-3 py-2 text-xs font-medium tracking-widest text-white">{dest.name}</span>
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Trips row */}
                      {data && activeTab !== 'individual' && trips.length > 0 && (
                        <div>
                          <p className="text-[10px] tracking-widest text-white/25 mb-3">{t.megamenu.trips}</p>
                          <div style={{ overflowX: 'auto', width: '100%', scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.2) transparent', paddingBottom: '6px' }}>
                            <div style={{ display: 'grid', gap: '12px', gridTemplateColumns: `repeat(${Math.min(trips.length, 6)}, 180px)`, width: 'max-content' }}>
                              {trips.map((item, i) => (
                                <ContentCard key={`trip-${item.slug}`} item={item} index={i} onClose={onClose} locale={locale} t={t} />
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Programs row */}
                      {data && activeTab !== 'individual' && programs.length > 0 && (
                        <div>
                          <p className="text-[10px] tracking-widest text-white/25 mb-3">{t.megamenu.programs}</p>
                          <div style={{ overflowX: 'auto', width: '100%', scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.2) transparent', paddingBottom: '6px' }}>
                            <div style={{ display: 'grid', gap: '12px', gridTemplateColumns: `repeat(${Math.min(programs.length, 6)}, 180px)`, width: 'max-content' }}>
                              {programs.map((item, i) => (
                                <ContentCard key={`program-${item.slug}`} item={item} index={i} onClose={onClose} locale={locale} t={t} />
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Individual tab: summary page link */}
                      {data && activeTab === 'individual' && (
                        <div>
                          <Link
                            href="/individual-programs"
                            onClick={onClose}
                            className="inline-flex items-center gap-2 px-4 py-2.5 mb-6 text-xs font-semibold tracking-widest text-white bg-white/8 hover:bg-white/12 border border-white/15 rounded-sm transition-colors duration-200"
                          >
                            {t.megamenu.what_is_custom_program}
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                              <path d="M2 6h8M6 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </Link>
                        </div>
                      )}

                      {data && activeTab === 'individual' && contentItems.length > 0 && (
                        <div>
                          <p className="text-[10px] tracking-widest text-white/25 mb-3">{t.megamenu.programs_and_trips}</p>
                          <div style={{ overflowX: 'auto', width: '100%', scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.2) transparent', paddingBottom: '6px' }}>
                            <div style={{ display: 'grid', gap: '12px', gridTemplateColumns: `repeat(${Math.min(contentItems.length, 6)}, 180px)`, width: 'max-content' }}>
                              {contentItems.map((item, i) => (
                                <ContentCard key={`ind-${item.slug}`} item={item} index={i} onClose={onClose} locale={locale} t={t} />
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {data && !showDestinations && trips.length === 0 && programs.length === 0 && activeTab !== 'individual' && (
                        <p className="text-white/30 text-xs tracking-widest">{t.megamenu.no_content}</p>
                      )}

                      {data && activeTab === 'individual' && contentItems.length === 0 && (
                        <p className="text-white/30 text-xs tracking-widest">{t.megamenu.no_content}</p>
                      )}

                      {/* See all button */}
                      {data && (
                        <div className="pt-2">
                          <Link
                            href="/calendar"
                            onClick={onClose}
                            className="inline-flex items-center gap-2 px-5 py-2 text-xs font-medium tracking-widest text-white/60 hover:text-white border border-white/15 hover:border-white/40 rounded-sm transition-colors duration-200"
                          >
                            {t.megamenu.see_all_in_calendar}
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                              <path d="M2 6h8M6 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </Link>
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

function ContentCard({ item, index, onClose, locale, t }: { item: ContentItem; index: number; onClose: () => void; locale: string; t: ReturnType<typeof useLanguage>['t'] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: index * 0.03 }}
      style={{ width: '180px' }}
    >
      <Link
        href={item.kind === 'trip' ? `/trips/${item.slug}` : `/programs/${item.slug}`}
        onClick={onClose}
        className="group relative overflow-hidden rounded-xl flex flex-col bg-white/5 hover:bg-white/8 border border-white/8 hover:border-white/16 transition-all duration-200"
      >
        <div className="relative aspect-[16/9] overflow-hidden">
          {item.image ? (
            <Image
              src={item.image}
              alt={item.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="180px"
            />
          ) : (
            <div className="absolute inset-0 bg-white/5" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          {item.spotsAvailable > 0 && (
            <span className="absolute top-2 right-2 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/80 text-white backdrop-blur-sm">
              {item.spotsAvailable} {t.megamenu.spots}
            </span>
          )}
          {item.spotsAvailable === 0 && (
            <span className="absolute top-2 right-2 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-red-500/80 text-white backdrop-blur-sm">
              {t.megamenu.no_spots}
            </span>
          )}
        </div>
        <div className="px-3 py-2.5 flex flex-col gap-0.5">
          <p className="text-xs font-semibold text-white leading-snug line-clamp-2 group-hover:text-white/90 transition-colors">
            {item.title}
          </p>
          {item.startDate && (
            <p className="text-[10px] text-white/40 mt-0.5">{formatDate(item.startDate, locale)}</p>
          )}
          <p className="text-xs font-medium text-[#c0442a] mt-1">{item.price} {item.currency}</p>
        </div>
      </Link>
    </motion.div>
  )
}
