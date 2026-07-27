import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// Every collection needs a polymorphic relationship column on Payload's
// document-locking and per-user-preferences join tables. The travel_stats
// table was created in 20260727_travel_stats_table without these, which
// broke every /admin page load with:
// "column payload_locked_documents_rels.travel_stats_id does not exist"
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE payload_locked_documents_rels ADD COLUMN IF NOT EXISTS travel_stats_id integer;
    DO $$ BEGIN
      ALTER TABLE payload_locked_documents_rels
        ADD CONSTRAINT payload_locked_documents_rels_travel_stats_fk
        FOREIGN KEY (travel_stats_id) REFERENCES travel_stats(id) ON DELETE CASCADE;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    CREATE INDEX IF NOT EXISTS payload_locked_documents_rels_travel_stats_id_idx
      ON payload_locked_documents_rels (travel_stats_id);

    ALTER TABLE payload_preferences_rels ADD COLUMN IF NOT EXISTS travel_stats_id integer;
    DO $$ BEGIN
      ALTER TABLE payload_preferences_rels
        ADD CONSTRAINT payload_preferences_rels_travel_stats_fk
        FOREIGN KEY (travel_stats_id) REFERENCES travel_stats(id) ON DELETE CASCADE;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    CREATE INDEX IF NOT EXISTS payload_preferences_rels_travel_stats_id_idx
      ON payload_preferences_rels (travel_stats_id);
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE payload_locked_documents_rels DROP CONSTRAINT IF EXISTS payload_locked_documents_rels_travel_stats_fk;
    ALTER TABLE payload_locked_documents_rels DROP COLUMN IF EXISTS travel_stats_id;
    ALTER TABLE payload_preferences_rels DROP CONSTRAINT IF EXISTS payload_preferences_rels_travel_stats_fk;
    ALTER TABLE payload_preferences_rels DROP COLUMN IF EXISTS travel_stats_id;
  `)
}
