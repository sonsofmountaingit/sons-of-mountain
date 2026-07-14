import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE trips ADD COLUMN IF NOT EXISTS meta_keywords character varying;
    ALTER TABLE destinations ADD COLUMN IF NOT EXISTS meta_keywords character varying;
    ALTER TABLE programs ADD COLUMN IF NOT EXISTS meta_keywords character varying;

    CREATE TABLE IF NOT EXISTS site_meta (
      id serial PRIMARY KEY NOT NULL,
      default_keywords character varying,
      updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
      created_at timestamp(3) with time zone DEFAULT now() NOT NULL
    );

    CREATE TABLE IF NOT EXISTS site_meta_pages (
      _order integer NOT NULL,
      id character varying PRIMARY KEY NOT NULL,
      _parent_id integer NOT NULL,
      path character varying NOT NULL,
      title character varying NOT NULL,
      description character varying,
      image_id integer,
      keywords character varying
    );

    DO $$ BEGIN
      ALTER TABLE site_meta_pages ADD CONSTRAINT site_meta_pages_image_id_media_id_fk
        FOREIGN KEY (image_id) REFERENCES media(id) ON DELETE SET NULL;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      ALTER TABLE site_meta_pages ADD CONSTRAINT site_meta_pages_parent_id_fk
        FOREIGN KEY (_parent_id) REFERENCES site_meta(id) ON DELETE CASCADE;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    CREATE INDEX IF NOT EXISTS site_meta_pages_order_idx ON site_meta_pages (_order);
    CREATE INDEX IF NOT EXISTS site_meta_pages_parent_id_idx ON site_meta_pages (_parent_id);
    CREATE INDEX IF NOT EXISTS site_meta_pages_image_idx ON site_meta_pages (image_id);
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE trips DROP COLUMN IF EXISTS meta_keywords;
    ALTER TABLE destinations DROP COLUMN IF EXISTS meta_keywords;
    ALTER TABLE programs DROP COLUMN IF EXISTS meta_keywords;
    DROP TABLE IF EXISTS site_meta_pages;
    DROP TABLE IF EXISTS site_meta;
  `)
}
