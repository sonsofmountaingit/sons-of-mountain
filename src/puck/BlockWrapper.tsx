'use client'

import { useRef } from 'react'
import { motion, useInView } from 'motion/react'

export interface BlockStyleProps {
  bgColor?: string
  bgGradientFrom?: string
  bgGradientTo?: string
  bgGradientDir?: string
  bgImage?: string
  bgImagePosition?: string
  bgImageOverlayColor?: string
  bgImageOverlayOpacity?: string
  textColor?: string
  textAlign?: string
  paddingTop?: string
  paddingBottom?: string
  paddingX?: string
  contentMaxWidth?: string
  borderRadius?: string
  borderWidth?: string
  borderColor?: string
  boxShadow?: string
  hideOnMobile?: string
  hideOnTablet?: string
  hideOnDesktop?: string
  animation?: string
  animationDelay?: string
  fontSize?: string
  fontWeight?: string
  letterSpacing?: string
  lineHeight?: string
  width?: string
  height?: string
  minHeight?: string
  maxHeight?: string
  marginTop?: string
  marginBottom?: string
  overflow?: string
  position?: string
  zIndex?: string
}

const SHADOW_MAP: Record<string, string | undefined> = {
  none: undefined,
  sm: '0 1px 3px rgba(0,0,0,0.3)',
  md: '0 4px 16px rgba(0,0,0,0.4)',
  lg: '0 10px 40px rgba(0,0,0,0.5)',
  xl: '0 20px 60px rgba(0,0,0,0.6)',
  glow: '0 0 60px rgba(255,255,255,0.08)',
}

const ANIM_VARIANTS: Record<string, { hidden: object; visible: object }> = {
  fadeIn:    { hidden: { opacity: 0 }, visible: { opacity: 1 } },
  slideUp:   { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0 } },
  slideLeft: { hidden: { opacity: 0, x: 60 }, visible: { opacity: 1, x: 0 } },
  zoom:      { hidden: { opacity: 0, scale: 0.92 }, visible: { opacity: 1, scale: 1 } },
}

interface BlockWrapperProps {
  props: BlockStyleProps
  children: React.ReactNode
  className?: string
  innerClassName?: string
  noDefaultPadding?: boolean
}

export function BlockWrapper({ props, children, className = '', innerClassName = '', noDefaultPadding = false }: BlockWrapperProps) {
  const ref = useRef<Element>(null)
  const anim = props.animation && props.animation !== 'none' ? props.animation : null
  const inView = useInView(ref, { once: true, margin: '-50px' })

  // Background
  let background: string | undefined
  if (props.bgGradientFrom && props.bgGradientTo) {
    const dir = props.bgGradientDir || '180deg'
    background = `linear-gradient(${dir}, ${props.bgGradientFrom}, ${props.bgGradientTo})`
  } else {
    background = props.bgColor || undefined
  }

  const hasBgImage = Boolean(props.bgImage)

  // Visibility
  const visClass = [
    props.hideOnMobile === 'true' ? 'max-sm:hidden' : '',
    props.hideOnTablet === 'true' ? 'sm:hidden md:block' : '',
    props.hideOnDesktop === 'true' ? 'lg:hidden' : '',
  ].filter(Boolean).join(' ')

  const sectionStyle: React.CSSProperties = {
    position: (props.position as React.CSSProperties['position']) || (hasBgImage ? 'relative' : undefined),
    background: !hasBgImage ? background : undefined,
    color: props.textColor || undefined,
    paddingTop: noDefaultPadding ? (props.paddingTop || undefined) : (props.paddingTop || '4rem'),
    paddingBottom: noDefaultPadding ? (props.paddingBottom || undefined) : (props.paddingBottom || '4rem'),
    paddingLeft: props.paddingX || undefined,
    paddingRight: props.paddingX || undefined,
    borderRadius: props.borderRadius || undefined,
    border: props.borderWidth && props.borderWidth !== 'none'
      ? `${props.borderWidth} solid ${props.borderColor || 'rgba(255,255,255,0.15)'}`
      : undefined,
    boxShadow: SHADOW_MAP[props.boxShadow || 'none'],
    textAlign: (props.textAlign as React.CSSProperties['textAlign']) || undefined,
    fontSize: props.fontSize || undefined,
    fontWeight: props.fontWeight as React.CSSProperties['fontWeight'] || undefined,
    letterSpacing: props.letterSpacing || undefined,
    lineHeight: props.lineHeight || undefined,
    overflow: (props.overflow as React.CSSProperties['overflow']) || (hasBgImage ? 'hidden' : undefined),
    width: props.width || undefined,
    height: props.height || undefined,
    minHeight: props.minHeight || undefined,
    maxHeight: props.maxHeight || undefined,
    marginTop: props.marginTop || undefined,
    marginBottom: props.marginBottom || undefined,
    zIndex: props.zIndex ? Number(props.zIndex) : undefined,
  }

  const Outer = anim ? motion.section : 'section'
  const animProps = anim && ANIM_VARIANTS[anim]
    ? {
        ref,
        initial: 'hidden' as const,
        animate: inView ? 'visible' : 'hidden',
        variants: ANIM_VARIANTS[anim],
        transition: { duration: 0.65, ease: [0.25, 0.46, 0.45, 0.94], delay: parseFloat(props.animationDelay || '0') },
      }
    : anim ? { ref } : {}

  return (
    <Outer
      style={sectionStyle}
      className={[visClass, className].filter(Boolean).join(' ')}
      {...(animProps as object)}
    >
      {hasBgImage && (
        <>
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: `url(${props.bgImage})`,
            backgroundSize: 'cover',
            backgroundPosition: props.bgImagePosition || 'center',
            zIndex: 0,
          }} />
          {props.bgImageOverlayOpacity && props.bgImageOverlayOpacity !== '0' && (
            <div style={{
              position: 'absolute', inset: 0,
              backgroundColor: props.bgImageOverlayColor || '#000000',
              opacity: parseFloat(props.bgImageOverlayOpacity),
              zIndex: 1,
            }} />
          )}
          {background && (
            <div style={{ position: 'absolute', inset: 0, background, zIndex: 2 }} />
          )}
        </>
      )}
      <div className={`${hasBgImage ? 'relative z-10' : ''} ${innerClassName}`} style={{ maxWidth: props.contentMaxWidth || undefined, margin: props.contentMaxWidth ? '0 auto' : undefined }}>
        {children}
      </div>
    </Outer>
  )
}
