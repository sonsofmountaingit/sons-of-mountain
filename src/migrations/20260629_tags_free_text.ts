import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE trips_tags ALTER COLUMN tag TYPE character varying USING tag::character varying;
  `)
  await db.execute(sql`DROP TYPE IF EXISTS enum_trips_tags_tag;`)

  await db.execute(sql`
    ALTER TABLE programs_tags ALTER COLUMN tag TYPE character varying USING tag::character varying;
  `)
  await db.execute(sql`DROP TYPE IF EXISTS enum_programs_tags_tag;`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`CREATE TYPE enum_trips_tags_tag AS ENUM ('Singles Only', 'Family', 'Adventure', 'Cultural', 'Beach', 'Yacht', 'Hiking', 'Ski', 'Wellness');`)
  await db.execute(sql`
    ALTER TABLE trips_tags ALTER COLUMN tag TYPE enum_trips_tags_tag USING tag::enum_trips_tags_tag;
  `)

  await db.execute(sql`CREATE TYPE enum_programs_tags_tag AS ENUM ('Singles Only', 'Family', 'Couples', 'Photography', 'Yoga', 'Ski', 'Sailing', 'Adventure', 'Wellness', 'Hiking', 'Cultural');`)
  await db.execute(sql`
    ALTER TABLE programs_tags ALTER COLUMN tag TYPE enum_programs_tags_tag USING tag::enum_programs_tags_tag;
  `)
}
