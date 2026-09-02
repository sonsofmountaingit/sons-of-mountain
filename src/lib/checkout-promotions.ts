import type { BasePayload } from 'payload'
import { sql } from '@payloadcms/db-postgres'

type ReservationInput = {
  orderId: string | number
  customerId?: string | number | null
  customerEmail?: string | null
  discountCodeId?: string | number | null
  giftVoucherId?: string | number | null
  voucherAmount?: number
  maxDiscountUses?: number | null
  discountOnePerCustomer?: boolean
}

function numericId(value: string | number | null | undefined): number | null {
  if (value == null || Number.isNaN(Number(value))) return null
  return Number(value)
}

export async function reserveCheckoutPromotions(payload: BasePayload, input: ReservationInput): Promise<void> {
  const orderId = numericId(input.orderId)
  const customerId = numericId(input.customerId)
  const customerEmail = input.customerEmail?.trim().toLowerCase() || null
  const discountCodeId = numericId(input.discountCodeId)
  const giftVoucherId = numericId(input.giftVoucherId)
  if (!orderId) throw new Error('Invalid order ID for promotion reservation')

  await payload.db.drizzle.transaction(async (tx) => {
    if (discountCodeId) {
      const code = await tx.execute(sql`
        SELECT "used_count", "max_uses", "one_per_customer"
        FROM "discount_codes"
        WHERE "id" = ${discountCodeId} AND "is_active" = true
        FOR UPDATE
      `)
      const row = (code as any).rows?.[0]
      if (!row) throw new Error('Discount code is no longer available')

      const reservations = await tx.execute(sql`
        SELECT COUNT(*)::int AS count
        FROM "checkout_promotion_reservations"
        WHERE "discount_code_id" = ${discountCodeId}
          AND "status" IN ('reserved', 'consumed')
      `)
      const reservedCount = Number((reservations as any).rows?.[0]?.count ?? 0)
      const maxUses = input.maxDiscountUses ?? row.max_uses
      if (maxUses != null && Number(row.used_count ?? 0) + reservedCount >= Number(maxUses)) {
        throw new Error('Discount code has reached its usage limit')
      }

      if (input.discountOnePerCustomer ?? row.one_per_customer) {
        const customerUse = await tx.execute(sql`
          SELECT 1
          FROM "checkout_promotion_reservations"
          WHERE "discount_code_id" = ${discountCodeId}
            AND ("customer_id" = ${customerId} OR ("customer_id" IS NULL AND "customer_email" = ${customerEmail}))
            AND "status" IN ('reserved', 'consumed')
          LIMIT 1
        `)
        if ((customerUse as any).rows?.length) throw new Error('Discount code was already used by this customer')
      }

      await tx.execute(sql`
        INSERT INTO "checkout_promotion_reservations"
          ("order_id", "customer_id", "customer_email", "discount_code_id", "status")
        VALUES (${orderId}, ${customerId}, ${customerEmail}, ${discountCodeId}, 'reserved')
      `)
    }

    if (giftVoucherId) {
      const voucher = await tx.execute(sql`
        SELECT "status", "amount", "expires_at"
        FROM "gift_vouchers"
        WHERE "id" = ${giftVoucherId}
        FOR UPDATE
      `)
      const row = (voucher as any).rows?.[0]
      if (!row || row.status !== 'active' || (row.expires_at && new Date(row.expires_at) < new Date())) {
        throw new Error('Gift voucher is no longer available')
      }

      const existing = await tx.execute(sql`
        SELECT 1
        FROM "checkout_promotion_reservations"
        WHERE "gift_voucher_id" = ${giftVoucherId}
          AND "status" = 'reserved'
        LIMIT 1
      `)
      if ((existing as any).rows?.length) throw new Error('Gift voucher is already being used')

      await tx.execute(sql`
        INSERT INTO "checkout_promotion_reservations"
          ("order_id", "customer_id", "customer_email", "gift_voucher_id", "amount", "status")
        VALUES (${orderId}, ${customerId}, ${customerEmail}, ${giftVoucherId}, ${input.voucherAmount ?? Number(row.amount ?? 0)}, 'reserved')
      `)
    }
  })
}

export async function releaseCheckoutPromotions(payload: BasePayload, orderId: string | number): Promise<void> {
  await payload.db.drizzle.execute(sql`
    UPDATE "checkout_promotion_reservations"
    SET "status" = 'released', "released_at" = now()
    WHERE "order_id" = ${numericId(orderId)} AND "status" = 'reserved'
  `)
}

export async function consumeCheckoutPromotions(payload: BasePayload, orderId: string | number): Promise<{ hadReservation: boolean; consumedNow: boolean }> {
  return payload.db.drizzle.transaction(async (tx) => {
    const before = await tx.execute(sql`
      SELECT COUNT(*)::int AS count
      FROM "checkout_promotion_reservations"
      WHERE "order_id" = ${numericId(orderId)} AND "status" IN ('reserved', 'consumed')
    `)
    const hadReservation = Number((before as any).rows?.[0]?.count ?? 0) > 0
    const consumed = await tx.execute(sql`
      UPDATE "checkout_promotion_reservations"
      SET "status" = 'consumed', "consumed_at" = now()
      WHERE "order_id" = ${numericId(orderId)} AND "status" = 'reserved'
      RETURNING "discount_code_id"
    `)
    const rows = (consumed as any).rows ?? []
    for (const row of rows) {
      if (row.discount_code_id) {
        await tx.execute(sql`
          UPDATE "discount_codes"
          SET "used_count" = "used_count" + 1
          WHERE "id" = ${row.discount_code_id}
        `)
      }
    }
    return { hadReservation, consumedNow: rows.length > 0 }
  })
}

export async function releaseCancelledCheckoutPromotions(payload: BasePayload): Promise<void> {
  await payload.db.drizzle.execute(sql`
    UPDATE "checkout_promotion_reservations" AS r
    SET "status" = 'released', "released_at" = now()
    FROM "orders" AS o
    WHERE r."order_id" = o."id"
      AND r."status" = 'reserved'
      AND o."status" = 'cancelled'
  `)
}
