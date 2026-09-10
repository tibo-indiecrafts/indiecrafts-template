-- 0009_email_preferences.sql — per-category marketing opt-in state.
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
