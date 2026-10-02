-- The Clerk role (public_metadata.role) last seen by the Clerk webhook. Clerk sends no
-- previous values, so this is how the webhook tells a role→admin GRANT from a later update
-- of a user who is already admin — it records one privilege_escalation per grant, not one
-- per profile edit. Forward-only. NULL = no role, or not seen since this migration (the
-- next update of an existing admin then counts as a grant once).
ALTER TABLE user_profiles ADD COLUMN role TEXT;
