'use client'

import Image from 'next/image'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { useState, useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface WhyImage {
  url: string
  alt?: string
}

interface WhyVideo {
  videoUrl: string
  thumbnailUrl?: string | null
  thumbnailAlt?: string
  label?: string
}

interface Props {
  name: string
  whyImages?: WhyImage[]
  whyVideos?: WhyVideo[]
  heading?: string | null
  content?: Record<string, unknown> | null
  tripId?: string
  tripTitle?: string
  price?: number
  spotsAvailable?: number | null
  spotsTotal?: number | null
  difficulty?: number | null
  startDate?: string | null
  endDate?: string | null
}

function DifficultyLabel(score: number | null | undefined) {
  if (score == null) return null
  if (score < 35) return 'Лесно'
  if (score < 65) return 'Умерено'
  if (score < 85) return 'Предизвикателно'
  return 'Трудно'
}

function VideoCard({
  video,
  rotate,
  onPlay,
}: {
  video: WhyVideo
  rotate: string
  onPlay: () => void
}) {
  return (
    <button
      onClick={onPlay}
      className={`relative w-52 sm:w-64 aspect-[4/3] rounded-2xl overflow-hidden shadow-xl flex-shrink-0 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black ${rotate}`}
      aria-label={`Пусни видео${video.label ? `: ${video.label}` : ''}`}
    >
      {video.thumbnailUrl ? (
        <Image
          src={video.thumbnailUrl}
          alt={video.thumbnailAlt ?? video.label ?? 'Video thumbnail'}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 208px, 256px"
        />
      ) : (
        <div className="absolute inset-0 bg-gray-200" />
      )}
      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-14 h-14 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
          <svg className="w-5 h-5 text-black translate-x-0.5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      </div>
      {video.label && (
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent px-3 py-2">
          <span className="text-white text-xs font-medium">{video.label}</span>
        </div>
      )}
    </button>
  )
}

function VideoModal({
  video,
  tripTitle,
  price,
  spotsAvailable,
  spotsTotal,
  difficulty,
  startDate,
  endDate,
  onClose,
  onBook,
}: {
  video: WhyVideo
  tripTitle?: string
  price?: number
  spotsAvailable?: number | null
  spotsTotal?: number | null
  difficulty?: number | null
  startDate?: string | null
  endDate?: string | null
  onClose: () => void
  onBook: () => void
}) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  useEffect(() => {
    videoRef.current?.play().catch(() => {})
  }, [])

  const diffLabel = DifficultyLabel(difficulty)
  const dateStr = startDate && endDate
    ? `${new Date(startDate).toLocaleDateString('bg-BG', { day: 'numeric', month: 'short' })} – ${new Date(endDate).toLocaleDateString('bg-BG', { day: 'numeric', month: 'short', year: 'numeric' })}`
    : null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="relative w-full max-w-3xl rounded-2xl overflow-hidden shadow-2xl bg-black">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          aria-label="Затвори"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>

        <div className="relative w-full aspect-video bg-black">
          <video
            ref={videoRef}
            src={video.videoUrl}
            autoPlay
            playsInline
            muted
            loop
            className="w-full h-full object-cover"
            poster={video.thumbnailUrl ?? undefined}
          />

          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent px-5 pt-16 pb-4 pointer-events-none">
            {tripTitle && (
              <p className="text-white font-semibold text-base mb-2">{tripTitle}</p>
            )}
            <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm">
              {price != null && price > 0 && (
                <div className="flex flex-col">
                  <span className="text-white/50 text-[10px] uppercase tracking-widest">Цена</span>
                  <span className="text-white font-semibold">{price.toLocaleString('de-DE')} €</span>
                </div>
              )}
              {spotsAvailable != null && (
                <div className="flex flex-col">
                  <span className="text-white/50 text-[10px] uppercase tracking-widest">Свободни места</span>
                  <span className={`font-semibold ${spotsAvailable <= 3 ? 'text-orange-400' : 'text-white'}`}>
                    {spotsAvailable}{spotsTotal ? ` / ${spotsTotal}` : ''}
                  </span>
                </div>
              )}
              {diffLabel && (
                <div className="flex flex-col">
                  <span className="text-white/50 text-[10px] uppercase tracking-widest">Трудност</span>
                  <span className="text-white font-semibold">{diffLabel}</span>
                </div>
              )}
              {dateStr && (
                <div className="flex flex-col">
                  <span className="text-white/50 text-[10px] uppercase tracking-widest">Дати</span>
                  <span className="text-white font-semibold">{dateStr}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="px-5 py-4 bg-[#0f0f0f]">
          <button
            onClick={onBook}
            className="w-full py-3 rounded-xl bg-white text-black text-sm font-semibold hover:bg-white/90 active:scale-[0.98] transition-all duration-150"
          >
            Резервирай място
          </button>
        </div>
      </div>
    </div>
  )
}

export function WhySection({
  name,
  whyImages = [],
  whyVideos = [],
  heading,
  content,
  tripId,
  tripTitle,
  price,
  spotsAvailable,
  spotsTotal,
  difficulty,
  startDate,
  endDate,
}: Props) {
  const [activeVideo, setActiveVideo] = useState<WhyVideo | null>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const leftCardRef = useRef<HTMLDivElement>(null)
  const rightCardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const ctx = gsap.context(() => {
      if (textRef.current) {
        gsap.from(textRef.current, { opacity: 0, y: 50, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: textRef.current, start: 'top 85%', once: true } })
      }
      if (leftCardRef.current) {
        gsap.from(leftCardRef.current, { opacity: 0, x: -60, rotate: -6, duration: 1, ease: 'power3.out', delay: 0.1, scrollTrigger: { trigger: leftCardRef.current, start: 'top 85%', once: true } })
      }
      if (rightCardRef.current) {
        gsap.from(rightCardRef.current, { opacity: 0, x: 60, rotate: 6, duration: 1, ease: 'power3.out', delay: 0.2, scrollTrigger: { trigger: rightCardRef.current, start: 'top 85%', once: true } })
      }
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  if (!heading && !content && whyImages.length === 0 && whyVideos.length === 0) return null

  const hasVideos = whyVideos.length > 0
  const left = hasVideos ? whyVideos[0] : null
  const right = hasVideos && whyVideos.length > 1 ? whyVideos[1] : null

  function openBooking() {
    setActiveVideo(null)
    window.dispatchEvent(new Event('open-booking-drawer'))
  }

  return (
    <>
      <section ref={sectionRef} className="py-16 sm:py-20 px-4 sm:px-6 bg-white text-black overflow-hidden">
        <div className={`max-w-6xl mx-auto flex flex-col items-center gap-8 sm:gap-10 ${hasVideos ? 'md:flex-row md:justify-between' : 'md:justify-center'}`}>

          {left && (
            <div ref={leftCardRef} className="hidden md:flex justify-end flex-1">
              <VideoCard video={left} rotate="-rotate-3" onPlay={() => setActiveVideo(left)} />
            </div>
          )}

          <div ref={textRef} className="text-center flex-shrink-0 max-w-lg w-full">
            <p className="text-[10px] font-semibold tracking-[0.2em] text-black/35 uppercase mb-3 sm:mb-4">
              ЗАЩО {name.toUpperCase()}?
            </p>
            {heading && (
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight tracking-tight mb-4 sm:mb-5">
                {heading}
              </h2>
            )}
            {content && (
              <div className="prose prose-sm sm:prose-base text-black/55 max-w-none mx-auto">
                <RichText data={content as unknown as Parameters<typeof RichText>[0]['data']} />
              </div>
            )}
            {hasVideos && (
              <div className="md:hidden flex justify-center gap-3 sm:gap-4 mt-6 sm:mt-8 overflow-x-auto pb-2">
                {whyVideos.slice(0, 2).map((v, i) => (
                  <VideoCard
                    key={i}
                    video={v}
                    rotate={i === 0 ? '-rotate-2' : 'rotate-2'}
                    onPlay={() => setActiveVideo(v)}
                  />
                ))}
              </div>
            )}
          </div>

          {right && (
            <div ref={rightCardRef} className="hidden md:flex justify-start flex-1">
              <VideoCard video={right} rotate="rotate-3" onPlay={() => setActiveVideo(right)} />
            </div>
          )}
          {!right && left && (
            <div className="hidden md:flex flex-1" />
          )}
        </div>
      </section>

      {activeVideo && (
        <VideoModal
          video={activeVideo}
          tripTitle={tripTitle}
          price={price}
          spotsAvailable={spotsAvailable}
          spotsTotal={spotsTotal}
          difficulty={difficulty}
          startDate={startDate}
          endDate={endDate}
          onClose={() => setActiveVideo(null)}
          onBook={openBooking}
        />
      )}
    </>
  )
}
