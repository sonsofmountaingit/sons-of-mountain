interface Props {
  heading?: string
  subheading?: string
}

export function CalendarHeroBlock({ heading = 'Calendar', subheading = 'Upcoming journeys and programs by month' }: Props) {
  return (
    <div className="pt-28 pb-8 px-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-bold mb-4 text-zinc-900">{heading}</h1>
        <p className="text-zinc-500 text-lg">{subheading}</p>
      </div>
    </div>
  )
}
