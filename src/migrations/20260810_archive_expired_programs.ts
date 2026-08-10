import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TYPE enum_programs_status ADD VALUE IF NOT EXISTS 'archived';
  `)
}

export async function down(_: MigrateDownArgs): Promise<void> {
  // PostgreSQL enum values cannot be safely removed.
}
