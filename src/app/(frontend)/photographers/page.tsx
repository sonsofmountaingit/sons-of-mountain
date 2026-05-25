import { getPayload } from 'payload'
import config from '@payload-config'
import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { mediaUrl } from '@/lib/media-url'
import { Suspense } from 'react'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Фотографи',
  description: 'Запознай се с фотографите, създатели на нашите галерии.',
}

async function getPhotographers() {
  try {
    const payload = await getPayload({ config })
    const { docs: users } = await payload.find({
      collection: 'users',
      where: { username: { exists: true } },
      depth: 1,
      limit: 50,
    })
    return users
  } catch {
    return []
  }
}

async function PhotographersContent() {
  const users = await getPhotographers() as any[]

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-24 pb-20 px-6">
      <div className="max-w-[1440px] mx-auto">
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-4">Фотографи</h1>
        <p className="text-white/50 text-lg mb-16 max-w-xl">Запознай се с хората зад обективите.</p>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {users.map((u: any) => {
            const avatarUrl = mediaUrl(u.profileImage?.url)
            return (
              <Link
                key={u.id}
                href={`/photographers/${u.username}`}
                className="group block text-center"
              >
                <div className="relative w-24 h-24 mx-auto rounded-full overflow-hidden mb-4 border-2 border-white/10 group-hover:border-white/30 transition-colors duration-300">
                  {avatarUrl ? (
                    <Image src={avatarUrl} alt={u.name ?? ''} fill className="object-cover" sizes="96px" />
                  ) : (
                    <div className="w-full h-full bg-white/10 flex items-center justify-center text-white/40 text-2xl font-bold">
                      {(u.name ?? u.email ?? '?')[0].toUpperCase()}
                    </div>
                  )}
                </div>
                <p className="text-white font-medium text-sm">{u.name}</p>
                {u.instagramHandle && (
                  <p className="text-white/40 text-xs mt-1">{u.instagramHandle}</p>
                )}
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default function PhotographersPage() {
  return (
    <Suspense>
      <PhotographersContent />
    </Suspense>
  )
}
