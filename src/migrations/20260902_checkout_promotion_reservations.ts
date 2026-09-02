import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "checkout_promotion_reservations" (
      "id" serial PRIMARY KEY,
      "order_id" integer NOT NULL REFERENCES "orders"("id") ON DELETE CASCADE,
      "customer_id" integer REFERENCES "customers"("id") ON DELETE SET NULL,
      "customer_email" varchar,
      "discount_code_id" integer REFERENCES "discount_codes"("id") ON DELETE SET NULL,
      "gift_voucher_id" integer REFERENCES "gift_vouchers"("id") ON DELETE SET NULL,
      "amount" numeric,
      "status" varchar NOT NULL DEFAULT 'reserved',
      "created_at" timestamp(3) with time zone NOT NULL DEFAULT now(),
      "consumed_at" timestamp(3) with time zone,
      "released_at" timestamp(3) with time zone,
      "expires_at" timestamp(3) with time zone NOT NULL DEFAULT (now() + interval '30 minutes')
    );
    CREATE INDEX IF NOT EXISTS "checkout_promotion_reservations_order_idx"
      ON "checkout_promotion_reservations" ("order_id");
    CREATE INDEX IF NOT EXISTS "checkout_promotion_reservations_discount_idx"
      ON "checkout_promotion_reservations" ("discount_code_id", "status");
    CREATE INDEX IF NOT EXISTS "checkout_promotion_reservations_voucher_idx"
      ON "checkout_promotion_reservations" ("gift_voucher_id", "status");
    CREATE INDEX IF NOT EXISTS "checkout_promotion_reservations_expiry_idx"
      ON "checkout_promotion_reservations" ("status", "expires_at");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "checkout_promotion_reservations";
  `)
}
