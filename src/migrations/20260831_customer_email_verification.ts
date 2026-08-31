import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

// Payload adds these internal auth fields when auth.verify is enabled.
// This migration makes the change explicit for production deployments.
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE customers
      ADD COLUMN IF NOT EXISTS _verified boolean DEFAULT false,
      ADD COLUMN IF NOT EXISTS _verificationtoken character varying;

    -- Existing accounts were created under the previous non-verifying policy;
    -- preserve their login behavior. New accounts are explicitly created false
    -- by Payload when auth.verify is enabled.
    UPDATE customers SET _verified = true WHERE _verified IS DISTINCT FROM true;

    CREATE INDEX IF NOT EXISTS customers_verification_token_idx
      ON customers (_verificationtoken);
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP INDEX IF EXISTS customers_verification_token_idx;
    ALTER TABLE customers
      DROP COLUMN IF EXISTS _verificationtoken,
      DROP COLUMN IF EXISTS _verified;
  `)
}
