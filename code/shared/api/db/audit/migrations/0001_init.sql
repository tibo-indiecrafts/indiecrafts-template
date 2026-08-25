-- The api's EU D1 (--location weur) — ONE database, three isolated tables. Holds the
-- admin audit trail, per-surface sign-in activity, AND the app-level security incidents
-- Cloudflare's edge WAF can't see. One DB (not three) keeps the free-plan D1 count low;
-- the tables stay independent (own indexes, own purges). Forward-only (D1 has no
-- down-migrations; expand → migrate → contract). Data is minimized (GDPR Art. 5(1)(c)):
-- country code + a SALTED hash of the IP, never the raw IP, no user-agent, no PII
-- free-text. 90-day retention is enforced by the cron worker's purge.
-- Design: docs/apps/web/config/security-hardening.md · docs/apps/web/config/data-retention.md

-- ── admin actions (the audit trail) ────────────────────────────────────────────
CREATE TABLE admin_audit (
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
  ts             TEXT NOT NULL,   -- ISO8601 timestamp
  event          TEXT NOT NULL,   -- admin.grant | admin.revoke | admin.revoke_session | …
  actor_user_id  TEXT NOT NULL,   -- who performed the action
  target_user_id TEXT NOT NULL,   -- whom it affected
  country        TEXT,            -- cf-ipcountry (2-letter), nullable
  ip_hash        TEXT             -- salted SHA-256 of the IP, never raw
);
CREATE INDEX idx_admin_audit_ts ON admin_audit (ts);

-- ── per-surface sign-in activity (revocable from the admin sessions screen) ─────
CREATE TABLE session_events (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  ts         TEXT NOT NULL,
  surface    TEXT NOT NULL,       -- website | admin | app | mobile | hybrid
  user_id    TEXT NOT NULL,
  session_id TEXT,                -- the Clerk session id → the row is revocable
  country    TEXT,
  ip_hash    TEXT
);
CREATE INDEX idx_session_events_ts   ON session_events (ts);
CREATE INDEX idx_session_events_user ON session_events (user_id);  -- for erasure purges

-- ── app-level security incidents (low-volume; the edge firehose stays in Cloudflare) ─
CREATE TABLE security_events (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  ts          TEXT NOT NULL,   -- ISO8601 timestamp
  event_type  TEXT NOT NULL,   -- failed_login | credential_stuffing | privilege_escalation
                               -- | data_exfiltration | suspicious_pattern | rate_limit_exceeded
  severity    TEXT NOT NULL,   -- low | medium | high | critical
  surface     TEXT,            -- website | admin | app | mobile | hybrid | api
  user_id     TEXT,            -- when known; else null (IP-keyed)
  country     TEXT,            -- cf-ipcountry (2-letter)
  ip_hash     TEXT,            -- salted SHA-256 of the IP, never raw
  description TEXT             -- short label, never PII free-text
);
CREATE INDEX idx_security_events_ts       ON security_events (ts);
CREATE INDEX idx_security_events_type_sev ON security_events (event_type, severity);
CREATE INDEX idx_security_events_user     ON security_events (user_id);  -- for erasure purges
