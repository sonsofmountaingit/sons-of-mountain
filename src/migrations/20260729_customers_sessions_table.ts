import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "customers_sessions" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" character varying PRIMARY KEY NOT NULL,
      "created_at" timestamp(3) with time zone,
      "expires_at" timestamp(3) with time zone NOT NULL
    );

    DO $$ BEGIN
      ALTER TABLE "customers_sessions"
        ADD CONSTRAINT "customers_sessions_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "customers"("id") ON DELETE CASCADE;
    EXCEPTION
      WHEN duplicate_object THEN NULL;
    END $$;

    CREATE INDEX IF NOT EXISTS "customers_sessions_order_idx" ON "customers_sessions" ("_order");
    CREATE INDEX IF NOT EXISTS "customers_sessions_parent_id_idx" ON "customers_sessions" ("_parent_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "customers_sessions";
  `)
}
