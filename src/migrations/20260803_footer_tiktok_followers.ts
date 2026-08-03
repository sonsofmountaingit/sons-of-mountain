import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE footer ADD COLUMN IF NOT EXISTS tiktok_followers character varying DEFAULT '15.4K';
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE footer DROP COLUMN IF EXISTS tiktok_followers;
  `)
}
