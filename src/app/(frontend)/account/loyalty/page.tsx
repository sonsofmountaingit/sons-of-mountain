import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'
import type { Metadata } from 'next'
import { Suspense } from 'react'


export const metadata: Metadata = { title: 'Loyalty Points — Sons of Mountains' }

const TIER_CONFIG = {
  bronze: { label: 'Bronze', nextThreshold: 500, color: '#8B4513', icon: '🥉' },
  silver: { label: 'Silver', nextThreshold: 1500, color: '#C0C0C0', icon: '🥈' },
  gold: { label: 'Gold', nextThreshold: 5000, color: '#FFD700', icon: '🥇' },
  platinum: { label: 'Platinum', nextThreshold: null, color: '#3D3D3D', icon: '💎' },
}

const TIER_THRESHOLDS = {
  bronze: 0,
  silver: 500,
  gold: 1500,
  platinum: 5000,
}

async function getLoyaltyData(betterAuthUserId: string) {
  try {
    const payload = await getPayload({ config })
    const customer = await payload.find({
      collection: 'customers',
      where: { betterAuthId: { equals: betterAuthUserId } },
      limit: 1,
    })
    return customer.docs[0] ?? null
  } catch {
    return null
  }
}

async function LoyaltyContent() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect('/auth/login?redirect=/account/loyalty')

  const betterAuthUserId = (session.user as any).id
  const cust = await getLoyaltyData(betterAuthUserId)
  const loyaltyPoints = cust?.loyaltyPoints ?? 0
  const loyaltyTier = (cust?.loyaltyTier ?? 'bronze') as keyof typeof TIER_CONFIG

  const tierConfig = TIER_CONFIG[loyaltyTier]
  const currentThreshold = TIER_THRESHOLDS[loyaltyTier]
  const nextThreshold = tierConfig.nextThreshold

  const pointsToNextTier = nextThreshold ? Math.max(0, nextThreshold - loyaltyPoints) : null
  const progressPercentage =
    nextThreshold && loyaltyPoints >= currentThreshold
      ? Math.min(100, ((loyaltyPoints - currentThreshold) / (nextThreshold - currentThreshold)) * 100)
      : loyaltyPoints >= currentThreshold
        ? 100
        : 0

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="text-3xl font-bold mb-8">Loyalty Points</h1>

      <div className="rounded-lg border bg-white p-8 mb-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-semibold text-gray-600 mb-2">Current Tier</p>
              <div className="flex items-center gap-3">
                <span style={{ fontSize: '32px' }}>{tierConfig.icon}</span>
                <div>
                  <p className="text-2xl font-bold capitalize">{loyaltyTier}</p>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-600 mb-2">Points Balance</p>
              <p className="text-4xl font-bold">{loyaltyPoints}</p>
              <p className="text-xs text-gray-500 mt-1">100 pts = €1 discount</p>
            </div>
          </div>
        </div>

        {nextThreshold && (
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              <p className="text-sm font-semibold text-gray-700">Progress to Next Tier</p>
              <p className="text-sm font-semibold text-gray-700">{pointsToNextTier} points needed</p>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gray-900 h-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <div className="mt-2 flex justify-between text-xs text-gray-500">
              <span>{currentThreshold} pts</span>
              <span className="capitalize">
                {loyaltyTier === 'platinum'
                  ? 'Platinum'
                  : (Object.keys(TIER_CONFIG).find((k) => TIER_THRESHOLDS[k as keyof typeof TIER_THRESHOLDS] === nextThreshold) || '').toUpperCase()}
              </span>
              <span>{nextThreshold} pts</span>
            </div>
          </div>
        )}

        {loyaltyTier === 'platinum' && (
          <div className="rounded bg-gradient-to-r from-purple-50 to-pink-50 p-4 border border-purple-200">
            <p className="text-sm font-semibold text-purple-900 mb-1">You've reached our highest tier!</p>
            <p className="text-sm text-purple-800">Enjoy all exclusive Platinum benefits and rewards.</p>
          </div>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2 mb-8">
        <div className="rounded-lg border bg-white p-6">
          <h3 className="font-semibold mb-4">Tier Benefits</h3>
          <div className="space-y-3">
            {loyaltyTier === 'bronze' && (
              <>
                <div className="flex gap-3"><span>•</span><span className="text-sm">1% cashback on all purchases</span></div>
                <div className="flex gap-3"><span>•</span><span className="text-sm">Early access to seasonal sales</span></div>
              </>
            )}
            {loyaltyTier === 'silver' && (
              <>
                <div className="flex gap-3"><span>•</span><span className="text-sm">2% cashback on all purchases</span></div>
                <div className="flex gap-3"><span>•</span><span className="text-sm">Free shipping on orders over €50</span></div>
                <div className="flex gap-3"><span>•</span><span className="text-sm">Exclusive member discounts</span></div>
              </>
            )}
            {loyaltyTier === 'gold' && (
              <>
                <div className="flex gap-3"><span>•</span><span className="text-sm">3% cashback on all purchases</span></div>
                <div className="flex gap-3"><span>•</span><span className="text-sm">Free shipping on all orders</span></div>
                <div className="flex gap-3"><span>•</span><span className="text-sm">Priority customer support</span></div>
                <div className="flex gap-3"><span>•</span><span className="text-sm">Exclusive events access</span></div>
              </>
            )}
            {loyaltyTier === 'platinum' && (
              <>
                <div className="flex gap-3"><span>•</span><span className="text-sm">5% cashback on all purchases</span></div>
                <div className="flex gap-3"><span>•</span><span className="text-sm">Free shipping on all orders</span></div>
                <div className="flex gap-3"><span>•</span><span className="text-sm">VIP customer support</span></div>
                <div className="flex gap-3"><span>•</span><span className="text-sm">Exclusive events & preview access</span></div>
                <div className="flex gap-3"><span>•</span><span className="text-sm">Personalized recommendations</span></div>
              </>
            )}
          </div>
        </div>

        <div className="rounded-lg border bg-white p-6">
          <h3 className="font-semibold mb-4">How It Works</h3>
          <div className="space-y-3 text-sm">
            <div>
              <p className="font-semibold text-gray-700 mb-1">Earn Points</p>
              <p className="text-gray-600">Every purchase earns loyalty points based on your tier.</p>
            </div>
            <div>
              <p className="font-semibold text-gray-700 mb-1">Climb Tiers</p>
              <p className="text-gray-600">Accumulate points to unlock higher tiers with better benefits.</p>
            </div>
            <div>
              <p className="font-semibold text-gray-700 mb-1">Redeem Rewards</p>
              <p className="text-gray-600">Use your points for discounts on future purchases.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-lg border bg-gray-50 p-6">
        <h3 className="font-semibold mb-4">All Tiers</h3>
        <div className="grid gap-4 md:grid-cols-4">
          {Object.entries(TIER_CONFIG).map(([key, tier]) => (
            <div
              key={key}
              className={`rounded-lg border p-4 ${key === loyaltyTier ? 'bg-white border-gray-900 border-2' : 'bg-white border-gray-200'}`}
            >
              <p className="text-2xl mb-2">{tier.icon}</p>
              <p className={`font-semibold capitalize ${key === loyaltyTier ? 'text-gray-900' : 'text-gray-700'}`}>{key}</p>
              <p className="text-xs text-gray-500 mt-2">
                {key === 'bronze' && '0–499 pts'}
                {key === 'silver' && '500–1,499 pts'}
                {key === 'gold' && '1,500–4,999 pts'}
                {key === 'platinum' && '5,000+ pts'}
              </p>
              {key === loyaltyTier && (
                <p className="text-xs font-semibold text-gray-900 mt-3 bg-yellow-100 px-2 py-1 rounded inline-block">Current</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}

export default function LoyaltyPage() {
  return (
    <Suspense>
      <LoyaltyContent />
    </Suspense>
  )
}
