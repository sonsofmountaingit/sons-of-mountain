import { getPayload } from 'payload'
import config from '@payload-config'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import type { Data } from '@puckeditor/core'
import { PuckVouchersEditorClient } from './PuckVouchersEditorClient'

export const dynamic = 'force-dynamic'

async function EditorContent() {
  const requestHeaders = await headers()
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: requestHeaders })
  if (!user) redirect('/admin')

  const v = (await payload.findGlobal({ slug: 'vouchers', depth: 0 })) as any

  const puckData: Data = v?.puckData?.content?.length ? v.puckData : {
    root: { props: {} },
    content: [
      {
        type: 'VouchersHeroBlock',
        props: {
          id: 'vouchers-hero',
          eyebrow: v?.eyebrow ?? 'Sons of Mountains',
          heading: v?.heading ?? 'Gift Vouchers',
          subtext: v?.subtext ?? 'Give the gift of adventure — or treat yourself. Redeemable on any trip, program, or product.',
        },
      },
      {
        type: 'VouchersTabsBlock',
        props: {
          id: 'vouchers-tabs',
          buyTabLabel: v?.buyTabLabel ?? 'Buy a Voucher',
          redeemTabLabel: v?.redeemTabLabel ?? 'Redeem',
          mineTabLabel: v?.mineTabLabel ?? 'My Vouchers',
        },
      },
      {
        type: 'VouchersBuyFormBlock',
        props: {
          id: 'vouchers-buy-form',
          forMyselfLabel: v?.forMyselfLabel ?? 'For myself',
          giftSomeoneLabel: v?.giftSomeoneLabel ?? 'Gift someone',
          chooseAmountLabel: v?.chooseAmountLabel ?? 'Choose amount',
          customAmountLabel: v?.customAmountLabel ?? 'Custom',
          customAmountPlaceholder: v?.customAmountPlaceholder ?? 'Enter amount (€)',
          forSpecificLabel: v?.forSpecificLabel ?? 'For a specific',
          openTypeLabel: v?.openTypeLabel ?? 'Any adventure',
          destinationTypeLabel: v?.destinationTypeLabel ?? 'Destination',
          tripTypeLabel: v?.tripTypeLabel ?? 'Trip',
          programTypeLabel: v?.programTypeLabel ?? 'Program',
          recipientDetailsLabel: v?.recipientDetailsLabel ?? 'Recipient details',
          recipientNamePlaceholder: v?.recipientNamePlaceholder ?? 'Recipient name',
          recipientEmailPlaceholder: v?.recipientEmailPlaceholder ?? 'Recipient email',
          personalMessageLabel: v?.personalMessageLabel ?? 'Personal message',
          scheduleDeliveryLabel: v?.scheduleDeliveryLabel ?? 'Schedule delivery',
          submitButtonPrefix: v?.submitButtonPrefix ?? 'Purchase',
          submitButtonSuffix: v?.submitButtonSuffix ?? 'Voucher',
        },
      },
      {
        type: 'VouchersRedeemBlock',
        props: {
          id: 'vouchers-redeem',
          redeemPromptLabel: v?.redeemPromptLabel ?? 'Enter your voucher code',
          redeemCodePlaceholder: v?.redeemCodePlaceholder ?? 'SOM-XXXX-XXXX',
          redeemButtonLabel: v?.redeemButtonLabel ?? 'Redeem Voucher',
        },
      },
      {
        type: 'VouchersMineBlock',
        props: {
          id: 'vouchers-mine',
          mineSignInPrompt: v?.mineSignInPrompt ?? 'Sign in to view your vouchers.',
          mineSignInButtonLabel: v?.mineSignInButtonLabel ?? 'Sign In',
          mineEmptyLabel: v?.mineEmptyLabel ?? 'No vouchers yet.',
        },
      },
    ],
  }

  return <PuckVouchersEditorClient initialData={puckData} />
}

export default function PuckVouchersEditorPage() {
  return (
    <Suspense
      fallback={
        <div style={{ height: '100dvh', background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.3)', fontSize: 14, fontFamily: 'sans-serif' }}>
          Loading Visual Editor…
        </div>
      }
    >
      <EditorContent />
    </Suspense>
  )
}
