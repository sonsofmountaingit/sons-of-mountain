import Image from 'next/image'
import { RichText } from '@payloadcms/richtext-lexical/react'

interface Props {
  travelTitle?: string | null
  travelDescription?: Record<string, unknown> | null
  travelImage?: string | null
  travelImageAlt?: string
  transportTitle?: string | null
  transportDescription?: Record<string, unknown> | null
  transportImage?: string | null
  transportImageAlt?: string
}

export function TravelTransportSection({
  travelTitle, travelDescription, travelImage, travelImageAlt,
  transportTitle, transportDescription, transportImage, transportImageAlt,
}: Props) {
  const hasTravel = travelTitle || travelDescription || travelImage
  const hasTransport = transportTitle || transportDescription || transportImage
  if (!hasTravel && !hasTransport) return null

  return (
    <section className="py-16 px-6 bg-white text-black space-y-20">
      <div className="max-w-5xl mx-auto">
        {hasTravel && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20" data-animate="fade-up">
            <div>
              <p className="text-xs font-semibold tracking-widest text-black/60 uppercase mb-4">ПЪТУВАНЕТО</p>
              {travelTitle && (
                <h2 className="text-3xl md:text-4xl font-bold leading-tight mb-5">{travelTitle}</h2>
              )}
              {travelDescription && (
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
              {transportDescription && (
                <div className="prose text-black/70 max-w-none">
                  <RichText data={transportDescription as unknown as Parameters<typeof RichText>[0]["data"]} />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
