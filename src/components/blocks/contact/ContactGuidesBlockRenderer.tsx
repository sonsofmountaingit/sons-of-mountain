import Image from 'next/image'

type Guide = {
  id: string
  name: string
  instagram?: string | null
  photo?: { url?: string | null } | null
}

export function ContactGuidesBlockRenderer({ heading, guides }: { heading?: string | null; guides: Guide[] }) {
  const withInstagram = guides.filter((g) => g.instagram)
  if (!withInstagram.length) return null

  return (
    <div className="px-4 pb-8 sm:px-6 sm:pb-12">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-xl sm:text-3xl font-bold mb-4 sm:mb-8">{heading || 'Follow our guides'}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
          {withInstagram.map((guide) => (
            <a
              key={guide.id}
              href={`https://instagram.com/${guide.instagram}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 sm:gap-3 border border-white/10 rounded-lg p-3 sm:p-4 min-h-16 sm:min-h-auto hover:border-white/30 transition-colors"
            >
              {guide.photo?.url && (
                <Image
                  src={guide.photo.url}
                  alt={guide.name}
                  width={40}
                  height={40}
                  className="rounded-full object-cover w-10 h-10 flex-shrink-0"
                />
              )}
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-medium truncate">{guide.name}</p>
                <p className="text-xs text-white/50 truncate">@{guide.instagram}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
