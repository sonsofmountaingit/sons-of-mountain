import Link from 'next/link'
import Image from 'next/image'

interface StoryCardProps {
  title: string
  slug: string
  heroImage: { url?: string | null; alt: string } | null
  author: { name: string; avatar?: { url?: string | null } | null }
  destinationName?: string
}

export function StoryCard({ title, slug, heroImage, author, destinationName }: StoryCardProps) {
  return (
    <Link
      href={`/stories/${slug}`}
      className="group relative flex-shrink-0 w-[280px] aspect-[3/4] rounded-lg overflow-hidden block"
    >
      {heroImage?.url && (
        <Image
          src={heroImage.url}
          alt={heroImage.alt}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="280px"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <h3 className="text-base font-semibold text-white leading-snug mb-3">{title}</h3>
        <div className="flex items-center gap-2">
          {author.avatar?.url && (
            <div className="relative w-7 h-7 rounded-full overflow-hidden flex-shrink-0">
              <Image src={author.avatar.url} alt={author.name} fill className="object-cover" sizes="28px" />
            </div>
          )}
          <div>
            <p className="text-xs text-white/80">{author.name}</p>
            {destinationName && (
              <p className="text-xs text-white/50">за {destinationName}</p>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
