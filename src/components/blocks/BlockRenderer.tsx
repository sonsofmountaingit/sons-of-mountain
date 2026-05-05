// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Block = any

interface BlockRendererProps {
  blocks: Block[]
}

export async function BlockRenderer({ blocks }: BlockRendererProps) {
  if (!blocks || blocks.length === 0) return null

  const rendered = await Promise.all(
    blocks.map(async (block, i) => {
      switch (block.blockType) {
        case 'hero': {
          const { HeroBlockRenderer } = await import('./HeroBlockRenderer')
          return <HeroBlockRenderer key={i} block={block} />
        }
        case 'destination-carousel': {
          const { DestinationCarouselRenderer } = await import('./DestinationCarouselRenderer')
          return <DestinationCarouselRenderer key={i} block={block} />
        }
        case 'text': {
          const { TextBlockRenderer } = await import('./TextBlockRenderer')
          return <TextBlockRenderer key={i} block={block} />
        }
        case 'rich-text': {
          const { RichTextBlockRenderer } = await import('./RichTextBlockRenderer')
          return <RichTextBlockRenderer key={i} block={block} />
        }
        case 'image-gallery': {
          const { ImageGalleryRenderer } = await import('./ImageGalleryRenderer')
          return <ImageGalleryRenderer key={i} block={block} />
        }
        case 'faq': {
          const { FAQBlockRenderer } = await import('./FAQBlockRenderer')
          return <FAQBlockRenderer key={i} block={block} />
        }
        case 'cta': {
          const { CTABlockRenderer } = await import('./CTABlockRenderer')
          return <CTABlockRenderer key={i} block={block} />
        }
        case 'stories': {
          const { StoriesBlockRenderer } = await import('./StoriesBlockRenderer')
          return <StoriesBlockRenderer key={i} block={block} />
        }
        case 'team': {
          const { TeamBlockRenderer } = await import('./TeamBlockRenderer')
          return <TeamBlockRenderer key={i} block={block} />
        }
        case 'media-logos': {
          const { MediaLogosRenderer } = await import('./MediaLogosRenderer')
          return <MediaLogosRenderer key={i} block={block} />
        }
        case 'quote': {
          const { QuoteBlockRenderer } = await import('./QuoteBlockRenderer')
          return <QuoteBlockRenderer key={i} block={block} />
        }
        case 'video': {
          const { VideoBlockRenderer } = await import('./VideoBlockRenderer')
          return <VideoBlockRenderer key={i} block={block} />
        }
        default:
          return null
      }
    })
  )

  return <>{rendered}</>
}
