import Image from 'next/image'
import { mediaUrl } from '@/lib/media-url'

interface CommunityPhoto {
  photo?: { url?: string | null; alt?: string } | null
}

interface Props {
  durationDays?: number | null
  maxParticipants?: number | null
  price: number
  currency: string
  priceIncludes?: string | null
  communityPhotos?: CommunityPhoto[] | null
}

function formatPrice(price: number, currency: string) {
  const sym = currency === 'EUR' ? '€' : currency === 'USD' ? '$' : 'лв.'
  return `${sym}${price.toLocaleString('bg-BG')}`
}

export function AdventureCtaSection({ durationDays, maxParticipants, price, currency, priceIncludes, communityPhotos }: Props) {
  const photos = (communityPhotos ?? []).filter((p) => mediaUrl(p.photo?.url))

  return (
    <section className="py-20 px-4 sm:px-6 bg-white text-black text-center">
      <div className="max-w-2xl mx-auto" data-animate="scale-in">
        <h2 className="text-4xl md:text-5xl font-black uppercase mb-6">Хвърли се в приключение!</h2>

        {(durationDays || maxParticipants) && (
          <div className="flex justify-center gap-8 text-black/60 mb-12">
            {durationDays && (
              <span className="flex items-center gap-2 text-sm">
                <span aria-hidden="true">🧳</span> {durationDays} дни
              </span>
            )}
            {maxParticipants && (
              <span className="flex items-center gap-2 text-sm">
                <span aria-hidden="true">👥</span> {maxParticipants} пътешественика
              </span>
            )}
          </div>
        )}

        <div className="mb-12">
          <p className="text-xs font-semibold tracking-widest text-black/60 uppercase mb-2">ЦЕНА НА ЧОВЕК</p>
          <p className="text-5xl md:text-6xl font-black mb-3">{formatPrice(price, currency)}</p>
          {priceIncludes && (
            <p className="text-sm text-black/60 max-w-xs mx-auto leading-relaxed">{priceIncludes}</p>
          )}
        </div>

        {photos.length > 0 && (
          <div>
            <p className="font-bold mb-1">Стани част от нашата общност</p>
            <p className="text-sm text-black/60 mb-6">Над {Math.floor(photos.length / 10) * 10 + 10} човека вече пътуваха с нас</p>
            <div className="flex flex-wrap justify-center gap-2">
              {photos.map((p, i) => (
                <div key={i} className="relative w-10 h-10 rounded-full overflow-hidden ring-2 ring-white flex-shrink-0">
                  <Image
                    src={mediaUrl(p.photo!.url)!}
                    alt={p.photo?.alt ?? `Пътешественик ${i + 1}`}
                    fill
                    loading="lazy"
                    quality={60}
                    className="object-cover"
                    sizes="40px"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
