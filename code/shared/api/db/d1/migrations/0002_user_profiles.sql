-- The small user DB (identity tier), created/updated on login. Forward-only
-- (D1 has no down-migrations — expand → migrate → contract). Written by two
-- paths: the session-log sink (upsert, stamps last_login_at) and the Clerk
-- webhook (source of truth for email; re-fingerprints on change; pseudonymises
-- on user.deleted). Primary target of erasure pseudonymisation.
--
-- Unlike the audit tables, this deliberately holds plaintext email + name —
-- required for profile-on-login + email-keyed erasure. Mitigated: EU-resident
-- D1, bearer-gated api-only writes, pseudonymised on erasure, anonymised rows
-- hard-deleted after 90 days, minimal fields.
CREATE TABLE user_profiles (
  user_id           TEXT PRIMARY KEY,            -- Clerk user id
  email             TEXT,                        -- from Clerk; null until synced
  full_name         TEXT,
  locale            TEXT,
  email_fingerprint TEXT,                        -- salted SHA-256; survives pseudonymisation
  created_at        TEXT NOT NULL,               -- ISO8601
  last_login_at     TEXT,
  deleted_at        TEXT,                        -- set on pseudonymisation
  anonymized        INTEGER NOT NULL DEFAULT 0   -- 0|1 (SQLite has no boolean)
);
CREATE INDEX idx_user_profiles_fingerprint ON user_profiles (email_fingerprint);
