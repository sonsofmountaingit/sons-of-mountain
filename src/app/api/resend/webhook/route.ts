import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import crypto from 'crypto'

function verifySignature(req: NextRequest, body: string): boolean {
  const svixId = req.headers.get('svix-id')
  const svixTimestamp = req.headers.get('svix-timestamp')
  const svixSignature = req.headers.get('svix-signature')
  const secret = process.env.RESEND_WEBHOOK_SECRET
  if (!svixId || !svixTimestamp || !svixSignature || !secret) return false

  const toSign = `${svixId}.${svixTimestamp}.${body}`
  const expected = crypto.createHmac('sha256', secret).update(toSign).digest('base64')
  return svixSignature.split(' ').some((sig) => {
    const [, value] = sig.split(',')
    return value === expected
  })
}

export async function POST(req: NextRequest) {
  const body = await req.text()
  if (!verifySignature(req, body)) return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })

  const event = JSON.parse(body)
  const payload = await getPayload({ config })
  const messageId = event.data?.email_id
  if (!messageId) return NextResponse.json({ ok: true })

  const logs = await payload.find({ collection: 'email-logs', where: { resendMessageId: { equals: messageId } }, limit: 1 })
  const log = logs.docs[0] as any
  const now = new Date().toISOString()

  async function bumpCampaignStat(field: string) {
    if (!log?.campaign) return
    const campaignId = typeof log.campaign === 'string' ? log.campaign : log.campaign.id
    const campaign = await payload.findByID({ collection: 'campaigns', id: campaignId }).catch(() => null)
    if (!campaign) return
    const stats = (campaign as any).stats ?? {}
    await payload.update({ collection: 'campaigns', id: campaignId, data: { stats: { ...stats, [field]: (stats[field] ?? 0) + 1 } } })
  }

  switch (event.type) {
    case 'email.opened':
      if (log) await payload.update({ collection: 'email-logs', id: log.id, data: { status: 'opened', openedAt: now } })
      await bumpCampaignStat('opens')
      break
    case 'email.clicked':
      if (log) await payload.update({ collection: 'email-logs', id: log.id, data: { status: 'clicked', clickedAt: now } })
      await bumpCampaignStat('clicks')
      break
    case 'email.bounced':
    case 'email.complained': {
      if (log) await payload.update({ collection: 'email-logs', id: log.id, data: { status: 'bounced', bouncedAt: now } })
      if (log?.recipient) {
        const subs = await payload.find({ collection: 'subscribers', where: { email: { equals: log.recipient } }, limit: 1 })
        if (subs.docs[0]) await payload.update({ collection: 'subscribers', id: subs.docs[0].id, data: { status: 'bounced' } })
      }
      await bumpCampaignStat('bounces')
      break
    }
    case 'email.unsubscribed': {
      if (log?.recipient) {
        const subs = await payload.find({ collection: 'subscribers', where: { email: { equals: log.recipient } }, limit: 1 })
        if (subs.docs[0]) await payload.update({ collection: 'subscribers', id: subs.docs[0].id, data: { status: 'unsubscribed' } })
      }
      await bumpCampaignStat('unsubscribes')
      break
    }
    case 'email.delivery_delayed':
      console.warn('Resend delivery delayed', messageId)
      break
  }

  return NextResponse.json({ ok: true })
}
