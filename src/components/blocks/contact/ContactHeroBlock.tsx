interface Props {
  heading?: string
  subheading?: string
}

export function ContactHeroBlock({ heading = 'Контакти', subheading = 'Имаш въпрос? Пиши ни.' }: Props) {
  return (
    <div className="pt-24 pb-8 px-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-bold mb-4">{heading}</h1>
        <p className="text-white/50 text-lg">{subheading}</p>
      </div>
    </div>
  )
}
