-- A webhook retry (Svix re-sends the same message id) must not store or alert an incident twice.
-- The caller passes a dedup key (e.g. `clerk:<svix-id>`); NULL rows stay distinct. Forward-only.
ALTER TABLE security_events ADD COLUMN dedup_key TEXT;
CREATE UNIQUE INDEX idx_security_events_dedup ON security_events (dedup_key);
