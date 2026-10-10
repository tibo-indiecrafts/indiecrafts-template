-- Migration 0007 — a reason on an admin action.
--
-- The admin email overrides (turn a category off, stop all email, change a sign-in email) must
-- say why. The reason is a fixed code (request_email · request_phone · complaint · bounce ·
-- other), never free text: admin_audit is kept through erasure, so it must hold no personal data.
-- Nullable: every earlier action has no reason.
ALTER TABLE admin_audit ADD COLUMN reason TEXT;
