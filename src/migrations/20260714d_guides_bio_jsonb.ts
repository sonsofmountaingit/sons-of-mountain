import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// Guides.bio is defined as richText in code (Lexical, stored as jsonb) but the live
// column was still character varying — existing rows already contain valid Lexical
// JSON as text, so this is a safe type-only conversion, not a data migration.
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE guides ALTER COLUMN bio TYPE jsonb USING bio::jsonb;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE guides ALTER COLUMN bio TYPE character varying USING bio::text;
  `)
}
