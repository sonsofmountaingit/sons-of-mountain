import type { Metadata } from 'next'
import { unstable_cache } from 'next/cache'
import { getPayload } from 'payload'
import config from '@payload-config'
import { ContactForm } from '@/components/forms/ContactForm'
import { ContactHeroBlock } from '@/components/blocks/contact/ContactHeroBlock'
import { ContactFAQBlock } from '@/components/blocks/contact/ContactFAQBlock'
import { PuckRender } from '@/components/blocks/PuckRender'
import type { Data } from '@puckeditor/core'

export const dynamic = 'force-dynamic'

const getContactPage = unstable_cache(
  async () => {
    try {
      const payload = await getPayload({ config })
      return await payload.findGlobal({ slug: 'contact-page', depth: 0, overrideAccess: true })
    } catch { return null }
  },
  ['contact-page-global'],
  { tags: ['contact-page'], revalidate: false },
)

export const metadata: Metadata = { title: 'Контакти' }

export default async function ContactPage() {
  const d = (await getContactPage()) as any
  const puckData = d?.puckData as Data | null | undefined

  if (puckData?.content?.length) {
    return <PuckRender data={puckData} />
  }

  const faqItems = ((d?.faqItems ?? []) as { question: string; answer: string }[]).length
    ? (d.faqItems as { question: string; answer: string }[])
    : [
        { question: 'Как да се запиша за пътуване?', answer: 'Намери желаното пътуване на страницата на дестинацията и кликни "ЗАПИШИ СЕ". Ще те се обадим в рамките на 24 часа.' },
        { question: 'Колко струва депозитът?', answer: 'Депозитът обикновено е 30% от цената на пътуването. Останалата сума се плаща 30 дни преди заминаването.' },
        { question: 'Какво включва цената?', answer: 'Всяко пътуване има различен пакет. Проверявай детайлите на страницата на конкретното пътуване.' },
        { question: 'Мога ли да пътувам сам?', answer: 'Да! Повечето ни пътувания са отворени за соло пътешественици. Имаме и специални Singles Only турове.' },
        { question: 'Как да отменя записване?', answer: 'Свържи се с нас по имейл или телефон. Условията за анулиране са описани в общите условия.' },
      ]

  return (
    <div className="min-h-screen pb-20">
      <ContactHeroBlock heading={d?.heading} subheading={d?.subheading} />
      <div className="px-6 mb-12">
        <div className="max-w-3xl mx-auto">
          <ContactForm />
        </div>
      </div>
      <ContactFAQBlock faqItems={faqItems} />
    </div>
  )
}
