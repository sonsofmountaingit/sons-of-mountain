import * as migration_20260528_add_missing_tables from './20260528_add_missing_tables'
import * as migration_20260624_add_page_columns from './20260624_add_page_columns'
import * as migration_20260629_tags_free_text from './20260629_tags_free_text'
import * as migration_20260710_free_transfer_peak from './20260710_free_transfer_peak'
import * as migration_20260714_seo_meta_keywords_and_site_meta from './20260714_seo_meta_keywords_and_site_meta'
import * as migration_20260714b_seo_meta_keywords_all_collections from './20260714b_seo_meta_keywords_all_collections'
import * as migration_20260714c_seo_meta_keywords_versions_tables from './20260714c_seo_meta_keywords_versions_tables'
import * as migration_20260714d_guides_bio_jsonb from './20260714d_guides_bio_jsonb'
import * as migration_20260716_customers_native_auth from './20260716_customers_native_auth'
import * as migration_20260716b_preferences_rels_customers from './20260716b_preferences_rels_customers'

export const migrations = [
  {
    up: migration_20260528_add_missing_tables.up,
    down: migration_20260528_add_missing_tables.down,
    name: '20260528_add_missing_tables',
  },
  {
    up: migration_20260624_add_page_columns.up,
    down: migration_20260624_add_page_columns.down,
    name: '20260624_add_page_columns',
  },
  {
    up: migration_20260629_tags_free_text.up,
    down: migration_20260629_tags_free_text.down,
    name: '20260629_tags_free_text',
  },
  {
    up: migration_20260710_free_transfer_peak.up,
    down: migration_20260710_free_transfer_peak.down,
    name: '20260710_free_transfer_peak',
  },
  {
    up: migration_20260714_seo_meta_keywords_and_site_meta.up,
    down: migration_20260714_seo_meta_keywords_and_site_meta.down,
    name: '20260714_seo_meta_keywords_and_site_meta',
  },
  {
    up: migration_20260714b_seo_meta_keywords_all_collections.up,
    down: migration_20260714b_seo_meta_keywords_all_collections.down,
    name: '20260714b_seo_meta_keywords_all_collections',
  },
  {
    up: migration_20260714c_seo_meta_keywords_versions_tables.up,
    down: migration_20260714c_seo_meta_keywords_versions_tables.down,
    name: '20260714c_seo_meta_keywords_versions_tables',
  },
  {
    up: migration_20260714d_guides_bio_jsonb.up,
    down: migration_20260714d_guides_bio_jsonb.down,
    name: '20260714d_guides_bio_jsonb',
  },
  {
    up: migration_20260716_customers_native_auth.up,
    down: migration_20260716_customers_native_auth.down,
    name: '20260716_customers_native_auth',
  },
  {
    up: migration_20260716b_preferences_rels_customers.up,
    down: migration_20260716b_preferences_rels_customers.down,
    name: '20260716b_preferences_rels_customers',
  },
]
