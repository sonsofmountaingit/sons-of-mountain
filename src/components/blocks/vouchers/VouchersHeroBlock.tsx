type Props = {
  eyebrow?: string
  heading?: string
  subtext?: string
}

export function VouchersHeroBlock({
  eyebrow = 'Sons of Mountains',
  heading = 'Подаръчни ваучери',
  subtext = 'Подари приключение — или се поглези сам. Валиден за всеки преход, програма или продукт.',
}: Props) {
  return (
    <div className="mb-16 text-center">
      <p className="text-xs tracking-[0.3em] text-white/30 uppercase mb-4">{eyebrow}</p>
      <h1 className="text-4xl font-light tracking-wide">{heading}</h1>
      <p className="mt-4 text-white/40 max-w-md mx-auto text-sm leading-relaxed">{subtext}</p>
    </div>
  )
}
