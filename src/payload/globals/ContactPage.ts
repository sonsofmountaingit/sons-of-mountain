import type { GlobalConfig } from 'payload'
import { revalidateTag as _revalidateTag } from 'next/cache'
import { after } from 'next/server'

const revalidateTag = _revalidateTag
const revalidateContactTag = ({ doc }: { doc: unknown }) => {
  try { after(() => { try { revalidateTag('contact-page', 'max') } catch {} }) } catch {}
  return doc
}

export const ContactPage: GlobalConfig = {
  slug: 'contact-page',
  label: 'Contact Page',
  admin: { group: 'Site Settings' },
  fields: [
    {
      name: 'openVisualEditor',
      type: 'ui',
      admin: {
        components: {
          Field: '@/components/admin/ContactPageVisualEditorButton#ContactPageVisualEditorButton',
        },
      },
    },
    { name: 'heading', type: 'text', defaultValue: 'Контакти' },
    { name: 'subheading', type: 'text', defaultValue: 'Имаш въпрос? Пиши ни.' },
    { name: 'namePlaceholder', type: 'text', defaultValue: 'Твоето име' },
    { name: 'emailPlaceholder', type: 'text', defaultValue: 'Имейл адрес' },
    { name: 'messagePlaceholder', type: 'text', defaultValue: 'Твоето съобщение' },
    { name: 'submitLabel', type: 'text', defaultValue: 'Изпрати съобщение' },
    { name: 'submitLoadingLabel', type: 'text', defaultValue: 'Изпращане...' },
    { name: 'successHeading', type: 'text', defaultValue: 'Съобщението е изпратено!' },
    { name: 'successSubtext', type: 'text', defaultValue: 'Ще се свържем с теб скоро.' },
    { name: 'successResetLabel', type: 'text', defaultValue: 'Изпрати ново' },
    { name: 'errorText', type: 'text', defaultValue: 'Грешка. Опитайте отново.' },
    { name: 'rateLimitedText', type: 'text', defaultValue: 'Твърде много опити. Опитай отново по-късно.' },
    { name: 'nameMinError', type: 'text', defaultValue: 'Минимум 2 символа' },
    { name: 'emailInvalidError', type: 'text', defaultValue: 'Невалиден имейл' },
    { name: 'messageMinError', type: 'text', defaultValue: 'Минимум 10 символа' },
    { name: 'guidesHeading', type: 'text', defaultValue: 'Последвай водачите ни' },
    {
      name: 'faqItems',
      type: 'array',
      label: 'FAQ Items',
      fields: [
        { name: 'question', type: 'text', required: true },
        { name: 'answer', type: 'textarea', required: true },
      ],
      defaultValue: [
        { question: 'Как да се запиша за пътуване?', answer: 'Намери желаното пътуване на страницата на дестинацията и кликни "ЗАПИШИ СЕ". Ще те се обадим в рамките на 24 часа.' },
        { question: 'Колко струва депозитът?', answer: 'Депозитът обикновено е 30% от цената на пътуването. Останалата сума се плаща 30 дни преди заминаването.' },
        { question: 'Какво включва цената?', answer: 'Всяко пътуване има различен пакет. Проверявай детайлите на страницата на конкретното пътуване.' },
        { question: 'Мога ли да пътувам сам?', answer: 'Да! Повечето ни пътувания са отворени за соло пътешественици. Имаме и специални Singles Only турове.' },
        { question: 'Как да отменя записване?', answer: 'Свържи се с нас по имейл или телефон. Условията за анулиране са описани в общите условия.' },
      ],
    },
    { name: 'puckData', type: 'json', admin: { hidden: true } },
  ],
  hooks: {
    afterChange: [revalidateContactTag],
  },
}
