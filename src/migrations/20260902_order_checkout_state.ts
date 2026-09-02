import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE "enum_orders_payment_status" AS ENUM ('pending', 'partially_paid', 'paid', 'no_payment_required', 'failed', 'refunded');
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
    DO $$ BEGIN
      CREATE TYPE "enum_orders_payment_method" AS ENUM ('card', 'discount', 'gift_voucher', 'loyalty', 'mixed');
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    ALTER TABLE "orders"
      ADD COLUMN IF NOT EXISTS "payment_status" "enum_orders_payment_status" DEFAULT 'pending',
      ADD COLUMN IF NOT EXISTS "payment_method" "enum_orders_payment_method",
      ADD COLUMN IF NOT EXISTS "checkout_correlation_id" varchar,
      ADD COLUMN IF NOT EXISTS "checkout_failure_reason" text,
      ADD COLUMN IF NOT EXISTS "fulfillment_status" varchar DEFAULT 'pending',
      ADD COLUMN IF NOT EXISTS "fulfillment_attempts" integer DEFAULT 0,
      ADD COLUMN IF NOT EXISTS "fulfillment_failure_reason" text,
      ADD COLUMN IF NOT EXISTS "subtotal" numeric,
      ADD COLUMN IF NOT EXISTS "loyalty_discount_amount" numeric,
      ADD COLUMN IF NOT EXISTS "loyalty_points_deducted_at" timestamp(3) with time zone,
      ADD COLUMN IF NOT EXISTS "loyalty_points_credited_at" timestamp(3) with time zone;

    UPDATE "orders"
      SET "payment_status" = CASE
        WHEN "status" = 'paid' THEN 'paid'::"enum_orders_payment_status"
        WHEN "status" = 'refunded' THEN 'refunded'::"enum_orders_payment_status"
        ELSE 'pending'::"enum_orders_payment_status"
      END
      WHERE "payment_status" = 'pending';

    CREATE INDEX IF NOT EXISTS "orders_checkout_correlation_id_idx"
      ON "orders" ("checkout_correlation_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP INDEX IF EXISTS "orders_checkout_correlation_id_idx";
    ALTER TABLE "orders"
      DROP COLUMN IF EXISTS "payment_status",
      DROP COLUMN IF EXISTS "payment_method",
      DROP COLUMN IF EXISTS "checkout_correlation_id",
      DROP COLUMN IF EXISTS "checkout_failure_reason",
      DROP COLUMN IF EXISTS "fulfillment_status",
      DROP COLUMN IF EXISTS "fulfillment_attempts",
      DROP COLUMN IF EXISTS "fulfillment_failure_reason",
      DROP COLUMN IF EXISTS "subtotal",
      DROP COLUMN IF EXISTS "loyalty_discount_amount",
      DROP COLUMN IF EXISTS "loyalty_points_deducted_at",
      DROP COLUMN IF EXISTS "loyalty_points_credited_at";
    DROP TYPE IF EXISTS "enum_orders_payment_method";
    DROP TYPE IF EXISTS "enum_orders_payment_status";
  `)
}
