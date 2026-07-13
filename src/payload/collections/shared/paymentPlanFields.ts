import type { Field } from 'payload'

export const paymentPlanFields: Field[] = [
  {
    name: 'paymentPlanType',
    type: 'select',
    label: 'Схема на плащане',
    options: [
      { label: 'Автоматично (по продължителност)', value: 'auto' },
      { label: 'Пълно плащане', value: 'full' },
      { label: 'Депозит + остатък', value: 'deposit' },
      { label: 'На 3 вноски', value: 'installments3' },
    ],
    defaultValue: 'auto',
    admin: {
      position: 'sidebar',
      description: 'Автоматично: ≤1 ден → пълно плащане, 2–3 дни → депозит, 4+ дни → 3 вноски',
    },
  },
  {
    name: 'depositPercent',
    type: 'number',
    label: 'Депозит (%)',
    defaultValue: 30,
    min: 0,
    max: 100,
    admin: {
      position: 'sidebar',
      description: 'Използва се при схема "Депозит + остатък"',
      condition: (data) => data.paymentPlanType === 'deposit' || data.paymentPlanType === 'auto',
    },
  },
  {
    name: 'lateBookingThresholdDays',
    type: 'number',
    label: 'Праг за late booking (дни)',
    defaultValue: 30,
    min: 0,
    admin: {
      position: 'sidebar',
      description: 'Ако записването е по-малко от този брой дни преди старта, се изисква пълно плащане веднага',
    },
  },
  {
    name: 'installmentPlan',
    type: 'group',
    label: 'План с 3 вноски',
    admin: {
      description: 'Използва се при схема "На 3 вноски"',
      condition: (data) => data.paymentPlanType === 'installments3' || data.paymentPlanType === 'auto',
    },
    fields: [
      {
        name: 'secondPaymentPercent',
        type: 'number',
        label: '2ро плащане — до % от сумата',
        defaultValue: 50,
        min: 0,
        max: 100,
      },
      {
        name: 'secondPaymentDeadlineDays',
        type: 'number',
        label: '2ро плащане — дни след записването',
        defaultValue: 30,
      },
      {
        name: 'secondPaymentBeforeTripDays',
        type: 'number',
        label: '2ро плащане — или дни преди началото (по-рано от двете)',
        defaultValue: 60,
      },
      {
        name: 'finalPaymentBeforeTripDays',
        type: 'number',
        label: 'Финално плащане — дни преди началото',
        defaultValue: 45,
      },
    ],
  },
  {
    name: 'graceperiodDays',
    type: 'number',
    label: 'Гратисен период (дни)',
    defaultValue: 5,
    min: 0,
    admin: {
      position: 'sidebar',
      description: 'При неплащане на дължима вноска в срок — брой дни преди автоматично анулиране',
    },
  },
  {
    name: 'reminderScheduleDays',
    type: 'array',
    label: 'График на напомнянията (дни преди падеж)',
    defaultValue: [{ daysBefore: 7 }, { daysBefore: 0 }],
    admin: {
      description: 'Кога да се изпращат имейл напомняния преди падежа на вноска, напр. 7 и 0 (в деня на падежа)',
    },
    fields: [
      { name: 'daysBefore', type: 'number', required: true },
    ],
  },
]
