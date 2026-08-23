-- Append-only consent proof log. Forward-only (D1 has no down-migrations).
-- One row per (decision, consent_type). Retained ~3 years (spec §13) — NOT the
-- 90-day audit window; the cron purges it on its own longer schedule. Keyed for
-- erasure by subject_id (Clerk user id) and email_fingerprint (the pseudonymisation
-- key, copied from user_profiles at write time). Data-minimized: 2-letter country
-- + a salted ip_hash, never a raw IP; the email itself is never stored here.
CREATE TABLE consent_events (
  id                INTEGER PRIMARY KEY AUTOINCREMENT,
  ts                TEXT NOT NULL,                -- ISO8601
  subject_type      TEXT NOT NULL,               -- 'user' | 'visitor'
  subject_id        TEXT NOT NULL,               -- Clerk user id, or anonymous consent_id
  email_fingerprint TEXT,                         -- from user_profiles when subject is a user; else null
  consent_type      TEXT NOT NULL,               -- cookie_analytics | cookie_marketing | marketing_email | terms | privacy | content_guidelines
  granted           INTEGER NOT NULL,            -- 0 | 1 (SQLite has no boolean)
  policy_version    TEXT NOT NULL,
  surface           TEXT NOT NULL,               -- website | app | mobile | hybrid
  source            TEXT,                         -- banner | preferences | auto
  country           TEXT,                         -- cf-ipcountry (2-letter)
  ip_hash           TEXT,                         -- salted SHA-256, never raw
  idempotency_key   TEXT NOT NULL UNIQUE          -- `${decisionId}:${consent_type}`; INSERT OR IGNORE dedupes retries
);
CREATE INDEX idx_consent_events_ts      ON consent_events (ts);              -- for the retention purge
CREATE INDEX idx_consent_events_subject ON consent_events (subject_id);      -- for erasure
CREATE INDEX idx_consent_events_fp      ON consent_events (email_fingerprint); -- for email-keyed erasure
