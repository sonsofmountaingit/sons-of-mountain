import type Stripe from 'stripe'
import type { BasePayload } from 'payload'
import { revalidatePath, revalidateTag } from 'next/cache'

async function getStripe() {
  const { stripe } = await import('@/lib/stripe')
  return stripe!
}

async function creditLoyaltyPoints(payload: BasePayload, customerId: string | null | undefined, amountEur: number) {
  if (!customerId) return
  try {
    const shopSettings = await payload.findGlobal({ slug: 'shop' }).catch(() => null)
    const rate = (shopSettings as any)?.loyaltyPointsPerEur ?? 1
    const pointsToAdd = Math.floor(amountEur * rate)
    if (pointsToAdd <= 0) return
    const cust = await payload.findByID({ collection: 'customers', id: customerId }).catch(() => null)
    if (!cust) return
    const newPoints = ((cust as any).loyaltyPoints ?? 0) + pointsToAdd
    const tier = newPoints >= 5000 ? 'platinum' : newPoints >= 1500 ? 'gold' : newPoints >= 500 ? 'silver' : 'bronze'
    const oldTier = (cust as any).loyaltyTier ?? 'bronze'
    await payload.update({ collection: 'customers', id: customerId, data: { loyaltyPoints: newPoints, loyaltyTier: tier } })
    if (tier !== oldTier) {
      const { resend } = await import('@/lib/resend')
      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL ?? 'noreply@panicframe.com',
        to: (cust as any).email,
        subject: `You reached ${tier.charAt(0).toUpperCase() + tier.slice(1)} tier!`,
        html: `<p>Congratulations! You've earned enough points to reach <strong>${tier}</strong> tier. Keep adventuring!</p>`,
      }).catch(() => {})
    }
  } catch {}
}

async function notifyWaitlist(payload: BasePayload, itemType: string, itemId: string) {
  try {
    const next = await payload.find({
      collection: 'waitlist',
      where: { and: [{ itemType: { equals: itemType } }, { [itemType]: { equals: itemId } }, { status: { equals: 'waiting' } }] },
      sort: 'position',
      limit: 3,
    })
    for (const entry of next.docs) {
      const { resend } = await import('@/lib/resend')
      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL ?? 'noreply@panicframe.com',
        to: (entry as any).email,
        subject: 'A spot is available!',
        html: `<p>Great news, ${(entry as any).name ?? 'adventurer'}! A spot just opened up. <a href="${process.env.NEXT_PUBLIC_SERVER_URL}/shop">Book now</a> before it's gone.</p>`,
      }).catch(() => {})
      await payload.update({ collection: 'waitlist', id: entry.id, data: { status: 'notified', notifiedAt: new Date().toISOString() } })
    }
  } catch {}
}

async function generateInvoice(
  payload: BasePayload,
  stripe: Stripe,
  session: Stripe.Checkout.Session,
  collection: 'orders' | 'registrations',
  docId: string,
) {
  try {
    const stripeCustomerId = session.customer as string | null
    if (!stripeCustomerId) return
    const lineItems = await stripe.checkout.sessions.listLineItems(session.id, { limit: 100 })
    const inv = await stripe.invoices.create({
      customer: stripeCustomerId,
      auto_advance: false,
      metadata: { payloadCollection: collection, payloadId: docId },
    })
    for (const item of lineItems.data) {
      await stripe.invoiceItems.create({
        customer: stripeCustomerId,
        invoice: inv.id,
        description: item.description ?? 'Sons of Mountains',
        amount: item.amount_total,
        currency: item.currency,
      })
    }
    if (!inv.id) return
    const finalized = await stripe.invoices.finalizeInvoice(inv.id)
    await payload.update({
      collection,
      id: docId,
      data: {
        invoiceId: finalized.id,
        invoicePdfUrl: finalized.invoice_pdf ?? undefined,
      } as any,
    })
  } catch {}
}

export async function handleCheckoutCompleted(session: Stripe.Checkout.Session, payload: BasePayload) {
  const stripe = await getStripe()
  const meta = session.metadata ?? {}
  const { orderId, type, tripId, recordId, paymentMode, discountCodeId, giftVoucherId, loyaltyPointsRedeemed } = meta

  // Detect 3DS
  let scaVerified = false
  try {
    if (session.payment_intent) {
      const pi = await stripe.paymentIntents.retrieve(session.payment_intent as string, {
        expand: ['payment_method_details'],
      })
      scaVerified = !!(pi as any).payment_method_details?.card?.three_d_secure
    }
  } catch {}

  if (type === 'cart' && orderId) {
    const order = await payload.findByID({ collection: 'orders', id: orderId, depth: 2 }).catch(() => null)
    if (!order) return

    await payload.update({
      collection: 'orders',
      id: orderId,
      data: {
        status: 'paid',
        paidAt: new Date().toISOString(),
        stripePaymentIntentId: (session.payment_intent as string) ?? null,
        scaVerified,
      } as any,
    })

    // Save payment method for future use
    if (session.payment_intent && session.customer) {
      try {
        const pi = await stripe.paymentIntents.retrieve(session.payment_intent as string)
        const pmId = typeof pi.payment_method === 'string' ? pi.payment_method : pi.payment_method?.id
        if (pmId) {
          await stripe.paymentMethods.attach(pmId, { customer: session.customer as string }).catch(() => {})
          await stripe.customers.update(session.customer as string, {
            invoice_settings: { default_payment_method: pmId },
          }).catch(() => {})
          // Find Payload customer and update default PM
          const custResult = await payload.find({
            collection: 'customers',
            where: { stripeCustomerId: { equals: session.customer } },
            limit: 1,
          }).catch(() => null)
          if (custResult?.docs[0]) {
            await payload.update({ collection: 'customers', id: custResult.docs[0].id, data: { defaultPaymentMethodId: pmId } as any })
          }
        }
      } catch {}
    }

    // Decrement stock
    for (const item of ((order as any).items ?? []) as any[]) {
      if (item.itemType === 'trip' && item.trip) {
        const tId = typeof item.trip === 'string' ? item.trip : item.trip.id
        const trip = await payload.findByID({ collection: 'trips', id: tId }).catch(() => null)
        if (trip) {
          const newSpots = Math.max(0, (trip as any).spotsAvailable - (item.participantCount ?? item.quantity ?? 1))
          await payload.update({ collection: 'trips', id: tId, data: { spotsAvailable: newSpots, status: newSpots === 0 ? 'soldOut' : 'active' } })
          if (newSpots > 0) await notifyWaitlist(payload, 'trip', tId)
        }
      }
      if (item.itemType === 'product' && item.product) {
        const pId = typeof item.product === 'string' ? item.product : item.product.id
        const product = await payload.findByID({ collection: 'products', id: pId }).catch(() => null)
        if (product) {
          if (item.variantId) {
            const variants = ((product as any).variants ?? []).map((v: any) =>
              v.id === item.variantId ? { ...v, stock: Math.max(0, v.stock - item.quantity) } : v
            )
            await payload.update({ collection: 'products', id: pId, data: { variants } })
          } else {
            await payload.update({ collection: 'products', id: pId, data: { stock: Math.max(0, (product as any).stock - item.quantity) } })
          }
        }
      }
      if (item.itemType === 'program' && item.program) {
        const pgId = typeof item.program === 'string' ? item.program : item.program.id
        const program = await payload.findByID({ collection: 'programs', id: pgId }).catch(() => null)
        if (program) {
          const newSpots = Math.max(0, (program as any).spotsAvailable - (item.participantCount ?? item.quantity ?? 1))
          await payload.update({ collection: 'programs', id: pgId, data: { spotsAvailable: newSpots, status: newSpots === 0 ? 'Sold Out' : 'Active' } })
        }
      }
      if (item.itemType === 'bundle' && item.bundle) {
        const bId = typeof item.bundle === 'string' ? item.bundle : item.bundle.id
        const bundle = await payload.findByID({ collection: 'bundles', id: bId }).catch(() => null)
        if (bundle) {
          await payload.update({ collection: 'bundles', id: bId, data: { usedCount: ((bundle as any).usedCount ?? 0) + 1 } })
        }
      }
    }

    // Mark discount code used
    if (discountCodeId) {
      const dc = await payload.findByID({ collection: 'discount-codes', id: discountCodeId }).catch(() => null)
      if (dc) {
        const customerId = typeof (order as any).customer === 'string' ? (order as any).customer : (order as any).customer?.id
        await payload.update({
          collection: 'discount-codes',
          id: discountCodeId,
          data: {
            usedCount: ((dc as any).usedCount ?? 0) + 1,
            usedByCustomers: customerId
              ? [...((dc as any).usedByCustomers ?? []), { customer: customerId, usedAt: new Date().toISOString() }]
              : (dc as any).usedByCustomers,
          },
        })
        if ((dc as any).type === 'referral' && (dc as any).referredBy) {
          const referrerId = typeof (dc as any).referredBy === 'string' ? (dc as any).referredBy : (dc as any).referredBy?.id
          const referrer = await payload.findByID({ collection: 'customers', id: referrerId }).catch(() => null)
          if (referrer) {
            await payload.create({
              collection: 'gift-vouchers',
              data: {
                code: `REW-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 5).toUpperCase()}`,
                customer: referrerId,
                recipientEmail: (referrer as any).email,
                recipientName: (referrer as any).name ?? '',
                amount: 20,
                currency: 'EUR',
                status: 'active',
                message: 'Referral reward — thank you for spreading the adventure!',
              },
            })
          }
        }
      }
    }

    // Mark gift voucher redeemed
    if (giftVoucherId) {
      const customerId = typeof (order as any).customer === 'string' ? (order as any).customer : (order as any).customer?.id
      await payload.update({
        collection: 'gift-vouchers',
        id: giftVoucherId,
        data: { status: 'redeemed', redeemedAt: new Date().toISOString(), redeemedByCustomerId: customerId ?? '' },
      }).catch(() => {})
    }

    // Deduct loyalty points
    const pointsRedeemed = parseInt(loyaltyPointsRedeemed ?? '0', 10)
    const customerId = typeof (order as any).customer === 'string' ? (order as any).customer : (order as any).customer?.id
    if (pointsRedeemed > 0 && customerId) {
      const cust = await payload.findByID({ collection: 'customers', id: customerId }).catch(() => null)
      if (cust) {
        const newPoints = Math.max(0, ((cust as any).loyaltyPoints ?? 0) - pointsRedeemed)
        await payload.update({ collection: 'customers', id: customerId, data: { loyaltyPoints: newPoints } })
      }
    }

    // Credit loyalty points earned
    const amountTotal = (session.amount_total ?? 0) / 100
    await creditLoyaltyPoints(payload, customerId, amountTotal)

    // Generate invoice PDF
    await generateInvoice(payload, stripe, session, 'orders', orderId)

    // Update receipt info
    try {
      if (session.payment_intent) {
        const descriptionParts: string[] = []
        for (const item of ((order as any).items ?? []) as any[]) {
          const title = item.trip?.title ?? item.product?.title ?? item.program?.title ?? item.bundle?.title ?? 'Item'
          descriptionParts.push(title)
        }
        await stripe.paymentIntents.update(session.payment_intent as string, {
          description: `Sons of Mountains — ${descriptionParts.join(', ')}`,
          receipt_email: (order as any).email,
        })
        await payload.update({ collection: 'orders', id: orderId, data: { receiptSentAt: new Date().toISOString() } as any })
      }
    } catch {}

    // Schedule balance charge if deposit mode
    if (paymentMode === 'deposit' && session.payment_intent && session.customer) {
      try {
        const pi = await stripe.paymentIntents.retrieve(session.payment_intent as string)
        const pmId = typeof pi.payment_method === 'string' ? pi.payment_method : pi.payment_method?.id
        if (pmId) {
          await payload.update({
            collection: 'orders',
            id: orderId,
            data: { balancePaymentIntentId: `scheduled:${pmId}`, balanceChargeStatus: 'pending' } as any,
          })
        }
      } catch {}
    }

    revalidateTag('products', 'default')
    revalidateTag('trips', 'default')
    void revalidatePath('/shop')
    return
  }

  // Legacy single-item
  const id = recordId ?? orderId
  if (!id) return

  if (type === 'registration' || type === 'deposit') {
    const paymentModeValue = paymentMode ?? 'full'
    const updateData: Record<string, unknown> = {
      status: 'paid',
      paidAt: new Date().toISOString(),
      stripePaymentIntentId: (session.payment_intent as string) ?? null,
      scaVerified,
    }
    if (paymentModeValue === 'deposit') {
      updateData.paymentMode = 'deposit'
      updateData.depositPaid = (session.amount_total ?? 0) / 100
    }
    await payload.update({ collection: 'registrations', id, data: updateData as any })
    await generateInvoice(payload, stripe, session, 'registrations', id)

    if (tripId) {
      const reg = await payload.findByID({ collection: 'registrations', id }).catch(() => null)
      const trip = await payload.findByID({ collection: 'trips', id: tripId }).catch(() => null)
      if (trip && reg) {
        const newSpots = Math.max(0, (trip as any).spotsAvailable - ((reg as any).participantCount ?? 1))
        await payload.update({ collection: 'trips', id: tripId, data: { spotsAvailable: newSpots, status: newSpots === 0 ? 'soldOut' : 'active' } })
        if (newSpots > 0) await notifyWaitlist(payload, 'trip', tripId)
        revalidateTag('trips', 'default')
        void revalidatePath('/destinations')
      }
    }

    // Schedule balance charge if deposit
    if (paymentModeValue === 'deposit' && session.payment_intent && session.customer) {
      try {
        const pi = await stripe.paymentIntents.retrieve(session.payment_intent as string)
        const pmId = typeof pi.payment_method === 'string' ? pi.payment_method : pi.payment_method?.id
        if (pmId) {
          await payload.update({ collection: 'registrations', id, data: { balancePaymentIntentId: `scheduled:${pmId}`, balanceChargeStatus: 'pending' } as any })
        }
      } catch {}
    }
  } else if (type === 'order') {
    await payload.update({ collection: 'orders', id, data: { status: 'paid', paidAt: new Date().toISOString(), scaVerified } as any })
    await generateInvoice(payload, stripe, session, 'orders', id)
  } else if (type === 'voucher') {
    await payload.update({ collection: 'gift-vouchers', id, data: { paidAt: new Date().toISOString(), status: 'active' } })
    await sendVoucherEmails(payload, id).catch(() => {})
  }
}

async function sendVoucherEmails(payload: BasePayload, voucherId: string) {
  const voucher = await payload.findByID({ collection: 'gift-vouchers', id: voucherId }).catch(() => null)
  if (!voucher) return

  const v = voucher as any
  const base = process.env.NEXT_PUBLIC_SERVER_URL ?? 'http://localhost:3000'
  const voucherUrl = `${base}/vouchers/${v.code}`
  const dashboardUrl = `${base}/vouchers?tab=mine`
  const from = process.env.RESEND_FROM_EMAIL ?? 'noreply@panicframe.com'

  const { resend } = await import('@/lib/resend')

  const isGift = !!v.isGift
  const recipientEmail = v.recipientEmail
  const recipientName = v.recipientName ?? 'Adventurer'
  const senderName = v.senderName ?? 'Someone special'
  const senderEmail = v.senderEmail

  const expiryText = v.expiresAt
    ? new Date(v.expiresAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
    : null

  const giftHtml = buildGiftVoucherHtml({
    recipientName, senderName, amount: v.amount, currency: v.currency ?? 'EUR',
    code: v.code, message: v.message, expiryText, voucherUrl,
  })

  const confirmHtml = buildVoucherConfirmHtml({
    buyerName: senderName, recipientName, recipientEmail, amount: v.amount,
    currency: v.currency ?? 'EUR', code: v.code, isGift,
    message: v.message, expiryText, dashboardUrl,
  })

  const safeAmount = Number(v.amount).toFixed(0)
  const safeSenderName = String(senderName).replace(/[^\w\s\-'.]/g, '').slice(0, 80)
  const safeRecipientName = String(recipientName).replace(/[^\w\s\-'.]/g, '').slice(0, 80)

  // Send voucher to recipient (always)
  if (recipientEmail) {
    await resend.emails.send({
      from,
      to: recipientEmail,
      subject: `${safeSenderName} sent you a €${safeAmount} adventure voucher`,
      html: giftHtml,
    }).catch(() => {})
  }

  // Send confirmation to buyer
  const to = isGift ? senderEmail : recipientEmail
  if (to && to !== recipientEmail || !isGift) {
    const buyerTo = isGift ? senderEmail : recipientEmail
    if (buyerTo) {
      await resend.emails.send({
        from,
        to: buyerTo,
        subject: isGift ? `Your gift voucher for ${safeRecipientName} is on its way` : `Your €${safeAmount} adventure voucher`,
        html: confirmHtml,
      }).catch(() => {})
    }
  }
}

function escHtml(s: string | null | undefined): string {
  if (s == null) return ''
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
}

function safeUrl(url: string): string {
  try {
    const u = new URL(url)
    if (u.protocol !== 'https:' && u.protocol !== 'http:') return '#'
    return url
  } catch {
    return '#'
  }
}

function buildGiftVoucherHtml(p: {
  recipientName: string; senderName: string; amount: number; currency: string
  code: string; message?: string; expiryText: string | null; voucherUrl: string
}) {
  const rn = escHtml(p.recipientName)
  const sn = escHtml(p.senderName)
  const amt = escHtml(String(p.amount))
  const cur = escHtml(p.currency)
  const code = escHtml(p.code)
  const msg = escHtml(p.message)
  const exp = escHtml(p.expiryText)
  const url = safeUrl(p.voucherUrl)

  return `<!DOCTYPE html><html><body style="margin:0;padding:0;background:#0a0a0a;font-family:'Helvetica Neue',Arial,sans-serif">
<div style="max-width:560px;margin:0 auto;padding:48px 24px">
  <div style="text-align:center;margin-bottom:48px">
    <p style="color:#555;font-size:11px;letter-spacing:3px;text-transform:uppercase;margin:0 0 12px 0">Sons of Mountains</p>
    <h1 style="color:#fff;font-size:28px;font-weight:300;letter-spacing:2px;margin:0">You&#x27;ve received a gift</h1>
  </div>
  <div style="background:linear-gradient(135deg,#1a1a1a 0%,#111 100%);border:1px solid #2a2a2a;border-radius:4px;padding:40px;margin-bottom:32px;text-align:center">
    <p style="color:#888;font-size:11px;letter-spacing:3px;text-transform:uppercase;margin:0 0 8px 0">Adventure Voucher</p>
    <p style="color:#fff;font-size:48px;font-weight:300;margin:0 0 4px 0">&#x20AC;${amt}</p>
    <p style="color:#555;font-size:12px;margin:0 0 32px 0">${cur}</p>
    <div style="background:#000;border:1px solid #333;border-radius:2px;padding:12px 24px;display:inline-block;margin-bottom:24px">
      <p style="color:#aaa;font-size:11px;letter-spacing:3px;text-transform:uppercase;margin:0 0 4px 0">Your code</p>
      <p style="color:#fff;font-size:20px;font-family:monospace;letter-spacing:4px;margin:0">${code}</p>
    </div>
    ${exp ? `<p style="color:#555;font-size:11px;letter-spacing:1px;margin:0">Valid until ${exp}</p>` : ''}
  </div>
  ${msg ? `<div style="border-left:2px solid #333;padding-left:20px;margin-bottom:32px">
    <p style="color:#888;font-size:11px;letter-spacing:2px;text-transform:uppercase;margin:0 0 8px 0">A message from ${sn}</p>
    <p style="color:#ccc;font-size:15px;line-height:1.6;font-style:italic;margin:0">&quot;${msg}&quot;</p>
  </div>` : ''}
  <div style="text-align:center;margin-bottom:40px">
    <p style="color:#888;font-size:14px;margin-bottom:20px">Hi ${rn}, ${sn} gifted you an adventure.</p>
    <a href="${url}" style="display:inline-block;background:#fff;color:#000;font-size:11px;letter-spacing:3px;text-transform:uppercase;text-decoration:none;padding:14px 36px;border-radius:2px;font-weight:600">View &amp; Use Your Voucher</a>
  </div>
  <div style="border-top:1px solid #1a1a1a;padding-top:32px;margin-bottom:32px">
    <p style="color:#555;font-size:11px;letter-spacing:2px;text-transform:uppercase;margin:0 0 16px 0">How to use</p>
    <ol style="color:#666;font-size:13px;line-height:2;padding-left:20px;margin:0">
      <li>Browse trips, programs and gear at sonsofmountains.com</li>
      <li>At checkout, enter code <strong style="color:#aaa;font-family:monospace;letter-spacing:2px">${code}</strong></li>
      <li>Your voucher value will be applied automatically</li>
    </ol>
  </div>
  <div style="text-align:center">
    <p style="color:#333;font-size:11px;margin:0">Sons of Mountains &middot; Adventure awaits</p>
  </div>
</div></body></html>`
}

function buildVoucherConfirmHtml(p: {
  buyerName: string; recipientName: string; recipientEmail: string; amount: number; currency: string
  code: string; isGift: boolean; message?: string; expiryText: string | null; dashboardUrl: string
}) {
  const bn = escHtml(p.buyerName)
  const rn = escHtml(p.recipientName)
  const re = escHtml(p.recipientEmail)
  const amt = escHtml(String(p.amount))
  const cur = escHtml(p.currency)
  const code = escHtml(p.code)
  const msg = escHtml(p.message)
  const exp = escHtml(p.expiryText)
  const url = safeUrl(p.dashboardUrl)
  const title = p.isGift ? 'Gift sent successfully' : 'Voucher purchased'

  return `<!DOCTYPE html><html><body style="margin:0;padding:0;background:#0a0a0a;font-family:'Helvetica Neue',Arial,sans-serif">
<div style="max-width:560px;margin:0 auto;padding:48px 24px">
  <div style="text-align:center;margin-bottom:48px">
    <p style="color:#555;font-size:11px;letter-spacing:3px;text-transform:uppercase;margin:0 0 12px 0">Sons of Mountains</p>
    <h1 style="color:#fff;font-size:28px;font-weight:300;letter-spacing:2px;margin:0">${escHtml(title)}</h1>
  </div>
  <div style="background:#111;border:1px solid #2a2a2a;border-radius:4px;padding:32px;margin-bottom:32px">
    <p style="color:#888;font-size:11px;letter-spacing:2px;text-transform:uppercase;margin:0 0 20px 0">Purchase summary</p>
    <table style="width:100%;border-collapse:collapse">
      <tr><td style="color:#666;font-size:13px;padding:8px 0">Amount</td><td style="color:#fff;font-size:18px;font-weight:300;text-align:right">&#x20AC;${amt} ${cur}</td></tr>
      <tr><td style="color:#666;font-size:13px;padding:8px 0">Code</td><td style="color:#fff;font-size:14px;font-family:monospace;letter-spacing:3px;text-align:right">${code}</td></tr>
      ${p.isGift ? `<tr><td style="color:#666;font-size:13px;padding:8px 0;vertical-align:top">Sent to</td><td style="text-align:right"><p style="color:#fff;font-size:13px;margin:0 0 2px 0">${rn}</p><p style="color:#555;font-size:12px;margin:0">${re}</p></td></tr>` : ''}
      ${exp ? `<tr style="border-top:1px solid #1a1a1a"><td style="color:#666;font-size:13px;padding:12px 0 8px 0">Valid until</td><td style="color:#555;font-size:13px;text-align:right;padding-top:12px">${exp}</td></tr>` : ''}
    </table>
  </div>
  ${p.isGift && msg ? `<div style="border-left:2px solid #333;padding-left:20px;margin-bottom:32px">
    <p style="color:#888;font-size:11px;letter-spacing:2px;text-transform:uppercase;margin:0 0 8px 0">Your message</p>
    <p style="color:#ccc;font-size:14px;line-height:1.6;font-style:italic;margin:0">&quot;${msg}&quot;</p>
  </div>` : ''}
  <div style="text-align:center;margin-bottom:40px">
    <p style="color:#777;font-size:14px;margin-bottom:20px">${p.isGift ? `Hi ${bn}, your gift voucher has been sent to ${rn}.` : `Hi ${bn}, your voucher is ready to use.`}</p>
    <a href="${url}" style="display:inline-block;background:#fff;color:#000;font-size:11px;letter-spacing:3px;text-transform:uppercase;text-decoration:none;padding:14px 36px;border-radius:2px;font-weight:600">View in Dashboard</a>
  </div>
  <div style="text-align:center">
    <p style="color:#333;font-size:11px;margin:0">Sons of Mountains · Adventure awaits</p>
  </div>
</div></body></html>`
}

export async function handleSubscriptionUpsert(sub: Stripe.Subscription, payload: BasePayload) {
  try {
    const existing = await payload.find({ collection: 'subscriptions', where: { stripeSubscriptionId: { equals: sub.id } }, limit: 1 })
    const status = sub.status === 'active' || sub.status === 'trialing' ? sub.status : sub.status === 'past_due' ? 'past_due' : 'cancelled'
    const priceId = (sub.items?.data?.[0]?.price?.id) ?? undefined

    if (existing.docs.length > 0) {
      const updateData: Record<string, unknown> = {
        status,
        currentPeriodEnd: new Date((sub as any).current_period_end * 1000).toISOString(),
        cancelAtPeriodEnd: sub.cancel_at_period_end,
      }
      if (priceId) updateData.stripePriceId = priceId
      if (status === 'past_due' && !(existing.docs[0] as any).pastDueAt) {
        updateData.pastDueAt = new Date().toISOString()
      }
      await payload.update({ collection: 'subscriptions', id: existing.docs[0].id, data: updateData as any })

      // Send dunning email if past_due
      if (status === 'past_due') {
        const sub_doc = existing.docs[0] as any
        const emailsSent = sub_doc.dunningEmailsSent ?? 0
        const { resend } = await import('@/lib/resend')
        await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL ?? 'noreply@panicframe.com',
          to: sub.customer as string,
          subject: 'Action required: Payment failed for your Adventure Pass',
          html: `<p>Your subscription payment failed. Please update your payment method to continue enjoying your Adventure Pass benefits. <a href="${process.env.NEXT_PUBLIC_SERVER_URL}/dashboard/billing">Update payment method</a></p>`,
        }).catch(() => {})
        await payload.update({ collection: 'subscriptions', id: existing.docs[0].id, data: { dunningEmailsSent: emailsSent + 1 } as any })
      }

      // Send recovery email if was past_due → active
      if (status === 'active' && (existing.docs[0] as any).pastDueAt) {
        const { resend } = await import('@/lib/resend')
        await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL ?? 'noreply@panicframe.com',
          to: sub.customer as string,
          subject: 'Your Adventure Pass is active again',
          html: `<p>Great news! Your payment was recovered and your Adventure Pass is now active. Keep adventuring!</p>`,
        }).catch(() => {})
        await payload.update({ collection: 'subscriptions', id: existing.docs[0].id, data: { pastDueAt: null, dunningEmailsSent: 0 } as any })
      }
    } else {
      await payload.create({
        collection: 'subscriptions',
        data: {
          stripeSubscriptionId: sub.id,
          stripeCustomerId: sub.customer as string,
          plan: 'monthly',
          status: status as any,
          stripePriceId: priceId,
          currentPeriodEnd: new Date((sub as any).current_period_end * 1000).toISOString(),
        } as any,
      })
    }
  } catch {}
}

export async function handleSubscriptionDeleted(sub: Stripe.Subscription, payload: BasePayload) {
  try {
    const existing = await payload.find({ collection: 'subscriptions', where: { stripeSubscriptionId: { equals: sub.id } }, limit: 1 })
    if (existing.docs.length > 0) {
      await payload.update({ collection: 'subscriptions', id: existing.docs[0].id, data: { status: 'cancelled' as any } })
      const discountId = typeof (existing.docs[0] as any).discountCode === 'string'
        ? (existing.docs[0] as any).discountCode
        : (existing.docs[0] as any).discountCode?.id
      if (discountId) {
        await payload.update({ collection: 'discount-codes', id: discountId, data: { isActive: false } }).catch(() => {})
      }
    }
  } catch {}
}

export async function handleChargeRefunded(charge: Stripe.Charge, payload: BasePayload) {
  if (!charge.payment_intent) return
  try {
    const refund = charge.refunds?.data?.[0]
    const refundId = refund?.id ?? null
    const refundAmount = (refund?.amount ?? 0) / 100

    // Find order by payment intent
    const orders = await payload.find({
      collection: 'orders',
      where: { stripePaymentIntentId: { equals: charge.payment_intent as string } },
      limit: 1,
    })
    if (orders.docs.length > 0) {
      await payload.update({
        collection: 'orders',
        id: orders.docs[0].id,
        data: { status: 'refunded', stripeRefundId: refundId, refundAmount } as any,
      })
      return
    }

    // Find registration by payment intent
    const regs = await payload.find({
      collection: 'registrations',
      where: { stripePaymentIntentId: { equals: charge.payment_intent as string } },
      limit: 1,
    })
    if (regs.docs.length > 0) {
      await payload.update({
        collection: 'registrations',
        id: regs.docs[0].id,
        data: { status: 'refunded', stripeRefundId: refundId, refundAmount } as any,
      })
    }
  } catch {}
}

export async function handleInvoicePaymentFailed(invoice: Stripe.Invoice, payload: BasePayload) {
  // For subscription invoices, dunning is handled in handleSubscriptionUpsert
  // For order invoices, send a payment retry email
  try {
    const { resend } = await import('@/lib/resend')
    const customerEmail = typeof invoice.customer_email === 'string' ? invoice.customer_email : null
    if (!customerEmail) return
    const retryUrl = invoice.hosted_invoice_url ?? `${process.env.NEXT_PUBLIC_SERVER_URL}/dashboard`
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL ?? 'noreply@panicframe.com',
      to: customerEmail,
      subject: 'Payment failed — action required',
      html: `<p>Your payment could not be processed. <a href="${retryUrl}">Click here to retry</a>.</p>`,
    }).catch(() => {})
  } catch {}
}

export async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice, payload: BasePayload) {
  // Update subscription period end
  if (!invoice.subscription) return
  try {
    const existing = await payload.find({
      collection: 'subscriptions',
      where: { stripeSubscriptionId: { equals: invoice.subscription as string } },
      limit: 1,
    })
    if (existing.docs.length > 0 && invoice.lines?.data?.[0]?.period?.end) {
      await payload.update({
        collection: 'subscriptions',
        id: existing.docs[0].id,
        data: { currentPeriodEnd: new Date(invoice.lines.data[0].period.end * 1000).toISOString() } as any,
      })
    }
  } catch {}
}

export async function handleInvoiceFinalized(invoice: Stripe.Invoice, payload: BasePayload) {
  if (!invoice.metadata?.payloadCollection || !invoice.metadata?.payloadId) return
  try {
    const collection = invoice.metadata.payloadCollection as 'orders' | 'registrations'
    await payload.update({
      collection,
      id: invoice.metadata.payloadId,
      data: { invoicePdfUrl: invoice.invoice_pdf ?? undefined } as any,
    })
  } catch {}
}

export async function handlePaymentIntentSucceeded(pi: Stripe.PaymentIntent, payload: BasePayload) {
  // Handle balance charge completion (deposit → remaining)
  if (!pi.metadata?.balanceForCollection || !pi.metadata?.balanceForId) return
  try {
    const collection = pi.metadata.balanceForCollection as 'orders' | 'registrations'
    await payload.update({
      collection,
      id: pi.metadata.balanceForId,
      data: { remainingBalance: 0, status: 'paid', balanceChargeStatus: 'succeeded', balancePaymentIntentId: pi.id } as any,
    })
  } catch {}
}

export async function handlePaymentIntentFailed(pi: Stripe.PaymentIntent, payload: BasePayload) {
  if (!pi.metadata?.balanceForCollection || !pi.metadata?.balanceForId) return
  try {
    const stripe = await getStripe()
    const collection = pi.metadata.balanceForCollection as 'orders' | 'registrations'
    await payload.update({ collection, id: pi.metadata.balanceForId, data: { balanceChargeStatus: 'failed' } as any })

    // Generate retry payment link
    const doc = await payload.findByID({ collection, id: pi.metadata.balanceForId }).catch(() => null)
    if (!doc) return
    const remainingAmount = (doc as any).remainingBalance ?? 0
    const retryLink = await stripe.paymentLinks.create({
      line_items: [{
        price_data: {
          currency: 'eur',
          product_data: { name: 'Balance Payment — Sons of Mountains' },
          unit_amount: Math.round(remainingAmount * 100),
        },
        quantity: 1,
      }],
      metadata: { balanceForCollection: collection, balanceForId: pi.metadata.balanceForId },
    } as any).catch(() => null)

    const { resend } = await import('@/lib/resend')
    const email = (doc as any).email
    if (email) {
      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL ?? 'noreply@panicframe.com',
        to: email,
        subject: 'Balance payment failed — retry link enclosed',
        html: `<p>Your balance payment of €${remainingAmount.toFixed(2)} failed. ${retryLink ? `<a href="${retryLink.url}">Click here to pay now</a>` : 'Please visit your dashboard to complete payment.'}</p>`,
      }).catch(() => {})
    }
  } catch {}
}
