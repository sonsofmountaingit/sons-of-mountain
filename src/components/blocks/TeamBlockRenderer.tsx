import Image from 'next/image'

interface TeamMember {
  name: string
  role?: string | null
  photo?: { url?: string | null; alt: string } | null
  bio?: string | null
}

interface TeamBlockProps {
  block: {
    title?: string | null
    members: TeamMember[]
    bgColor?: string | null
    textColor?: string | null
    paddingTop?: string | null
    paddingBottom?: string | null
  }
}

export function TeamBlockRenderer({ block }: TeamBlockProps) {
  return (
    <section
      className="px-6"
      style={{
        backgroundColor: block.bgColor || undefined,
        color: block.textColor || undefined,
        paddingTop: block.paddingTop ?? '4rem',
        paddingBottom: block.paddingBottom ?? '4rem',
      }}
    >
      <div className="max-w-[1440px] mx-auto">
        {block.title && (
          <h2 className="text-3xl font-bold mb-10">{block.title}</h2>
        )}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {block.members.map((member, i) => (
            <div key={i} className="text-center">
              {member.photo?.url && (
                <div className="relative w-24 h-24 rounded-full overflow-hidden mx-auto mb-4">
                  <Image
                    src={member.photo.url}
                    alt={member.photo.alt}
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
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
          ))}
        </div>
      </div>
    </section>
  )
}
