-- Data-export single-use download tokens. Forward-only.
-- POST /v1/export runs runExport, stores the bundle in R2, and inserts one row here
-- keyed by a SHA-256 token hash (never plaintext). GET /v1/export/download verifies
-- the hash + TTL + single-use, then streams the R2 object and deletes it.
CREATE TABLE export_requests (
  id                INTEGER PRIMARY KEY AUTOINCREMENT,
  token_hash        TEXT NOT NULL,               -- sha256Hex of the single-use download token
  r2_key            TEXT NOT NULL,               -- the export bundle's key in EXPORT_BUCKET
  user_id           TEXT,                        -- Clerk user id
  email_fingerprint TEXT NOT NULL,               -- the subject key (matches user_profiles / consent)
  created_at        TEXT NOT NULL,
  expires_at        TEXT NOT NULL,               -- ISO8601 TTL (1h)
  downloaded_at     TEXT                         -- set on first download (single-use)
);
CREATE INDEX idx_export_requests_token ON export_requests (token_hash);
