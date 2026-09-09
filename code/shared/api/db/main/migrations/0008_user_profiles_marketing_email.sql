-- Marketing-email opt-in (current state; the append-only proof stays in consent_events).
-- Forward-only (D1 has no down-migration). NULL = never decided, 0 = opted out, 1 = opted in.
-- Written on user.created (from Clerk unsafe_metadata) and by POST /v1/consent/marketing-email;
-- read by the account toggle, the sign-in nudge, and the admin users list. The proof of each
-- decision lives in consent_events (consent_type = 'marketing_email'); this is the fast cache.
ALTER TABLE user_profiles ADD COLUMN marketing_email INTEGER;
