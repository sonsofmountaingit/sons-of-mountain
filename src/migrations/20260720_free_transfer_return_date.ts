import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE destinations ADD COLUMN IF NOT EXISTS free_transfer_return_date timestamp(3) with time zone;
    ALTER TABLE trips ADD COLUMN IF NOT EXISTS free_transfer_return_date timestamp(3) with time zone;
    ALTER TABLE _destinations_v ADD COLUMN IF NOT EXISTS version_free_transfer_return_date timestamp(3) with time zone;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE destinations DROP COLUMN IF EXISTS free_transfer_return_date;
    ALTER TABLE trips DROP COLUMN IF EXISTS free_transfer_return_date;
    ALTER TABLE _destinations_v DROP COLUMN IF EXISTS version_free_transfer_return_date;
  `)
}
