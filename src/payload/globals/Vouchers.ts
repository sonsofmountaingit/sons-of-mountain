import type { GlobalConfig } from 'payload'
import { revalidateTag as _revalidateTag } from 'next/cache'
import { after } from 'next/server'

const revalidateTag = _revalidateTag
const revalidateVouchersTag = ({ doc }: { doc: unknown }) => {
  try {
    after(() => { try { revalidateTag('vouchers', 'max') } catch {} })
  } catch { /* outside request scope */ }
  return doc
}

export const Vouchers: GlobalConfig = {
  slug: 'vouchers',
  admin: { group: 'Site Settings' },
  fields: [
    {
      name: 'openVisualEditor',
      type: 'ui',
      admin: {
        components: {
          Field: '@/components/admin/VouchersVisualEditorButton#VouchersVisualEditorButton',
        },
      },
    },
    // ── Hero ─────────────────────────────────────────────────────────────────
    { name: 'eyebrow', type: 'text', defaultValue: 'Sons of Mountains' },
    { name: 'heading', type: 'text', defaultValue: 'Gift Vouchers' },
    { name: 'subtext', type: 'textarea', defaultValue: 'Give the gift of adventure — or treat yourself. Redeemable on any trip, program, or product.' },

    // ── Tabs ─────────────────────────────────────────────────────────────────
    { name: 'buyTabLabel', type: 'text', defaultValue: 'Buy a Voucher' },
    { name: 'redeemTabLabel', type: 'text', defaultValue: 'Redeem' },
    { name: 'mineTabLabel', type: 'text', defaultValue: 'My Vouchers' },

    // ── Buy tab: recipient toggle ────────────────────────────────────────────
    { name: 'forMyselfLabel', type: 'text', defaultValue: 'For myself' },
    { name: 'giftSomeoneLabel', type: 'text', defaultValue: 'Gift someone' },

    // ── Buy tab: amount ──────────────────────────────────────────────────────
    { name: 'chooseAmountLabel', type: 'text', defaultValue: 'Choose amount' },
    {
      name: 'amountPresets',
      type: 'array',
      label: 'Amount Presets (€)',
      minRows: 1,
      fields: [{ name: 'amount', type: 'number', required: true }],
      defaultValue: [{ amount: 50 }, { amount: 100 }, { amount: 200 }, { amount: 300 }, { amount: 500 }],
    },
    { name: 'customAmountLabel', type: 'text', defaultValue: 'Custom' },
    { name: 'customAmountPlaceholder', type: 'text', defaultValue: 'Enter amount (€)' },
    { name: 'minAmount', type: 'number', defaultValue: 10 },
    { name: 'maxAmount', type: 'number', defaultValue: 5000 },
    { name: 'minAmountError', type: 'text', defaultValue: 'Minimum €10' },
    { name: 'maxAmountError', type: 'text', defaultValue: 'Maximum €5000' },

    // ── Buy tab: voucher type ────────────────────────────────────────────────
    { name: 'forSpecificLabel', type: 'text', defaultValue: 'For a specific' },
    { name: 'openTypeLabel', type: 'text', defaultValue: 'Any adventure' },
    { name: 'destinationTypeLabel', type: 'text', defaultValue: 'Destination' },
    { name: 'tripTypeLabel', type: 'text', defaultValue: 'Trip' },
    { name: 'programTypeLabel', type: 'text', defaultValue: 'Program' },
    { name: 'selectDestinationLabel', type: 'text', defaultValue: 'Select destination' },
    { name: 'selectTripLabel', type: 'text', defaultValue: 'Select trip' },
    { name: 'selectProgramLabel', type: 'text', defaultValue: 'Select program' },

    // ── Buy tab: recipient / message / delivery ─────────────────────────────
    { name: 'recipientDetailsLabel', type: 'text', defaultValue: 'Recipient details' },
    { name: 'recipientNamePlaceholder', type: 'text', defaultValue: 'Recipient name' },
    { name: 'recipientEmailPlaceholder', type: 'text', defaultValue: 'Recipient email' },
    { name: 'recipientNameRequiredError', type: 'text', defaultValue: 'Required' },
    { name: 'recipientEmailInvalidError', type: 'text', defaultValue: 'Invalid email' },
    { name: 'personalMessageLabel', type: 'text', defaultValue: 'Personal message' },
    { name: 'giftMessagePlaceholder', type: 'text', defaultValue: 'Write a personal message for the recipient (optional)' },
    { name: 'selfMessagePlaceholder', type: 'text', defaultValue: 'A note for this voucher (optional)' },
    { name: 'scheduleDeliveryLabel', type: 'text', defaultValue: 'Schedule delivery' },
    { name: 'sendTodayLabel', type: 'text', defaultValue: 'Send today after payment confirmation' },

    // ── Buy tab: signed-in / submit ──────────────────────────────────────────
    { name: 'signedInAsPrefix', type: 'text', defaultValue: 'Signed in as' },
    { name: 'signInPromptText', type: 'text', defaultValue: "You'll be asked to sign in or create an account before checkout." },
    { name: 'submitLoadingLabel', type: 'text', defaultValue: 'Redirecting...' },
    { name: 'submitButtonPrefix', type: 'text', defaultValue: 'Purchase' },
    { name: 'submitButtonSuffix', type: 'text', defaultValue: 'Voucher' },
    { name: 'voucherCreateError', type: 'text', defaultValue: 'Failed to create voucher' },
    { name: 'genericError', type: 'text', defaultValue: 'Something went wrong' },
    { name: 'giftDescriptionPrefix', type: 'text', defaultValue: 'Gift Voucher for' },
    { name: 'selfDescriptionPrefix', type: 'text', defaultValue: 'Adventure Voucher —' },

    // ── Redeem tab ───────────────────────────────────────────────────────────
    { name: 'redeemPromptLabel', type: 'text', defaultValue: 'Enter your voucher code' },
    { name: 'redeemCodePlaceholder', type: 'text', defaultValue: 'SOM-XXXX-XXXX' },
    { name: 'redeemButtonLabel', type: 'text', defaultValue: 'Redeem Voucher' },
    { name: 'redeemLoadingLabel', type: 'text', defaultValue: '...' },
    { name: 'redeemSuccessPrefix', type: 'text', defaultValue: 'Voucher redeemed! Value:' },
    { name: 'redeemGenericError', type: 'text', defaultValue: 'Something went wrong' },
    { name: 'redeemSignInPrefix', type: 'text', defaultValue: 'Sign in' },
    { name: 'redeemSignInSuffix', type: 'text', defaultValue: 'to redeem a voucher.' },

    // ── Mine tab ─────────────────────────────────────────────────────────────
    { name: 'mineSignInPrompt', type: 'text', defaultValue: 'Sign in to view your vouchers.' },
    { name: 'mineSignInButtonLabel', type: 'text', defaultValue: 'Sign In' },
    { name: 'mineEmptyLabel', type: 'text', defaultValue: 'No vouchers yet.' },
    { name: 'mineGiftBadgeLabel', type: 'text', defaultValue: 'Gift' },
    { name: 'mineForPrefix', type: 'text', defaultValue: 'For:' },
    { name: 'mineExpiresPrefix', type: 'text', defaultValue: 'Expires' },
    { name: 'statusActiveLabel', type: 'text', defaultValue: 'Active' },
    { name: 'statusRedeemedLabel', type: 'text', defaultValue: 'Redeemed' },
    { name: 'statusExpiredLabel', type: 'text', defaultValue: 'Expired' },
    { name: 'statusCancelledLabel', type: 'text', defaultValue: 'Cancelled' },

    {
      name: 'puckData',
      type: 'json',
      admin: { hidden: true },
    },
  ],
  hooks: {
    afterChange: [revalidateVouchersTag],
  },
}
