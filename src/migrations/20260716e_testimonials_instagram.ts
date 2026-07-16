import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// Adds testimonials.instagram_handle so a testimonial author name can link
// out to their Instagram profile on click.
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS instagram_handle varchar;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE testimonials DROP COLUMN IF EXISTS instagram_handle;
  `)
}
