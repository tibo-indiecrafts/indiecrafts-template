-- Idempotency-Key results for retried POSTs (/v1/events, /v1/export). A retry with the same key
-- replays the stored answer instead of acting twice. Kept 24 h — the cron's audit_purge deletes
-- older rows.
CREATE TABLE idempotency_keys (
  scope        TEXT NOT NULL,   -- route + sha256(authorization): a key never crosses callers
  key          TEXT NOT NULL,
  request_hash TEXT NOT NULL,   -- sha256(body): the same key with another body is refused
  status       INTEGER,         -- NULL while the first request still runs
  body         TEXT,
  created_at   TEXT NOT NULL,
  PRIMARY KEY (scope, key)
);
CREATE INDEX idempotency_keys_created ON idempotency_keys (created_at);
