import { getPayload } from 'payload'
import config from '@payload-config'
import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Блог' }

export default async function BlogPage() {
  const payload = await getPayload({ config })

  const { docs: posts } = await payload.find({
    collection: 'blog-posts',
    limit: 50,
    sort: '-createdAt',
  })

  return (
    <div className="pt-24 pb-20 px-6 min-h-screen">
      <div className="max-w-[1440px] mx-auto">
        <h1 className="text-5xl md:text-6xl font-bold mb-4">Блог</h1>
        <p className="text-white/50 mb-12 text-lg">Статии, съвети и вдъхновение за пътуване</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => {
            const heroImage = post.heroImage as { url?: string | null; alt: string } | null
            return (
              <Link key={post.id} href={`/blog/${post.slug}`} className="group block">
                {heroImage?.url && (
                  <div className="relative aspect-video rounded-lg overflow-hidden mb-4">
                    <Image
                      src={heroImage.url}
                      alt={heroImage.alt}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                )}
                <h2 className="text-xl font-semibold mb-2 group-hover:text-white/80 transition-colors">{post.title}</h2>
                {post.excerpt && <p className="text-sm text-white/50 leading-relaxed">{post.excerpt}</p>}
                {post.readingTime && (
                  <p className="text-xs text-white/30 mt-2">{post.readingTime} мин. четене</p>
                )}
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
