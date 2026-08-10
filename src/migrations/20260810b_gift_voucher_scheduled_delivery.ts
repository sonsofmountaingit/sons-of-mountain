import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE gift_vouchers
      ADD COLUMN IF NOT EXISTS delivery_sent_at timestamp(3) with time zone;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE gift_vouchers
      DROP COLUMN IF EXISTS delivery_sent_at;
  `)
}
