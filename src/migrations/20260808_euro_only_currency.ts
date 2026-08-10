import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    UPDATE trips SET currency = 'EUR' WHERE currency IS DISTINCT FROM 'EUR';
    UPDATE programs SET currency = 'EUR' WHERE currency IS DISTINCT FROM 'EUR';
    UPDATE orders SET currency = 'EUR' WHERE currency IS DISTINCT FROM 'EUR';
    UPDATE registrations SET currency = 'EUR' WHERE currency IS DISTINCT FROM 'EUR';
    UPDATE gift_vouchers SET currency = 'EUR' WHERE currency IS DISTINCT FROM 'EUR';
    UPDATE payouts SET currency = 'EUR' WHERE currency IS DISTINCT FROM 'EUR';
    UPDATE customers SET display_currency = 'eur' WHERE display_currency IS DISTINCT FROM 'eur';
    UPDATE why_travel_with_us_video_cards SET currency = 'EUR' WHERE currency IS DISTINCT FROM 'EUR';
  `)
}

export async function down(_: MigrateDownArgs): Promise<void> {
  // Reverting cannot reliably restore the previous currency of each record.
}
