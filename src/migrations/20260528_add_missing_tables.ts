import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS why_travel_with_us_video_cards (
      _order integer NOT NULL,
      _parent_id integer NOT NULL REFERENCES why_travel_with_us(id) ON DELETE CASCADE,
      id varchar PRIMARY KEY,
      _uuid varchar,
      title varchar NOT NULL,
      video_id integer REFERENCES media(id) ON DELETE SET NULL,
      poster_id integer REFERENCES media(id) ON DELETE SET NULL,
      price numeric,
      currency varchar DEFAULT 'EUR',
      spots_available numeric,
      difficulty numeric,
      deposit_amount numeric,
      start_date timestamp with time zone,
      end_date timestamp with time zone,
      duration_days numeric,
      month varchar,
      item_type varchar DEFAULT 'trip',
      trip_id varchar
    );
    CREATE INDEX IF NOT EXISTS why_travel_with_us_video_cards_order_idx ON why_travel_with_us_video_cards (_order);
    CREATE INDEX IF NOT EXISTS why_travel_with_us_video_cards_parent_id_idx ON why_travel_with_us_video_cards (_parent_id);

    CREATE TABLE IF NOT EXISTS destinations_hero_gallery (
      _order integer NOT NULL,
      _parent_id integer NOT NULL REFERENCES destinations(id) ON DELETE CASCADE,
      id varchar PRIMARY KEY,
      _uuid varchar,
      image_id integer REFERENCES media(id) ON DELETE SET NULL,
      alt varchar
    );
    CREATE INDEX IF NOT EXISTS destinations_hero_gallery_order_idx ON destinations_hero_gallery (_order);
    CREATE INDEX IF NOT EXISTS destinations_hero_gallery_parent_id_idx ON destinations_hero_gallery (_parent_id);

    CREATE TABLE IF NOT EXISTS _destinations_v_version_hero_gallery (
      _order integer NOT NULL,
      _parent_id integer NOT NULL REFERENCES _destinations_v(id) ON DELETE CASCADE,
      id varchar PRIMARY KEY,
      _uuid varchar,
      image_id integer REFERENCES media(id) ON DELETE SET NULL,
      alt varchar
    );
    CREATE INDEX IF NOT EXISTS _destinations_v_version_hero_gallery_order_idx ON _destinations_v_version_hero_gallery (_order);
    CREATE INDEX IF NOT EXISTS _destinations_v_version_hero_gallery_parent_id_idx ON _destinations_v_version_hero_gallery (_parent_id);
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS why_travel_with_us_video_cards;
    DROP TABLE IF EXISTS destinations_hero_gallery;
    DROP TABLE IF EXISTS _destinations_v_version_hero_gallery;
  `)
}
