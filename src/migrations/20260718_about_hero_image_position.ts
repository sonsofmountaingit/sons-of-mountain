import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// Adds about.hero_image_position_x/y focal-point coordinates (0-100%) for the
// hero image, editable via drag in Payload admin and the Puck visual editor.
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE about ADD COLUMN IF NOT EXISTS hero_image_position_x numeric DEFAULT 50;
    ALTER TABLE about ADD COLUMN IF NOT EXISTS hero_image_position_y numeric DEFAULT 50;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE about DROP COLUMN IF EXISTS hero_image_position_x;
    ALTER TABLE about DROP COLUMN IF EXISTS hero_image_position_y;
  `)
}
