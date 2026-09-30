-- 0004_cron_runs.sql — one row per scheduled cron tick, written by the cron worker, read by
-- GET /v1/cron/status (admin "Scheduled jobs"). `passes` = JSON PassResult[] — counts + error
-- NAMES only, no personal data. Purged at the audit retention window.
CREATE TABLE cron_runs (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  started_at  TEXT NOT NULL,
  finished_at TEXT NOT NULL,
  status      TEXT NOT NULL,  -- 'ok' | 'failed'
  passes      TEXT NOT NULL
);
CREATE INDEX idx_cron_runs_recent ON cron_runs (started_at DESC);
