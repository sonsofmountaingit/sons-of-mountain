import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TYPE enum_discount_codes_applicable_to ADD VALUE IF NOT EXISTS 'specific-trip';
    ALTER TYPE enum_discount_codes_applicable_to ADD VALUE IF NOT EXISTS 'specific-program';
    ALTER TYPE enum_discount_codes_applicable_to ADD VALUE IF NOT EXISTS 'specific-destination';
  `)
  await db.execute(sql`
    ALTER TABLE discount_codes ADD COLUMN IF NOT EXISTS specific_trip_id integer REFERENCES trips(id) ON DELETE SET NULL;
    ALTER TABLE discount_codes ADD COLUMN IF NOT EXISTS specific_program_id integer REFERENCES programs(id) ON DELETE SET NULL;
    ALTER TABLE discount_codes ADD COLUMN IF NOT EXISTS specific_destination_id integer REFERENCES destinations(id) ON DELETE SET NULL;
    CREATE INDEX IF NOT EXISTS discount_codes_specific_trip_idx ON discount_codes (specific_trip_id);
    CREATE INDEX IF NOT EXISTS discount_codes_specific_program_idx ON discount_codes (specific_program_id);
    CREATE INDEX IF NOT EXISTS discount_codes_specific_destination_idx ON discount_codes (specific_destination_id);
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE discount_codes DROP COLUMN IF EXISTS specific_trip_id;
    ALTER TABLE discount_codes DROP COLUMN IF EXISTS specific_program_id;
    ALTER TABLE discount_codes DROP COLUMN IF EXISTS specific_destination_id;
  `)
}
