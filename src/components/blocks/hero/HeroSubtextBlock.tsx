'use client'

interface HeroSubtextBlockProps {
  text?: string
  fontSize?: string
  color?: string
  textAlign?: string
}

export function HeroSubtextBlock({
  text = 'Пътувай с Panic Frame там, където комфортът среща приключението.',
  fontSize = '1rem',
  color = 'rgba(255,255,255,0.65)',
  textAlign = 'center',
}: HeroSubtextBlockProps) {
  return (
    <p style={{ fontSize, color, textAlign: textAlign as any, lineHeight: 1.6, margin: '0.75rem 0' }}>
      {text}
    </p>
  )
}
