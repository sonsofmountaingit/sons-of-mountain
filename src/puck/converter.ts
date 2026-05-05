import type { Data } from '@puckeditor/core'

const BLOCK_TYPE_MAP: Record<string, string> = {
  hero: 'HeroBlock',
  text: 'TextBlock',
  'rich-text': 'RichTextBlock',
  cta: 'CTABlock',
  quote: 'QuoteBlock',
  faq: 'FAQBlock',
  'image-gallery': 'ImageGalleryBlock',
  video: 'VideoBlock',
  team: 'TeamBlock',
  'media-logos': 'MediaLogosBlock',
  stories: 'StoriesBlock',
  'destination-carousel': 'DestinationCarouselBlock',
}

function extractLexicalText(node: unknown): string {
  if (!node || typeof node !== 'object') return ''
  const n = node as Record<string, unknown>
  if (n.type === 'text') return (n.text as string) ?? ''
  if (Array.isArray(n.children)) {
    return (n.children as unknown[]).map(extractLexicalText).join(' ')
  }
  if (n.root) return extractLexicalText(n.root)
  return ''
}

function makeId(): string {
  return Math.random().toString(36).slice(2, 10)
}

export function payloadLayoutToPuck(layout: Record<string, unknown>[]): Data {
  const content: Data['content'] = []

  for (const block of layout) {
    const blockType = block.blockType as string
    const puckType = BLOCK_TYPE_MAP[blockType]
    if (!puckType) continue

    const id = (block.id as string) || makeId()

    switch (blockType) {
      case 'hero': {
        const bgImg = block.backgroundImage as Record<string, unknown> | null
        content.push({
          type: 'HeroBlock',
          props: {
            id,
            headline: (block.headline as string) ?? '',
            subheadline: (block.subheadline as string) ?? '',
            backgroundImageUrl: (bgImg?.url as string) ?? '',
            ctaText: (block.ctaText as string) ?? '',
            ctaLink: (block.ctaLink as string) ?? '',
            bgColor: (block.bgColor as string) ?? '#0a0a0a',
            textColor: (block.textColor as string) ?? '#ffffff',
            variant: (block.variant as string) ?? 'fullscreen',
          },
        })
        break
      }

      case 'text':
        content.push({
          type: 'TextBlock',
          props: {
            id,
            heading: (block.heading as string) ?? '',
            content: (block.content as string) ?? '',
            alignment: (block.alignment as string) ?? 'left',
            variant: (block.variant as string) ?? 'contained',
            bgColor: (block.bgColor as string) ?? '',
            textColor: (block.textColor as string) ?? '',
            padding: (block.padding as string) ?? 'md',
            ctaText: (block.ctaText as string) ?? '',
            ctaLink: (block.ctaLink as string) ?? '',
          },
        })
        break

      case 'rich-text':
        content.push({
          type: 'RichTextBlock',
          props: {
            id,
            content: extractLexicalText(block.content),
            variant: (block.variant as string) ?? 'contained',
            bgColor: (block.bgColor as string) ?? '',
            textColor: (block.textColor as string) ?? '',
          },
        })
        break

      case 'cta':
        content.push({
          type: 'CTABlock',
          props: {
            id,
            headline: (block.headline as string) ?? '',
            body: (block.body as string) ?? '',
            buttonText: (block.buttonText as string) ?? '',
            buttonLink: (block.buttonLink as string) ?? '',
            bgColor: (block.bgColor as string) ?? '#111111',
            textColor: (block.textColor as string) ?? '#ffffff',
            variant: (block.variant as string) ?? 'centered',
          },
        })
        break

      case 'quote':
        content.push({
          type: 'QuoteBlock',
          props: {
            id,
            quote: (block.quote as string) ?? '',
            author: (block.author as string) ?? '',
            role: (block.role as string) ?? '',
          },
        })
        break

      case 'faq': {
        const rawItems = (block.items as Record<string, unknown>[]) ?? []
        content.push({
          type: 'FAQBlock',
          props: {
            id,
            title: (block.title as string) ?? '',
            items: rawItems.map((item) => ({
              question: (item.question as string) ?? '',
              answer: extractLexicalText(item.answer),
            })),
          },
        })
        break
      }

      case 'image-gallery': {
        const rawImages = (block.images as Record<string, unknown>[]) ?? []
        content.push({
          type: 'ImageGalleryBlock',
          props: {
            id,
            title: (block.title as string) ?? '',
            layout: (block.layout as string) ?? 'scroll',
            images: rawImages.map((img) => {
              const image = img.image as Record<string, unknown> | null
              return {
                url: (image?.url as string) ?? '',
                alt: (image?.alt as string) ?? '',
                caption: (img.caption as string) ?? '',
              }
            }),
          },
        })
        break
      }

      case 'video': {
        const poster = block.poster as Record<string, unknown> | null
        content.push({
          type: 'VideoBlock',
          props: {
            id,
            url: (block.url as string) ?? '',
            posterUrl: (poster?.url as string) ?? '',
            caption: (block.caption as string) ?? '',
            autoPlay: Boolean(block.autoPlay),
            muted: block.muted !== false,
            loop: block.loop !== false,
          },
        })
        break
      }

      case 'team': {
        const rawMembers = (block.members as Record<string, unknown>[]) ?? []
        content.push({
          type: 'TeamBlock',
          props: {
            id,
            title: (block.title as string) ?? '',
            members: rawMembers.map((m) => {
              const photo = m.photo as Record<string, unknown> | null
              return {
                name: (m.name as string) ?? '',
                role: (m.role as string) ?? '',
                bio: (m.bio as string) ?? '',
                photoUrl: (photo?.url as string) ?? '',
              }
            }),
          },
        })
        break
      }

      case 'media-logos': {
        const rawLogos = (block.logos as Record<string, unknown>[]) ?? []
        content.push({
          type: 'MediaLogosBlock',
          props: {
            id,
            title: (block.title as string) ?? '',
            logos: rawLogos.map((l) => ({
              name: (l.name as string) ?? '',
              url: (l.url as string) ?? '',
            })),
          },
        })
        break
      }

      case 'stories':
        content.push({
          type: 'StoriesBlock',
          props: {
            id,
            title: (block.title as string) ?? 'Stories',
            limit: (block.limit as number) ?? 6,
          },
        })
        break

      case 'destination-carousel':
        content.push({
          type: 'DestinationCarouselBlock',
          props: {
            id,
            title: (block.title as string) ?? 'Destinations',
            limit: (block.limit as number) ?? 20,
          },
        })
        break
    }
  }

  return { content, root: { props: {} } }
}
