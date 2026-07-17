interface Props {
  heading?: string
  subheading?: string
}

export function ContactHeroBlock({ heading = 'Contacts', subheading = 'Have a question? Write to us.' }: Props) {
  return (
    <div className="pt-12 pb-6 px-4 sm:pt-24 sm:pb-8 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl sm:text-5xl md:text-6xl font-bold mb-2 sm:mb-4">{heading}</h1>
        <p className="text-white/50 text-sm sm:text-lg">{subheading}</p>
      </div>
    </div>
  )
}
