import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// The previous email_marketing_platform migration assumed Payload would auto-create
// the new email-flows, email-logs, and cron-jobs collections on first migrate run.
// It does not — payload.db.migrate() only applies committed migrations, it never
// pushes schema. This migration creates those missing tables/enums/columns.
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE "enum_email_flows_trigger" AS ENUM (
        'registration_pending', 'registration_paid_full', 'registration_paid_deposit',
        'registration_confirmed', 'registration_cancelled', 'registration_refunded',
        'registration_balance_due_7d', 'registration_balance_due_1d', 'registration_balance_overdue',
        'registration_balance_failed', 'registration_trip_reminder_7d', 'registration_trip_reminder_1d',
        'registration_checkin', 'registration_certificate', 'registration_review_request',
        'order_paid_full', 'order_paid_deposit', 'order_cancelled', 'order_refunded',
        'order_shipped', 'order_balance_due_7d', 'order_balance_due_1d', 'order_balance_failed',
        'gift_voucher_recipient', 'gift_voucher_buyer', 'gift_voucher_expiry_7d',
        'subscription_created', 'subscription_payment_failed', 'subscription_dunning_2',
        'subscription_dunning_3', 'subscription_payment_recovered', 'subscription_cancelled',
        'subscription_renewal_3d', 'loyalty_tier_upgrade', 'waitlist_joined',
        'waitlist_spot_available', 'waitlist_expired', 'stock_alert_notified',
        'abandoned_cart_1h', 'abandoned_cart_24h', 'auth_password_reset',
        'auth_email_verification', 'custom'
      );
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;

    DO $$ BEGIN
      CREATE TYPE "enum_email_logs_status" AS ENUM ('queued', 'sent', 'failed', 'bounced', 'opened', 'clicked');
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;

    DO $$ BEGIN
      CREATE TYPE "enum_cron_jobs_job" AS ENUM (
        'trip-reminders', 'balance-overdue', 'balance-reminders', 'review-requests',
        'subscription-renewal', 'voucher-expiry', 'waitlist-expire', 'delayed-emails',
        'abandoned-cart', 'send-campaigns', 'send-registration-forms', 'sync-sold-out'
      );
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;

    DO $$ BEGIN
      CREATE TYPE "enum_cron_jobs_last_status" AS ENUM ('success', 'failed', 'never');
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;

    CREATE TABLE IF NOT EXISTS "email_flows" (
      "id" serial PRIMARY KEY NOT NULL,
      "label" varchar NOT NULL,
      "trigger" "enum_email_flows_trigger" NOT NULL,
      "custom_trigger_key" varchar,
      "enabled" boolean DEFAULT false,
      "template_id" integer,
      "from_name" varchar,
      "from_email" varchar,
      "reply_to" varchar,
      "subject_override" varchar,
      "delay_minutes" numeric DEFAULT 0,
      "cc_admin" boolean DEFAULT false,
      "skip_if_already_sent" boolean DEFAULT true,
      "notes" varchar,
      "last_triggered_at" timestamp(3) with time zone,
      "total_sent" numeric DEFAULT 0,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );

    CREATE TABLE IF NOT EXISTS "email_flows_resend_tags" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "name" varchar NOT NULL,
      "value" varchar NOT NULL
    );

    CREATE TABLE IF NOT EXISTS "email_flows_rels" (
      "id" serial PRIMARY KEY NOT NULL,
      "order" integer,
      "parent_id" integer NOT NULL,
      "path" varchar NOT NULL,
      "trips_id" integer,
      "programs_id" integer,
      "destinations_id" integer
    );

    CREATE TABLE IF NOT EXISTS "email_logs" (
      "id" serial PRIMARY KEY NOT NULL,
      "flow_id" integer,
      "campaign_id" integer,
      "trigger" varchar,
      "recipient" varchar,
      "subject" varchar,
      "status" "enum_email_logs_status" DEFAULT 'sent',
      "scheduled_for" timestamp(3) with time zone,
      "resend_message_id" varchar,
      "sent_at" timestamp(3) with time zone,
      "opened_at" timestamp(3) with time zone,
      "bounced_at" timestamp(3) with time zone,
      "clicked_at" timestamp(3) with time zone,
      "error" varchar,
      "context" jsonb,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );

    CREATE TABLE IF NOT EXISTS "cron_jobs" (
      "id" serial PRIMARY KEY NOT NULL,
      "job" "enum_cron_jobs_job" NOT NULL,
      "label" varchar NOT NULL,
      "enabled" boolean DEFAULT true,
      "interval_minutes" numeric DEFAULT 1440 NOT NULL,
      "last_run_at" timestamp(3) with time zone,
      "last_status" "enum_cron_jobs_last_status" DEFAULT 'never',
      "last_error" varchar,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );

    DO $$ BEGIN
      ALTER TABLE "email_flows" ADD CONSTRAINT "email_flows_template_id_email_templates_id_fk" FOREIGN KEY ("template_id") REFERENCES "email_templates"("id") ON DELETE SET NULL;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;

    DO $$ BEGIN
      ALTER TABLE "email_flows_resend_tags" ADD CONSTRAINT "email_flows_resend_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "email_flows"("id") ON DELETE CASCADE;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;

    DO $$ BEGIN
      ALTER TABLE "email_flows_rels" ADD CONSTRAINT "email_flows_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "email_flows"("id") ON DELETE CASCADE;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    DO $$ BEGIN
      ALTER TABLE "email_flows_rels" ADD CONSTRAINT "email_flows_rels_trips_fk" FOREIGN KEY ("trips_id") REFERENCES "trips"("id") ON DELETE CASCADE;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    DO $$ BEGIN
      ALTER TABLE "email_flows_rels" ADD CONSTRAINT "email_flows_rels_programs_fk" FOREIGN KEY ("programs_id") REFERENCES "programs"("id") ON DELETE CASCADE;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    DO $$ BEGIN
      ALTER TABLE "email_flows_rels" ADD CONSTRAINT "email_flows_rels_destinations_fk" FOREIGN KEY ("destinations_id") REFERENCES "destinations"("id") ON DELETE CASCADE;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;

    DO $$ BEGIN
      ALTER TABLE "email_logs" ADD CONSTRAINT "email_logs_flow_id_email_flows_id_fk" FOREIGN KEY ("flow_id") REFERENCES "email_flows"("id") ON DELETE SET NULL;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    DO $$ BEGIN
      ALTER TABLE "email_logs" ADD CONSTRAINT "email_logs_campaign_id_campaigns_id_fk" FOREIGN KEY ("campaign_id") REFERENCES "campaigns"("id") ON DELETE SET NULL;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;

    CREATE INDEX IF NOT EXISTS "email_flows_template_idx" ON "email_flows" USING btree ("template_id");
    CREATE INDEX IF NOT EXISTS "email_flows_created_at_idx" ON "email_flows" USING btree ("created_at");
    CREATE INDEX IF NOT EXISTS "email_flows_updated_at_idx" ON "email_flows" USING btree ("updated_at");
    CREATE INDEX IF NOT EXISTS "email_flows_resend_tags_order_idx" ON "email_flows_resend_tags" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "email_flows_resend_tags_parent_id_idx" ON "email_flows_resend_tags" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "email_flows_rels_order_idx" ON "email_flows_rels" USING btree ("order");
    CREATE INDEX IF NOT EXISTS "email_flows_rels_parent_idx" ON "email_flows_rels" USING btree ("parent_id");
    CREATE INDEX IF NOT EXISTS "email_flows_rels_path_idx" ON "email_flows_rels" USING btree ("path");
    CREATE INDEX IF NOT EXISTS "email_flows_rels_trips_id_idx" ON "email_flows_rels" USING btree ("trips_id");
    CREATE INDEX IF NOT EXISTS "email_flows_rels_programs_id_idx" ON "email_flows_rels" USING btree ("programs_id");
    CREATE INDEX IF NOT EXISTS "email_flows_rels_destinations_id_idx" ON "email_flows_rels" USING btree ("destinations_id");
    CREATE INDEX IF NOT EXISTS "email_logs_flow_idx" ON "email_logs" USING btree ("flow_id");
    CREATE INDEX IF NOT EXISTS "email_logs_campaign_idx" ON "email_logs" USING btree ("campaign_id");
    CREATE INDEX IF NOT EXISTS "email_logs_created_at_idx" ON "email_logs" USING btree ("created_at");
    CREATE INDEX IF NOT EXISTS "email_logs_updated_at_idx" ON "email_logs" USING btree ("updated_at");
    CREATE UNIQUE INDEX IF NOT EXISTS "cron_jobs_job_idx" ON "cron_jobs" USING btree ("job");
    CREATE INDEX IF NOT EXISTS "cron_jobs_created_at_idx" ON "cron_jobs" USING btree ("created_at");
    CREATE INDEX IF NOT EXISTS "cron_jobs_updated_at_idx" ON "cron_jobs" USING btree ("updated_at");

    ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "email_flows_id" integer;
    ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "email_logs_id" integer;
    ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "cron_jobs_id" integer;

    DO $$ BEGIN
      ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_email_flows_fk" FOREIGN KEY ("email_flows_id") REFERENCES "email_flows"("id") ON DELETE CASCADE;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    DO $$ BEGIN
      ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_email_logs_fk" FOREIGN KEY ("email_logs_id") REFERENCES "email_logs"("id") ON DELETE CASCADE;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    DO $$ BEGIN
      ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_cron_jobs_fk" FOREIGN KEY ("cron_jobs_id") REFERENCES "cron_jobs"("id") ON DELETE CASCADE;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;

    CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_email_flows_id_idx" ON "payload_locked_documents_rels" USING btree ("email_flows_id");
    CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_email_logs_id_idx" ON "payload_locked_documents_rels" USING btree ("email_logs_id");
    CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_cron_jobs_id_idx" ON "payload_locked_documents_rels" USING btree ("cron_jobs_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_email_flows_fk";
    ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_email_logs_fk";
    ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_cron_jobs_fk";
    ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "email_flows_id";
    ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "email_logs_id";
    ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "cron_jobs_id";

    DROP TABLE IF EXISTS "email_logs";
    DROP TABLE IF EXISTS "email_flows_rels";
    DROP TABLE IF EXISTS "email_flows_resend_tags";
    DROP TABLE IF EXISTS "email_flows";
    DROP TABLE IF EXISTS "cron_jobs";

    DROP TYPE IF EXISTS "enum_email_logs_status";
    DROP TYPE IF EXISTS "enum_email_flows_trigger";
    DROP TYPE IF EXISTS "enum_cron_jobs_job";
    DROP TYPE IF EXISTS "enum_cron_jobs_last_status";
  `)
}
