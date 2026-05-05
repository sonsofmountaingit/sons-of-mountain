'use client'

import { HeroBlockRenderer } from './HeroBlockRenderer'
import { DestinationCarouselRenderer } from './DestinationCarouselRenderer'
import { TextBlockRenderer } from './TextBlockRenderer'
import { RichTextBlockRenderer } from './RichTextBlockRenderer'
import { ImageGalleryRenderer } from './ImageGalleryRenderer'
import { FAQBlockRenderer } from './FAQBlockRenderer'
import { CTABlockRenderer } from './CTABlockRenderer'
import { StoriesBlockRenderer } from './StoriesBlockRenderer'
import { TeamBlockRenderer } from './TeamBlockRenderer'
import { MediaLogosRenderer } from './MediaLogosRenderer'
import { QuoteBlockRenderer } from './QuoteBlockRenderer'
import { VideoBlockRenderer } from './VideoBlockRenderer'

type Block = { blockType: string } & Record<string, unknown>

const map: Record<string, React.ComponentType<{ block: Block }>> = {
  hero: HeroBlockRenderer as never,
  'destination-carousel': DestinationCarouselRenderer as never,
  text: TextBlockRenderer as never,
  'rich-text': RichTextBlockRenderer as never,
  'image-gallery': ImageGalleryRenderer as never,
  faq: FAQBlockRenderer as never,
  cta: CTABlockRenderer as never,
  stories: StoriesBlockRenderer as never,
  team: TeamBlockRenderer as never,
  'media-logos': MediaLogosRenderer as never,
  quote: QuoteBlockRenderer as never,
  video: VideoBlockRenderer as never,
}

export function ClientBlockRenderer({ blocks }: { blocks: Block[] }) {
  if (!blocks?.length) return null
  return (
    <>
      {blocks.map((block, i) => {
        const Cmp = map[block.blockType]
        return Cmp ? <Cmp key={i} block={block} /> : null
      })}
    </>
  )
}
