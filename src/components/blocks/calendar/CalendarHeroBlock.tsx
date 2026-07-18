interface Props {
  heading?: string
  subheading?: string
}

export function CalendarHeroBlock({ heading = 'Календар', subheading = 'Предстоящи пътувания и програми по месец' }: Props) {
  return (
    <div className="pt-24 pb-6 px-4 sm:pt-28 sm:pb-8 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold mb-3 sm:mb-4 text-zinc-900">{heading}</h1>
        <p className="text-zinc-500 text-sm sm:text-lg">{subheading}</p>
      </div>
    </div>
  )
}
