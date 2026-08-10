import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

// Customer self-service profile fields. IF NOT EXISTS makes this safe for the
// already-provisioned production database as well as fresh CI/CD deployments.
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE customers
      ADD COLUMN IF NOT EXISTS date_of_birth timestamp(3) with time zone,
      ADD COLUMN IF NOT EXISTS address character varying;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE customers
      DROP COLUMN IF EXISTS date_of_birth,
      DROP COLUMN IF EXISTS address;
  `)
}
