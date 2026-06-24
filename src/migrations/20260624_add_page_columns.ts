import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // Add navSection to trips
  await db.execute(sql`
    ALTER TABLE trips ADD COLUMN IF NOT EXISTS nav_section varchar;
  `)

  // Add navSection to programs
  await db.execute(sql`
    ALTER TABLE programs ADD COLUMN IF NOT EXISTS nav_section varchar;
  `)

  // Add page_id to navigation nav link arrays
  await db.execute(sql`
    ALTER TABLE navigation_nav_links_left ADD COLUMN IF NOT EXISTS page_id integer REFERENCES pages(id) ON DELETE SET NULL;
  `)
  await db.execute(sql`
    ALTER TABLE navigation_nav_links_right ADD COLUMN IF NOT EXISTS page_id integer REFERENCES pages(id) ON DELETE SET NULL;
  `)

  // New globals: contact-page, blog-page, stories-page, calendar-page, home-page
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS contact_page (
      id serial PRIMARY KEY,
      heading varchar,
      subheading varchar,
      puck_data jsonb,
      updated_at timestamp with time zone DEFAULT now() NOT NULL,
      created_at timestamp with time zone DEFAULT now() NOT NULL
    );
  `)

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS contact_page_faq_items (
      _order integer NOT NULL,
      _parent_id integer NOT NULL REFERENCES contact_page(id) ON DELETE CASCADE,
      id varchar PRIMARY KEY,
      question varchar,
      answer varchar
    );
  `)

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS blog_page (
      id serial PRIMARY KEY,
      heading varchar,
      subheading varchar,
      puck_data jsonb,
      updated_at timestamp with time zone DEFAULT now() NOT NULL,
      created_at timestamp with time zone DEFAULT now() NOT NULL
    );
  `)

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS stories_page (
      id serial PRIMARY KEY,
      heading varchar,
      subheading varchar,
      puck_data jsonb,
      updated_at timestamp with time zone DEFAULT now() NOT NULL,
      created_at timestamp with time zone DEFAULT now() NOT NULL
    );
  `)

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS calendar_page (
      id serial PRIMARY KEY,
      heading varchar,
      subheading varchar,
      puck_data jsonb,
      updated_at timestamp with time zone DEFAULT now() NOT NULL,
      created_at timestamp with time zone DEFAULT now() NOT NULL
    );
  `)

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS home_page (
      id serial PRIMARY KEY,
      puck_data jsonb,
      updated_at timestamp with time zone DEFAULT now() NOT NULL,
      created_at timestamp with time zone DEFAULT now() NOT NULL
    );
  `)

  // Seed one row for each new global so Payload can read/update it
  await db.execute(sql`INSERT INTO contact_page (id) VALUES (1) ON CONFLICT DO NOTHING;`)
  await db.execute(sql`INSERT INTO blog_page (id) VALUES (1) ON CONFLICT DO NOTHING;`)
  await db.execute(sql`INSERT INTO stories_page (id) VALUES (1) ON CONFLICT DO NOTHING;`)
  await db.execute(sql`INSERT INTO calendar_page (id) VALUES (1) ON CONFLICT DO NOTHING;`)
  await db.execute(sql`INSERT INTO home_page (id) VALUES (1) ON CONFLICT DO NOTHING;`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`ALTER TABLE trips DROP COLUMN IF EXISTS nav_section;`)
  await db.execute(sql`ALTER TABLE programs DROP COLUMN IF EXISTS nav_section;`)
  await db.execute(sql`ALTER TABLE navigation_nav_links_left DROP COLUMN IF EXISTS page_id;`)
  await db.execute(sql`ALTER TABLE navigation_nav_links_right DROP COLUMN IF EXISTS page_id;`)
  await db.execute(sql`DROP TABLE IF EXISTS contact_page_faq_items;`)
  await db.execute(sql`DROP TABLE IF EXISTS contact_page;`)
  await db.execute(sql`DROP TABLE IF EXISTS blog_page;`)
  await db.execute(sql`DROP TABLE IF EXISTS stories_page;`)
  await db.execute(sql`DROP TABLE IF EXISTS calendar_page;`)
  await db.execute(sql`DROP TABLE IF EXISTS home_page;`)
}
