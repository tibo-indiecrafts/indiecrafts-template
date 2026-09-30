-- 0012_erasure_breach_flagged.sql — marks an erasure request once its GDPR SLA deadline has
-- PASSED and been flagged high (erasure_sla_breach). `due_flagged_at` (0005) marks the earlier
-- "due soon" (medium) flag; together each request gets at most one of each. Forward-only.
ALTER TABLE erasure_requests ADD COLUMN breach_flagged_at TEXT;
