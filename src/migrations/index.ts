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
import * as migration_20260716c_transport_map_link from './20260716c_transport_map_link'
import * as migration_20260716d_testimonials_role from './20260716d_testimonials_role'
import * as migration_20260716e_testimonials_instagram from './20260716e_testimonials_instagram'
import * as migration_20260718_about_hero_image_position from './20260718_about_hero_image_position'
import * as migration_20260719_booking_steps from './20260719_booking_steps'
import * as migration_20260719b_email_marketing_platform from './20260719b_email_marketing_platform'
import * as migration_20260720_free_transfer_return_date from './20260720_free_transfer_return_date'
import * as migration_20260720b_email_marketing_tables from './20260720b_email_marketing_tables'
import * as migration_20260721_email_settings_global from './20260721_email_settings_global'
import * as migration_20260723_early_bird_spots_remaining from './20260723_early_bird_spots_remaining'
import * as migration_20260727_travel_stats_table from './20260727_travel_stats_table'
import * as migration_20260727b_travel_stats_rels_columns from './20260727b_travel_stats_rels_columns'
import * as migration_20260729_customers_sessions_table from './20260729_customers_sessions_table'
import * as migration_20260731_registrations_manual_confirm_paid from './20260731_registrations_manual_confirm_paid'
import * as migration_20260801_booking_deadline from './20260801_booking_deadline'
import * as migration_20260803_footer_tiktok_followers from './20260803_footer_tiktok_followers'
import * as migration_20260806_discount_codes_applicable_scope from './20260806_discount_codes_applicable_scope'
import * as migration_20260807_programs_hero_gallery from './20260807_programs_hero_gallery'
import * as migration_20260807b_programs_free_transfer from './20260807b_programs_free_transfer'
import * as migration_20260807c_programs_why_visit from './20260807c_programs_why_visit'
import * as migration_20260807d_programs_intro_text from './20260807d_programs_intro_text'
import * as migration_20260808_euro_only_currency from './20260808_euro_only_currency'
import * as migration_20260810_archive_expired_programs from './20260810_archive_expired_programs'
import * as migration_20260811_customer_profile_fields from './20260811_customer_profile_fields'

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
  {
    up: migration_20260716c_transport_map_link.up,
    down: migration_20260716c_transport_map_link.down,
    name: '20260716c_transport_map_link',
  },
  {
    up: migration_20260716d_testimonials_role.up,
    down: migration_20260716d_testimonials_role.down,
    name: '20260716d_testimonials_role',
  },
  {
    up: migration_20260716e_testimonials_instagram.up,
    down: migration_20260716e_testimonials_instagram.down,
    name: '20260716e_testimonials_instagram',
  },
  {
    up: migration_20260718_about_hero_image_position.up,
    down: migration_20260718_about_hero_image_position.down,
    name: '20260718_about_hero_image_position',
  },
  {
    up: migration_20260719_booking_steps.up,
    down: migration_20260719_booking_steps.down,
    name: '20260719_booking_steps',
  },
  {
    up: migration_20260719b_email_marketing_platform.up,
    down: migration_20260719b_email_marketing_platform.down,
    name: '20260719b_email_marketing_platform',
  },
  {
    up: migration_20260720_free_transfer_return_date.up,
    down: migration_20260720_free_transfer_return_date.down,
    name: '20260720_free_transfer_return_date',
  },
  {
    up: migration_20260720b_email_marketing_tables.up,
    down: migration_20260720b_email_marketing_tables.down,
    name: '20260720b_email_marketing_tables',
  },
  {
    up: migration_20260721_email_settings_global.up,
    down: migration_20260721_email_settings_global.down,
    name: '20260721_email_settings_global',
  },
  {
    up: migration_20260723_early_bird_spots_remaining.up,
    down: migration_20260723_early_bird_spots_remaining.down,
    name: '20260723_early_bird_spots_remaining',
  },
  {
    up: migration_20260727_travel_stats_table.up,
    down: migration_20260727_travel_stats_table.down,
    name: '20260727_travel_stats_table',
  },
  {
    up: migration_20260727b_travel_stats_rels_columns.up,
    down: migration_20260727b_travel_stats_rels_columns.down,
    name: '20260727b_travel_stats_rels_columns',
  },
  {
    up: migration_20260729_customers_sessions_table.up,
    down: migration_20260729_customers_sessions_table.down,
    name: '20260729_customers_sessions_table',
  },
  {
    up: migration_20260731_registrations_manual_confirm_paid.up,
    down: migration_20260731_registrations_manual_confirm_paid.down,
    name: '20260731_registrations_manual_confirm_paid',
  },
  {
    up: migration_20260801_booking_deadline.up,
    down: migration_20260801_booking_deadline.down,
    name: '20260801_booking_deadline',
  },
  {
    up: migration_20260803_footer_tiktok_followers.up,
    down: migration_20260803_footer_tiktok_followers.down,
    name: '20260803_footer_tiktok_followers',
  },
  {
    up: migration_20260806_discount_codes_applicable_scope.up,
    down: migration_20260806_discount_codes_applicable_scope.down,
    name: '20260806_discount_codes_applicable_scope',
  },
  {
    up: migration_20260807_programs_hero_gallery.up,
    down: migration_20260807_programs_hero_gallery.down,
    name: '20260807_programs_hero_gallery',
  },
  {
    up: migration_20260807b_programs_free_transfer.up,
    down: migration_20260807b_programs_free_transfer.down,
    name: '20260807b_programs_free_transfer',
  },
  {
    up: migration_20260807c_programs_why_visit.up,
    down: migration_20260807c_programs_why_visit.down,
    name: '20260807c_programs_why_visit',
  },
  {
    up: migration_20260807d_programs_intro_text.up,
    down: migration_20260807d_programs_intro_text.down,
    name: '20260807d_programs_intro_text',
  },
  {
    up: migration_20260808_euro_only_currency.up,
    down: migration_20260808_euro_only_currency.down,
    name: '20260808_euro_only_currency',
  },
  {
    up: migration_20260810_archive_expired_programs.up,
    down: migration_20260810_archive_expired_programs.down,
    name: '20260810_archive_expired_programs',
  },
  {
    up: migration_20260811_customer_profile_fields.up,
    down: migration_20260811_customer_profile_fields.down,
    name: '20260811_customer_profile_fields',
  },
]
