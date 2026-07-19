import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// Adds per-item booking process step overrides (step 01/02/03 text shown in
// BookingCtaSection) to destinations, trips, and programs. Empty/null hides the step.
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE destinations ADD COLUMN IF NOT EXISTS booking_step1 varchar;
    ALTER TABLE destinations ADD COLUMN IF NOT EXISTS booking_step2 varchar;
    ALTER TABLE destinations ADD COLUMN IF NOT EXISTS booking_step3 varchar;
    ALTER TABLE trips ADD COLUMN IF NOT EXISTS booking_step1 varchar;
    ALTER TABLE trips ADD COLUMN IF NOT EXISTS booking_step2 varchar;
    ALTER TABLE trips ADD COLUMN IF NOT EXISTS booking_step3 varchar;
    ALTER TABLE programs ADD COLUMN IF NOT EXISTS booking_step1 varchar;
    ALTER TABLE programs ADD COLUMN IF NOT EXISTS booking_step2 varchar;
    ALTER TABLE programs ADD COLUMN IF NOT EXISTS booking_step3 varchar;

    ALTER TABLE _destinations_v ADD COLUMN IF NOT EXISTS version_booking_step1 varchar;
    ALTER TABLE _destinations_v ADD COLUMN IF NOT EXISTS version_booking_step2 varchar;
    ALTER TABLE _destinations_v ADD COLUMN IF NOT EXISTS version_booking_step3 varchar;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE destinations DROP COLUMN IF EXISTS booking_step1;
    ALTER TABLE destinations DROP COLUMN IF EXISTS booking_step2;
    ALTER TABLE destinations DROP COLUMN IF EXISTS booking_step3;
    ALTER TABLE trips DROP COLUMN IF EXISTS booking_step1;
    ALTER TABLE trips DROP COLUMN IF EXISTS booking_step2;
    ALTER TABLE trips DROP COLUMN IF EXISTS booking_step3;
    ALTER TABLE programs DROP COLUMN IF EXISTS booking_step1;
    ALTER TABLE programs DROP COLUMN IF EXISTS booking_step2;
    ALTER TABLE programs DROP COLUMN IF EXISTS booking_step3;

    ALTER TABLE _destinations_v DROP COLUMN IF EXISTS version_booking_step1;
    ALTER TABLE _destinations_v DROP COLUMN IF EXISTS version_booking_step2;
    ALTER TABLE _destinations_v DROP COLUMN IF EXISTS version_booking_step3;
  `)
}
