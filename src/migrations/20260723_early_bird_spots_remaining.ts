import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE trips ADD COLUMN IF NOT EXISTS early_bird_spots_remaining numeric;
    ALTER TABLE programs ADD COLUMN IF NOT EXISTS early_bird_spots_remaining numeric;
    ALTER TABLE destinations ADD COLUMN IF NOT EXISTS early_bird_spots_remaining numeric;
    ALTER TABLE _destinations_v ADD COLUMN IF NOT EXISTS version_early_bird_spots_remaining numeric;

    UPDATE trips SET early_bird_spots_remaining = early_bird_spots WHERE early_bird_spots IS NOT NULL AND early_bird_spots_remaining IS NULL;
    UPDATE programs SET early_bird_spots_remaining = early_bird_spots WHERE early_bird_spots IS NOT NULL AND early_bird_spots_remaining IS NULL;
    UPDATE destinations SET early_bird_spots_remaining = early_bird_spots WHERE early_bird_spots IS NOT NULL AND early_bird_spots_remaining IS NULL;

    WITH consumed AS (
      SELECT trip_id AS id, COALESCE(SUM(early_bird_count), 0) AS n
      FROM orders_items oi
      JOIN orders o ON o.id = oi._parent_id
      WHERE oi.trip_id IS NOT NULL AND o.status IN ('paid', 'partial')
      GROUP BY trip_id
    )
    UPDATE trips t
    SET early_bird_spots_remaining = GREATEST(0, COALESCE(t.early_bird_spots, 0) - COALESCE(c.n, 0))
    FROM consumed c
    WHERE c.id = t.id AND t.early_bird_spots IS NOT NULL;

    WITH consumed AS (
      SELECT program_id AS id, COALESCE(SUM(early_bird_count), 0) AS n
      FROM orders_items oi
      JOIN orders o ON o.id = oi._parent_id
      WHERE oi.program_id IS NOT NULL AND o.status IN ('paid', 'partial')
      GROUP BY program_id
    )
    UPDATE programs p
    SET early_bird_spots_remaining = GREATEST(0, COALESCE(p.early_bird_spots, 0) - COALESCE(c.n, 0))
    FROM consumed c
    WHERE c.id = p.id AND p.early_bird_spots IS NOT NULL;

    WITH consumed AS (
      SELECT destination_id AS id, COALESCE(SUM(early_bird_count), 0) AS n
      FROM orders_items oi
      JOIN orders o ON o.id = oi._parent_id
      WHERE oi.destination_id IS NOT NULL AND o.status IN ('paid', 'partial')
      GROUP BY destination_id
    )
    UPDATE destinations d
    SET early_bird_spots_remaining = GREATEST(0, COALESCE(d.early_bird_spots, 0) - COALESCE(c.n, 0))
    FROM consumed c
    WHERE c.id = d.id AND d.early_bird_spots IS NOT NULL;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE trips DROP COLUMN IF EXISTS early_bird_spots_remaining;
    ALTER TABLE programs DROP COLUMN IF EXISTS early_bird_spots_remaining;
    ALTER TABLE destinations DROP COLUMN IF EXISTS early_bird_spots_remaining;
    ALTER TABLE _destinations_v DROP COLUMN IF EXISTS version_early_bird_spots_remaining;
  `)
}
