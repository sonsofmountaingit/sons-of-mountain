import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "stripe_webhook_events" (
      "id" serial PRIMARY KEY,
      "stripe_event_id" varchar NOT NULL,
      "event_type" varchar NOT NULL,
      "status" varchar NOT NULL DEFAULT 'processing',
      "order_id" varchar,
      "attempts" integer NOT NULL DEFAULT 1,
      "last_error" text,
      "received_at" timestamp(3) with time zone NOT NULL DEFAULT now(),
      "processed_at" timestamp(3) with time zone
    );
    CREATE UNIQUE INDEX IF NOT EXISTS "stripe_webhook_events_event_id_idx"
      ON "stripe_webhook_events" ("stripe_event_id");
    CREATE INDEX IF NOT EXISTS "stripe_webhook_events_status_idx"
      ON "stripe_webhook_events" ("status");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "stripe_webhook_events";
  `)
}
