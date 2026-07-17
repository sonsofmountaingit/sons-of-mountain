'use client'

import React, { useRef, useState, useCallback, useEffect, useMemo, lazy, Suspense } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { CalendarTripCard, type CalendarItem, DIFFICULTY_LABELS } from './CalendarTripCard'

const CalendarMap = lazy(() => import('./CalendarMap').then((m) => ({ default: m.CalendarMap })))

export type MonthGroup = {
  year: number
  month: number
  label: string
  items: CalendarItem[]
}

const CATEGORY_LABELS: Record<string, string> = {
  all: 'ALL',
  bulgaria: 'IN BULGARIA',
  abroad: 'ABROAD',
  individual: 'CUSTOM PROGRAM',
}


const SEASON_LABELS: Record<number, string> = {
  0: 'WINTER', 1: 'WINTER', 11: 'WINTER',
  2: 'SPRING', 3: 'SPRING', 4: 'SPRING',
  5: 'SUMMER', 6: 'SUMMER', 7: 'SUMMER',
  8: 'FALL', 9: 'FALL', 10: 'FALL',
}
const SEASON_COLORS: Record<string, string> = {
  WINTER: 'text-blue-500',
  SPRING: 'text-green-600',
  SUMMER: 'text-amber-500',
  FALL: 'text-orange-500',
}
const MONTHS_BG: Record<number, string> = {
  0: 'JANUARY', 1: 'FEBRUARY', 2: 'MARCH', 3: 'APRIL',
  4: 'MAY', 5: 'JUNE', 6: 'JULY', 7: 'AUGUST',
  8: 'SEPTEMBER', 9: 'OCTOBER', 10: 'NOVEMBER', 11: 'DECEMBER',
}

type RowData = {
  rowIdx: number
  groups: MonthGroup[]
  showSeasonBanner: boolean
  season: string
}

type Props = {
  groups: MonthGroup[]
  initialWishlist: string[]
  loggedIn: boolean
  allItems: CalendarItem[]
  itemCoords: Record<string, { lat: number; lng: number }>
}

function SkeletonCard() {
  return (
    <div className="flex items-center gap-3 p-3 border border-zinc-200 rounded-xl animate-pulse">
      <div className="w-14 h-14 rounded-lg bg-zinc-100 flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-2 bg-zinc-100 rounded-full w-1/4" />
        <div className="h-3 bg-zinc-100 rounded-full w-3/4" />
        <div className="h-2 bg-zinc-100 rounded-full w-1/2" />
      </div>
    </div>
  )
}

function RecentlyViewed({ allItems }: { allItems: CalendarItem[] }) {
  const [recentIds, setRecentIds] = useState<string[]>([])
  useEffect(() => {
    try {
      const raw = localStorage.getItem('som_recent')
      if (raw) setRecentIds(JSON.parse(raw) as string[])
    } catch {}
  }, [])
  const recentItems = recentIds.map((id) => allItems.find((i) => i.id === id)).filter(Boolean) as CalendarItem[]
  if (recentItems.length === 0) return null
  return (
    <div className="mb-10 print:hidden">
      <p className="text-[9px] tracking-[0.3em] text-zinc-400 mb-3 uppercase">Последно видяно</p>
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        {recentItems.map((item) => (
          <a key={item.id} href={item.href}
            className="flex-shrink-0 flex items-center gap-2 px-3 py-1.5 border border-zinc-200 rounded-lg hover:border-zinc-400 transition-all text-xs text-zinc-500 hover:text-zinc-800">
            <span className="truncate max-w-[110px]">{item.title || item.destinationName}</span>
          </a>
        ))}
      </div>
    </div>
  )
}

function CompareDrawer({ items, onClose }: { items: CalendarItem[]; onClose: () => void }) {
  const drawerRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!drawerRef.current) return
    const el = drawerRef.current
    el.style.transform = 'translateY(100%)'
    import('gsap').then(({ gsap }) => {
      gsap.to(el, { y: 0, duration: 0.4, ease: 'power3.out' })
    })
  }, [])
  return (
    <div ref={drawerRef} className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-zinc-200 p-4 sm:p-5 print:hidden" style={{ maxHeight: '80vh', overflowY: 'auto' }}>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <p className="text-[10px] tracking-[0.3em] text-zinc-400 uppercase">Сравнение ({items.length})</p>
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-800 transition-colors text-sm leading-none p-2">✕</button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
          {items.map((item) => (
            <div key={item.id} className="border border-zinc-200 rounded-xl p-3 sm:p-4 space-y-2">
              <p className="font-semibold text-sm text-zinc-800 truncate">{item.title}</p>
              <p className="text-[11px] text-zinc-500">{new Date(item.startDate).toLocaleDateString('bg-BG')} — {new Date(item.endDate).toLocaleDateString('bg-BG')}</p>
              <p className="text-[11px] text-zinc-500">{item.spotsAvailable > 0 ? `${item.spotsAvailable} места` : 'Изчерпано'}</p>
              {item.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {item.tags.slice(0, 3).map((t) => (
                    <span key={t} className="text-[9px] bg-zinc-100 px-1.5 py-0.5 rounded-full text-zinc-500">{t}</span>
                  ))}
                </div>
              )}
              <a href={item.href} className="text-[10px] text-zinc-500 hover:text-zinc-800 transition-colors underline underline-offset-2">Виж →</a>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Season banner with GSAP entrance
function SeasonBanner({ season, year, colorClass }: { season: string; year: number; colorClass: string }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!ref.current) return
    const el = ref.current
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return
    // Set initial state immediately to avoid flash
    el.style.opacity = '0'
    el.style.transform = 'translateX(-24px)'
    import('gsap').then(({ gsap }) => {
      import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
        gsap.registerPlugin(ScrollTrigger)
        gsap.to(el, {
          x: 0, opacity: 1, duration: 0.7, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 95%', once: true },
        })
      })
    })
  }, [])
  return (
    <div ref={ref} className={`text-[9px] tracking-[0.35em] font-semibold mb-5 ${colorClass}`}>
      — {season} {year} —
    </div>
  )
}

// Month column with GSAP stagger entrance
function MonthColumn({
  group, collapsed, onToggle, wishlistIds, loggedIn, onWishlistToggle, compareIds, onCompareToggle, staggerDelay,
}: {
  group: MonthGroup
  collapsed: boolean
  onToggle: () => void
  wishlistIds: Set<string>
  loggedIn: boolean
  onWishlistToggle: (item: CalendarItem) => void
  compareIds: Set<string>
  onCompareToggle: (id: string) => void
  staggerDelay: number
}) {
  const colRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!colRef.current) return
    const el = colRef.current
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return
    // Set initial state immediately to avoid flash
    el.style.opacity = '0'
    el.style.transform = 'translateY(28px)'
    import('gsap').then(({ gsap }) => {
      import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
        gsap.registerPlugin(ScrollTrigger)
        gsap.to(el, {
          y: 0, opacity: 1, duration: 0.65, ease: 'power3.out',
          delay: staggerDelay,
          scrollTrigger: { trigger: el, start: 'top 92%', once: true },
        })
      })
    })
  }, [staggerDelay])

  useEffect(() => {
    if (collapsed || !cardsRef.current) return
    const cards = Array.from(cardsRef.current.querySelectorAll('[data-card]')) as HTMLElement[]
    if (cards.length === 0) return
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return
    // Set initial state immediately to avoid flash
    cards.forEach((c) => { c.style.opacity = '0'; c.style.transform = 'translateX(-12px)' })
    import('gsap').then(({ gsap }) => {
      import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
        gsap.registerPlugin(ScrollTrigger)
        gsap.to(cards, {
          x: 0, opacity: 1, stagger: 0.055, duration: 0.38, ease: 'power2.out',
          scrollTrigger: { trigger: cardsRef.current!, start: 'top 95%', once: true },
        })
      })
    })
  }, [collapsed, group.items])

  return (
    <div ref={colRef}>
      <button
        onClick={onToggle}
        className="flex items-center gap-2 mb-4 w-full text-left group/header print:static"
      >
        <h2 className="text-[10px] tracking-[0.25em] font-semibold text-zinc-400 group-hover/header:text-zinc-700 transition-colors duration-200">
          {MONTHS_BG[group.month]}
        </h2>
        <span
          className="text-[8px] text-zinc-300 group-hover/header:text-zinc-500 transition-colors duration-200 ml-0.5"
          style={{ transform: collapsed ? 'rotate(180deg)' : 'rotate(0deg)', display: 'inline-block', transition: 'transform 0.25s ease, color 0.2s' }}
        >
          ▴
        </span>
      </button>

      {!collapsed && (
        <div ref={cardsRef} className="space-y-2.5">
          {group.items.map((item, idx) => (
            <CalendarTripCard
              key={`${group.year}-${group.month}-${item.id}-${idx}`}
              item={item}
              isWishlisted={wishlistIds.has(item.id)}
              loggedIn={loggedIn}
              onWishlistToggle={onWishlistToggle}
              isComparing={compareIds.has(item.id)}
              onCompareToggle={onCompareToggle}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function FilterDropdown({
  label,
  active,
  summary,
  children,
}: {
  label: string
  active: boolean
  summary?: string
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!panelRef.current) return
    const el = panelRef.current
    if (open) {
      el.style.display = 'block'
      el.style.opacity = '0'
      el.style.transform = 'translateY(-6px) scaleY(0.96)'
      import('gsap').then(({ gsap }) => {
        gsap.to(el, { opacity: 1, y: 0, scaleY: 1, duration: 0.22, ease: 'power2.out', transformOrigin: 'top center' })
      })
    } else {
      import('gsap').then(({ gsap }) => {
        gsap.to(el, {
          opacity: 0, y: -6, scaleY: 0.96, duration: 0.16, ease: 'power2.in', transformOrigin: 'top center',
          onComplete: () => { el.style.display = 'none' },
        })
      })
    }
  }, [open])

  // Close on outside click
  useEffect(() => {
    if (!open) return
    function handler(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  return (
    <div ref={wrapRef} className="relative">
      <button
        onClick={() => setOpen((p) => !p)}
        className={[
          'flex items-center gap-1.5 text-[10px] tracking-widest px-3.5 py-1.5 rounded-full border transition-all duration-200 whitespace-nowrap flex-shrink-0',
          active
            ? 'border-[#F45B26]/60 text-[#F45B26] bg-[#F45B26]/8'
            : open
            ? 'border-zinc-400 text-zinc-800 bg-zinc-50'
            : 'border-zinc-200 text-zinc-400 hover:border-zinc-400 hover:text-zinc-700',
        ].join(' ')}
      >
        {summary ?? label}
        <span
          className="text-[8px] leading-none transition-transform duration-200"
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', display: 'inline-block' }}
        >
          ▾
        </span>
      </button>
      <div
        ref={panelRef}
        style={{ display: 'none', position: 'absolute', top: 'calc(100% + 6px)', left: 0, zIndex: 999, minWidth: '160px', maxWidth: 'calc(100vw - 2rem)', maxHeight: '60vh', overflowY: 'auto' }}
        className="bg-white border border-zinc-200 rounded-xl shadow-xl overflow-hidden"
      >
        {children}
      </div>
    </div>
  )
}

export function CalendarGrid({ groups, initialWishlist, loggedIn, allItems, itemCoords }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [category, setCategory] = useState(searchParams.get('category') ?? 'all')
  const [tag, setTag] = useState(searchParams.get('tag') ?? 'Всички')

  const tagOptions = useMemo(() => {
    const seen = new Set<string>()
    for (const item of allItems) {
      for (const t of item.tags) if (t) seen.add(t)
    }
    return ['Всички', ...Array.from(seen).sort()]
  }, [allItems])
  const [year, setYear] = useState(searchParams.get('year') ?? 'all')
  const [onlyAvailable, setOnlyAvailable] = useState(false)
  const [onlyWishlisted, setOnlyWishlisted] = useState(false)
  const [onlyUpcoming, setOnlyUpcoming] = useState(false)
  const [difficulty, setDifficulty] = useState(searchParams.get('difficulty') ?? 'all')
  const [search, setSearch] = useState('')
  const [wishlistIds, setWishlistIds] = useState<Set<string>>(new Set(initialWishlist))
  const [collapsedMonths, setCollapsedMonths] = useState<Set<string>>(new Set())
  const [mapView, setMapView] = useState(false)
  const [hydrated, setHydrated] = useState(false)
  const [compareIds, setCompareIds] = useState<Set<string>>(new Set())
  const [isLoggedIn, setIsLoggedIn] = useState(loggedIn)
  const gridRef = useRef<HTMLDivElement>(null)
  const filterBarRef = useRef<HTMLDivElement>(null)

  useEffect(() => { setHydrated(true) }, [])

  // Fetch session + wishlist client-side so the server component can be cached
  useEffect(() => {
    fetch('/api/users/me', { credentials: 'include' })
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        if (!data?.user) return
        setIsLoggedIn(true)
        fetch('/api/wishlist', { credentials: 'include' })
          .then((r) => r.ok ? r.json() : null)
          .then((wdata) => {
            if (!wdata?.wishlist) return
            const ids = (wdata.wishlist as { itemType: string; trip?: { id?: string } | string; program?: { id?: string } | string }[])
              .map((w) => {
                if (w.itemType === 'trip') return typeof w.trip === 'object' ? (w.trip?.id ?? '') : (w.trip ?? '')
                return typeof w.program === 'object' ? (w.program?.id ?? '') : (w.program ?? '')
              }).filter(Boolean) as string[]
            setWishlistIds(new Set(ids))
          })
          .catch(() => {})
      })
      .catch(() => {})
  }, [])

  // Filter bar entrance on mount
  useEffect(() => {
    if (!hydrated || !filterBarRef.current) return
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return
    const el = filterBarRef.current
    el.style.opacity = '0'
    el.style.transform = 'translateY(-8px)'
    import('gsap').then(({ gsap }) => {
      gsap.to(el, { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' })
    })
  }, [hydrated])

  const allYears = [...new Set(groups.map((g) => g.year))].sort()

  function updateUrl(params: Record<string, string>) {
    const sp = new URLSearchParams(searchParams.toString())
    for (const [k, v] of Object.entries(params)) {
      if (v === 'all' || v === 'ALL' || v === '') sp.delete(k)
      else sp.set(k, v)
    }
    router.replace(`${pathname}?${sp.toString()}`, { scroll: false })
  }

  function animateGridChange(cb: () => void) {
    const prefersReduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced || !gridRef.current) { cb(); return }
    import('gsap').then(({ gsap }) => {
      gsap.to(gridRef.current!, {
        opacity: 0.2, duration: 0.12, ease: 'power1.in',
        onComplete: () => {
          cb()
          gsap.to(gridRef.current!, { opacity: 1, duration: 0.25, ease: 'power2.out' })
        },
      })
    })
  }

  function setAndSyncCategory(v: string) { animateGridChange(() => { setCategory(v); updateUrl({ category: v }) }) }
  function setAndSyncYear(v: string) { animateGridChange(() => { setYear(v); updateUrl({ year: v }) }) }
  function setAndSyncTag(v: string) { animateGridChange(() => { setTag(v); updateUrl({ tag: v }) }) }
  function setAndSyncDifficulty(v: string) { animateGridChange(() => { setDifficulty(v); updateUrl({ difficulty: v }) }) }

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  function handleSearch(v: string) {
    setSearch(v)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => updateUrl({ search: v }), 150)
  }

  function toggleWishlist(item: CalendarItem) {
    setWishlistIds((prev) => {
      const next = new Set(prev)
      if (next.has(item.id)) next.delete(item.id)
      else next.add(item.id)
      return next
    })
  }

  function toggleCompare(id: string) {
    setCompareIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else if (next.size < 3) next.add(id)
      return next
    })
  }

  const filterItem = useCallback((item: CalendarItem) => {
    if (category !== 'all' && item.category !== category) return false
    if (tag !== 'Всички' && !item.tags.includes(tag)) return false
    if (year !== 'all' && new Date(item.startDate).getFullYear() !== Number(year)) return false
    if (onlyAvailable && (item.spotsAvailable === 0 || item.status === 'soldOut')) return false
    if (onlyWishlisted && !wishlistIds.has(item.id)) return false
    if (onlyUpcoming && item.status === 'archived') return false
    if (difficulty !== 'all' && item.difficulty !== Number(difficulty)) return false
    if (search) {
      const q = search.toLowerCase()
      if (!item.title.toLowerCase().includes(q) && !item.destinationName.toLowerCase().includes(q)) return false
    }
    return true
  }, [category, tag, year, onlyAvailable, onlyWishlisted, onlyUpcoming, wishlistIds, difficulty, search])

  const filteredGroups = useMemo(() =>
    groups.map((g) => ({ ...g, items: g.items.filter(filterItem) })).filter((g) => g.items.length > 0),
    [groups, filterItem]
  )

  // Pre-compute rows with stable season banner flags (not during render to avoid ref mutation)
  const rows = useMemo<RowData[]>(() => {
    const result: RowData[] = []
    let lastSeason: string | null = null
    for (let i = 0; i < filteredGroups.length; i += 3) {
      const rowGroups = filteredGroups.slice(i, i + 3)
      const season = SEASON_LABELS[rowGroups[0].month]
      const showSeasonBanner = season !== lastSeason
      if (showSeasonBanner) lastSeason = season
      result.push({ rowIdx: i / 3, groups: rowGroups, showSeasonBanner, season })
    }
    return result
  }, [filteredGroups])

  const compareItems = allItems.filter((i) => compareIds.has(i.id))

  if (!hydrated) {
    return (
      <div className="space-y-14">
        {[0, 1].map((gi) => (
          <div key={`skel-row-${gi}`}>
            <div className="h-3 bg-zinc-100 rounded-full w-24 mb-5 animate-pulse" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-6">
              {[0, 1, 2].map((ci) => (
                <div key={`skel-col-${gi}-${ci}`} className="space-y-2.5">
                  <div className="h-2.5 bg-zinc-100 rounded-full w-16 mb-4 animate-pulse" />
                  {[0, 1, 2].map((i) => <SkeletonCard key={`skel-card-${gi}-${ci}-${i}`} />)}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <>
      <style>{`
        @media print {
          .print\\:hidden { display: none !important; }
          body { background: white !important; color: black !important; }
          [data-card] { border: 1px solid #e5e7eb !important; break-inside: avoid; }
        }
        .scrollbar-none::-webkit-scrollbar { display: none; }
        .scrollbar-none { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* Filter bar */}
      <div ref={filterBarRef} className="mb-8 sm:mb-10 print:hidden relative z-40">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 -mx-4 px-4 sm:overflow-visible sm:pb-0 sm:mx-0 sm:px-0 sm:flex-wrap scrollbar-none">
          {/* Dropdown: Destination */}
          <FilterDropdown
            label="DESTINATION"
            active={category !== 'all'}
            summary={category !== 'all' ? CATEGORY_LABELS[category] : undefined}
          >
            <div className="flex flex-col gap-1 p-3">
              {Object.entries(CATEGORY_LABELS).map(([val, lbl]) => (
                <button
                  key={val}
                  onClick={() => setAndSyncCategory(val)}
                  className={[
                    'text-left text-[10px] tracking-widest px-3 py-1.5 rounded-md border transition-all duration-150',
                    category === val
                      ? 'border-zinc-400 text-zinc-900 bg-zinc-100'
                      : 'border-transparent text-zinc-400 hover:text-zinc-700 hover:border-zinc-200',
                  ].join(' ')}
                >
                  {lbl}
                </button>
              ))}
            </div>
          </FilterDropdown>

          {/* Dropdown: Type */}
          <FilterDropdown
            label="TYPE"
            active={tag !== 'All'}
            summary={tag !== 'All' ? tag.toUpperCase() : undefined}
          >
            <div className="flex flex-wrap gap-1.5 p-3" style={{ maxWidth: '320px' }}>
              {tagOptions.map((t) => (
                <button
                  key={t}
                  onClick={() => setAndSyncTag(t)}
                  className={[
                    'text-[9px] tracking-wider px-2.5 py-1 rounded-md border transition-all duration-150',
                    tag === t
                      ? 'border-zinc-400 text-zinc-900 bg-zinc-100'
                      : 'border-zinc-200 text-zinc-400 hover:border-zinc-400 hover:text-zinc-700',
                  ].join(' ')}
                >
                  {t.toUpperCase()}
                </button>
              ))}
            </div>
          </FilterDropdown>

          {/* Dropdown: Difficulty */}
          <FilterDropdown
            label="DIFFICULTY"
            active={difficulty !== 'all'}
            summary={difficulty !== 'all' ? DIFFICULTY_LABELS[Number(difficulty)] : undefined}
          >
            <div className="flex flex-col gap-1 p-3">
              <button
                onClick={() => setAndSyncDifficulty('all')}
                className={[
                  'text-left text-[10px] tracking-widest px-3 py-1.5 rounded-md border transition-all duration-150',
                  difficulty === 'all'
                    ? 'border-zinc-400 text-zinc-900 bg-zinc-100'
                    : 'border-transparent text-zinc-400 hover:text-zinc-700 hover:border-zinc-200',
                ].join(' ')}
              >
                ALL
              </button>
              {Object.entries(DIFFICULTY_LABELS).map(([val, lbl]) => (
                <button
                  key={val}
                  onClick={() => setAndSyncDifficulty(val)}
                  className={[
                    'text-left text-[10px] tracking-widest px-3 py-1.5 rounded-md border transition-all duration-150',
                    difficulty === val
                      ? 'border-zinc-400 text-zinc-900 bg-zinc-100'
                      : 'border-transparent text-zinc-400 hover:text-zinc-700 hover:border-zinc-200',
                  ].join(' ')}
                >
                  {lbl.toUpperCase()}
                </button>
              ))}
            </div>
          </FilterDropdown>

          {/* Dropdown: Period */}
          <FilterDropdown
            label="PERIOD"
            active={year !== 'all' || onlyAvailable}
            summary={year !== 'all' ? String(year) : onlyAvailable ? 'AVAILABLE' : undefined}
          >
            <div className="flex flex-col gap-1 p-3">
              {allYears.map((y) => (
                <button
                  key={y}
                  onClick={() => setAndSyncYear(year === String(y) ? 'all' : String(y))}
                  className={[
                    'text-left text-[10px] tracking-widest px-3 py-1.5 rounded-md border transition-all duration-150',
                    year === String(y)
                      ? 'border-zinc-400 text-zinc-900 bg-zinc-100'
                      : 'border-transparent text-zinc-400 hover:text-zinc-700 hover:border-zinc-200',
                  ].join(' ')}
                >
                  {y}
                </button>
              ))}
              <div className="h-px bg-zinc-200 my-1" />
              <button
                onClick={() => setOnlyAvailable((p) => !p)}
                className={[
                  'text-left text-[10px] tracking-widest px-3 py-1.5 rounded-md border transition-all duration-150',
                  onlyAvailable
                    ? 'border-zinc-400 text-zinc-900 bg-zinc-100'
                    : 'border-transparent text-zinc-400 hover:text-zinc-700 hover:border-zinc-200',
                ].join(' ')}
              >
                САМО СВОБОДНИ
              </button>
              <button
                onClick={() => setOnlyUpcoming((p) => !p)}
                className={[
                  'text-left text-[10px] tracking-widest px-3 py-1.5 rounded-md border transition-all duration-150',
                  onlyUpcoming
                    ? 'border-zinc-400 text-zinc-900 bg-zinc-100'
                    : 'border-transparent text-zinc-400 hover:text-zinc-700 hover:border-zinc-200',
                ].join(' ')}
              >
                САМО ПРЕДСТОЯЩИ
              </button>
              {isLoggedIn && (
                <button
                  onClick={() => setOnlyWishlisted((p) => !p)}
                  className={[
                    'text-left text-[10px] tracking-widest px-3 py-1.5 rounded-md border transition-all duration-150',
                    onlyWishlisted
                      ? 'border-[#F45B26]/50 text-[#F45B26] bg-[#F45B26]/5'
                      : 'border-transparent text-zinc-400 hover:text-zinc-700 hover:border-zinc-200',
                  ].join(' ')}
                >
                  ♥ ЛЮБИМИ
                </button>
              )}
            </div>
          </FilterDropdown>

          {/* Search + Map */}
          <div className="flex items-center gap-2 flex-shrink-0 sm:ml-auto">
            <input
              type="search"
              placeholder="Търси..."
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              className="text-xs bg-white border border-zinc-200 rounded-md px-3 py-1.5 text-zinc-800 placeholder-zinc-300 focus:outline-none focus:border-zinc-400 transition-colors w-28 sm:w-40"
              style={{ minHeight: '36px' }}
            />
            <button
              onClick={() => setMapView((p) => !p)}
              className={[
                'text-[10px] tracking-widest px-3 py-1.5 rounded-md border transition-all duration-200 whitespace-nowrap flex-shrink-0',
                mapView ? 'border-zinc-400 text-zinc-900 bg-zinc-100' : 'border-zinc-200 text-zinc-400 hover:border-zinc-400',
              ].join(' ')}
              style={{ minHeight: '36px' }}
            >
              {mapView ? 'СПИСЪК' : 'КАРТА'}
            </button>
          </div>
        </div>
      </div>

      <RecentlyViewed allItems={allItems} />

      {mapView && (
        <Suspense fallback={<div className="h-96 bg-zinc-100 rounded-xl animate-pulse" />}>
          <CalendarMap items={allItems.filter(filterItem)} itemCoords={itemCoords} />
        </Suspense>
      )}

      {!mapView && filteredGroups.length === 0 && (
        <p className="text-zinc-400 text-center py-24 text-sm">No trips found.</p>
      )}

      {!mapView && (
        <div ref={gridRef}>
          {rows.map(({ rowIdx, groups: rowGroups, showSeasonBanner, season }) => (
            <div key={rowIdx} className="mb-10 sm:mb-14">
              {showSeasonBanner && (
                <SeasonBanner
                  season={season}
                  year={rowGroups[0].year}
                  colorClass={SEASON_COLORS[season] ?? 'text-zinc-400'}
                />
              )}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-8" style={{ rowGap: '2rem' }}>
                {rowGroups.map((group, colIdx) => {
                  const monthKey = `${group.year}-${group.month}`
                  return (
                    <MonthColumn
                      key={monthKey}
                      group={group}
                      collapsed={collapsedMonths.has(monthKey)}
                      onToggle={() => setCollapsedMonths((prev) => {
                        const next = new Set(prev)
                        if (next.has(monthKey)) next.delete(monthKey)
                        else next.add(monthKey)
                        return next
                      })}
                      wishlistIds={wishlistIds}
                      loggedIn={isLoggedIn}
                      onWishlistToggle={toggleWishlist}
                      compareIds={compareIds}
                      onCompareToggle={toggleCompare}
                      staggerDelay={colIdx * 0.1}
                    />
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {compareIds.size >= 2 && (
        <CompareDrawer items={compareItems} onClose={() => setCompareIds(new Set())} />
      )}
    </>
  )
}
