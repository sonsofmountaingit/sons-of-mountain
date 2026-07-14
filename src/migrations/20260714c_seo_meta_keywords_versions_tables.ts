import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE _destinations_v ADD COLUMN IF NOT EXISTS version_meta_keywords character varying;
    ALTER TABLE _stories_v ADD COLUMN IF NOT EXISTS version_meta_keywords character varying;
    ALTER TABLE _blog_posts_v ADD COLUMN IF NOT EXISTS version_meta_keywords character varying;
    ALTER TABLE _pages_v ADD COLUMN IF NOT EXISTS version_meta_keywords character varying;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE _destinations_v DROP COLUMN IF EXISTS version_meta_keywords;
    ALTER TABLE _stories_v DROP COLUMN IF EXISTS version_meta_keywords;
    ALTER TABLE _blog_posts_v DROP COLUMN IF EXISTS version_meta_keywords;
    ALTER TABLE _pages_v DROP COLUMN IF EXISTS version_meta_keywords;
  `)
}
