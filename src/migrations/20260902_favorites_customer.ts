import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "favorites"
      ADD COLUMN IF NOT EXISTS "customer_id" integer REFERENCES "customers"("id") ON DELETE SET NULL;
    CREATE INDEX IF NOT EXISTS "favorites_customer_idx"
      ON "favorites" ("customer_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP INDEX IF EXISTS "favorites_customer_idx";
    ALTER TABLE "favorites"
      DROP COLUMN IF EXISTS "customer_id";
  `)
}
