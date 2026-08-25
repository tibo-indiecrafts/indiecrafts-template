-- 0007_site_settings.sql — operator overrides for worker-read operational knobs.
-- Overrides only; an absent key falls back to its code default (packages-shared-config).
CREATE TABLE site_settings (
  key        TEXT PRIMARY KEY,
  value      TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  updated_by TEXT NOT NULL
);
