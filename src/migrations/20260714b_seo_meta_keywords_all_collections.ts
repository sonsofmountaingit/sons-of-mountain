import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    -- meta_keywords was missing on every collection touched by the SEO commit
    ALTER TABLE products ADD COLUMN IF NOT EXISTS meta_keywords character varying;
    ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS meta_keywords character varying;
    ALTER TABLE stories ADD COLUMN IF NOT EXISTS meta_keywords character varying;
    ALTER TABLE pages ADD COLUMN IF NOT EXISTS meta_keywords character varying;
    ALTER TABLE gallery_collections ADD COLUMN IF NOT EXISTS meta_keywords character varying;
    ALTER TABLE gallery_collections ADD COLUMN IF NOT EXISTS meta_image_id integer;

    -- bundles never had a meta group before this commit — create it in full
    ALTER TABLE bundles ADD COLUMN IF NOT EXISTS meta_title character varying;
    ALTER TABLE bundles ADD COLUMN IF NOT EXISTS meta_description character varying;
    ALTER TABLE bundles ADD COLUMN IF NOT EXISTS meta_image_id integer;
    ALTER TABLE bundles ADD COLUMN IF NOT EXISTS meta_keywords character varying;

    DO $$ BEGIN
      ALTER TABLE bundles ADD CONSTRAINT bundles_meta_image_id_media_id_fk
        FOREIGN KEY (meta_image_id) REFERENCES media(id) ON DELETE SET NULL;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      ALTER TABLE gallery_collections ADD CONSTRAINT gallery_collections_meta_image_id_media_id_fk
        FOREIGN KEY (meta_image_id) REFERENCES media(id) ON DELETE SET NULL;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    CREATE INDEX IF NOT EXISTS bundles_meta_meta_image_idx ON bundles (meta_image_id);
    CREATE INDEX IF NOT EXISTS gallery_collections_meta_meta_image_idx ON gallery_collections (meta_image_id);
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE products DROP COLUMN IF EXISTS meta_keywords;
    ALTER TABLE blog_posts DROP COLUMN IF EXISTS meta_keywords;
    ALTER TABLE stories DROP COLUMN IF EXISTS meta_keywords;
    ALTER TABLE pages DROP COLUMN IF EXISTS meta_keywords;
    ALTER TABLE gallery_collections DROP COLUMN IF EXISTS meta_keywords;
    ALTER TABLE gallery_collections DROP COLUMN IF EXISTS meta_image_id;
    ALTER TABLE bundles DROP COLUMN IF EXISTS meta_title;
    ALTER TABLE bundles DROP COLUMN IF EXISTS meta_description;
    ALTER TABLE bundles DROP COLUMN IF EXISTS meta_image_id;
    ALTER TABLE bundles DROP COLUMN IF EXISTS meta_keywords;
  `)
}
