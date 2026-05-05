import type { Data } from '@puckeditor/core'
import { getPayload } from 'payload'
import config from '@payload-config'
import { HeroBlockRenderer } from './HeroBlockRenderer'
import { TextBlockRenderer } from './TextBlockRenderer'
import { CTABlockRenderer } from './CTABlockRenderer'
import { QuoteBlockRenderer } from './QuoteBlockRenderer'
import { VideoBlockRenderer } from './VideoBlockRenderer'
import { FAQBlockRenderer } from './FAQBlockRenderer'
import { StoriesBlockRenderer } from './StoriesBlockRenderer'
import { DestinationCarouselRenderer } from './DestinationCarouselRenderer'
import { ImageGalleryRenderer } from './ImageGalleryRenderer'
import { TeamBlockRenderer } from './TeamBlockRenderer'
import { MediaLogosRenderer } from './MediaLogosRenderer'
import { RichTextBlockRenderer } from './RichTextBlockRenderer'
import { PricingBlockRenderer } from './PricingBlockRenderer'
import { CounterBlockRenderer } from './CounterBlockRenderer'
import { TimelineBlockRenderer } from './TimelineBlockRenderer'
import { MapBlockRenderer } from './MapBlockRenderer'
import { NewsletterBlockRenderer } from './NewsletterBlockRenderer'
import { ContactFormBlockRenderer } from './ContactFormBlockRenderer'
import { TabbedContentBlockRenderer } from './TabbedContentBlockRenderer'
import { AccordionBlockRenderer } from './AccordionBlockRenderer'
import { BannerBlockRenderer } from './BannerBlockRenderer'
import { SeparatorBlockRenderer } from './SeparatorBlockRenderer'
import { IconGridBlockRenderer } from './IconGridBlockRenderer'
import { FeatureCardsBlockRenderer } from './FeatureCardsBlockRenderer'
import { BeforeAfterBlockRenderer } from './BeforeAfterBlockRenderer'
import { EmbedBlockRenderer } from './EmbedBlockRenderer'
import { TestimonialsGridBlockRenderer } from './TestimonialsGridBlockRenderer'
import { GalleryLightboxBlockRenderer } from './GalleryLightboxBlockRenderer'
import { BookingWidgetBlockRenderer } from './BookingWidgetBlockRenderer'
import { BlogPostsBlockRenderer } from './BlogPostsBlockRenderer'
import { SocialFeedBlockRenderer } from './SocialFeedBlockRenderer'

type PuckItem = Data['content'][number]

function sp(p: Record<string, unknown>) {
  return {
    bgColor: (p.bgColor as string) || undefined,
    bgGradientFrom: (p.bgGradientFrom as string) || undefined,
    bgGradientTo: (p.bgGradientTo as string) || undefined,
    bgGradientDir: (p.bgGradientDir as string) || undefined,
    bgImage: (p.bgImage as string) || undefined,
    bgImagePosition: (p.bgImagePosition as string) || undefined,
    bgImageOverlayColor: (p.bgImageOverlayColor as string) || undefined,
    bgImageOverlayOpacity: (p.bgImageOverlayOpacity as string) || undefined,
    textColor: (p.textColor as string) || undefined,
    textAlign: (p.textAlign as string) || undefined,
    paddingTop: (p.paddingTop as string) || undefined,
    paddingBottom: (p.paddingBottom as string) || undefined,
    paddingX: (p.paddingX as string) || undefined,
    contentMaxWidth: (p.contentMaxWidth as string) || undefined,
    borderRadius: (p.borderRadius as string) || undefined,
    borderWidth: (p.borderWidth as string) || undefined,
    borderColor: (p.borderColor as string) || undefined,
    boxShadow: (p.boxShadow as string) || undefined,
    hideOnMobile: (p.hideOnMobile as string) || undefined,
    hideOnTablet: (p.hideOnTablet as string) || undefined,
    hideOnDesktop: (p.hideOnDesktop as string) || undefined,
    animation: (p.animation as string) || undefined,
    animationDelay: (p.animationDelay as string) || undefined,
    fontSize: (p.fontSize as string) || undefined,
    fontWeight: (p.fontWeight as string) || undefined,
    letterSpacing: (p.letterSpacing as string) || undefined,
    lineHeight: (p.lineHeight as string) || undefined,
  }
}

async function renderSlotContent(zones: Data['zones'], zoneKey: string): Promise<React.ReactNode> {
  const items = zones?.[zoneKey] ?? []
  const rendered = await Promise.all(items.map((item, i) => renderBlock(item, i)))
  return <>{rendered}</>
}

async function renderBlock(item: PuckItem, index: number): Promise<React.ReactNode> {
  const p = item.props as Record<string, unknown>

  switch (item.type) {
    case 'Section': {
      const bgColor = (p.bgColor as string) || undefined
      const textColor = (p.textColor as string) || undefined
      const paddingTop = (p.paddingTop as string) || '4rem'
      const paddingBottom = (p.paddingBottom as string) || '4rem'
      const maxWidth = (p.maxWidth as string) || '1440px'
      const slotKey = `${(item as { props: Record<string, unknown> } & { id?: string }).id ?? index}:content`
      return (
        <section key={index} style={{ backgroundColor: bgColor, color: textColor, paddingTop, paddingBottom }}>
          <div style={{ maxWidth, margin: '0 auto', paddingLeft: 24, paddingRight: 24 }}>
            {await renderSlotContent((item as Record<string, unknown>)['zones'] as Data['zones'], slotKey)}
          </div>
        </section>
      )
    }

    case 'HeroBlock':
      return (
        <HeroBlockRenderer key={index} block={{
          headline: (p.headline as string) ?? '',
          subheadline: (p.subheadline as string) || null,
          ctaText: (p.ctaText as string) || null,
          ctaLink: (p.ctaLink as string) || null,
          backgroundImage: (p.backgroundImage as string) ? { url: p.backgroundImage as string, alt: (p.headline as string) ?? '' } : null,
          bgColor: (p.bgColor as string) || null,
          textColor: (p.textColor as string) || null,
          variant: (p.variant as string) || null,
        }} />
      )

    case 'TextBlock':
      return (
        <TextBlockRenderer key={index} block={{
          heading: (p.heading as string) || null,
          content: (p.content as string) || null,
          alignment: (p.alignment as string) || null,
          variant: (p.variant as string) || null,
          bgColor: (p.bgColor as string) || null,
          textColor: (p.textColor as string) || null,
          padding: (p.padding as string) || null,
          ctaText: (p.ctaText as string) || null,
          ctaLink: (p.ctaLink as string) || null,
        }} />
      )

    case 'RichTextBlock':
      return (
        <RichTextBlockRenderer key={index} block={{
          content: p.content
            ? { root: { type: 'root', children: (p.content as string).split('\n').map((line) => ({ type: 'paragraph', version: 1, children: [{ type: 'text', text: line, version: 1 }] })), direction: 'ltr' as const, format: '' as const, indent: 0, version: 1 } }
            : null,
          variant: (p.variant as string) || null,
          bgColor: (p.bgColor as string) || null,
          textColor: (p.textColor as string) || null,
        }} />
      )

    case 'CTABlock':
      return (
        <CTABlockRenderer key={index} block={{
          headline: (p.headline as string) ?? '',
          body: (p.body as string) || null,
          buttonText: (p.buttonText as string) || null,
          buttonLink: (p.buttonLink as string) || null,
          bgColor: (p.bgColor as string) || null,
          textColor: (p.textColor as string) || null,
          variant: (p.variant as string) || null,
        }} />
      )

    case 'QuoteBlock':
      return (
        <QuoteBlockRenderer key={index} block={{
          quote: (p.quote as string) ?? '',
          author: (p.author as string) || null,
          role: (p.role as string) || null,
          ...sp(p),
        }} />
      )

    case 'FAQBlock': {
      const items = ((p.items as { question: string; answer: unknown }[]) ?? []).map((item) => ({
        question: item.question,
        answer: item.answer && typeof item.answer === 'object'
          ? item.answer
          : { root: { type: 'root', children: [{ type: 'paragraph', version: 1, children: [{ type: 'text', text: String(item.answer ?? ''), version: 1 }] }], direction: 'ltr' as const, format: '' as const, indent: 0, version: 1 } },
      }))
      return <FAQBlockRenderer key={index} block={{ title: (p.title as string) || null, items, ...sp(p) }} />
    }

    case 'ImageGalleryBlock': {
      const imgs = ((p.images as { url: string; alt: string; caption?: string }[]) ?? []).map((img) => ({ image: img.url ? { url: img.url, alt: img.alt } : null, caption: img.caption || null }))
      return <ImageGalleryRenderer key={index} block={{ title: (p.title as string) || null, images: imgs, layout: (p.layout as string) || null, ...sp(p) }} />
    }

    case 'VideoBlock':
      return (
        <VideoBlockRenderer key={index} block={{
          url: (p.url as string) ?? '',
          poster: (p.posterImage as string) ? { url: p.posterImage as string, alt: 'poster' } : null,
          caption: (p.caption as string) || null,
          autoPlay: Boolean(p.autoPlay),
          muted: Boolean(p.muted),
          ...sp(p),
        }} />
      )

    case 'TeamBlock': {
      const members = ((p.members as { name: string; role?: string; bio?: string; photoUrl?: string }[]) ?? []).map((m) => ({ name: m.name, role: m.role || null, bio: m.bio || null, photo: m.photoUrl ? { url: m.photoUrl, alt: m.name } : null }))
      return <TeamBlockRenderer key={index} block={{ title: (p.title as string) || null, members, ...sp(p) }} />
    }

    case 'MediaLogosBlock': {
      const logos = ((p.logos as { name: string; url?: string }[]) ?? []).map((l) => ({ name: l.name, image: null, url: l.url || null }))
      return <MediaLogosRenderer key={index} block={{ title: (p.title as string) || null, logos, ...sp(p) }} />
    }

    case 'StoriesBlock': {
      const payload = await getPayload({ config })
      const limit = (p.limit as number) ?? 6
      const { docs: stories } = await payload.find({ collection: 'stories', limit, sort: '-createdAt', depth: 1 })
      return <StoriesBlockRenderer key={index} block={{ title: (p.title as string) || null, stories: stories as Parameters<typeof StoriesBlockRenderer>[0]['block']['stories'], ...sp(p) }} />
    }

    case 'DestinationCarouselBlock': {
      const payload = await getPayload({ config })
      const limit = (p.limit as number) ?? 20
      const { docs: destinations } = await payload.find({ collection: 'destinations', limit, sort: 'name', depth: 1 })
      return <DestinationCarouselRenderer key={index} block={{ title: (p.title as string) || null, destinations: destinations as Parameters<typeof DestinationCarouselRenderer>[0]['block']['destinations'], ...sp(p) }} />
    }

    // ── NEW BLOCKS ────────────────────────────────────────────────────────────

    case 'PricingBlock': {
      const tiers = ((p.tiers as { name: string; price: string; period?: string; description?: string; features?: string; highlighted?: string; ctaText?: string; ctaLink?: string }[]) ?? []).map((t) => ({
        name: t.name, price: t.price, period: t.period || null, description: t.description || null,
        features: (t.features || '').split('\n').filter(Boolean),
        highlighted: t.highlighted === 'true',
        ctaText: t.ctaText || null, ctaLink: t.ctaLink || null,
      }))
      return <PricingBlockRenderer key={index} block={{ title: (p.title as string) || null, tiers, ...sp(p) }} />
    }

    case 'CounterBlock': {
      const stats = ((p.stats as { number: string; suffix?: string; label: string; description?: string }[]) ?? []).map((s) => ({ number: s.number, suffix: s.suffix || null, label: s.label, description: s.description || null }))
      return <CounterBlockRenderer key={index} block={{ title: (p.title as string) || null, stats, ...sp(p) }} />
    }

    case 'TimelineBlock': {
      const events = ((p.events as { year: string; title: string; description?: string; imageUrl?: string }[]) ?? []).map((e) => ({ year: e.year, title: e.title, description: e.description || null, imageUrl: e.imageUrl || null }))
      return <TimelineBlockRenderer key={index} block={{ title: (p.title as string) || null, events, ...sp(p) }} />
    }

    case 'MapBlock':
      return <MapBlockRenderer key={index} block={{ embedUrl: (p.embedUrl as string) || '', height: (p.height as string) || null, title: (p.title as string) || null, caption: (p.caption as string) || null, ...sp(p) }} />

    case 'NewsletterBlock':
      return <NewsletterBlockRenderer key={index} block={{ heading: (p.heading as string) || null, subheading: (p.subheading as string) || null, placeholder: (p.placeholder as string) || null, buttonText: (p.buttonText as string) || null, formAction: (p.formAction as string) || null, successMessage: (p.successMessage as string) || null, ...sp(p) }} />

    case 'ContactFormBlock':
      return <ContactFormBlockRenderer key={index} block={{ heading: (p.heading as string) || null, subheading: (p.subheading as string) || null, showPhone: (p.showPhone as string) || null, showSubject: (p.showSubject as string) || null, buttonText: (p.buttonText as string) || null, formAction: (p.formAction as string) || null, successMessage: (p.successMessage as string) || null, ...sp(p) }} />

    case 'TabbedContentBlock': {
      const tabs = ((p.tabs as { label: string; content: string }[]) ?? [])
      return <TabbedContentBlockRenderer key={index} block={{ title: (p.title as string) || null, tabs, ...sp(p) }} />
    }

    case 'AccordionBlock': {
      const items = ((p.items as { title: string; content: string }[]) ?? [])
      return <AccordionBlockRenderer key={index} block={{ heading: (p.heading as string) || null, items, ...sp(p) }} />
    }

    case 'BannerBlock':
      return <BannerBlockRenderer key={index} block={{ text: (p.text as string) || '', linkText: (p.linkText as string) || null, linkUrl: (p.linkUrl as string) || null, closeable: (p.closeable as string) || null, ...sp(p) }} />

    case 'SeparatorBlock':
      return <SeparatorBlockRenderer key={index} block={{ label: (p.label as string) || null, style: (p.style as string) || null, ...sp(p) }} />

    case 'IconGridBlock': {
      const items = ((p.items as { icon: string; heading: string; description?: string; link?: string }[]) ?? []).map((i) => ({ icon: i.icon, heading: i.heading, description: i.description || null, link: i.link || null }))
      return <IconGridBlockRenderer key={index} block={{ title: (p.title as string) || null, items, columns: (p.columns as string) || null, ...sp(p) }} />
    }

    case 'FeatureCardsBlock': {
      const cards = ((p.cards as { imageUrl?: string; heading: string; text?: string; ctaText?: string; ctaLink?: string }[]) ?? []).map((c) => ({ imageUrl: c.imageUrl || null, heading: c.heading, text: c.text || null, ctaText: c.ctaText || null, ctaLink: c.ctaLink || null }))
      return <FeatureCardsBlockRenderer key={index} block={{ title: (p.title as string) || null, cards, columns: (p.columns as string) || null, ...sp(p) }} />
    }

    case 'BeforeAfterBlock':
      return <BeforeAfterBlockRenderer key={index} block={{ beforeImageUrl: (p.beforeImageUrl as string) || '', afterImageUrl: (p.afterImageUrl as string) || '', beforeLabel: (p.beforeLabel as string) || null, afterLabel: (p.afterLabel as string) || null, title: (p.title as string) || null, caption: (p.caption as string) || null, ...sp(p) }} />

    case 'EmbedBlock':
      return <EmbedBlockRenderer key={index} block={{ embedUrl: (p.embedUrl as string) || null, height: (p.height as string) || null, title: (p.title as string) || null, allowFullscreen: (p.allowFullscreen as string) || null, ...sp(p) }} />

    case 'TestimonialsGridBlock': {
      const testimonials = ((p.testimonials as { quote: string; author: string; role?: string; avatarUrl?: string; rating?: string }[]) ?? []).map((t) => ({ quote: t.quote, author: t.author, role: t.role || null, avatarUrl: t.avatarUrl || null, rating: t.rating || null }))
      return <TestimonialsGridBlockRenderer key={index} block={{ title: (p.title as string) || null, testimonials, columns: (p.columns as string) || null, ...sp(p) }} />
    }

    case 'GalleryLightboxBlock': {
      const images = ((p.images as { url: string; alt: string; caption?: string }[]) ?? []).filter((i) => i.url).map((i) => ({ url: i.url, alt: i.alt, caption: i.caption || null }))
      return <GalleryLightboxBlockRenderer key={index} block={{ title: (p.title as string) || null, images, columns: (p.columns as string) || null, ...sp(p) }} />
    }

    case 'BookingWidgetBlock':
      return <BookingWidgetBlockRenderer key={index} block={{ heading: (p.heading as string) || null, subheading: (p.subheading as string) || null, embedUrl: (p.embedUrl as string) || null, height: (p.height as string) || null, ...sp(p) }} />

    case 'BlogPostsBlock': {
      const payload = await getPayload({ config })
      const limit = (p.limit as number) ?? 6
      const { docs: posts } = await payload.find({ collection: 'stories', limit, sort: '-createdAt', depth: 1 })
      return <BlogPostsBlockRenderer key={index} block={{ title: (p.title as string) || null, layout: (p.layout as string) || null, ctaText: (p.ctaText as string) || null, ctaLink: (p.ctaLink as string) || null, posts: posts as Parameters<typeof BlogPostsBlockRenderer>[0]['block']['posts'], ...sp(p) }} />
    }

    case 'SocialFeedBlock': {
      const posts = ((p.posts as { platform: string; handle: string; content: string; imageUrl?: string; likes?: string; url?: string; date?: string }[]) ?? []).map((post) => ({ platform: post.platform, handle: post.handle, content: post.content, imageUrl: post.imageUrl || null, likes: post.likes || null, url: post.url || null, date: post.date || null }))
      return <SocialFeedBlockRenderer key={index} block={{ title: (p.title as string) || null, posts, columns: (p.columns as string) || null, ...sp(p) }} />
    }

    default:
      return null
  }
}

export async function PuckPageRenderer({ data }: { data: Data }) {
  if (!data.content || data.content.length === 0) return null
  const rendered = await Promise.all(data.content.map((item, i) => renderBlock(item, i)))
  return <>{rendered}</>
}
