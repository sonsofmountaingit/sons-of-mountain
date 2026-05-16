import { getPayload } from 'payload'
import config from '@payload-config'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import type { Metadata } from 'next'
import { cacheTag } from 'next/dist/server/use-cache/cache-tag'
import { cacheLife } from 'next/dist/server/use-cache/cache-life'
import { mediaUrl } from '@/lib/media-url'
import { BookingFormWrapper } from '@/components/forms/BookingFormWrapper'

interface Props { params: Promise<{ slug: string }> }

let _staticParamsCache: Promise<{ slug: string }[]> | null = null
export async function generateStaticParams() {
  if (!_staticParamsCache) {
    _staticParamsCache = (async () => {
      try {
        const payload = await getPayload({ config })
        const { docs } = await payload.find({ collection: 'programs', limit: 200, select: { slug: true } })
        if (docs.length > 0) return docs.map((p) => ({ slug: p.slug ?? String(p.id) }))
      } catch {}
      return [{ slug: '_placeholder' }]
    })()
  }
  return _staticParamsCache
}

async function getProgramData(slug: string) {
  'use cache'
  cacheTag('programs')
  cacheLife('days')
  const payload = await getPayload({ config })
  const { docs } = await payload.find({ collection: 'programs', where: { slug: { equals: slug } }, limit: 1, depth: 1 })
  return docs[0] ?? null
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const program = await getProgramData(slug)
  if (!program) return { title: 'Програма' }
  return { title: program.title, description: program.shortDescription ?? undefined }
}

export default async function ProgramPage({ params }: Props) {
  const { slug } = await params
  const program = await getProgramData(slug)
  if (!program) notFound()

  const heroImage = program.heroImage as { url?: string | null; alt: string } | null
  const instructor = program.instructor as { name?: string; bio?: string; photo?: { url?: string | null; alt?: string } | null } | null
  const gallery = program.gallery as { image: { url?: string | null; alt?: string } | null; alt?: string }[] | null

  return (
    <article>
      <div className="relative h-screen">
        {mediaUrl(heroImage?.url) && (
          <Image
            src={mediaUrl(heroImage!.url)!}
            alt={heroImage!.alt}
            fill
            priority
            quality={90}
            className="object-cover"
            sizes="100vw"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16">
          {program.type && (
            <p className="text-xs font-semibold tracking-widest text-white/50 uppercase mb-3">{program.type}</p>
          )}
          <h1 className="text-5xl md:text-7xl font-bold mb-4">{program.title}</h1>
          {program.location && (
            <p className="text-lg text-white/70">{program.location}</p>
          )}
        </div>
      </div>

      {Array.isArray(gallery) && gallery.length > 0 && (
        <div className="py-10 overflow-hidden">
          <div className="flex gap-3 px-6 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
            {gallery.map((item, i) =>
              mediaUrl(item.image?.url) ? (
                <div key={i} className="relative flex-shrink-0 w-48 aspect-[3/4] rounded-lg overflow-hidden">
                  <Image src={mediaUrl(item.image!.url)!} alt={item.alt ?? item.image?.alt ?? ''} fill quality={80} className="object-cover" sizes="192px" />
                </div>
              ) : null
            )}
          </div>
        </div>
      )}

      <div className="py-16 px-6">
        <div className="max-w-2xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {program.startDate && (
              <div className="border border-white/10 rounded-lg p-4">
                <p className="text-xs text-white/40 mb-1">Начало</p>
                <p className="text-sm font-semibold">{new Date(program.startDate as string).toLocaleDateString('bg-BG')}</p>
              </div>
            )}
            {program.endDate && (
              <div className="border border-white/10 rounded-lg p-4">
                <p className="text-xs text-white/40 mb-1">Край</p>
                <p className="text-sm font-semibold">{new Date(program.endDate as string).toLocaleDateString('bg-BG')}</p>
              </div>
            )}
            {program.price != null && (
              <div className="border border-white/10 rounded-lg p-4">
                <p className="text-xs text-white/40 mb-1">Цена</p>
                <p className="text-sm font-semibold">{program.price} {program.currency ?? 'EUR'}</p>
              </div>
            )}
            {program.spotsAvailable != null && (
              <div className="border border-white/10 rounded-lg p-4">
                <p className="text-xs text-white/40 mb-1">Свободни места</p>
                <p className="text-sm font-semibold">{program.spotsAvailable}</p>
              </div>
            )}
          </div>

          {program.shortDescription && (
            <p className="text-lg text-white/70 leading-relaxed mb-12">{program.shortDescription}</p>
          )}

          {instructor?.name && (
            <div className="flex items-center gap-4 mb-12 p-5 border border-white/10 rounded-lg">
              {mediaUrl(instructor.photo?.url) && (
                <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
                  <Image src={mediaUrl(instructor.photo!.url)!} alt={instructor.name} fill quality={80} className="object-cover" sizes="64px" />
                </div>
              )}
              <div>
                <p className="font-semibold">{instructor.name}</p>
                {instructor.bio && <p className="text-sm text-white/50 mt-1">{instructor.bio}</p>}
              </div>
            </div>
          )}

          {Array.isArray(program.itinerary) && program.itinerary.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-8">Програма</h2>
              <div className="space-y-6">
                {(program.itinerary as { day: number; title: string }[]).map((day) => (
                  <div key={day.day} className="flex gap-6">
                    <div className="flex-shrink-0 w-10 h-10 border border-white/20 rounded-full flex items-center justify-center text-sm font-bold">{day.day}</div>
                    <div className="pt-2">
                      <h3 className="font-semibold">{day.title}</h3>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="border border-white/10 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Запиши се</h2>
            <BookingFormWrapper
              trip={{
                id: String(program.id),
                title: program.title ?? '',
                startDate: program.startDate as string,
                endDate: (program.endDate ?? program.startDate) as string,
                spotsAvailable: (program.spotsAvailable ?? 0) as number,
                spotsTotal: (program.spotsTotal ?? 0) as number,
                price: (program.price ?? 0) as number,
                currency: (program.currency ?? 'EUR') as string,
                status: (program.status as 'active' | 'soldOut' | 'draft') ?? 'active',
                tags: [],
              }}
            />
          </div>
        </div>
      </div>
    </article>
  )
}
