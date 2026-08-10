import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TYPE "enum_email_logs_status" ADD VALUE IF NOT EXISTS 'delivered';
    ALTER TYPE "enum_email_logs_status" ADD VALUE IF NOT EXISTS 'delayed';
    ALTER TYPE "enum_email_logs_status" ADD VALUE IF NOT EXISTS 'suppressed';
    ALTER TYPE "enum_email_logs_status" ADD VALUE IF NOT EXISTS 'complained';

    ALTER TABLE "email_logs"
      ADD COLUMN IF NOT EXISTS "delivered_at" timestamp(3) with time zone,
      ADD COLUMN IF NOT EXISTS "delayed_at" timestamp(3) with time zone,
      ADD COLUMN IF NOT EXISTS "failed_at" timestamp(3) with time zone,
      ADD COLUMN IF NOT EXISTS "suppressed_at" timestamp(3) with time zone,
      ADD COLUMN IF NOT EXISTS "complained_at" timestamp(3) with time zone,
      ADD COLUMN IF NOT EXISTS "last_event_at" timestamp(3) with time zone,
      ADD COLUMN IF NOT EXISTS "last_event_type" varchar,
      ADD COLUMN IF NOT EXISTS "delivery_error" varchar,
      ADD COLUMN IF NOT EXISTS "html" varchar;

    CREATE TABLE IF NOT EXISTS "resend_webhook_events" (
      "id" serial PRIMARY KEY NOT NULL,
      "svix_id" varchar NOT NULL,
      "resend_message_id" varchar,
      "event_type" varchar NOT NULL,
      "event_created_at" timestamp(3) with time zone,
      "email_log_id" integer,
      "received_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );

    DO $$ BEGIN
      ALTER TABLE "resend_webhook_events"
        ADD CONSTRAINT "resend_webhook_events_email_log_id_email_logs_id_fk"
        FOREIGN KEY ("email_log_id") REFERENCES "email_logs"("id") ON DELETE SET NULL;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;

    CREATE UNIQUE INDEX IF NOT EXISTS "resend_webhook_events_svix_id_idx"
      ON "resend_webhook_events" USING btree ("svix_id");
    CREATE INDEX IF NOT EXISTS "resend_webhook_events_message_id_idx"
      ON "resend_webhook_events" USING btree ("resend_message_id");
    CREATE INDEX IF NOT EXISTS "resend_webhook_events_email_log_id_idx"
      ON "resend_webhook_events" USING btree ("email_log_id");
    CREATE INDEX IF NOT EXISTS "email_logs_resend_message_id_idx"
      ON "email_logs" USING btree ("resend_message_id");
    CREATE INDEX IF NOT EXISTS "email_logs_status_created_at_idx"
      ON "email_logs" USING btree ("status", "created_at");
  `)
}

// PostgreSQL enum values are intentionally not removed: deployed rows may use them.
export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "resend_webhook_events";
    DROP INDEX IF EXISTS "email_logs_resend_message_id_idx";
    DROP INDEX IF EXISTS "email_logs_status_created_at_idx";
    ALTER TABLE "email_logs"
      DROP COLUMN IF EXISTS "delivered_at",
      DROP COLUMN IF EXISTS "delayed_at",
      DROP COLUMN IF EXISTS "failed_at",
      DROP COLUMN IF EXISTS "suppressed_at",
      DROP COLUMN IF EXISTS "complained_at",
      DROP COLUMN IF EXISTS "last_event_at",
      DROP COLUMN IF EXISTS "last_event_type",
      DROP COLUMN IF EXISTS "delivery_error",
      DROP COLUMN IF EXISTS "html";
  `)
}
