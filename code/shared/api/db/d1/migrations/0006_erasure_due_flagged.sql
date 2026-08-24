-- Marks an erasure request once its GDPR SLA due date has been flagged (approaching or
-- breached) as a security_events row, so the cron's SLA pass doesn't re-flag it every
-- tick. Forward-only.
ALTER TABLE erasure_requests ADD COLUMN due_flagged_at TEXT;
