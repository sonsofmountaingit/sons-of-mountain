import { BlockWrapper, type BlockStyleProps } from '@/puck/BlockWrapper'

interface BookingWidgetBlockProps {
  block: {
    heading?: string | null
    subheading?: string | null
    embedUrl?: string | null
    height?: string | null
  } & BlockStyleProps
}

export function BookingWidgetBlockRenderer({ block }: BookingWidgetBlockProps) {
  const { heading, subheading, embedUrl, height, ...styleProps } = block
  return (
    <BlockWrapper props={styleProps} innerClassName="max-w-4xl mx-auto px-6">
      {heading && <h2 className="text-3xl font-bold mb-3 text-center">{heading}</h2>}
      {subheading && <p className="opacity-60 mb-8 text-center">{subheading}</p>}
      <div className="relative w-full rounded-2xl overflow-hidden bg-white/5 border border-white/10" style={{ height: height || '600px' }}>
        {embedUrl ? (
          <iframe src={embedUrl} width="100%" height="100%" style={{ border: 0 }} title={heading || 'Booking'} />
        ) : (
          <div className="w-full h-full flex items-center justify-center opacity-30 text-sm">
            Paste a booking widget URL (Calendly, FareHarbor, etc.) in the panel →
          </div>
        )}
      </div>
    </BlockWrapper>
  )
}
