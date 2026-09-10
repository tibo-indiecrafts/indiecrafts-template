-- Per-category marketing opt-in state (replaces the single marketing_email flag with one
-- row per user per category). Forward-only (D1 has no down-migrations — expand → migrate →
-- contract). idx_email_prefs_category supports lookups/filters by category.
--
-- Backfill: seeds each user's legacy user_profiles.marketing_email into a `news` category
-- row — NULL (never decided) is skipped, 0 (opted out) and 1 (opted in) are both preserved.
-- INSERT OR IGNORE makes this idempotent — safe to re-run against the (user_id, category_key)
-- primary key.
CREATE TABLE email_preferences (
  user_id      TEXT NOT NULL,
  category_key TEXT NOT NULL,
  granted      INTEGER NOT NULL,
  updated_at   TEXT NOT NULL,
  PRIMARY KEY (user_id, category_key)
);
CREATE INDEX idx_email_prefs_category ON email_preferences (category_key, granted);
-- Migrate the legacy single opt-in into the reserved `news` category.
INSERT OR IGNORE INTO email_preferences (user_id, category_key, granted, updated_at)
SELECT user_id, 'news', marketing_email, strftime('%Y-%m-%dT%H:%M:%fZ','now')
FROM user_profiles WHERE marketing_email IS NOT NULL;
