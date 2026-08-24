-- DSAR (data-subject request) intake — migrates the GDPR request form off the Sanity
-- `dataRequest` doc into this D1. DELIBERATE DEPARTURE from this file's minimization
-- convention (see 0001_init.sql's header): unlike the minimized audit tables, this
-- table stores a plaintext, replyable `email` + up to 4000 chars of free-text
-- `message` — short-lived OPERATIONAL PII the operator needs to action a GDPR
-- request (exactly as the Sanity dataRequest doc did before it). Forward-only (D1
-- has no down-migrations; expand → migrate → contract).
-- Design: docs/apps/web/config/data-retention.md

CREATE TABLE data_requests (
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
  request_type   TEXT NOT NULL,             -- one of the 7 GDPR rights (request-types.ts)
  email          TEXT NOT NULL,             -- plaintext, replyable — operator needs it
  message        TEXT,                      -- free text, ≤4000 chars
  status         TEXT NOT NULL DEFAULT 'new', -- new | in-progress | done
  submitted_at   TEXT NOT NULL,             -- ISO8601 timestamp
  source         TEXT,                      -- the page path the form was submitted from
  locale         TEXT,
  policy_version TEXT
);
CREATE INDEX idx_data_requests_status ON data_requests (status, submitted_at);
