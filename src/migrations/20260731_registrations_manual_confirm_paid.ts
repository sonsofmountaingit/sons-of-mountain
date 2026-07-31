import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "registrations"
      ADD COLUMN IF NOT EXISTS "manual_confirm_paid" boolean DEFAULT false;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "registrations"
      DROP COLUMN IF EXISTS "manual_confirm_paid";
  `)
}
