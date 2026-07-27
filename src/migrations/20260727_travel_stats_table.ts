import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// Backing table for the read-only "Статистика" admin view/collection under
// Пътувания. No writable fields are exposed in the admin UI; the table only
// needs to exist so Payload's collection machinery (access checks, routing)
// has something to point at.
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS travel_stats (
      id serial PRIMARY KEY,
      title varchar,
      updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
      created_at timestamp(3) with time zone DEFAULT now() NOT NULL
    );
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS travel_stats;
  `)
}
