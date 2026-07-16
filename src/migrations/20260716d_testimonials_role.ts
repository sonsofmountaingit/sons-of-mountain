import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// Adds testimonials.role (author role/title), replacing the frontend's
// hardcoded ROLES array so each testimonial can set its own role in the CMS.
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS role varchar;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE testimonials DROP COLUMN IF EXISTS role;
  `)
}
