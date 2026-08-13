import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

// The Waitlist collection config declares a `customer` relationship field, but the
// database column was never migrated in. Every call to notifyWaitlist() (fired from
// Orders' decrementSpotsOnPaid afterChange hook while the order's paid-transition
// transaction is still open) selects this column and threw "column customer_id does
// not exist", poisoning that open Postgres transaction. The poisoned transaction then
// sat idle-in-transaction until Postgres's idle_in_transaction_session_timeout killed
// the connection, crashing the request before the order's paid status ever committed —
// which is why paid Stripe orders kept showing as "pending". IF NOT EXISTS makes this
// safe for the already-provisioned production database as well as fresh CI/CD deployments.
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE waitlist
      ADD COLUMN IF NOT EXISTS customer_id integer;
  `)
  await db.execute(sql`
    DO $$ BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'waitlist_customer_id_customers_id_fk'
      ) THEN
        ALTER TABLE waitlist
          ADD CONSTRAINT waitlist_customer_id_customers_id_fk
          FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL;
      END IF;
    END $$;
  `)
  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS waitlist_customer_idx ON waitlist (customer_id);
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE waitlist
      DROP CONSTRAINT IF EXISTS waitlist_customer_id_customers_id_fk,
      DROP COLUMN IF EXISTS customer_id;
  `)
}
