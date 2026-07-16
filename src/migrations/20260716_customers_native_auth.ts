import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// Customers moved from better-auth to Payload native auth (commit ee1e217, 0f3e5bb).
// Add Payload's native-auth columns and drop the obsolete better-auth/legacy columns.
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE customers
      ADD COLUMN IF NOT EXISTS reset_password_token character varying,
      ADD COLUMN IF NOT EXISTS reset_password_expiration timestamp(3) with time zone,
      ADD COLUMN IF NOT EXISTS salt character varying,
      ADD COLUMN IF NOT EXISTS hash character varying,
      ADD COLUMN IF NOT EXISTS login_attempts numeric DEFAULT 0,
      ADD COLUMN IF NOT EXISTS lock_until timestamp(3) with time zone;

    DROP INDEX IF EXISTS customers_better_auth_id_idx;

    ALTER TABLE customers
      DROP COLUMN IF EXISTS better_auth_id,
      DROP COLUMN IF EXISTS email_verified,
      DROP COLUMN IF EXISTS stripe_i_d,
      DROP COLUMN IF EXISTS skip_sync;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE customers
      ADD COLUMN IF NOT EXISTS better_auth_id character varying,
      ADD COLUMN IF NOT EXISTS email_verified boolean DEFAULT false,
      ADD COLUMN IF NOT EXISTS stripe_i_d character varying,
      ADD COLUMN IF NOT EXISTS skip_sync boolean;

    CREATE UNIQUE INDEX IF NOT EXISTS customers_better_auth_id_idx ON customers (better_auth_id);

    ALTER TABLE customers
      DROP COLUMN IF EXISTS reset_password_token,
      DROP COLUMN IF EXISTS reset_password_expiration,
      DROP COLUMN IF EXISTS salt,
      DROP COLUMN IF EXISTS hash,
      DROP COLUMN IF EXISTS login_attempts,
      DROP COLUMN IF EXISTS lock_until;
  `)
}
