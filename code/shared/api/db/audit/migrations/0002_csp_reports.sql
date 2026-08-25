-- Aggregated CSP violation reports. Forward-only (D1 has no down-migrations).
-- One row per distinct violation GROUP (surface|disposition|directive|path|source),
-- with a running count — not one row per report. Bounds table size by distinct
-- violations, not request volume. Purged after 30 days by the cron worker.
-- Data-minimized: NO country, NO ip_hash — a CSP violation is about a resource,
-- not a person. Routes are collapsed (/orders/:id) and samples redacted upstream.
CREATE TABLE csp_reports (
  id                 INTEGER PRIMARY KEY AUTOINCREMENT,
  group_key          TEXT NOT NULL UNIQUE,   -- surface|disposition|directive|path|source
  first_seen         TEXT NOT NULL,          -- ISO8601
  last_seen          TEXT NOT NULL,          -- ISO8601; drives the 30-day purge
  count              INTEGER NOT NULL DEFAULT 1,
  surface            TEXT NOT NULL,          -- website | admin | app
  disposition        TEXT NOT NULL,          -- report | enforce
  directive          TEXT NOT NULL,          -- effectiveDirective, e.g. script-src-elem
  document_path      TEXT NOT NULL,          -- collapsed route, e.g. /orders/:id
  blocked_source     TEXT NOT NULL,          -- origin | inline | eval
  sample_source_file TEXT,                    -- last-seen, query stripped
  sample_line        INTEGER,
  sample_snippet     TEXT                     -- last-seen, redacted
);
CREATE INDEX idx_csp_reports_last_seen ON csp_reports (last_seen);   -- for the purge
CREATE INDEX idx_csp_reports_group     ON csp_reports (surface, directive);
