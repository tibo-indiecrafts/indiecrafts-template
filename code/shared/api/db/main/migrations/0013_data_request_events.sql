-- History of operator actions on a DSAR (status changes + the closing note). One row per
-- action. `note` is operational PII (encrypted when PII_ENCRYPTION_KEY is set); rows go with
-- their request (ON DELETE CASCADE) — the 365-day data_requests purge removes both.
CREATE TABLE data_request_events (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  request_id  INTEGER NOT NULL REFERENCES data_requests(id) ON DELETE CASCADE,
  status      TEXT NOT NULL,
  note        TEXT,
  actor       TEXT NOT NULL,
  notified    INTEGER NOT NULL DEFAULT 0,
  at          TEXT NOT NULL
);
CREATE INDEX idx_data_request_events_request ON data_request_events (request_id, at);
