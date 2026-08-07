import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE programs ADD COLUMN IF NOT EXISTS why_visit_heading varchar;
    ALTER TABLE programs ADD COLUMN IF NOT EXISTS why_visit_content jsonb;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE programs DROP COLUMN IF EXISTS why_visit_heading;
    ALTER TABLE programs DROP COLUMN IF EXISTS why_visit_content;
  `)
}
