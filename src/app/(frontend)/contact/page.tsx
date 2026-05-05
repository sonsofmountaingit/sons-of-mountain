import type { Metadata } from 'next'
import { ContactForm } from '@/components/forms/ContactForm'

export const metadata: Metadata = { title: 'Контакти' }

const FAQ_ITEMS = [
  { q: 'Как да се запиша за пътуване?', a: 'Намери желаното пътуване на страницата на дестинацията и кликни "ЗАПИШИ СЕ". Ще те се обадим в рамките на 24 часа.' },
  { q: 'Колко струва депозитът?', a: 'Депозитът обикновено е 30% от цената на пътуването. Останалата сума се плаща 30 дни преди заминаването.' },
  { q: 'Какво включва цената?', a: 'Всяко пътуване има различен пакет. Проверявай детайлите на страницата на конкретното пътуване.' },
  { q: 'Мога ли да пътувам сам?', a: 'Да! Повечето ни пътувания са отворени за соло пътешественици. Имаме и специални Singles Only турове.' },
  { q: 'Как да отменя записване?', a: 'Свържи се с нас по имейл или телефон. Условията за анулиране са описани в общите условия.' },
]

export default function ContactPage() {
  return (
    <div className="pt-24 pb-20 px-6 min-h-screen">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-bold mb-4">Контакти</h1>
        <p className="text-white/50 mb-12 text-lg">Имаш въпрос? Пиши ни.</p>

        <ContactForm />

        <div className="mt-20">
          <h2 className="text-3xl font-bold mb-8">Често задавани въпроси</h2>
          <div className="space-y-2">
            {FAQ_ITEMS.map((item, i) => (
              <details key={i} className="group border border-white/10 rounded-lg overflow-hidden">
                <summary className="flex items-center justify-between px-6 py-4 cursor-pointer text-sm font-medium hover:bg-white/5 transition-colors list-none">
                  {item.q}
                  <span className="flex-shrink-0 ml-4 text-white/40 group-open:rotate-45 transition-transform duration-200">+</span>
                </summary>
                <div className="px-6 pb-5 text-sm text-white/60 leading-relaxed">
                  {item.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
