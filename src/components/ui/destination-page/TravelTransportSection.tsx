import Image from 'next/image'
import { RichText } from '@payloadcms/richtext-lexical/react'

interface Props {
  variant?: 'travel' | 'transport' | 'both'
  travelTitle?: string | null
  travelDescription?: Record<string, unknown> | null
  travelImage?: string | null
  travelImageAlt?: string
  transportTitle?: string | null
  transportDescription?: Record<string, unknown> | null
  transportMapLink?: string | null
  transportImage?: string | null
  transportImageAlt?: string
}

function hasRichText(value?: Record<string, unknown> | null) {
  const root = value?.root as { children?: unknown[] } | undefined
  if (!root?.children?.length) return false
  return root.children.some((node) => {
    const n = node as { children?: unknown[]; type?: string }
    return n.type !== 'paragraph' || (n.children?.length ?? 0) > 0
  })
}

export function TravelTransportSection({
  variant = 'both',
  travelTitle, travelDescription, travelImage, travelImageAlt,
  transportTitle, transportDescription, transportMapLink, transportImage, transportImageAlt,
}: Props) {
  const hasTravel = variant !== 'transport' && Boolean(travelTitle || hasRichText(travelDescription) || travelImage)
  const hasTransport = variant !== 'travel' && Boolean(transportTitle || hasRichText(transportDescription) || transportMapLink || transportImage)
  if (!hasTravel && !hasTransport) return null

  return (
    <section className="py-16 px-4 sm:px-6 bg-white text-black space-y-20">
      <div className="max-w-5xl mx-auto">
        {hasTravel && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20" data-animate="fade-up">
            <div>
              <p className="text-xs font-semibold tracking-widest text-black/60 uppercase mb-4">ПЪТУВАНЕТО</p>
              {travelTitle && (
                <h2 className="text-3xl md:text-4xl font-bold leading-tight mb-5">{travelTitle}</h2>
              )}
              {hasRichText(travelDescription) && (
                <div className="prose text-black/70 max-w-none">
                  <RichText data={travelDescription as unknown as Parameters<typeof RichText>[0]["data"]} />
                </div>
              )}
            </div>
            {travelImage && (
              <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
                <Image
                  src={travelImage}
                  alt={travelImageAlt ?? (travelTitle ?? 'Пътуването')}
                  fill
                  loading="lazy"
                  quality={80}
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            )}
          </div>
        )}

        {hasTransport && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center" data-animate="fade-up">
            {transportImage && (
              <div className="relative aspect-[4/3] rounded-lg overflow-hidden order-2 md:order-1">
                <Image
                  src={transportImage}
                  alt={transportImageAlt ?? (transportTitle ?? 'Придвижването')}
                  fill
                  loading="lazy"
                  quality={80}
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            )}
            <div className={transportImage ? 'order-1 md:order-2' : 'md:col-span-2'}>
              <p className="text-xs font-semibold tracking-widest text-black/60 uppercase mb-4 underline underline-offset-4">
                ПРИДВИЖВАНЕТО
              </p>
              {transportTitle && (
                <h2 className="text-3xl md:text-4xl font-bold leading-tight mb-5">{transportTitle}</h2>
              )}
              {hasRichText(transportDescription) && (
                <div className="prose text-black/70 max-w-none">
                  <RichText data={transportDescription as unknown as Parameters<typeof RichText>[0]["data"]} />
                </div>
              )}
              {transportMapLink && (
                <a
                  href={transportMapLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex items-center gap-2 rounded-md bg-black px-5 py-3 text-sm font-semibold text-white hover:bg-black/80 transition-colors"
                >
                  Вижте на Google Maps
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
