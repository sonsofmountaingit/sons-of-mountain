'use client'

import type { Config } from '@puckeditor/core'
import { Slot } from '@puckeditor/core'

import { HeroBlockRenderer } from '@/components/blocks/HeroBlockRenderer'
import { TextBlockRenderer } from '@/components/blocks/TextBlockRenderer'
import { CTABlockRenderer } from '@/components/blocks/CTABlockRenderer'
import { RichTextBlockRenderer } from '@/components/blocks/RichTextBlockRenderer'
import { QuoteBlockRenderer } from '@/components/blocks/QuoteBlockRenderer'
import { VideoBlockRenderer } from '@/components/blocks/VideoBlockRenderer'
import { StoriesBlockRenderer } from '@/components/blocks/StoriesBlockRenderer'
import { DestinationCarouselRenderer } from '@/components/blocks/DestinationCarouselRenderer'
import { PricingBlockRenderer } from '@/components/blocks/PricingBlockRenderer'
import { CounterBlockRenderer } from '@/components/blocks/CounterBlockRenderer'
import { TimelineBlockRenderer } from '@/components/blocks/TimelineBlockRenderer'
import { MapBlockRenderer } from '@/components/blocks/MapBlockRenderer'
import { NewsletterBlockRenderer } from '@/components/blocks/NewsletterBlockRenderer'
import { ContactFormBlockRenderer } from '@/components/blocks/ContactFormBlockRenderer'
import { TabbedContentBlockRenderer } from '@/components/blocks/TabbedContentBlockRenderer'
import { AccordionBlockRenderer } from '@/components/blocks/AccordionBlockRenderer'
import { BannerBlockRenderer } from '@/components/blocks/BannerBlockRenderer'
import { SeparatorBlockRenderer } from '@/components/blocks/SeparatorBlockRenderer'
import { IconGridBlockRenderer } from '@/components/blocks/IconGridBlockRenderer'
import { FeatureCardsBlockRenderer } from '@/components/blocks/FeatureCardsBlockRenderer'
import { BeforeAfterBlockRenderer } from '@/components/blocks/BeforeAfterBlockRenderer'
import { EmbedBlockRenderer } from '@/components/blocks/EmbedBlockRenderer'
import { TestimonialsGridBlockRenderer } from '@/components/blocks/TestimonialsGridBlockRenderer'
import { GalleryLightboxBlockRenderer } from '@/components/blocks/GalleryLightboxBlockRenderer'
import { BookingWidgetBlockRenderer } from '@/components/blocks/BookingWidgetBlockRenderer'
import { BlogPostsBlockRenderer } from '@/components/blocks/BlogPostsBlockRenderer'
import { SocialFeedBlockRenderer } from '@/components/blocks/SocialFeedBlockRenderer'
import { FooterBlockRenderer } from '@/components/blocks/FooterBlockRenderer'
import { NavigationLinksBlock } from '@/components/blocks/navigation/NavigationLinksBlock'
import { HeroMainBlock } from '@/components/blocks/hero/HeroMainBlock'
import { HeroHeadlineBlock } from '@/components/blocks/hero/HeroHeadlineBlock'
import { HeroSubtextBlock } from '@/components/blocks/hero/HeroSubtextBlock'
import { HeroCtaBlock } from '@/components/blocks/hero/HeroCtaBlock'
import { DestinationCarouselBlock as HomeDestinationCarouselBlock } from '@/components/blocks/destination-carousel/DestinationCarouselBlock'
import { FooterSubscribeBlock } from '@/components/blocks/footer/FooterSubscribeBlock'
import { FooterFollowBlock } from '@/components/blocks/footer/FooterFollowBlock'
import { FooterTravelBlock } from '@/components/blocks/footer/FooterTravelBlock'
import { FooterNavBlock } from '@/components/blocks/footer/FooterNavBlock'
import { FooterBottomBlock } from '@/components/blocks/footer/FooterBottomBlock'
import { GalleryHeroBlock } from '@/components/blocks/gallery/GalleryHeroBlock'
import { GalleryGridBlock } from '@/components/blocks/gallery/GalleryGridBlock'
import { WhyTravelWithUsBlock } from '@/components/blocks/why-travel-with-us/WhyTravelWithUsBlock'
import { FeaturedTravelsBlock } from '@/components/blocks/featured-travels/FeaturedTravelsBlock'
import { CalendarCtaBlock } from '@/components/blocks/calendar-cta/CalendarCtaBlock'
import { TestimonialsBlock } from '@/components/blocks/testimonials/TestimonialsBlock'

import {
  allStyleFields,
  allStyleDefaults,
  applyBlockStyles,
  colorField,
  payloadMediaField,
  BG_ICON,
  TEXT_ICON,
  LINK_ICON,
  type AllStyleDefaults,
} from './styleFields'

// ─── Inline editor render helpers ─────────────────────────────────────────────

function FAQEditorBlock({ title, items, ...style }: { title?: string; items: { question: string; answer: string }[] } & AllStyleDefaults) {
  return (
    <section style={{ ...applyBlockStyles(style), paddingLeft: style.paddingX || '1.5rem', paddingRight: style.paddingX || '1.5rem' }}>
      <div className="max-w-3xl mx-auto">
        {title && <h2 className="text-3xl font-bold mb-10">{title}</h2>}
        <div className="space-y-2">
          {items.map((item, i) => (
            <div key={i} className="border border-white/10 rounded-lg overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 text-sm font-medium">{item.question}<span className="ml-4 opacity-50">+</span></div>
              <div className="px-6 pb-5 text-sm opacity-60">{item.answer}</div>
            </div>
          ))}
          {items.length === 0 && <p className="text-sm opacity-40 text-center py-8">Add FAQ items in the panel →</p>}
        </div>
      </div>
    </section>
  )
}

function ImageGalleryEditorBlock({ title, images, layout, ...style }: { title?: string; images: { url: string; alt: string; caption?: string }[]; layout?: string } & AllStyleDefaults) {
  const valid = images.filter((i) => i.url)
  return (
    <section style={{ ...applyBlockStyles(style), ...(layout !== 'grid' ? { overflow: style.overflow || 'hidden' } : { paddingLeft: style.paddingX || '1.5rem', paddingRight: style.paddingX || '1.5rem' }) }}>
      {title && <h2 className={`text-3xl font-bold mb-8 ${layout !== 'grid' ? 'px-6 max-w-[1440px] mx-auto' : ''}`}>{title}</h2>}
      <div className={layout === 'grid' ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-w-[1440px] mx-auto' : 'flex gap-3 px-6 overflow-x-auto pb-2'} style={{ scrollbarWidth: 'none' }}>
        {valid.map((img, i) => (
          <div key={i} className={`relative rounded-lg overflow-hidden bg-white/5 ${layout === 'grid' ? 'aspect-square' : 'flex-shrink-0 w-52 aspect-[3/4]'}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img.url} alt={img.alt} className="w-full h-full object-cover" />
          </div>
        ))}
        {valid.length === 0 && <p className="py-12 text-sm opacity-40">Add images in the panel →</p>}
      </div>
    </section>
  )
}

function TeamEditorBlock({ title, members, ...style }: { title?: string; members: { name: string; role?: string; bio?: string; photoUrl?: string }[] } & AllStyleDefaults) {
  return (
    <section style={{ ...applyBlockStyles(style), paddingLeft: style.paddingX || '1.5rem', paddingRight: style.paddingX || '1.5rem' }}>
      <div className="max-w-[1440px] mx-auto">
        {title && <h2 className="text-3xl font-bold mb-10">{title}</h2>}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {members.map((m, i) => (
            <div key={i} className="text-center">
              {m.photoUrl
                // eslint-disable-next-line @next/next/no-img-element
                ? <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4"><img src={m.photoUrl} alt={m.name} className="w-full h-full object-cover" /></div>
                : <div className="w-24 h-24 rounded-full bg-white/10 mx-auto mb-4 flex items-center justify-center text-white/30 text-2xl">{m.name?.[0] ?? '?'}</div>
              }
              <p className="font-semibold">{m.name || 'Name'}</p>
              {m.role && <p className="text-sm opacity-50 mt-1">{m.role}</p>}
              {m.bio && <p className="text-xs opacity-40 mt-2 leading-relaxed">{m.bio}</p>}
            </div>
          ))}
          {members.length === 0 && <p className="col-span-4 text-sm opacity-40 py-8 text-center">Add team members →</p>}
        </div>
      </div>
    </section>
  )
}

function MediaLogosEditorBlock({ title, logos, ...style }: { title?: string; logos: { name: string; url?: string }[] } & AllStyleDefaults) {
  return (
    <section className="border-y border-white/10" style={{ ...applyBlockStyles(style), paddingLeft: style.paddingX || '1.5rem', paddingRight: style.paddingX || '1.5rem' }}>
      <div className="max-w-[1440px] mx-auto">
        {title && <p className="text-xs font-semibold tracking-widest opacity-30 uppercase text-center mb-8">{title}</p>}
        <div className="flex items-center justify-center gap-10 flex-wrap">
          {logos.map((l, i) => <div key={i} className="text-lg font-bold opacity-30 hover:opacity-60 transition-colors cursor-pointer">{l.name || 'Logo'}</div>)}
          {logos.length === 0 && <p className="text-sm opacity-30">Add logos in the panel →</p>}
        </div>
      </div>
    </section>
  )
}

// ─── Types ────────────────────────────────────────────────────────────────────

type StyleProps = AllStyleDefaults

export type PuckBlocks = {
  NavigationLinksBlock: { navLinksLeft: { label: string; href: string }[]; navLinksRight: { label: string; href: string }[]; instagramUrl: string; facebookUrl: string; tiktokUrl: string; logoDarkUrl: string; logoLightUrl: string }
  Section: { layout: string; gap: string; bgColor: string; textColor: string; paddingTop: string; paddingBottom: string; maxWidth: string; locked: string; content: never }
  HeroBlock: StyleProps & { headline: string; subheadline: string; backgroundImage: string; ctaText: string; ctaLink: string; variant: string; overlayOpacity: string }
  TextBlock: StyleProps & { heading: string; content: string; alignment: 'left' | 'center' | 'right'; variant: string; padding: string; ctaText: string; ctaLink: string }
  RichTextBlock: StyleProps & { content: unknown; variant: string }
  CTABlock: StyleProps & { headline: string; body: string; buttonText: string; buttonLink: string; backgroundImage: string; variant: string }
  QuoteBlock: StyleProps & { quote: string; author: string; role: string; avatar: string }
  FAQBlock: StyleProps & { title: string; items: { question: string; answer: string }[] }
  ImageGalleryBlock: StyleProps & { title: string; images: { url: string; alt: string; caption: string }[]; layout: string; columns: string }
  VideoBlock: StyleProps & { url: string; posterImage: string; caption: string; autoPlay: boolean; muted: boolean; loop: boolean; controls: boolean }
  TeamBlock: StyleProps & { title: string; members: { name: string; role: string; bio: string; photoUrl: string }[]; columns: string }
  MediaLogosBlock: StyleProps & { title: string; logos: { name: string; linkUrl: string }[] }
  StoriesBlock: StyleProps & { title: string; limit: number; _stories: unknown[] }
  DestinationCarouselBlock: StyleProps & { title: string; limit: number; _destinations: unknown[] }
  // New blocks
  PricingBlock: StyleProps & { title: string; tiers: { name: string; price: string; period: string; description: string; features: string; highlighted: string; ctaText: string; ctaLink: string }[] }
  CounterBlock: StyleProps & { title: string; stats: { number: string; suffix: string; label: string; description: string }[] }
  TimelineBlock: StyleProps & { title: string; events: { year: string; title: string; description: string; imageUrl: string }[] }
  MapBlock: StyleProps & { embedUrl: string; mapHeight: string; title: string; caption: string }
  NewsletterBlock: StyleProps & { heading: string; subheading: string; placeholder: string; buttonText: string; formAction: string; successMessage: string }
  ContactFormBlock: StyleProps & { heading: string; subheading: string; showPhone: string; showSubject: string; buttonText: string; formAction: string; successMessage: string }
  TabbedContentBlock: StyleProps & { title: string; tabs: { label: string; content: string }[] }
  AccordionBlock: StyleProps & { heading: string; items: { title: string; content: string }[] }
  BannerBlock: StyleProps & { text: string; linkText: string; linkUrl: string; closeable: string }
  SeparatorBlock: StyleProps & { label: string; style: string }
  IconGridBlock: StyleProps & { title: string; items: { icon: string; heading: string; description: string; link: string }[]; columns: string }
  FeatureCardsBlock: StyleProps & { title: string; cards: { imageUrl: string; heading: string; text: string; ctaText: string; ctaLink: string }[]; columns: string }
  BeforeAfterBlock: StyleProps & { beforeImageUrl: string; afterImageUrl: string; beforeLabel: string; afterLabel: string; title: string; caption: string }
  EmbedBlock: StyleProps & { embedUrl: string; embedHeight: string; title: string; allowFullscreen: string }
  TestimonialsGridBlock: StyleProps & { title: string; testimonials: { quote: string; author: string; role: string; avatarUrl: string; rating: string }[]; columns: string }
  GalleryLightboxBlock: StyleProps & { title: string; images: { url: string; alt: string; caption: string }[]; columns: string }
  BookingWidgetBlock: StyleProps & { heading: string; subheading: string; embedUrl: string; widgetHeight: string }
  BlogPostsBlock: StyleProps & { title: string; limit: number; layout: string; ctaText: string; ctaLink: string; _posts: unknown[] }
  SocialFeedBlock: StyleProps & { title: string; posts: { platform: string; handle: string; content: string; imageUrl: string; likes: string; url: string; date: string }[]; columns: string }
  FooterBlock: Record<string, never>
  FooterSubscribeBlock: { subscribeHeading: string; subscribeSubtext: string; submitLabel: string; firstNamePlaceholder: string; lastNamePlaceholder: string; emailPlaceholder: string; consentText: string; consentLinkText: string; privacyUrl: string }
  FooterFollowBlock: { followHeading: string; followSubtext: string; facebookUrl: string; facebookFollowers: string; instagramUrl: string; instagramFollowers: string }
  FooterTravelBlock: { travelSectionHeading: string }
  FooterNavBlock: { navSectionHeading: string }
  FooterBottomBlock: { copyright: string; licenseText: string; insuranceText: string; logoUrl: string; termsLabel: string; termsUrl: string; privacyLabel: string; privacyUrl: string; creditPrefix: string; creditName: string; creditUrl: string }
  HeroMainBlock: { backgroundImageUrl: string; backgroundImage: any; overlayOpacity: number; contentAlign: string; height: string }
  HeroHeadlineBlock: { text: string; fontSize: string; color: string; fontWeight: string; textAlign: string }
  HeroSubtextBlock: { text: string; fontSize: string; color: string; textAlign: string }
  HeroCtaBlock: { label: string; url: string; style: string; fontSize: string; align: string }
  HomeDestCarouselBlock: { sectionTitle: string; destinations: { id: string; name: string; slug: string; month: string; spotsLabel: string }[] }
  GalleryHeroBlock: { heading: string; subheading: string; ctaLabel: string }
  GalleryGridBlock: Record<string, never>
  ShopHeroBlock: { title: string; subtitle: string; imageUrl: string }
  ShopFeaturedBlock: { title: string; items: unknown[] }
  ShopBannerBlock: { text: string; cta: string; ctaHref: string }
  GiftVoucherPromoBlock: { title: string; description: string }
  BundleShowcaseBlock: { title: string }
  WhyTravelWithUsBlock: { heading: string; items: { icon: string; title: string; body: string }[] }
  FeaturedTravelsBlock: { heading: string }
  CalendarCtaBlock: { heading: string; subheading: string; buttonText: string; buttonUrl: string }
  TestimonialsMarqueeBlock: { heading: string; subheading: string }
}

// ─── Config ───────────────────────────────────────────────────────────────────

export const puckConfig: Config<PuckBlocks> = {
  categories: {
    layout: { title: 'Layout', components: ['Section'], defaultExpanded: true },
    content: { title: 'Content', components: ['HeroBlock', 'TextBlock', 'RichTextBlock', 'CTABlock', 'QuoteBlock', 'BannerBlock', 'SeparatorBlock'], defaultExpanded: true },
    conversion: { title: 'Conversion', components: ['PricingBlock', 'NewsletterBlock', 'ContactFormBlock', 'BookingWidgetBlock', 'CTABlock'], defaultExpanded: false },
    media: { title: 'Media', components: ['ImageGalleryBlock', 'GalleryLightboxBlock', 'VideoBlock', 'BeforeAfterBlock', 'EmbedBlock', 'MapBlock'], defaultExpanded: false },
    brand: { title: 'Team & Brand', components: ['TeamBlock', 'MediaLogosBlock', 'FAQBlock', 'AccordionBlock', 'TestimonialsGridBlock', 'IconGridBlock', 'FeatureCardsBlock', 'CounterBlock', 'TimelineBlock', 'TabbedContentBlock'], defaultExpanded: false },
    dynamic: { title: 'Dynamic (Live Data)', components: ['StoriesBlock', 'BlogPostsBlock', 'DestinationCarouselBlock', 'SocialFeedBlock', 'GalleryHeroBlock', 'GalleryGridBlock'], defaultExpanded: false },
    global: { title: 'Global', components: ['FooterBlock', 'NavigationLinksBlock', 'WhyTravelWithUsBlock', 'FeaturedTravelsBlock', 'CalendarCtaBlock', 'TestimonialsMarqueeBlock'], defaultExpanded: false },
  },

  components: {

    // ── SECTION ───────────────────────────────────────────────────────────────
    Section: {
      label: 'Section / Container',
      fields: {
        content: { type: 'slot', label: 'Content (drop blocks here)' },
        layout: { type: 'select', label: 'Layout Type', options: [{ value: 'single', label: 'Single Column' }, { value: 'two-col', label: 'Two Columns' }, { value: 'three-col', label: 'Three Columns' }, { value: 'four-col', label: 'Four Columns' }, { value: 'grid', label: 'Auto Grid' }] },
        gap: { type: 'select', label: 'Column Gap', options: [{ value: '8px', label: 'XS (8px)' }, { value: '16px', label: 'Small (16px)' }, { value: '24px', label: 'Medium (24px)' }, { value: '32px', label: 'Large (32px)' }, { value: '48px', label: 'XL (48px)' }] },
        bgColor: colorField('Background Color', BG_ICON),
        textColor: colorField('Text Color', TEXT_ICON),
        paddingTop: { type: 'select', label: 'Padding Top', options: [{ value: '0', label: 'None' }, { value: '2rem', label: 'Small' }, { value: '4rem', label: 'Medium' }, { value: '6rem', label: 'Large' }, { value: '10rem', label: 'XL' }] },
        paddingBottom: { type: 'select', label: 'Padding Bottom', options: [{ value: '0', label: 'None' }, { value: '2rem', label: 'Small' }, { value: '4rem', label: 'Medium' }, { value: '6rem', label: 'Large' }, { value: '10rem', label: 'XL' }] },
        maxWidth: { type: 'select', label: 'Max Width', options: [{ value: '100%', label: 'Full Width' }, { value: '1440px', label: 'Wide (1440px)' }, { value: '1200px', label: 'Large (1200px)' }, { value: '960px', label: 'Medium (960px)' }, { value: '768px', label: 'Narrow (768px)' }] },
        locked: { type: 'radio', label: 'Lock this section', options: [{ value: 'false', label: 'Unlocked' }, { value: 'true', label: 'Locked' }] },
      },
      defaultProps: { content: undefined as never, layout: 'single', gap: '24px', bgColor: '', textColor: '', paddingTop: '4rem', paddingBottom: '4rem', maxWidth: '1440px', locked: 'false' },
      resolvePermissions: (data, { permissions }) => {
        if (data.props.locked === 'true') {
          return {
            delete: false,
            duplicate: false,
            edit: false,
          }
        }
        return permissions
      },
      render: ({ content: Content, layout, gap, maxWidth, ...styleProps }) => {
        const C = Content as React.ElementType
        const gridColsMap: Record<string, string> = {
          'single': '1fr',
          'two-col': '1fr 1fr',
          'three-col': '1fr 1fr 1fr',
          'four-col': '1fr 1fr 1fr 1fr',
          'grid': 'repeat(auto-fit, minmax(300px, 1fr))',
        }
        const cols = gridColsMap[layout] || '1fr'
        const sectionStyle = applyBlockStyles(styleProps as Partial<AllStyleDefaults>)
        return (
          <section style={sectionStyle}>
            <div style={{
              maxWidth: maxWidth || undefined,
              margin: '0 auto',
              paddingLeft: (styleProps as unknown as AllStyleDefaults).paddingX || 24,
              paddingRight: (styleProps as unknown as AllStyleDefaults).paddingX || 24,
              display: layout === 'single' ? 'block' : 'grid',
              gridTemplateColumns: layout === 'single' ? undefined : cols,
              gap: layout === 'single' ? undefined : gap || '24px',
            }}>
              <C />
            </div>
          </section>
        )
      },
    },

    // ── HERO ─────────────────────────────────────────────────────────────────
    HeroBlock: {
      label: 'Hero / Banner',
      fields: {
        headline: { type: 'text', label: 'Headline', placeholder: 'Your bold headline' },
        subheadline: { type: 'textarea', label: 'Subheadline', placeholder: 'Supporting copy…' },
        backgroundImage: payloadMediaField('Background Image'),
        variant: { type: 'select', label: 'Style Variant', options: [{ value: 'fullscreen', label: 'Fullscreen (100vh)' }, { value: 'split', label: 'Split (text + image)' }, { value: 'minimal', label: 'Minimal (auto-height)' }] },
        overlayOpacity: { type: 'select', label: 'Image Overlay Darkness', options: [{ value: '0', label: 'None' }, { value: '0.2', label: '20%' }, { value: '0.4', label: '40%' }, { value: '0.6', label: '60%' }, { value: '0.8', label: '80%' }] },
        ctaText: { type: 'text', label: 'CTA Button Text', labelIcon: LINK_ICON, placeholder: 'Book Now' },
        ctaLink: { type: 'text', label: 'CTA Button Link', placeholder: '/shop' },
        ...allStyleFields(),
      },
      defaultProps: { headline: 'Your Headline Here', subheadline: 'Your subheadline here', backgroundImage: '', ctaText: '', ctaLink: '', variant: 'fullscreen', overlayOpacity: '0', ...allStyleDefaults(), bgColor: '#0a0a0a', textColor: '#ffffff' },
      render: ({ headline, subheadline, backgroundImage, ctaText, ctaLink, overlayOpacity, variant, ...style }) => {
        const cleanHeadline = String(headline || '').trim()
        const cleanSubheadline = String(subheadline || '').trim() || null
        const bgImageObj = typeof backgroundImage === 'string' && backgroundImage ? { url: backgroundImage, alt: cleanHeadline } : null
        return (
          <HeroBlockRenderer block={{ headline: cleanHeadline, subheadline: cleanSubheadline, ctaText: ctaText || null, ctaLink: ctaLink || null, backgroundImage: bgImageObj, overlayOpacity: overlayOpacity || null, variant: variant || null, ...style }} />
        )
      },
    },

    // ── TEXT ─────────────────────────────────────────────────────────────────
    TextBlock: {
      label: 'Text / Copy',
      fields: {
        heading: { type: 'text', label: 'Heading', placeholder: 'Section heading…' },
        content: { type: 'textarea', label: 'Body Text', placeholder: 'Write your copy here…' },
        alignment: { type: 'radio', label: 'Alignment', options: [{ value: 'left', label: 'Left' }, { value: 'center', label: 'Center' }, { value: 'right', label: 'Right' }] },
        variant: { type: 'select', label: 'Layout', options: [{ value: 'contained', label: 'Contained (max 3xl)' }, { value: 'full-width', label: 'Full Width' }, { value: 'two-column', label: 'Two Column' }, { value: 'centered', label: 'Centered (max 2xl)' }] },
        padding: { type: 'select', label: 'Vertical Padding', options: [{ value: 'none', label: 'None' }, { value: 'sm', label: 'Small' }, { value: 'md', label: 'Medium' }, { value: 'lg', label: 'Large' }, { value: 'xl', label: 'XL' }] },
        ctaText: { type: 'text', label: 'Button Text', labelIcon: LINK_ICON, placeholder: 'Book Now' },
        ctaLink: { type: 'text', label: 'Button URL', placeholder: '/shop' },
        ...allStyleFields(),
      },
      defaultProps: { heading: '', content: '', alignment: 'left', variant: 'contained', padding: 'md', ctaText: '', ctaLink: '', ...allStyleDefaults() },
      render: ({ heading, content, alignment, variant, padding, ctaText, ctaLink, ...style }) => (
        <TextBlockRenderer block={{ heading: heading || null, content: content || null, alignment, variant, padding, ctaText: ctaText || null, ctaLink: ctaLink || null, ...style }} />
      ),
    },

    // ── RICH TEXT ─────────────────────────────────────────────────────────────
    RichTextBlock: {
      label: 'Rich Text (WYSIWYG)',
      fields: {
        content: {
          type: 'richtext',
          label: 'Content',
          initialHeight: 200,
          options: {
            bold: {} as any,
            italic: {} as any,
            underline: {} as any,
            link: {} as any,
            blockquote: {} as any,
            code: {} as any,
            codeBlock: {} as any,
            horizontalRule: {} as any,
            h1: {} as any,
            h2: {} as any,
            h3: {} as any,
            h4: {} as any,
            h5: {} as any,
            h6: {} as any,
            ul: {} as any,
            ol: {} as any,
          } as any
        },
        variant: { type: 'select', label: 'Width', options: [{ value: 'contained', label: 'Contained' }, { value: 'full-width', label: 'Full Width' }, { value: 'centered', label: 'Centered' }] },
        ...allStyleFields(),
      },
      defaultProps: { content: '' as unknown, variant: 'contained', ...allStyleDefaults() },
      render: ({ content, variant, ...style }) => (
        <RichTextBlockRenderer block={{ content: content || null, variant, ...style }} />
      ),
    },

    // ── CTA ───────────────────────────────────────────────────────────────────
    CTABlock: {
      label: 'Call to Action',
      fields: {
        headline: { type: 'text', label: 'Headline', placeholder: 'Ready to start?', contentEditable: true },
        body: { type: 'textarea', label: 'Body Text', placeholder: 'Supporting copy…', contentEditable: true },
        buttonText: { type: 'text', label: 'Button Text', placeholder: 'Book Now', contentEditable: true },
        buttonLink: { type: 'text', label: 'Button URL', placeholder: '/shop' },
        backgroundImage: payloadMediaField('Background Image (optional)'),
        variant: { type: 'radio', label: 'Alignment', options: [{ value: 'centered', label: 'Centered' }, { value: 'left', label: 'Left' }] },
        ...allStyleFields(),
      },
      defaultProps: { headline: 'Ready to start your adventure?', body: '', buttonText: 'Book Now', buttonLink: '/shop', backgroundImage: '', variant: 'centered', ...allStyleDefaults(), bgColor: '#111111', textColor: '#ffffff' },
      render: ({ headline, body, buttonText, buttonLink, backgroundImage, variant, ...style }) => (
        <CTABlockRenderer block={{ headline, body: body || null, buttonText: buttonText || null, buttonLink: buttonLink || null, backgroundImage: backgroundImage ? { url: backgroundImage, alt: headline } : null, variant, ...style }} />
      ),
    },

    // ── QUOTE ─────────────────────────────────────────────────────────────────
    QuoteBlock: {
      label: 'Quote / Testimonial',
      fields: {
        quote: { type: 'textarea', label: 'Quote Text', placeholder: 'An amazing journey awaits…', contentEditable: true },
        author: { type: 'text', label: 'Author Name', placeholder: 'Jane Doe', contentEditable: true },
        role: { type: 'text', label: 'Author Role / Company', placeholder: 'CEO, Company', contentEditable: true },
        avatar: payloadMediaField('Author Photo'),
        ...allStyleFields(),
      },
      defaultProps: { quote: 'An amazing journey awaits those who dare.', author: '', role: '', avatar: '', ...allStyleDefaults() },
      render: ({ quote, author, role, ...style }) => (
        <QuoteBlockRenderer block={{ quote, author: author || null, role: role || null, ...style }} />
      ),
    },

    // ── FAQ ───────────────────────────────────────────────────────────────────
    FAQBlock: {
      label: 'FAQ Accordion',
      fields: {
        title: { type: 'text', label: 'Section Title', placeholder: 'Frequently Asked Questions', contentEditable: true },
        items: {
          type: 'array', label: 'Questions',
          arrayFields: {
            question: { type: 'text', label: 'Question', placeholder: 'What is included?', contentEditable: true },
            answer: { type: 'richtext', label: 'Answer', initialHeight: 120, options: { codeBlock: false, code: false, blockquote: false, horizontalRule: false } },
          },
          defaultItemProps: { question: '', answer: '' },
          getItemSummary: (item: { question: string }) => item.question || 'New Question',
          min: 1,
        },
        ...allStyleFields(),
      },
      defaultProps: { title: 'Frequently Asked Questions', items: [{ question: 'What is included?', answer: '' }], ...allStyleDefaults() },
      render: ({ title, items, ...style }) => (
        <FAQEditorBlock title={title} items={items.map((i) => ({ question: i.question, answer: typeof i.answer === 'string' ? i.answer : '' }))} {...style} />
      ),
    },

    // ── IMAGE GALLERY ─────────────────────────────────────────────────────────
    ImageGalleryBlock: {
      label: 'Image Gallery',
      fields: {
        title: { type: 'text', label: 'Section Title', placeholder: 'Gallery', contentEditable: true },
        layout: { type: 'radio', label: 'Display', options: [{ value: 'scroll', label: 'Horizontal Scroll' }, { value: 'grid', label: 'Masonry Grid' }] },
        columns: { type: 'select', label: 'Grid Columns (grid only)', options: [{ value: '2', label: '2' }, { value: '3', label: '3' }, { value: '4', label: '4' }] },
        images: {
          type: 'array', label: 'Images',
          arrayFields: {
            url: payloadMediaField('Image'),
            alt: { type: 'text', label: 'Alt Text', placeholder: 'Describe the image' },
            caption: { type: 'text', label: 'Caption (optional)' },
          },
          defaultItemProps: { url: '', alt: '', caption: '' },
          getItemSummary: (item: { alt: string; url: string }) => item.alt || item.url || 'Image',
        },
        ...allStyleFields(),
      },
      defaultProps: { title: '', layout: 'scroll', columns: '3', images: [], ...allStyleDefaults() },
      render: ({ title, images, layout, ...style }) => (
        <ImageGalleryEditorBlock title={title} images={images} layout={layout} {...style} />
      ),
    },

    // ── VIDEO ─────────────────────────────────────────────────────────────────
    VideoBlock: {
      label: 'Video',
      fields: {
        url: { type: 'text', label: 'Video URL (.mp4, YouTube embed, Vimeo…)', placeholder: 'https://…' },
        posterImage: payloadMediaField('Poster / Thumbnail'),
        caption: { type: 'text', label: 'Caption', contentEditable: true },
        autoPlay: { type: 'radio', label: 'Auto Play', options: [{ value: true as unknown as string, label: 'Yes' }, { value: false as unknown as string, label: 'No' }] },
        muted: { type: 'radio', label: 'Muted (required for autoplay)', options: [{ value: true as unknown as string, label: 'Yes' }, { value: false as unknown as string, label: 'No' }] },
        loop: { type: 'radio', label: 'Loop', options: [{ value: true as unknown as string, label: 'Yes' }, { value: false as unknown as string, label: 'No' }] },
        controls: { type: 'radio', label: 'Show Controls', options: [{ value: true as unknown as string, label: 'Yes' }, { value: false as unknown as string, label: 'No' }] },
        ...allStyleFields(),
      },
      defaultProps: { url: '', posterImage: '', caption: '', autoPlay: false, muted: true, loop: true, controls: true, ...allStyleDefaults() },
      render: ({ url, posterImage, caption, autoPlay, muted, ...style }) => (
        <VideoBlockRenderer block={{ url, poster: posterImage ? { url: posterImage, alt: 'poster' } : null, caption: caption || null, autoPlay: Boolean(autoPlay), muted: Boolean(muted), ...style }} />
      ),
    },

    // ── TEAM ─────────────────────────────────────────────────────────────────
    TeamBlock: {
      label: 'Team Grid',
      fields: {
        title: { type: 'text', label: 'Section Title', placeholder: 'Our Team', contentEditable: true },
        columns: { type: 'select', label: 'Columns', options: [{ value: '2', label: '2' }, { value: '3', label: '3' }, { value: '4', label: '4' }] },
        members: {
          type: 'array', label: 'Team Members',
          arrayFields: {
            name: { type: 'text', label: 'Full Name', placeholder: 'Jane Doe', contentEditable: true },
            role: { type: 'text', label: 'Role / Title', placeholder: 'Lead Guide', contentEditable: true },
            bio: { type: 'textarea', label: 'Short Bio', placeholder: 'A few sentences about this person…' },
            photoUrl: payloadMediaField('Photo'),
          },
          defaultItemProps: { name: '', role: '', bio: '', photoUrl: '' },
          getItemSummary: (item: { name: string }) => item.name || 'Team Member',
        },
        ...allStyleFields(),
      },
      defaultProps: { title: 'Our Team', columns: '4', members: [], ...allStyleDefaults() },
      render: ({ title, members, ...style }) => (
        <TeamEditorBlock title={title} members={members} {...style} />
      ),
    },

    // ── MEDIA LOGOS ───────────────────────────────────────────────────────────
    MediaLogosBlock: {
      label: 'Press / Media Logos',
      fields: {
        title: { type: 'text', label: 'Section Label', placeholder: 'As seen in', contentEditable: true },
        logos: {
          type: 'array', label: 'Logos',
          arrayFields: {
            name: { type: 'text', label: 'Name (displayed as text)', contentEditable: true },
            linkUrl: { type: 'text', label: 'Link URL (optional)' },
          },
          defaultItemProps: { name: '', linkUrl: '' },
          getItemSummary: (item: { name: string }) => item.name || 'Logo',
        },
        ...allStyleFields(),
      },
      defaultProps: { title: 'Говорят за нас', logos: [{ name: 'BTV', linkUrl: '' }, { name: 'BNT', linkUrl: '' }, { name: 'YouTube', linkUrl: '' }], ...allStyleDefaults(), paddingTop: '3rem', paddingBottom: '3rem' },
      render: ({ title, logos, ...style }) => (
        <MediaLogosEditorBlock title={title} logos={logos.map((l) => ({ name: l.name, url: l.linkUrl }))} {...style} />
      ),
    },

    // ── STORIES ───────────────────────────────────────────────────────────────
    StoriesBlock: {
      label: 'Stories Carousel',
      fields: {
        title: { type: 'text', label: 'Section Title', placeholder: 'Stories', contentEditable: true },
        limit: { type: 'number', label: 'Number of Stories', min: 1, max: 20, step: 1 },
        _stories: { type: 'custom', label: '', visible: false, render: () => <></> },
        ...allStyleFields(),
      },
      defaultProps: { title: 'Stories', limit: 6, _stories: [], ...allStyleDefaults() },
      resolveData: async ({ props }, { changed }) => {
        if (!changed.limit && props._stories?.length) return { props }
        try {
          const res = await fetch(`/api/stories?limit=${props.limit}&sort=-createdAt&depth=1`, { credentials: 'include' })
          if (!res.ok) return { props }
          const { docs } = await res.json()
          return { props: { ...props, _stories: docs } }
        } catch { return { props } }
      },
      render: ({ title, _stories, ...style }) => (
        <StoriesBlockRenderer block={{ title: title || null, stories: (_stories ?? []) as Parameters<typeof StoriesBlockRenderer>[0]['block']['stories'], ...style }} />
      ),
    },

    // ── DESTINATIONS ─────────────────────────────────────────────────────────
    DestinationCarouselBlock: {
      label: 'Destinations Carousel',
      fields: {
        title: { type: 'text', label: 'Section Title', placeholder: 'Destinations', contentEditable: true },
        limit: { type: 'number', label: 'Number of Destinations', min: 1, max: 50, step: 1 },
        _destinations: { type: 'custom', label: '', visible: false, render: () => <></> },
        ...allStyleFields(),
      },
      defaultProps: { title: 'Destinations', limit: 20, _destinations: [], ...allStyleDefaults() },
      resolveData: async ({ props }, { changed }) => {
        if (!changed.limit && props._destinations?.length) return { props }
        try {
          const res = await fetch(`/api/destinations?limit=${props.limit}&sort=name&depth=1`, { credentials: 'include' })
          if (!res.ok) return { props }
          const { docs } = await res.json()
          return { props: { ...props, _destinations: docs } }
        } catch { return { props } }
      },
      render: ({ title, _destinations, ...style }) => (
        <DestinationCarouselRenderer block={{ title: title || null, destinations: (_destinations ?? []) as Parameters<typeof DestinationCarouselRenderer>[0]['block']['destinations'], ...style }} />
      ),
    },

    // ─────────────────────────────────────────────────────────────────────────
    // NEW BLOCKS
    // ─────────────────────────────────────────────────────────────────────────

    // ── PRICING ───────────────────────────────────────────────────────────────
    PricingBlock: {
      label: 'Pricing Tiers',
      fields: {
        title: { type: 'text', label: 'Section Title', placeholder: 'Pricing', contentEditable: true },
        tiers: {
          type: 'array', label: 'Tiers',
          arrayFields: {
            name: { type: 'text', label: 'Tier Name', placeholder: 'Basic', contentEditable: true },
            price: { type: 'text', label: 'Price', placeholder: '$99', contentEditable: true },
            period: { type: 'text', label: 'Period', placeholder: 'per person' },
            description: { type: 'textarea', label: 'Description' },
            features: { type: 'textarea', label: 'Features (one per line)', placeholder: 'Guided tour\nBreakfast included' },
            highlighted: { type: 'radio', label: 'Highlighted / Popular', options: [{ value: 'false', label: 'No' }, { value: 'true', label: 'Yes' }] },
            ctaText: { type: 'text', label: 'Button Text', placeholder: 'Book Now' },
            ctaLink: { type: 'text', label: 'Button URL', placeholder: '/book' },
          },
          defaultItemProps: { name: 'Standard', price: '$99', period: 'per person', description: '', features: 'Guided tour\nBreakfast included', highlighted: 'false', ctaText: 'Book Now', ctaLink: '/book' },
          getItemSummary: (item: { name: string }) => item.name || 'Tier',
          min: 1,
        },
        ...allStyleFields(),
      },
      defaultProps: {
        title: 'Choose Your Experience',
        tiers: [
          { name: 'Day Trip', price: '$99', period: 'per person', description: 'Perfect for a quick escape', features: 'Guided tour\nBreakfast included\nTransport', highlighted: 'false', ctaText: 'Book Now', ctaLink: '/book' },
          { name: 'Weekend', price: '$299', period: 'per person', description: 'The complete experience', features: 'Guided tour\nAll meals\nTransport\nAccommodation\nGear rental', highlighted: 'true', ctaText: 'Book Now', ctaLink: '/book' },
          { name: 'Custom', price: 'POA', period: '', description: 'Tailored to your group', features: 'Everything in Weekend\nPrivate guide\nCustom itinerary', highlighted: 'false', ctaText: 'Contact Us', ctaLink: '/contact' },
        ],
        ...allStyleDefaults(),
      },
      render: ({ title, tiers, ...style }) => (
        <PricingBlockRenderer block={{
          title: title || null,
          tiers: tiers.map((t) => ({
            name: t.name, price: t.price, period: t.period || null, description: t.description || null,
            features: (t.features || '').split('\n').filter(Boolean),
            highlighted: t.highlighted === 'true',
            ctaText: t.ctaText || null, ctaLink: t.ctaLink || null,
          })),
          ...style,
        }} />
      ),
    },

    // ── COUNTER ───────────────────────────────────────────────────────────────
    CounterBlock: {
      label: 'Stats / Counter',
      fields: {
        title: { type: 'text', label: 'Section Title', contentEditable: true },
        stats: {
          type: 'array', label: 'Stats',
          arrayFields: {
            number: { type: 'text', label: 'Number', placeholder: '1000', contentEditable: true },
            suffix: { type: 'text', label: 'Suffix', placeholder: '+' },
            label: { type: 'text', label: 'Label', placeholder: 'Happy Climbers', contentEditable: true },
            description: { type: 'text', label: 'Description (optional)' },
          },
          defaultItemProps: { number: '100', suffix: '+', label: 'Happy Clients', description: '' },
          getItemSummary: (item: { label: string }) => item.label || 'Stat',
          min: 1,
        },
        ...allStyleFields(),
      },
      defaultProps: {
        title: '',
        stats: [
          { number: '1000', suffix: '+', label: 'Happy Climbers', description: '' },
          { number: '50', suffix: '', label: 'Peaks Conquered', description: '' },
          { number: '15', suffix: '+', label: 'Years Experience', description: '' },
          { number: '98', suffix: '%', label: 'Satisfaction Rate', description: '' },
        ],
        ...allStyleDefaults(),
      },
      render: ({ title, stats, ...style }) => (
        <CounterBlockRenderer block={{ title: title || null, stats: stats.map((s) => ({ number: s.number, suffix: s.suffix || null, label: s.label, description: s.description || null })), ...style }} />
      ),
    },

    // ── TIMELINE ─────────────────────────────────────────────────────────────
    TimelineBlock: {
      label: 'Timeline',
      fields: {
        title: { type: 'text', label: 'Section Title', contentEditable: true },
        events: {
          type: 'array', label: 'Events',
          arrayFields: {
            year: { type: 'text', label: 'Year / Date', placeholder: '2010', contentEditable: true },
            title: { type: 'text', label: 'Title', placeholder: 'We started', contentEditable: true },
            description: { type: 'textarea', label: 'Description' },
            imageUrl: payloadMediaField('Image (optional)'),
          },
          defaultItemProps: { year: '2010', title: 'The Beginning', description: '', imageUrl: '' },
          getItemSummary: (item: { year: string; title: string }) => `${item.year} — ${item.title || 'Event'}`,
          min: 1,
        },
        ...allStyleFields(),
      },
      defaultProps: {
        title: 'Our Journey',
        events: [
          { year: '2010', title: 'Founded', description: 'Started with a dream and two backpacks.', imageUrl: '' },
          { year: '2015', title: 'First Summit', description: 'Led our first high-altitude expedition.', imageUrl: '' },
          { year: '2023', title: 'Today', description: 'Thousands of adventures and counting.', imageUrl: '' },
        ],
        ...allStyleDefaults(),
      },
      render: ({ title, events, ...style }) => (
        <TimelineBlockRenderer block={{ title: title || null, events: events.map((e) => ({ year: e.year, title: e.title, description: e.description || null, imageUrl: e.imageUrl || null })), ...style }} />
      ),
    },

    // ── MAP ───────────────────────────────────────────────────────────────────
    MapBlock: {
      label: 'Map Embed',
      fields: {
        title: { type: 'text', label: 'Section Title', contentEditable: true },
        embedUrl: { type: 'text', label: 'Google Maps Embed URL', placeholder: 'https://www.google.com/maps/embed?pb=…' },
        mapHeight: { type: 'select', label: 'Map Height', options: [{ value: '320px', label: '320px' }, { value: '480px', label: '480px' }, { value: '600px', label: '600px' }, { value: '800px', label: '800px' }] },
        caption: { type: 'text', label: 'Caption', contentEditable: true },
        ...allStyleFields(),
      },
      defaultProps: { title: '', embedUrl: '', mapHeight: '480px', caption: '', ...allStyleDefaults() },
      render: ({ title, embedUrl, mapHeight, caption, height: _h, ...style }) => (
        <MapBlockRenderer block={{ embedUrl: embedUrl || '', height: mapHeight || undefined, title: title || null, caption: caption || null, ...style }} />
      ),
    },

    // ── NEWSLETTER ───────────────────────────────────────────────────────────
    NewsletterBlock: {
      label: 'Newsletter Signup',
      fields: {
        heading: { type: 'text', label: 'Heading', placeholder: 'Join our community', contentEditable: true },
        subheading: { type: 'textarea', label: 'Subheading', contentEditable: true },
        placeholder: { type: 'text', label: 'Input Placeholder', placeholder: 'your@email.com' },
        buttonText: { type: 'text', label: 'Button Text', placeholder: 'Subscribe', contentEditable: true },
        formAction: { type: 'text', label: 'Form POST URL (optional)', placeholder: 'https://…/api/subscribe' },
        successMessage: { type: 'text', label: 'Success Message', placeholder: "You're in!" },
        ...allStyleFields(),
      },
      defaultProps: { heading: 'Stay in the loop', subheading: 'Get the latest news and stories from the mountains.', placeholder: 'your@email.com', buttonText: 'Subscribe', formAction: '', successMessage: "You're subscribed!", ...allStyleDefaults() },
      render: ({ heading, subheading, placeholder, buttonText, formAction, successMessage, ...style }) => (
        <NewsletterBlockRenderer block={{ heading: heading || null, subheading: subheading || null, placeholder: placeholder || null, buttonText: buttonText || null, formAction: formAction || null, successMessage: successMessage || null, ...style }} />
      ),
    },

    // ── CONTACT FORM ─────────────────────────────────────────────────────────
    ContactFormBlock: {
      label: 'Contact Form',
      fields: {
        heading: { type: 'text', label: 'Heading', placeholder: 'Get in touch', contentEditable: true },
        subheading: { type: 'textarea', label: 'Subheading', contentEditable: true },
        showPhone: { type: 'radio', label: 'Show Phone Field', options: [{ value: 'true', label: 'Yes' }, { value: 'false', label: 'No' }] },
        showSubject: { type: 'radio', label: 'Show Subject Field', options: [{ value: 'true', label: 'Yes' }, { value: 'false', label: 'No' }] },
        buttonText: { type: 'text', label: 'Button Text', placeholder: 'Send Message', contentEditable: true },
        formAction: { type: 'text', label: 'Form POST URL (optional)' },
        successMessage: { type: 'text', label: 'Success Message' },
        ...allStyleFields(),
      },
      defaultProps: { heading: 'Get in touch', subheading: '', showPhone: 'false', showSubject: 'true', buttonText: 'Send Message', formAction: '', successMessage: "Thanks! We'll be in touch.", ...allStyleDefaults() },
      render: ({ heading, subheading, showPhone, showSubject, buttonText, formAction, successMessage, ...style }) => (
        <ContactFormBlockRenderer block={{ heading: heading || null, subheading: subheading || null, showPhone: showPhone || null, showSubject: showSubject || null, buttonText: buttonText || null, formAction: formAction || null, successMessage: successMessage || null, ...style }} />
      ),
    },

    // ── TABBED CONTENT ────────────────────────────────────────────────────────
    TabbedContentBlock: {
      label: 'Tabbed Content',
      fields: {
        title: { type: 'text', label: 'Section Title', contentEditable: true },
        tabs: {
          type: 'array', label: 'Tabs',
          arrayFields: {
            label: { type: 'text', label: 'Tab Label', placeholder: 'Day 1', contentEditable: true },
            content: { type: 'textarea', label: 'Tab Content' },
          },
          defaultItemProps: { label: 'Tab', content: '' },
          getItemSummary: (item: { label: string }) => item.label || 'Tab',
          min: 1,
        },
        ...allStyleFields(),
      },
      defaultProps: { title: '', tabs: [{ label: 'Day 1', content: 'Arrive at base camp and acclimatize.' }, { label: 'Day 2', content: 'Trek to the upper camp.' }, { label: 'Day 3', content: 'Summit attempt at dawn.' }], ...allStyleDefaults() },
      render: ({ title, tabs, ...style }) => (
        <TabbedContentBlockRenderer block={{ title: title || null, tabs, ...style }} />
      ),
    },

    // ── ACCORDION ────────────────────────────────────────────────────────────
    AccordionBlock: {
      label: 'Accordion',
      fields: {
        heading: { type: 'text', label: 'Heading', contentEditable: true },
        items: {
          type: 'array', label: 'Items',
          arrayFields: {
            title: { type: 'text', label: 'Title', placeholder: 'Section title', contentEditable: true },
            content: { type: 'textarea', label: 'Content' },
          },
          defaultItemProps: { title: '', content: '' },
          getItemSummary: (item: { title: string }) => item.title || 'Item',
          min: 1,
        },
        ...allStyleFields(),
      },
      defaultProps: { heading: '', items: [{ title: 'What should I bring?', content: 'Sturdy boots, warm layers, and a sense of adventure.' }], ...allStyleDefaults() },
      render: ({ heading, items, ...style }) => (
        <AccordionBlockRenderer block={{ heading: heading || null, items, ...style }} />
      ),
    },

    // ── BANNER ────────────────────────────────────────────────────────────────
    BannerBlock: {
      label: 'Announcement Banner',
      fields: {
        text: { type: 'text', label: 'Message', placeholder: 'New routes available for 2025!', contentEditable: true },
        linkText: { type: 'text', label: 'Link Text', placeholder: 'View all', contentEditable: true },
        linkUrl: { type: 'text', label: 'Link URL', placeholder: '/tours' },
        closeable: { type: 'radio', label: 'Show Close Button', options: [{ value: 'true', label: 'Yes' }, { value: 'false', label: 'No' }] },
        ...allStyleFields(),
      },
      defaultProps: { text: 'New routes available for 2025!', linkText: 'View tours', linkUrl: '/tours', closeable: 'true', ...allStyleDefaults(), bgColor: '#1a1a2e', paddingTop: '0.75rem', paddingBottom: '0.75rem' },
      render: ({ text, linkText, linkUrl, closeable, ...style }) => (
        <BannerBlockRenderer block={{ text, linkText: linkText || null, linkUrl: linkUrl || null, closeable: closeable || null, ...style }} />
      ),
    },

    // ── SEPARATOR ────────────────────────────────────────────────────────────
    SeparatorBlock: {
      label: 'Divider / Separator',
      fields: {
        label: { type: 'text', label: 'Label Text (optional)', contentEditable: true },
        style: { type: 'radio', label: 'Style', options: [{ value: 'line', label: 'Line' }, { value: 'dots', label: 'Dots' }, { value: 'label', label: 'Label' }] },
        ...allStyleFields(),
      },
      defaultProps: { label: '', style: 'line', ...allStyleDefaults(), paddingTop: '2rem', paddingBottom: '2rem' },
      render: ({ label, style: lineStyle, ...styleRest }) => (
        <SeparatorBlockRenderer block={{ label: label || null, style: lineStyle || null, ...styleRest }} />
      ),
    },

    // ── ICON GRID ────────────────────────────────────────────────────────────
    IconGridBlock: {
      label: 'Icon Grid / Features',
      fields: {
        title: { type: 'text', label: 'Section Title', contentEditable: true },
        columns: { type: 'select', label: 'Columns', options: [{ value: '2', label: '2' }, { value: '3', label: '3' }, { value: '4', label: '4' }, { value: '5', label: '5' }] },
        items: {
          type: 'array', label: 'Items',
          arrayFields: {
            icon: { type: 'text', label: 'Icon (emoji or SVG path)', placeholder: '🏔️', contentEditable: true },
            heading: { type: 'text', label: 'Heading', placeholder: 'Mountain Guides', contentEditable: true },
            description: { type: 'textarea', label: 'Description' },
            link: { type: 'text', label: 'Link URL (optional)' },
          },
          defaultItemProps: { icon: '🏔️', heading: '', description: '', link: '' },
          getItemSummary: (item: { heading: string }) => item.heading || 'Item',
          min: 1,
        },
        ...allStyleFields(),
      },
      defaultProps: {
        title: 'Why Choose Us',
        columns: '3',
        items: [
          { icon: '🏔️', heading: 'Expert Guides', description: 'Certified mountain guides with 10+ years experience.', link: '' },
          { icon: '🛡️', heading: 'Safety First', description: 'Full safety equipment and rescue protocols.', link: '' },
          { icon: '🌍', heading: 'Sustainable', description: 'Leave no trace. We protect the mountains we love.', link: '' },
        ],
        ...allStyleDefaults(),
      },
      render: ({ title, columns, items, ...style }) => (
        <IconGridBlockRenderer block={{ title: title || null, columns: columns || null, items: items.map((i) => ({ icon: i.icon, heading: i.heading, description: i.description || null, link: i.link || null })), ...style }} />
      ),
    },

    // ── FEATURE CARDS ────────────────────────────────────────────────────────
    FeatureCardsBlock: {
      label: 'Feature Cards',
      fields: {
        title: { type: 'text', label: 'Section Title', contentEditable: true },
        columns: { type: 'select', label: 'Columns', options: [{ value: '2', label: '2' }, { value: '3', label: '3' }, { value: '4', label: '4' }] },
        cards: {
          type: 'array', label: 'Cards',
          arrayFields: {
            imageUrl: payloadMediaField('Card Image'),
            heading: { type: 'text', label: 'Heading', contentEditable: true },
            text: { type: 'textarea', label: 'Body Text' },
            ctaText: { type: 'text', label: 'Button Text', placeholder: 'Learn More' },
            ctaLink: { type: 'text', label: 'Button URL' },
          },
          defaultItemProps: { imageUrl: '', heading: 'Feature', text: '', ctaText: '', ctaLink: '' },
          getItemSummary: (item: { heading: string }) => item.heading || 'Card',
          min: 1,
        },
        ...allStyleFields(),
      },
      defaultProps: {
        title: '',
        columns: '3',
        cards: [
          { imageUrl: '', heading: 'Rock Climbing', text: 'Scale vertical faces with expert instructors.', ctaText: 'Explore', ctaLink: '/rock-climbing' },
          { imageUrl: '', heading: 'Ski Touring', text: 'Off-piste adventures in untouched powder.', ctaText: 'Explore', ctaLink: '/ski-touring' },
          { imageUrl: '', heading: 'Via Ferrata', text: 'Iron paths through dramatic mountain scenery.', ctaText: 'Explore', ctaLink: '/via-ferrata' },
        ],
        ...allStyleDefaults(),
      },
      render: ({ title, columns, cards, ...style }) => (
        <FeatureCardsBlockRenderer block={{ title: title || null, columns: columns || null, cards: cards.map((c) => ({ imageUrl: c.imageUrl || null, heading: c.heading, text: c.text || null, ctaText: c.ctaText || null, ctaLink: c.ctaLink || null })), ...style }} />
      ),
    },

    // ── BEFORE / AFTER ────────────────────────────────────────────────────────
    BeforeAfterBlock: {
      label: 'Before / After Slider',
      fields: {
        title: { type: 'text', label: 'Title', contentEditable: true },
        beforeImageUrl: payloadMediaField('Before Image'),
        afterImageUrl: payloadMediaField('After Image'),
        beforeLabel: { type: 'text', label: '"Before" Label', placeholder: 'Before', contentEditable: true },
        afterLabel: { type: 'text', label: '"After" Label', placeholder: 'After', contentEditable: true },
        caption: { type: 'text', label: 'Caption', contentEditable: true },
        ...allStyleFields(),
      },
      defaultProps: { title: '', beforeImageUrl: '', afterImageUrl: '', beforeLabel: 'Before', afterLabel: 'After', caption: '', ...allStyleDefaults() },
      render: ({ title, beforeImageUrl, afterImageUrl, beforeLabel, afterLabel, caption, ...style }) => (
        <BeforeAfterBlockRenderer block={{ beforeImageUrl: beforeImageUrl || '', afterImageUrl: afterImageUrl || '', beforeLabel: beforeLabel || null, afterLabel: afterLabel || null, title: title || null, caption: caption || null, ...style }} />
      ),
    },

    // ── EMBED ─────────────────────────────────────────────────────────────────
    EmbedBlock: {
      label: 'Embed (YouTube / Vimeo / etc.)',
      fields: {
        title: { type: 'text', label: 'Title', contentEditable: true },
        embedUrl: { type: 'text', label: 'Embed URL', placeholder: 'https://www.youtube.com/embed/…' },
        embedHeight: { type: 'select', label: 'Height', options: [{ value: '320px', label: '320px' }, { value: '480px', label: '480px' }, { value: '600px', label: '600px' }, { value: '80vh', label: '80vh' }] },
        allowFullscreen: { type: 'radio', label: 'Allow Fullscreen', options: [{ value: 'true', label: 'Yes' }, { value: 'false', label: 'No' }] },
        ...allStyleFields(),
      },
      defaultProps: { title: '', embedUrl: '', embedHeight: '480px', allowFullscreen: 'true', ...allStyleDefaults() },
      render: ({ title, embedUrl, embedHeight, allowFullscreen, height: _h, ...style }) => (
        <EmbedBlockRenderer block={{ title: title || null, embedUrl: embedUrl || undefined, height: embedHeight || undefined, allowFullscreen: allowFullscreen || null, ...style }} />
      ),
    },

    // ── TESTIMONIALS GRID ─────────────────────────────────────────────────────
    TestimonialsGridBlock: {
      label: 'Testimonials Grid',
      fields: {
        title: { type: 'text', label: 'Section Title', contentEditable: true },
        columns: { type: 'select', label: 'Columns', options: [{ value: '2', label: '2' }, { value: '3', label: '3' }, { value: '4', label: '4' }] },
        testimonials: {
          type: 'array', label: 'Testimonials',
          arrayFields: {
            quote: { type: 'textarea', label: 'Quote', contentEditable: true },
            author: { type: 'text', label: 'Author Name', contentEditable: true },
            role: { type: 'text', label: 'Role / Company' },
            avatarUrl: payloadMediaField('Avatar Photo'),
            rating: { type: 'select', label: 'Rating (stars)', options: [{ value: '', label: 'None' }, { value: '3', label: '3 stars' }, { value: '4', label: '4 stars' }, { value: '5', label: '5 stars' }] },
          },
          defaultItemProps: { quote: '', author: '', role: '', avatarUrl: '', rating: '5' },
          getItemSummary: (item: { author: string }) => item.author || 'Testimonial',
          min: 1,
        },
        ...allStyleFields(),
      },
      defaultProps: {
        title: 'What Our Clients Say',
        columns: '3',
        testimonials: [
          { quote: 'The most incredible experience of my life. Highly recommend!', author: 'Maria S.', role: 'Adventure Traveler', avatarUrl: '', rating: '5' },
          { quote: 'Professional guides, stunning scenery, memories for life.', author: 'John D.', role: 'Solo Hiker', avatarUrl: '', rating: '5' },
          { quote: 'Worth every penny. Will be back next year!', author: 'Elena K.', role: 'Group Leader', avatarUrl: '', rating: '5' },
        ],
        ...allStyleDefaults(),
      },
      render: ({ title, columns, testimonials, ...style }) => (
        <TestimonialsGridBlockRenderer block={{ title: title || null, columns: columns || null, testimonials: testimonials.map((t) => ({ quote: t.quote, author: t.author, role: t.role || null, avatarUrl: t.avatarUrl || null, rating: t.rating || null })), ...style }} />
      ),
    },

    // ── GALLERY LIGHTBOX ─────────────────────────────────────────────────────
    GalleryLightboxBlock: {
      label: 'Gallery with Lightbox',
      fields: {
        title: { type: 'text', label: 'Section Title', contentEditable: true },
        columns: { type: 'select', label: 'Columns', options: [{ value: '2', label: '2' }, { value: '3', label: '3' }, { value: '4', label: '4' }, { value: '5', label: '5' }] },
        images: {
          type: 'array', label: 'Images',
          arrayFields: {
            url: payloadMediaField('Image'),
            alt: { type: 'text', label: 'Alt Text', placeholder: 'Describe the image' },
            caption: { type: 'text', label: 'Caption (shown in lightbox)' },
          },
          defaultItemProps: { url: '', alt: '', caption: '' },
          getItemSummary: (item: { alt: string }) => item.alt || 'Image',
          min: 1,
        },
        ...allStyleFields(),
      },
      defaultProps: { title: '', columns: '3', images: [], ...allStyleDefaults() },
      render: ({ title, columns, images, ...style }) => (
        <GalleryLightboxBlockRenderer block={{ title: title || null, columns: columns || null, images: images.map((i) => ({ url: i.url, alt: i.alt, caption: i.caption || null })).filter((i) => i.url), ...style }} />
      ),
    },

    // ── BOOKING WIDGET ────────────────────────────────────────────────────────
    BookingWidgetBlock: {
      label: 'Booking Widget',
      fields: {
        heading: { type: 'text', label: 'Heading', contentEditable: true },
        subheading: { type: 'textarea', label: 'Subheading', contentEditable: true },
        embedUrl: { type: 'text', label: 'Widget Embed URL', placeholder: 'https://calendly.com/…' },
        widgetHeight: { type: 'select', label: 'Widget Height', options: [{ value: '400px', label: '400px' }, { value: '600px', label: '600px' }, { value: '800px', label: '800px' }, { value: '100vh', label: 'Full Screen' }] },
        ...allStyleFields(),
      },
      defaultProps: { heading: 'Book Your Adventure', subheading: '', embedUrl: '', widgetHeight: '600px', ...allStyleDefaults() },
      render: ({ heading, subheading, embedUrl, widgetHeight, height: _h, ...style }) => (
        <BookingWidgetBlockRenderer block={{ heading: heading || null, subheading: subheading || null, embedUrl: embedUrl || undefined, height: widgetHeight || undefined, ...style }} />
      ),
    },

    // ── BLOG POSTS ────────────────────────────────────────────────────────────
    BlogPostsBlock: {
      label: 'Blog / Stories Feed',
      fields: {
        title: { type: 'text', label: 'Section Title', contentEditable: true },
        limit: { type: 'number', label: 'Number of Posts', min: 1, max: 24, step: 1 },
        layout: { type: 'radio', label: 'Layout', options: [{ value: 'grid', label: 'Grid' }, { value: 'list', label: 'List' }] },
        ctaText: { type: 'text', label: 'See All Button Text', placeholder: 'View all stories' },
        ctaLink: { type: 'text', label: 'See All Button URL', placeholder: '/stories' },
        _posts: { type: 'custom', label: '', visible: false, render: () => <></> },
        ...allStyleFields(),
      },
      defaultProps: { title: 'Latest Stories', limit: 6, layout: 'grid', ctaText: 'View all stories', ctaLink: '/stories', _posts: [], ...allStyleDefaults() },
      resolveData: async ({ props }, { changed }) => {
        if (!changed.limit && props._posts?.length) return { props }
        try {
          const res = await fetch(`/api/stories?limit=${props.limit}&sort=-createdAt&depth=1`, { credentials: 'include' })
          if (!res.ok) return { props }
          const { docs } = await res.json()
          return { props: { ...props, _posts: docs } }
        } catch { return { props } }
      },
      render: ({ title, _posts, layout, ctaText, ctaLink, ...style }) => (
        <BlogPostsBlockRenderer block={{
          title: title || null,
          layout: layout || null,
          ctaText: ctaText || null,
          ctaLink: ctaLink || null,
          posts: (_posts ?? []) as Parameters<typeof BlogPostsBlockRenderer>[0]['block']['posts'],
          ...style,
        }} />
      ),
    },

    // ── SOCIAL FEED ───────────────────────────────────────────────────────────
    SocialFeedBlock: {
      label: 'Social Media Feed',
      fields: {
        title: { type: 'text', label: 'Section Title', contentEditable: true },
        columns: { type: 'select', label: 'Columns', options: [{ value: '2', label: '2' }, { value: '3', label: '3' }, { value: '4', label: '4' }] },
        posts: {
          type: 'array', label: 'Posts',
          arrayFields: {
            platform: { type: 'select', label: 'Platform', options: [{ value: 'instagram', label: 'Instagram' }, { value: 'twitter', label: 'Twitter / X' }, { value: 'facebook', label: 'Facebook' }, { value: 'tiktok', label: 'TikTok' }] },
            handle: { type: 'text', label: 'Handle (without @)', placeholder: 'sonsofmountains' },
            content: { type: 'textarea', label: 'Post Text', contentEditable: true },
            imageUrl: payloadMediaField('Post Image'),
            likes: { type: 'text', label: 'Likes Count', placeholder: '1.2k' },
            url: { type: 'text', label: 'Post URL' },
            date: { type: 'text', label: 'Date (ISO format)', placeholder: '2025-01-15' },
          },
          defaultItemProps: { platform: 'instagram', handle: 'sonsofmountains', content: '', imageUrl: '', likes: '', url: '', date: '' },
          getItemSummary: (item: { handle: string; platform: string }) => `@${item.handle || 'handle'} (${item.platform || 'instagram'})`,
          min: 1,
        },
        ...allStyleFields(),
      },
      defaultProps: {
        title: 'Follow Our Journey',
        columns: '3',
        posts: [
          { platform: 'instagram', handle: 'sonsofmountains', content: 'Another perfect summit day. The mountains never disappoint. #hiking #mountains', imageUrl: '', likes: '234', url: '', date: '' },
          { platform: 'instagram', handle: 'sonsofmountains', content: 'Fresh snow on the peaks this morning. Who is ready for winter season?', imageUrl: '', likes: '187', url: '', date: '' },
          { platform: 'instagram', handle: 'sonsofmountains', content: 'Our guides are the best in the Balkans. Meet the team at link in bio.', imageUrl: '', likes: '312', url: '', date: '' },
        ],
        ...allStyleDefaults(),
      },
      render: ({ title, columns, posts, ...style }) => (
        <SocialFeedBlockRenderer block={{ title: title || null, columns: columns || null, posts: posts.map((p) => ({ platform: p.platform, handle: p.handle, content: p.content, imageUrl: p.imageUrl || null, likes: p.likes || null, url: p.url || null, date: p.date || null })), ...style }} />
      ),
    },

    // ── NAVIGATION ────────────────────────────────────────────────────────────
    NavigationLinksBlock: {
      label: 'Navigation (Global)',
      fields: {
        navLinksLeft: {
          type: 'array', label: 'Left Links',
          arrayFields: {
            label: { type: 'text', label: 'Label', placeholder: 'ДЕСТИНАЦИИ' },
            href: { type: 'text', label: 'URL', placeholder: '/destinations' },
          },
          defaultItemProps: { label: '', href: '' },
          getItemSummary: (item: { label: string }) => item.label || 'Link',
        },
        navLinksRight: {
          type: 'array', label: 'Right Links',
          arrayFields: {
            label: { type: 'text', label: 'Label', placeholder: 'ГАЛЕРИЯ' },
            href: { type: 'text', label: 'URL', placeholder: '/gallery' },
          },
          defaultItemProps: { label: '', href: '' },
          getItemSummary: (item: { label: string }) => item.label || 'Link',
        },
        instagramUrl: { type: 'text', label: 'Instagram URL' },
        facebookUrl: { type: 'text', label: 'Facebook URL' },
        tiktokUrl: { type: 'text', label: 'TikTok URL' },
        logoDarkUrl: { type: 'text', label: 'Logo (dark bg) URL' },
        logoLightUrl: { type: 'text', label: 'Logo (light bg) URL' },
      },
      defaultProps: {
        navLinksLeft: [
          { label: 'ДЕСТИНАЦИИ', href: '/destinations' },
          { label: 'КАЛЕНДАР', href: '/calendar' },
          { label: 'ИСТОРИИ', href: '/stories' },
        ],
        navLinksRight: [
          { label: 'ГАЛЕРИЯ', href: '/gallery' },
          { label: 'БЛОГ', href: '/blog' },
          { label: 'ЗА НАС', href: '/about' },
          { label: 'КОНТАКТИ', href: '/contact' },
        ],
        instagramUrl: 'https://instagram.com/panicframe',
        facebookUrl: 'https://facebook.com/panicframe',
        tiktokUrl: '',
        logoDarkUrl: 'https://framerusercontent.com/images/sQ2kYkKWnh9M8mP6NCkfgP6bXuE.png',
        logoLightUrl: '',
      },
      render: (props) => <NavigationLinksBlock {...props} />,
    },

    // ── HERO ─────────────────────────────────────────────────────────────────
    HeroMainBlock: {
      label: 'Hero — Main',
      fields: {
        backgroundImage: payloadMediaField('Background Image'),
        backgroundImageUrl: { type: 'text', label: 'Background Image URL (fallback)' },
        overlayOpacity: { type: 'number', label: 'Overlay Opacity (0–100)', min: 0, max: 100 },
        contentAlign: {
          type: 'select', label: 'Content Alignment',
          options: [
            { value: 'center', label: 'Center' },
            { value: 'bottom-center', label: 'Bottom Center' },
            { value: 'bottom-left', label: 'Bottom Left' },
          ],
        },
        height: {
          type: 'select', label: 'Section Height',
          options: [
            { value: 'screen', label: 'Full screen' },
            { value: '80vh', label: '80vh' },
            { value: '60vh', label: '60vh' },
          ],
        },
      },
      defaultProps: {
        backgroundImageUrl: '',
        backgroundImage: '',
        overlayOpacity: 40,
        contentAlign: 'bottom-center',
        height: 'screen',
      },
      render: (props) => {
        const bgUrl = (typeof props.backgroundImage === 'object' && props.backgroundImage !== null
          ? (props.backgroundImage as { url?: string }).url
          : props.backgroundImageUrl) ?? props.backgroundImageUrl ?? ''
        return <HeroMainBlock {...props} backgroundImageUrl={bgUrl} />
      },
    },

    HeroHeadlineBlock: {
      label: 'Hero — Headline',
      fields: {
        text: { type: 'text', label: 'Headline Text' },
        fontSize: { type: 'text', label: 'Font Size (e.g. 4rem, 72px)' },
        color: { type: 'text', label: 'Color (CSS)' },
        fontWeight: {
          type: 'select', label: 'Font Weight',
          options: [
            { value: '400', label: 'Regular' },
            { value: '600', label: 'Semi-bold' },
            { value: '700', label: 'Bold' },
            { value: '800', label: 'Extra-bold' },
            { value: '900', label: 'Black' },
          ],
        },
        textAlign: {
          type: 'select', label: 'Text Align',
          options: [
            { value: 'left', label: 'Left' },
            { value: 'center', label: 'Center' },
            { value: 'right', label: 'Right' },
          ],
        },
      },
      defaultProps: {
        text: 'Преоткривай света с нас!',
        fontSize: '4rem',
        color: '#ffffff',
        fontWeight: '700',
        textAlign: 'center',
      },
      render: (props) => <HeroHeadlineBlock {...props} />,
    },

    HeroSubtextBlock: {
      label: 'Hero — Subtext',
      fields: {
        text: { type: 'textarea', label: 'Subtext' },
        fontSize: { type: 'text', label: 'Font Size (e.g. 1rem, 18px)' },
        color: { type: 'text', label: 'Color (CSS)' },
        textAlign: {
          type: 'select', label: 'Text Align',
          options: [
            { value: 'left', label: 'Left' },
            { value: 'center', label: 'Center' },
            { value: 'right', label: 'Right' },
          ],
        },
      },
      defaultProps: {
        text: 'Пътувай с Panic Frame там, където комфортът среща приключението.',
        fontSize: '1rem',
        color: 'rgba(255,255,255,0.65)',
        textAlign: 'center',
      },
      render: (props) => <HeroSubtextBlock {...props} />,
    },

    HeroCtaBlock: {
      label: 'Hero — CTA Button',
      fields: {
        label: { type: 'text', label: 'Button Label' },
        url: { type: 'text', label: 'URL' },
        style: {
          type: 'select', label: 'Style',
          options: [
            { value: 'filled-white', label: 'White filled' },
            { value: 'filled-black', label: 'Black filled' },
            { value: 'outline-white', label: 'White outline' },
          ],
        },
        fontSize: { type: 'text', label: 'Font Size' },
        align: {
          type: 'select', label: 'Alignment',
          options: [
            { value: 'left', label: 'Left' },
            { value: 'center', label: 'Center' },
            { value: 'right', label: 'Right' },
          ],
        },
      },
      defaultProps: {
        label: 'Виж всички дестинации',
        url: '/destinations',
        style: 'filled-white',
        fontSize: '0.75rem',
        align: 'center',
      },
      render: (props) => <HeroCtaBlock {...props} />,
    },

    // ── HOME DESTINATION CAROUSEL ─────────────────────────────────────────────
    HomeDestCarouselBlock: {
      label: 'Home — Destination Carousel',
      fields: {
        sectionTitle: { type: 'text', label: 'Section Title' },
        destinations: { type: 'custom', label: '', visible: false, render: () => <></> },
      },
      defaultProps: {
        sectionTitle: 'Дестинации',
        destinations: [],
      },
      render: (props: any) => <HomeDestinationCarouselBlock sectionTitle={props.sectionTitle} destinations={props.destinations ?? []} />,
    },

    // ── FOOTER ────────────────────────────────────────────────────────────────
    FooterBlock: {
      label: 'Footer (Global)',
      fields: {},
      defaultProps: {},
      render: () => <FooterBlockRenderer />,
    },

    FooterSubscribeBlock: {
      label: 'Footer — Subscribe',
      fields: {
        subscribeHeading: { type: 'text', label: 'Heading' },
        subscribeSubtext: { type: 'textarea', label: 'Subtext' },
        submitLabel: { type: 'text', label: 'Button Label' },
        firstNamePlaceholder: { type: 'text', label: 'First Name Placeholder' },
        lastNamePlaceholder: { type: 'text', label: 'Last Name Placeholder' },
        emailPlaceholder: { type: 'text', label: 'Email Placeholder' },
        consentText: { type: 'text', label: 'Consent Text' },
        consentLinkText: { type: 'text', label: 'Consent Link Text' },
        privacyUrl: { type: 'text', label: 'Privacy URL' },
      },
      defaultProps: {
        subscribeHeading: 'Абонирай се',
        subscribeSubtext: 'Научавай първи за предстоящи пътешествия, отстъпки и събития.',
        submitLabel: 'Абонирай се',
        firstNamePlaceholder: 'Име',
        lastNamePlaceholder: 'Фамилия',
        emailPlaceholder: 'E-mail адрес',
        consentText: 'С натискането на бутона "Абонирай се" се съгласяваш с',
        consentLinkText: 'Политиката ни за поверителност',
        privacyUrl: '/legal/cookies',
      },
      render: (props) => <FooterSubscribeBlock {...props} />,
    },

    FooterFollowBlock: {
      label: 'Footer — Follow Us',
      fields: {
        followHeading: { type: 'text', label: 'Heading' },
        followSubtext: { type: 'textarea', label: 'Subtext' },
        facebookUrl: { type: 'text', label: 'Facebook URL' },
        facebookFollowers: { type: 'text', label: 'Facebook Followers' },
        instagramUrl: { type: 'text', label: 'Instagram URL' },
        instagramFollowers: { type: 'text', label: 'Instagram Followers' },
      },
      defaultProps: {
        followHeading: 'Последвай ни!',
        followSubtext: 'Стани част от нашата общност и следи приключенията ни отблизо.',
        facebookUrl: 'https://facebook.com/panicframe',
        facebookFollowers: '20.2K',
        instagramUrl: 'https://instagram.com/panicframe',
        instagramFollowers: '23.8K',
      },
      render: (props) => <FooterFollowBlock {...props} />,
    },

    FooterTravelBlock: {
      label: 'Footer — Travel Links',
      fields: {
        travelSectionHeading: { type: 'text', label: 'Section Heading' },
      },
      defaultProps: {
        travelSectionHeading: 'ПЪТУВАЙ С НАС',
      },
      render: (props) => <FooterTravelBlock {...props} />,
    },

    FooterNavBlock: {
      label: 'Footer — Navigation',
      fields: {
        navSectionHeading: { type: 'text', label: 'Section Heading' },
      },
      defaultProps: {
        navSectionHeading: 'НАВИГАЦИЯ',
      },
      render: (props) => <FooterNavBlock {...props} />,
    },

    FooterBottomBlock: {
      label: 'Footer — Bottom Bar',
      fields: {
        copyright: { type: 'text', label: 'Copyright' },
        licenseText: { type: 'text', label: 'License Text' },
        insuranceText: { type: 'text', label: 'Insurance Text' },
        logoUrl: { type: 'text', label: 'Logo URL' },
        termsLabel: { type: 'text', label: 'Terms Label' },
        termsUrl: { type: 'text', label: 'Terms URL' },
        privacyLabel: { type: 'text', label: 'Privacy Label' },
        privacyUrl: { type: 'text', label: 'Privacy URL' },
        creditPrefix: { type: 'text', label: 'Credit Prefix' },
        creditName: { type: 'text', label: 'Credit Name' },
        creditUrl: { type: 'text', label: 'Credit URL' },
      },
      defaultProps: {
        copyright: '© 2018-2026 Паник Фрейм енд Травел',
        licenseText: 'Номер на лиценз: РК-01-8245 / 28.07.2022',
        insuranceText: 'Номер на застрахователна полица: 03700100005995 / 31.08.2025',
        logoUrl: '/white-logo.svg',
        termsLabel: 'Общи условия',
        termsUrl: '/legal/terms',
        privacyLabel: 'Политика за поверителност',
        privacyUrl: '/legal/cookies',
        creditPrefix: 'Дизайн и разработка от',
        creditName: 'Netinsky',
        creditUrl: 'https://netinsky.com',
      },
      render: (props) => <FooterBottomBlock {...props} />,
    },

    GalleryHeroBlock: {
      label: 'Gallery Hero',
      fields: {
        heading: { type: 'text', label: 'Heading', contentEditable: true },
        subheading: { type: 'textarea', label: 'Subheading' },
        ctaLabel: { type: 'text', label: 'CTA Label' },
      },
      defaultProps: {
        heading: 'Фото галерии от нашите дестинации',
        subheading: 'Разгледай снимки от наши приключения по света.',
        ctaLabel: 'Виж всички снимки',
      },
      render: (props: any) => <GalleryHeroBlock {...props} />,
    },

    GalleryGridBlock: {
      label: 'Gallery Grid',
      fields: {},
      defaultProps: {},
      render: () => (
        <div className="px-6 py-8 text-white/40 text-sm text-center">
          Gallery Grid — collections pulled from Payload Gallery global
        </div>
      ),
    },

    ShopHeroBlock: {
      label: 'Shop — Hero',
      fields: {
        title: { type: 'text', label: 'Title' },
        subtitle: { type: 'textarea', label: 'Subtitle' },
        imageUrl: { type: 'text', label: 'Image URL' },
      },
      defaultProps: {
        title: 'Adventure Shop',
        subtitle: 'Discover our collection',
        imageUrl: '',
      },
      render: (props: any) => (
        <div className="px-6 py-12 text-center">
          {props.imageUrl && <img src={props.imageUrl} alt={props.title} className="w-full max-w-xl mx-auto mb-6 rounded-lg" />}
          <h1 className="text-4xl font-bold mb-4">{props.title}</h1>
          <p className="text-lg opacity-75">{props.subtitle}</p>
        </div>
      ),
    },

    ShopFeaturedBlock: {
      label: 'Shop — Featured Categories',
      fields: {
        title: { type: 'text', label: 'Title' },
        items: { type: 'array', label: 'Categories', arrayFields: [{ name: 'name', type: 'text', label: 'Name' }] },
      },
      defaultProps: {
        title: 'Featured Categories',
        items: [],
      },
      render: (props: any) => (
        <div className="px-6 py-12">
          <h2 className="text-3xl font-bold mb-8 text-center">{props.title}</h2>
          <div className="grid grid-cols-3 gap-6 max-w-3xl mx-auto">
            {props.items?.length ? props.items.map((item: any, i: number) => (
              <div key={i} className="bg-white/10 rounded-lg p-6 text-center">{item.name || 'Category'}</div>
            )) : <p className="col-span-3 text-center opacity-40">Add categories in the panel →</p>}
          </div>
        </div>
      ),
    },

    ShopBannerBlock: {
      label: 'Shop — Banner',
      fields: {
        text: { type: 'text', label: 'Banner Text' },
        cta: { type: 'text', label: 'CTA Text' },
        ctaHref: { type: 'text', label: 'CTA URL' },
      },
      defaultProps: {
        text: 'Free shipping over €100',
        cta: 'Shop Now',
        ctaHref: '/shop',
      },
      render: (props: any) => (
        <div className="px-6 py-8 bg-white/5 rounded-lg max-w-2xl mx-auto text-center mb-12">
          <p className="text-lg mb-4">{props.text}</p>
          <a href={props.ctaHref} className="inline-block px-6 py-3 bg-white/20 rounded hover:bg-white/30 transition-colors">
            {props.cta}
          </a>
        </div>
      ),
    },

    GiftVoucherPromoBlock: {
      label: 'Shop — Gift Vouchers',
      fields: {
        title: { type: 'text', label: 'Title' },
        description: { type: 'textarea', label: 'Description' },
      },
      defaultProps: {
        title: 'Gift Vouchers',
        description: 'Give the gift of adventure',
      },
      render: (props: any) => (
        <div className="px-6 py-12 bg-white/5 rounded-lg max-w-2xl mx-auto text-center">
          <h3 className="text-2xl font-bold mb-4">{props.title}</h3>
          <p className="opacity-75">{props.description}</p>
        </div>
      ),
    },

    BundleShowcaseBlock: {
      label: 'Shop — Bundles',
      fields: {
        title: { type: 'text', label: 'Title' },
      },
      defaultProps: {
        title: 'Shop Bundles',
      },
      render: (props: any) => (
        <div className="px-6 py-12 text-center">
          <h3 className="text-3xl font-bold">{props.title}</h3>
        </div>
      ),
    },
  },

  // ── Root ──────────────────────────────────────────────────────────────────
  root: {
    fields: {
      bgColor: colorField('Page Background Color', BG_ICON),
      fontFamily: { type: 'select', label: 'Font Family', options: [{ value: 'system', label: 'System' }, { value: 'serif', label: 'Serif' }, { value: 'mono', label: 'Monospace' }] },
      maxWidth: { type: 'select', label: 'Max Width', options: [{ value: '100%', label: 'Full' }, { value: '1440px', label: '1440px' }] },
    },
    defaultProps: { bgColor: '#0a0a0a', fontFamily: 'system', maxWidth: '100%' },
    render: ({ children, bgColor, fontFamily, maxWidth }: any) => {
      const fontMap: Record<string, string> = {
        system: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        serif: 'Georgia, serif',
        mono: '"Courier New", monospace',
      }
      return (
        <div style={{
          backgroundColor: bgColor || '#0a0a0a',
          minHeight: '100vh',
          fontFamily: fontMap[fontFamily] || fontMap.system,
        }}>
          <div style={{ maxWidth: maxWidth || '100%', margin: '0 auto', width: '100%' }}>
            {children}
          </div>
        </div>
      )
    },
  },

    WhyTravelWithUsBlock: {
      label: 'Why Travel With Us',
      fields: {
        heading: { type: 'text', label: 'Heading' },
        items: {
          type: 'array',
          label: 'Items',
          arrayFields: {
            icon: { type: 'select', label: 'Icon', options: [{ value: 'camera', label: 'Camera' }, { value: 'globe', label: 'Globe' }, { value: 'city', label: 'City' }] },
            title: { type: 'text', label: 'Title' },
            body: { type: 'textarea', label: 'Body' },
          },
        },
      },
      defaultProps: {
        heading: 'ЗАЩО ДА ПЪТУВАШ С НАС?',
        items: [
          { icon: 'camera', title: 'Автентичност', body: 'Пътувания, в които се сливаш с мястото, не просто го снимаш.' },
          { icon: 'globe', title: 'Общност', body: 'Малки групи от хора със сходен дух и жажда за приключения.' },
          { icon: 'city', title: 'Смисъл', body: 'Моменти, които остават в съзнанието дълго след като се приберeш.' },
        ],
      },
      render: (props: any) => <WhyTravelWithUsBlock {...props} />,
    },

    FeaturedTravelsBlock: {
      label: 'Featured Travels Grid',
      fields: {
        heading: { type: 'text', label: 'Section heading' },
      },
      defaultProps: {
        heading: 'ИЗБЕРИ СВОЕТО ПЪТУВАНЕ',
      },
      render: ({ heading }: any) => (
        <div style={{ padding: '2rem', background: '#0a0a0a', color: 'white', textAlign: 'center', borderRadius: 8 }}>
          <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.2em', opacity: 0.4, textTransform: 'uppercase', marginBottom: 8 }}>{heading}</p>
          <p style={{ fontSize: 13, opacity: 0.3 }}>Grid items are managed via the Payload Admin → Site Settings → Featured Travels global.</p>
        </div>
      ),
    },

    CalendarCtaBlock: {
      label: 'Calendar CTA Banner',
      fields: {
        heading: { type: 'text', label: 'Heading' },
        subheading: { type: 'text', label: 'Subheading' },
        buttonText: { type: 'text', label: 'Button Text' },
        buttonUrl: { type: 'text', label: 'Button URL' },
      },
      defaultProps: {
        heading: 'Търсиш следващото приключение?',
        subheading: 'Разгледай всички предстоящи пътувания.',
        buttonText: 'Виж календара',
        buttonUrl: '/calendar',
      },
      render: (props: any) => <CalendarCtaBlock {...props} />,
    },

    TestimonialsMarqueeBlock: {
      label: 'Testimonials Marquee',
      fields: {
        heading: { type: 'text', label: 'Section Heading' },
        subheading: { type: 'text', label: 'Section Subheading' },
      },
      defaultProps: {
        heading: 'Какво казват нашите клиенти',
        subheading: 'Реални истории от реални пътешественици.',
      },
      render: ({ heading, subheading }: any) => (
        <div style={{ padding: '2rem', background: '#111111', color: 'white', textAlign: 'center', borderRadius: 8 }}>
          <p style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0 0 0.5rem' }}>{heading}</p>
          <p style={{ fontSize: '0.875rem', opacity: 0.5, margin: '0 0 1rem' }}>{subheading}</p>
          <p style={{ fontSize: 12, opacity: 0.3 }}>Testimonials cards are managed in Payload Admin → Content → Testimonials.</p>
        </div>
      ),
    },
}

// ── Multi-column Layout Component ──────────────────────────────────────────────
export function createLayoutConfig(columns: number) {
  const columnOptions = Array.from({ length: 12 }, (_, i) => ({ value: String(i + 1), label: `${i + 1} col` }))

  return {
    label: `Grid Layout (${columns} cols)`,
    fields: {
      gap: { type: 'select', label: 'Gap', options: [{ value: '8px', label: 'XS (8px)' }, { value: '16px', label: 'Small (16px)' }, { value: '24px', label: 'Medium (24px)' }, { value: '32px', label: 'Large (32px)' }] },
      ...allStyleFields(),
    },
    defaultProps: { gap: '24px', ...allStyleDefaults() },
    render: ({ gap, children, ...style }: any) => (
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: gap || '24px',
        backgroundColor: style.bgColor || undefined,
        color: style.textColor || undefined,
        padding: `${style.paddingTop || '0'} ${style.paddingX || '0'} ${style.paddingBottom || '0'}`,
        borderRadius: style.borderRadius || undefined,
      }}>
        {Array.isArray(children) ? children : [children]}
      </div>
    ),
  }
}
