import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE vouchers
      ADD COLUMN IF NOT EXISTS send_today_label character varying DEFAULT 'Send today after payment confirmation';
    UPDATE vouchers
      SET send_today_label = 'Send today after payment confirmation'
      WHERE send_today_label IS NULL;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE vouchers DROP COLUMN IF EXISTS send_today_label;
  `)
}
