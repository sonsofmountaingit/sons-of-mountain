import * as migration_20260528_add_missing_tables from './20260528_add_missing_tables'
import * as migration_20260624_add_page_columns from './20260624_add_page_columns'
import * as migration_20260629_tags_free_text from './20260629_tags_free_text'
import * as migration_20260710_free_transfer_peak from './20260710_free_transfer_peak'
import * as migration_20260714_seo_meta_keywords_and_site_meta from './20260714_seo_meta_keywords_and_site_meta'
import * as migration_20260714b_seo_meta_keywords_all_collections from './20260714b_seo_meta_keywords_all_collections'

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
]
