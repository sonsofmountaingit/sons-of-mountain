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
    <div className="px-6 pb-12">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold mb-8">{heading || 'Последвай водачите ни'}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {withInstagram.map((guide) => (
            <a
              key={guide.id}
              href={`https://instagram.com/${guide.instagram}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 border border-white/10 rounded-lg p-4 hover:border-white/30 transition-colors"
            >
              {guide.photo?.url && (
                <Image
                  src={guide.photo.url}
                  alt={guide.name}
                  width={40}
                  height={40}
                  className="rounded-full object-cover w-10 h-10"
                />
              )}
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">{guide.name}</p>
                <p className="text-xs text-white/50 truncate">@{guide.instagram}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
