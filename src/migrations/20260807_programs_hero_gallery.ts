import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS programs_hero_gallery (
      _order integer NOT NULL,
      _parent_id integer NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
      id varchar PRIMARY KEY,
      image_id integer REFERENCES media(id) ON DELETE SET NULL,
      alt varchar
    );
    CREATE INDEX IF NOT EXISTS programs_hero_gallery_order_idx ON programs_hero_gallery (_order);
    CREATE INDEX IF NOT EXISTS programs_hero_gallery_parent_id_idx ON programs_hero_gallery (_parent_id);
    CREATE INDEX IF NOT EXISTS programs_hero_gallery_image_idx ON programs_hero_gallery (image_id);
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS programs_hero_gallery;
  `)
}
