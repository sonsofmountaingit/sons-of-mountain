import type { GlobalConfig } from 'payload'
import { revalidateTag as _revalidateTag } from 'next/cache'
import { after } from 'next/server'

const revalidateTag = _revalidateTag
const revalidateIndividualProgramsTag = ({ doc }: { doc: unknown }) => {
  try { after(() => { try { revalidateTag('individual-programs-page', 'max') } catch {} }) } catch {}
  return doc
}

export const IndividualProgramsPage: GlobalConfig = {
  slug: 'individual-programs-page',
  label: 'Individual Programs Page',
  admin: { group: 'Site Settings' },
  fields: [
    {
      name: 'openVisualEditor',
      type: 'ui',
      admin: {
        components: {
          Field: '@/components/admin/IndividualProgramsPageVisualEditorButton#IndividualProgramsPageVisualEditorButton',
        },
      },
    },
    // Hero
    { name: 'heroHeading', type: 'text', defaultValue: 'Индивидуални програми' },
    { name: 'heroSubtext', type: 'text', defaultValue: 'Пътуване, скроено изцяло по твоите желания — дестинация, дати, темпо и хора по твой избор.' },
    { name: 'heroCtaLabel', type: 'text', defaultValue: 'Изпрати запитване' },
    { name: 'heroCtaUrl', type: 'text', defaultValue: '#questionnaire' },
    {
      name: 'heroImage',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Използва се и за OG изображението с автоматично добавено бяло лого отгоре.' },
    },
    // What We Offer
    { name: 'offerHeading', type: 'text', defaultValue: 'Какво предлагаме' },
    { name: 'offerSubtext', type: 'text', defaultValue: 'Индивидуална програма, изградена изцяло около теб — от идеята до последния ден.' },
    {
      name: 'offerItems',
      type: 'array',
      label: 'Offer Items',
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea', required: true },
        { name: 'icon', type: 'text', admin: { description: 'Emoji or short label used as an icon' } },
      ],
      defaultValue: [
        { title: 'Персонален маршрут', description: 'Изграждаме маршрута изцяло по твоите предпочитания — темпо, дестинации и активности.', icon: '🗺️' },
        { title: 'Гъвкави дати', description: 'Ти избираш кога да пътуваш — съобразяваме се с твоя график.', icon: '📅' },
        { title: 'Личен водач', description: 'Опитен водач, посветен само на твоята група, през цялото пътуване.', icon: '🧭' },
        { title: 'Настаняване по избор', description: 'От планински хижи до бутикови хотели — избираш нивото на комфорт.', icon: '🏕️' },
      ],
    },
    // How We Offer It
    { name: 'howHeading', type: 'text', defaultValue: 'Как работим' },
    { name: 'howSubtext', type: 'text', defaultValue: 'Процесът е прост — ти споделяш визията, ние я превръщаме в пътуване.' },
    {
      name: 'howSteps',
      type: 'array',
      label: 'How Steps',
      fields: [
        { name: 'step', type: 'text', required: true, admin: { description: 'e.g. 01' } },
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea', required: true },
      ],
      defaultValue: [
        { step: '01', title: 'Попълваш въпросника', description: 'Разкажи ни за мечтаното пътуване — дестинация, дати, брой хора, бюджет.' },
        { step: '02', title: 'Изготвяме предложение', description: 'Свързваме се с теб в рамките на 24 часа с персонализиран план и оферта.' },
        { step: '03', title: 'Финализираме детайлите', description: 'Прецизираме маршрута заедно, докато не е перфектен за теб.' },
        { step: '04', title: 'Тръгваме на път', description: 'Ти се наслаждаваш на пътуването — ние се грижим за всичко останало.' },
      ],
    },
    // Why We Offer It
    { name: 'whyHeading', type: 'text', defaultValue: 'Защо индивидуална програма' },
    { name: 'whySubtext', type: 'text', defaultValue: 'Защото всяко пътешествие е лично и заслужава собствена история.' },
    { name: 'whyImage', type: 'upload', relationTo: 'media' },
    {
      name: 'whyPoints',
      type: 'array',
      label: 'Why Points',
      fields: [
        { name: 'text', type: 'text', required: true },
      ],
      defaultValue: [
        { text: 'Без чужди хора в групата — само ти и хората, които избереш' },
        { text: 'Пълна свобода да променяш плана в движение' },
        { text: 'Внимание към детайли, които масовите турове пропускат' },
        { text: 'Директна връзка с твоя водач през цялото пътуване' },
      ],
    },
    // Questionnaire section intro (form fields themselves live in ProgramInquiries collection admin config)
    { name: 'questionnaireHeading', type: 'text', defaultValue: 'Разкажи ни за твоето пътуване' },
    { name: 'questionnaireSubtext', type: 'text', defaultValue: 'Fill out the questionnaire and we will contact you within 24 hours with a personalized offer.' },
    {
      name: 'questions',
      type: 'array',
      label: 'Въпросник — въпроси към клиента',
      admin: { description: 'Въпросите, които клиентите ще виждат и попълват във формата. Подредбата тук определя реда на показване.' },
      fields: [
        { name: 'label', type: 'text', required: true, label: 'Въпрос' },
        {
          name: 'fieldType',
          type: 'select',
          required: true,
          defaultValue: 'text',
          options: [
            { label: 'Кратък текст', value: 'text' },
            { label: 'Дълъг текст', value: 'textarea' },
            { label: 'Число', value: 'number' },
            { label: 'Дата', value: 'date' },
            { label: 'Избор (един)', value: 'select' },
          ],
        },
        { name: 'placeholder', type: 'text', label: 'Placeholder текст' },
        { name: 'required', type: 'checkbox', defaultValue: false, label: 'Задължителен' },
        {
          name: 'options',
          type: 'array',
          label: 'Опции (само за тип "Избор")',
          fields: [{ name: 'value', type: 'text', required: true }],
        },
      ],
      defaultValue: [
        { label: 'Дестинация или регион', fieldType: 'text', required: true, placeholder: 'напр. Алпите, Кавказ, Патагония' },
        { label: 'Предпочитани дати', fieldType: 'text', required: false, placeholder: 'напр. Юли 2026, гъвкаво' },
        { label: 'Брой участници', fieldType: 'number', required: true, placeholder: '' },
        { label: 'Ориентировъчен бюджет на човек', fieldType: 'text', required: false, placeholder: 'напр. 1500 EUR' },
        { label: 'Разкажи ни повече за пътуването, което мечтаеш да направиш', fieldType: 'textarea', required: true, placeholder: '' },
      ],
    },
    { name: 'formNamePlaceholder', type: 'text', defaultValue: 'Твоето име' },
    { name: 'formEmailPlaceholder', type: 'text', defaultValue: 'Имейл адрес' },
    { name: 'formPhonePlaceholder', type: 'text', defaultValue: 'Телефон' },
    { name: 'formSubmitLabel', type: 'text', defaultValue: 'Изпрати запитване' },
    { name: 'formSubmitLoadingLabel', type: 'text', defaultValue: 'Изпращане...' },
    { name: 'formSuccessHeading', type: 'text', defaultValue: 'Получихме твоето запитване!' },
    { name: 'formSuccessSubtext', type: 'text', defaultValue: 'Благодарим ти! Ще се свържем с теб съвсем скоро.' },
    { name: 'formErrorText', type: 'text', defaultValue: 'Възникна грешка. Моля, опитай отново.' },
    { name: 'formRateLimitedText', type: 'text', defaultValue: 'Твърде много опити. Опитай отново по-късно.' },
    { name: 'formNameMinError', type: 'text', defaultValue: 'Минимум 2 символа' },
    { name: 'formEmailInvalidError', type: 'text', defaultValue: 'Невалиден имейл' },
    { name: 'puckData', type: 'json', admin: { hidden: true } },
  ],
  hooks: {
    afterChange: [revalidateIndividualProgramsTag],
  },
}
