'use client'

import Image from 'next/image'
import { BlockWrapper, type BlockStyleProps } from '@/puck/BlockWrapper'

interface TeamMember {
  name: string
  role?: string | null
  photo?: { url?: string | null; alt: string } | null
  photoUrl?: string | null
  bio?: string | null
}

interface TeamBlockProps {
  block: BlockStyleProps & {
    title?: string | null
    members: TeamMember[]
    columns?: string | null
  }
}

export function TeamBlockRenderer({ block }: TeamBlockProps) {
  const colClass: Record<string, string> = {
    '2': 'grid-cols-2',
    '3': 'grid-cols-2 md:grid-cols-3',
    '4': 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
    '5': 'grid-cols-2 md:grid-cols-3 lg:grid-cols-5',
  }
  const gridClass = colClass[block.columns ?? '4'] ?? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'

  return (
    <BlockWrapper props={block} innerClassName="max-w-[1440px] mx-auto">
      {block.title && (
        <h2 className="text-3xl font-bold mb-10">{block.title}</h2>
      )}
      <div className={`grid ${gridClass} gap-8`}>
        {block.members.map((member, i) => {
          const photoSrc = member.photo?.url || member.photoUrl || null
          return (
            <div key={i} className="text-center">
              {photoSrc ? (
                <div className="relative w-24 h-24 rounded-full overflow-hidden mx-auto mb-4">
                  <Image
                    src={photoSrc}
                    alt={member.photo?.alt ?? member.name}
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                </div>
              ) : (
                <div className="w-24 h-24 rounded-full bg-white/10 mx-auto mb-4 flex items-center justify-center text-white/30 text-2xl">
                  {member.name?.[0] ?? '?'}
                </div>
              )}
              <p className="font-semibold">{member.name}</p>
              {member.role && (
                <p className="text-sm opacity-50 mt-1">{member.role}</p>
              )}
              {member.bio && (
                <p className="text-xs opacity-40 mt-2 leading-relaxed">{member.bio}</p>
              )}
            </div>
          )
        })}
      </div>
    </BlockWrapper>
  )
}
