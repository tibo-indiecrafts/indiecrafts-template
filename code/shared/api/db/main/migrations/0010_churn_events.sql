-- Voluntary-churn survey capture. One row per self-service account deletion (the only
-- writer — the Clerk webhook reads this table but never writes it). Legitimate-interest
-- basis: understand why customers leave. No email, no name; feedback/competitor are
-- optional operator-read free text (the data_requests precedent). Forward-only (D1 has no
-- down-migrations). idx_churn_deleted_at supports the admin page's time-series aggregate.
CREATE TABLE churn_events (
  user_id     TEXT PRIMARY KEY,   -- opaque Clerk id, dedup key
  deleted_at  TEXT NOT NULL,      -- ISO 8601
  reason      TEXT,               -- preset code (CHURN_REASONS), else NULL
  feedback    TEXT,               -- optional free text
  competitor  TEXT                -- optional free text
);
CREATE INDEX idx_churn_deleted_at ON churn_events (deleted_at);
