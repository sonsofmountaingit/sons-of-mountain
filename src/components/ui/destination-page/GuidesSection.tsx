import Image from 'next/image'
import { mediaUrl } from '@/lib/media-url'

type Guide = {
  id: string
  name: string
  photo?: { url?: string | null; alt?: string } | null
  bio?: string | null
  instagram?: string | null
  specializations?: { item: string }[] | null
  yearsExperience?: number | null
}

type Props = {
  guides: Guide[]
}

export default function GuidesSection({ guides }: Props) {
  if (!guides?.length) return null

  const eyebrow = guides.length === 1 ? 'ВАШИЯТ ВОДАЧ' : 'ВАШИТЕ ВОДАЧИ'
  const heading = guides.length === 1 ? 'Кой ще ви води?' : 'Кои ще са вашите водачи?'

  return (
    <section className="py-20 px-4 sm:px-6 bg-white text-black">
      <div className="max-w-5xl mx-auto">
        <p className="text-xs font-semibold tracking-widest text-black/60 uppercase mb-3" data-animate="fade-up">
          {eyebrow}
        </p>
        <h2 className="text-3xl font-bold mb-14" data-animate="fade-up">
          {heading}
        </h2>

        <div className="space-y-20" data-animate="stagger-children">
          {guides.map((guide, idx) => {
            const photoUrl = mediaUrl(guide.photo?.url)
            return (
              <div key={guide.id} className={`grid grid-cols-1 md:grid-cols-[280px_1fr] gap-10 md:gap-16 items-start ${idx > 0 ? 'pt-16 border-t border-black/10' : ''}`}>
                <div className="relative aspect-[4/3] md:aspect-[3/4] rounded-2xl overflow-hidden bg-gray-100">
                  {photoUrl ? (
                    <Image
                      src={photoUrl}
                      alt={guide.photo?.alt ?? guide.name}
                      fill
                      className="object-cover"
                      sizes="280px"
                      quality={80}
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gray-200" />
                  )}
                </div>

                <div className="py-2">
                  {guide.specializations?.length ? (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {guide.specializations.map((s, i) => (
                        <span key={i} className="text-[10px] font-semibold tracking-widest uppercase px-3 py-1 border border-black/20 rounded-full text-black/60">
                          {s.item}
                        </span>
                      ))}
                    </div>
                  ) : null}

                  <h3 className="text-3xl font-bold mb-4 leading-tight">{guide.name}</h3>

                  {guide.bio && (
                    <div className="space-y-3 mb-6">
                      {guide.bio.split('\n\n').map((para, i) => (
                        <p key={i} className="text-sm text-black/65 leading-relaxed">{para}</p>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center gap-6 flex-wrap">
                    {guide.yearsExperience ? (
                      <span className="text-xs font-semibold text-black/50 uppercase tracking-wide">
                        {guide.yearsExperience}+ години опит
                      </span>
                    ) : null}
                    {guide.instagram && (
                      <a
                        href={`https://instagram.com/${guide.instagram}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-black/60 hover:text-black transition-colors"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="flex-shrink-0">
                          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                          <circle cx="12" cy="12" r="4" />
                          <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
                        </svg>
                        {guide.instagram}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
