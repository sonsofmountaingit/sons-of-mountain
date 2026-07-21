import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// The email_marketing_platform migrations never created the email_settings global's
// tables, so /admin/globals/email-settings returns "Nothing found" on prod.
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE "enum_email_settings_social_links_platform" AS ENUM ('instagram', 'facebook', 'youtube', 'tiktok');
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;

    CREATE TABLE IF NOT EXISTS "email_settings" (
      "id" serial PRIMARY KEY NOT NULL,
      "from_name" varchar DEFAULT 'Sons of Mountains',
      "from_email" varchar,
      "reply_to_email" varchar,
      "admin_email" varchar,
      "logo_url" varchar,
      "brand_color" varchar DEFAULT '#ffffff',
      "brand_bg_color" varchar DEFAULT '#0a0a0a',
      "footer_text" jsonb,
      "unsubscribe_text" varchar DEFAULT 'Отпиши се',
      "test_mode" boolean DEFAULT false,
      "test_email" varchar,
      "updated_at" timestamp(3) with time zone,
      "created_at" timestamp(3) with time zone
    );

    CREATE TABLE IF NOT EXISTS "email_settings_social_links" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "platform" "enum_email_settings_social_links_platform",
      "url" varchar
    );

    DO $$ BEGIN
      ALTER TABLE "email_settings_social_links" ADD CONSTRAINT "email_settings_social_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "email_settings"("id") ON DELETE CASCADE;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;

    CREATE INDEX IF NOT EXISTS "email_settings_social_links_order_idx" ON "email_settings_social_links" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "email_settings_social_links_parent_id_idx" ON "email_settings_social_links" USING btree ("_parent_id");

    INSERT INTO "email_settings" ("id") SELECT 1 WHERE NOT EXISTS (SELECT 1 FROM "email_settings");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "email_settings_social_links";
    DROP TABLE IF EXISTS "email_settings";
    DROP TYPE IF EXISTS "enum_email_settings_social_links_platform";
  `)
}
