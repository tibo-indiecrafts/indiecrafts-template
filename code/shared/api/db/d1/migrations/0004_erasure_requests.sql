-- Erasure request lifecycle + single-use confirmation token. Forward-only.
-- A request is anti-enumeration: a row exists only when the subject was found.
-- The token is stored as a SHA-256 hash (never plaintext); confirm verifies the
-- hash + a typed-email fingerprint + TTL + an attempt cap. `result` holds the
-- engine receipt JSON. Retained as a proof-of-erasure record (dropped at final purge).
CREATE TABLE erasure_requests (
  id                INTEGER PRIMARY KEY AUTOINCREMENT,
  status            TEXT NOT NULL,               -- pending | email_sent | confirmed | completed | cancelled | expired
  token_hash        TEXT NOT NULL,               -- sha256Hex of the single-use token
  token_expires_at  TEXT NOT NULL,               -- ISO8601 TTL
  attempts          INTEGER NOT NULL DEFAULT 0,  -- confirm attempts (attempt-limit)
  user_id           TEXT,                        -- Clerk user id when known
  email_fingerprint TEXT NOT NULL,               -- the subject key (matches user_profiles / consent)
  requested_at      TEXT NOT NULL,
  confirmed_at      TEXT,
  completed_at      TEXT,
  due_at            TEXT NOT NULL,               -- GDPR 1-month SLA target
  result            TEXT                         -- erasure receipt JSON
);
CREATE INDEX idx_erasure_requests_token ON erasure_requests (token_hash);
CREATE INDEX idx_erasure_requests_fp    ON erasure_requests (email_fingerprint);
