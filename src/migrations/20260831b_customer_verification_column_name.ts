import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

// Correct the internal Payload field name for deployments that received the
// initial migration with a manually underscored column name.
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE customers
      ADD COLUMN IF NOT EXISTS _verificationtoken character varying;

    CREATE INDEX IF NOT EXISTS customers_verification_token_idx_v2
      ON customers (_verificationtoken);
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // Deliberately non-destructive: the verification column may contain active
  // account tokens. Keep it during rollback to prevent data loss.
}
