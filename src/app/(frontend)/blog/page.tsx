import { getPayload } from 'payload'
import config from '@payload-config'
import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import { mediaUrl } from '@/lib/media-url'
import { unstable_cache } from 'next/cache'
import { Suspense } from 'react'
import { BlogHeroBlock } from '@/components/blocks/blog/BlogHeroBlock'
import { PuckRender } from '@/components/blocks/PuckRender'
import type { Data } from '@puckeditor/core'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = { title: 'Блог' }

const getBlogPage = unstable_cache(
  async () => {
    try {
      const payload = await getPayload({ config })
      return await payload.findGlobal({ slug: 'blog-page', depth: 0, overrideAccess: true })
    } catch { return null }
  },
  ['blog-page-global'],
  { tags: ['blog-page'], revalidate: false },
)

const getPosts = unstable_cache(
  async () => {
    const payload = await getPayload({ config })
    const { docs } = await payload.find({ collection: 'blog-posts', limit: 50, sort: '-createdAt', overrideAccess: true })
    return docs
  },
  ['blog-posts'],
  { tags: ['blog-posts'], revalidate: false },
)

async function BlogContent() {
  let posts: any[] = []
  try { posts = await getPosts() } catch {}

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post) => {
        const heroImage = post.heroImage as { url?: string | null; alt: string } | null
        return (
          <Link key={post.id} href={`/blog/${post.slug}`} className="group block">
            {mediaUrl(heroImage?.url) && (
              <div className="relative aspect-video rounded-lg overflow-hidden mb-4">
                <Image src={mediaUrl(heroImage!.url)!} alt={heroImage!.alt} fill quality={80} className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
              </div>
            )}
            <h2 className="text-xl font-semibold mb-2 group-hover:text-white/80 transition-colors">{post.title}</h2>
            {post.excerpt && <p className="text-sm text-white/50 leading-relaxed">{post.excerpt}</p>}
            {post.readingTime && <p className="text-xs text-white/30 mt-2">{post.readingTime} мин. четене</p>}
          </Link>
        )
      })}
    </div>
  )
}

export default async function BlogPage() {
  const d = (await getBlogPage()) as any
  const puckData = d?.puckData as Data | null | undefined

  if (puckData?.content?.length) {
    return <PuckRender data={puckData} />
  }

  return (
    <div className="min-h-screen pb-20">
      <BlogHeroBlock heading={d?.heading} subheading={d?.subheading} />
      <div className="pt-4 pb-20 px-6">
        <div className="max-w-[1440px] mx-auto">
          <Suspense>
            <BlogContent />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
