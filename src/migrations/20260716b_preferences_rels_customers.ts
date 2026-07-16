import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// customers is now an auth-enabled collection (20260716_customers_native_auth) but
// payload_preferences_rels was never updated to reference it, breaking admin login.
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE payload_preferences_rels
      ADD COLUMN IF NOT EXISTS customers_id integer;

    DO $$ BEGIN
      ALTER TABLE payload_preferences_rels
        ADD CONSTRAINT payload_preferences_rels_customers_fk
        FOREIGN KEY (customers_id) REFERENCES customers(id) ON DELETE CASCADE;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;

    CREATE INDEX IF NOT EXISTS payload_preferences_rels_customers_id_idx
      ON payload_preferences_rels (customers_id);
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE payload_preferences_rels
      DROP CONSTRAINT IF EXISTS payload_preferences_rels_customers_fk;

    DROP INDEX IF EXISTS payload_preferences_rels_customers_id_idx;

    ALTER TABLE payload_preferences_rels
      DROP COLUMN IF EXISTS customers_id;
  `)
}
