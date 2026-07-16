import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// Adds transport_map_link (Google Maps URL) next to transport_description
// on destinations, programs and trips, so admins can paste a map link that
// shows customers distance/time to the meeting point.
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE destinations ADD COLUMN IF NOT EXISTS transport_map_link varchar;
    ALTER TABLE programs ADD COLUMN IF NOT EXISTS transport_map_link varchar;
    ALTER TABLE trips ADD COLUMN IF NOT EXISTS transport_map_link varchar;

    ALTER TABLE _destinations_v ADD COLUMN IF NOT EXISTS version_transport_map_link varchar;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE destinations DROP COLUMN IF EXISTS transport_map_link;
    ALTER TABLE programs DROP COLUMN IF EXISTS transport_map_link;
    ALTER TABLE trips DROP COLUMN IF EXISTS transport_map_link;

    ALTER TABLE _destinations_v DROP COLUMN IF EXISTS version_transport_map_link;
  `)
}
