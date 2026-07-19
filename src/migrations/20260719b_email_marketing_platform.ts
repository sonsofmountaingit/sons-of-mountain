import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// Adds columns for the email marketing platform to existing tables.
// New collections (email_flows, email_logs) and the new email_settings global
// are created automatically by Payload's schema push on first `payload.db.migrate()`
// run since they have no prior data to preserve.
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE subscribers ADD COLUMN IF NOT EXISTS unsubscribe_token varchar;
    ALTER TABLE subscribers ADD COLUMN IF NOT EXISTS last_email_sent_at timestamp(3) with time zone;
    ALTER TABLE subscribers ADD COLUMN IF NOT EXISTS email_count numeric DEFAULT 0;

    DO $$ BEGIN
      ALTER TABLE subscribers ADD CONSTRAINT subscribers_unsubscribe_token_unique UNIQUE (unsubscribe_token);
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;

    ALTER TABLE segments ADD COLUMN IF NOT EXISTS description varchar;
    ALTER TABLE segments ADD COLUMN IF NOT EXISTS preview_count numeric;
    ALTER TABLE segments_filter_rules ADD COLUMN IF NOT EXISTS operator varchar DEFAULT 'include';

    ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS audience_type varchar DEFAULT 'subscribers';
    ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS from_name varchar;
    ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS from_email varchar;
    ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS reply_to varchar;
    ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS test_email varchar;
    ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS sent_count numeric DEFAULT 0;
    ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS stats_clicks numeric DEFAULT 0;

    ALTER TABLE email_templates ADD COLUMN IF NOT EXISTS content_type varchar DEFAULT 'richtext';
    ALTER TABLE email_templates ADD COLUMN IF NOT EXISTS maily_content jsonb;
    ALTER TABLE email_templates ADD COLUMN IF NOT EXISTS html_content varchar;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE subscribers DROP CONSTRAINT IF EXISTS subscribers_unsubscribe_token_unique;
    ALTER TABLE subscribers DROP COLUMN IF EXISTS unsubscribe_token;
    ALTER TABLE subscribers DROP COLUMN IF EXISTS last_email_sent_at;
    ALTER TABLE subscribers DROP COLUMN IF EXISTS email_count;

    ALTER TABLE segments DROP COLUMN IF EXISTS description;
    ALTER TABLE segments DROP COLUMN IF EXISTS preview_count;
    ALTER TABLE segments_filter_rules DROP COLUMN IF EXISTS operator;

    ALTER TABLE campaigns DROP COLUMN IF EXISTS audience_type;
    ALTER TABLE campaigns DROP COLUMN IF EXISTS from_name;
    ALTER TABLE campaigns DROP COLUMN IF EXISTS from_email;
    ALTER TABLE campaigns DROP COLUMN IF EXISTS reply_to;
    ALTER TABLE campaigns DROP COLUMN IF EXISTS test_email;
    ALTER TABLE campaigns DROP COLUMN IF EXISTS sent_count;
    ALTER TABLE campaigns DROP COLUMN IF EXISTS stats_clicks;

    ALTER TABLE email_templates DROP COLUMN IF EXISTS content_type;
    ALTER TABLE email_templates DROP COLUMN IF EXISTS maily_content;
    ALTER TABLE email_templates DROP COLUMN IF EXISTS html_content;
  `)
}
