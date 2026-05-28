import { getPayload } from 'payload'
import config from '@payload-config'
import type { Metadata } from 'next'
import { unstable_cache } from 'next/cache'
import { Suspense } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { mediaUrl } from '@/lib/media-url'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = { title: 'Индивидуални програми — Sons of Mountains' }

const PROGRAM_TYPE_LABELS: Record<string, string> = {
  Yoga: 'Йога',
  Ski: 'Ски',
  Photography: 'Фотография',
  Sailing: 'Ветроходство',
  Hiking: 'Туризъм',
  Cultural: 'Културно',
  Wellness: 'Уелнес',
  Adventure: 'Приключение',
  Other: 'Друго',
}

const getPrograms = unstable_cache(
  async () => {
    const payload = await getPayload({ config })
    const { docs } = await payload.find({
      collection: 'programs',
      limit: 100,
      sort: 'title',
      overrideAccess: true,
    })
    return docs
  },
  ['programs-list'],
  { tags: ['programs'], revalidate: 3600 },
)

function ProgramCard({ program }: { program: Record<string, unknown> }) {
  const heroImage = program.heroImage as { url?: string | null; alt?: string } | null
  const imageUrl = mediaUrl(heroImage?.url)
  const slug = program.slug as string | null
  const href = slug ? `/programs/${slug}` : `/programs/${program.id}`
  const type = program.type as string | null
  const price = program.price as number | null
  const currency = (program.currency ?? 'EUR') as string
  const spotsAvailable = program.spotsAvailable as number | null
  const status = program.status as string | null
  const startDate = program.startDate as string | null

  return (
    <Link href={href} className="group block bg-white/5 hover:bg-white/10 transition-colors rounded-2xl overflow-hidden">
      <div className="relative aspect-[4/3] overflow-hidden">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={heroImage?.alt ?? program.title as string}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full bg-white/10" />
        )}
        {status === 'soldOut' && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="text-white font-bold text-lg tracking-widest">РАЗПРОДАДЕНО</span>
          </div>
        )}
        {type && (
          <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-white text-xs font-semibold px-2 py-1 rounded">
            {PROGRAM_TYPE_LABELS[type] ?? type}
          </div>
        )}
        {spotsAvailable !== null && spotsAvailable <= 5 && status === 'active' && (
          <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            {spotsAvailable} места
          </div>
        )}
      </div>
      <div className="p-5">
        <h3 className="text-white font-bold text-lg leading-tight mb-2">{program.title as string}</h3>
        {typeof program.shortDescription === 'string' && (
          <p className="text-white/50 text-sm leading-relaxed mb-3 line-clamp-2">
            {program.shortDescription}
          </p>
        )}
        {startDate && (
          <p className="text-white/40 text-xs mb-3">
            {new Date(startDate).toLocaleDateString('bg-BG', { month: 'long', year: 'numeric' })}
          </p>
        )}
        {typeof program.location === 'string' && (
          <p className="text-white/40 text-xs mb-3">{program.location}</p>
        )}
        {price !== null && (
          <p className="text-white font-bold text-xl">{price} {currency}</p>
        )}
      </div>
    </Link>
  )
}

async function ProgramsContent() {
  let programs: Record<string, unknown>[] = []
  try {
    programs = (await getPrograms()) as unknown as Record<string, unknown>[]
  } catch {}

  return (
    <>
      {programs.length === 0 && (
        <p className="text-white/30 text-center py-20">Скоро ще добавим програми.</p>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {programs.map((program) => (
          <ProgramCard key={program.id as string} program={program} />
        ))}
      </div>
    </>
  )
}

export default function ProgramsPage() {
  return (
    <div className="pt-24 pb-20 px-6 min-h-screen">
      <div className="max-w-[1440px] mx-auto">
        <h1 className="text-5xl md:text-6xl font-bold mb-4">Индивидуални програми</h1>
        <p className="text-white/50 mb-12 text-lg">
          Изцяло персонализирани пътувания — ние организираме всичко за теб
        </p>
        <Suspense fallback={null}>
          <ProgramsContent />
        </Suspense>
      </div>
    </div>
  )
}
