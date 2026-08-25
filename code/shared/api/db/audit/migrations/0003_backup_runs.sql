-- 0003_backup_runs.sql — backup history for the admin read-only card. Written by the
-- backup scripts (wrangler d1 execute); read by GET /v1/backups/status.
CREATE TABLE backup_runs (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  db_name     TEXT NOT NULL,
  env         TEXT NOT NULL,
  kind        TEXT NOT NULL,          -- 'scheduled' | 'pre-migration' | 'manual'
  r2_key      TEXT,
  bytes       INTEGER,
  status      TEXT NOT NULL,          -- 'ok' | 'failed'
  error       TEXT,
  started_at  TEXT NOT NULL,
  finished_at TEXT
);
CREATE INDEX idx_backup_runs_recent ON backup_runs (db_name, env, started_at DESC);
