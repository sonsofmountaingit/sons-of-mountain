import { RichText } from '@payloadcms/richtext-lexical/react'
import { AccommodationCarousel } from './AccommodationsCarousel'
import { mediaUrl } from '@/lib/media-url'

interface AccommodationItem {
  locationLabel?: string | null
  name?: string | null
  description?: Record<string, unknown> | null
  learnMoreUrl?: string | null
  gallery?: { image: { url?: string | null; alt?: string } | null; alt?: string }[] | null
}

interface Props {
  accommodations?: AccommodationItem[] | null
}

export function AccommodationsSection({ accommodations }: Props) {
  if (!accommodations?.length) return null

  return (
    <section className="py-16 px-6 bg-gray-50 text-black">
      <div className="max-w-5xl mx-auto">
        <p className="text-xs font-semibold tracking-widest text-black/60 uppercase text-center mb-2" data-animate="fade-up">
          ЗА НАСТАНЯВАНЕТО
        </p>
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          Екзотични убежища в хармония с природата
        </h2>
        <p className="text-center text-black/60 mb-12 max-w-xl mx-auto">
          Открийте дивите красоти, без да жертвате удобството
        </p>

        <div className="space-y-6" data-animate="stagger-children">
          {accommodations.map((acc, i) => {
            const validGallery = (acc.gallery ?? [])
              .filter((g) => mediaUrl(g.image?.url))
              .map((g) => ({ image: { url: mediaUrl(g.image!.url)!, alt: g.image?.alt }, alt: g.alt }))

            return (
              <div key={i} className="bg-white rounded-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
                <AccommodationCarousel gallery={validGallery} name={acc.name ?? ''} />
                <div className="p-8 flex flex-col justify-center">
                  {acc.locationLabel && (
                    <p className="text-xs font-semibold tracking-widest text-black/60 uppercase mb-2">
                      {acc.locationLabel}
                    </p>
                  )}
                  {acc.name && (
                    <h3 className="text-xl font-bold mb-3">{acc.name}</h3>
                  )}
                  {acc.description && (
                    <div className="prose text-black/60 text-sm max-w-none mb-4">
                      <RichText data={acc.description as unknown as Parameters<typeof RichText>[0]["data"]} />
                    </div>
                  )}
                  {acc.learnMoreUrl && (
                    <a
                      href={acc.learnMoreUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm underline underline-offset-2 text-black/60 hover:text-black transition-colors"
                    >
                      научи повече
                    </a>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
