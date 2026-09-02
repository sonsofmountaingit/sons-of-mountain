import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "abandoned_carts"
      ADD COLUMN IF NOT EXISTS "customer_id" integer REFERENCES "customers"("id") ON DELETE SET NULL;
    CREATE INDEX IF NOT EXISTS "abandoned_carts_customer_idx"
      ON "abandoned_carts" ("customer_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP INDEX IF EXISTS "abandoned_carts_customer_idx";
    ALTER TABLE "abandoned_carts"
      DROP COLUMN IF EXISTS "customer_id";
  `)
}
