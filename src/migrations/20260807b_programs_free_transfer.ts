import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE programs ADD COLUMN IF NOT EXISTS free_transfer_image_id integer REFERENCES media(id) ON DELETE SET NULL;
    ALTER TABLE programs ADD COLUMN IF NOT EXISTS free_transfer_headline varchar;
    ALTER TABLE programs ADD COLUMN IF NOT EXISTS free_transfer_paragraph varchar;
    ALTER TABLE programs ADD COLUMN IF NOT EXISTS free_transfer_small_span_text varchar;
    ALTER TABLE programs ADD COLUMN IF NOT EXISTS free_transfer_departure_date timestamp(3) with time zone;
    ALTER TABLE programs ADD COLUMN IF NOT EXISTS free_transfer_departure_time varchar;
    ALTER TABLE programs ADD COLUMN IF NOT EXISTS free_transfer_return_date timestamp(3) with time zone;
    ALTER TABLE programs ADD COLUMN IF NOT EXISTS free_transfer_peak varchar;
    CREATE INDEX IF NOT EXISTS programs_free_transfer_image_idx ON programs (free_transfer_image_id);
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE programs DROP COLUMN IF EXISTS free_transfer_image_id;
    ALTER TABLE programs DROP COLUMN IF EXISTS free_transfer_headline;
    ALTER TABLE programs DROP COLUMN IF EXISTS free_transfer_paragraph;
    ALTER TABLE programs DROP COLUMN IF EXISTS free_transfer_small_span_text;
    ALTER TABLE programs DROP COLUMN IF EXISTS free_transfer_departure_date;
    ALTER TABLE programs DROP COLUMN IF EXISTS free_transfer_departure_time;
    ALTER TABLE programs DROP COLUMN IF EXISTS free_transfer_return_date;
    ALTER TABLE programs DROP COLUMN IF EXISTS free_transfer_peak;
  `)
}
