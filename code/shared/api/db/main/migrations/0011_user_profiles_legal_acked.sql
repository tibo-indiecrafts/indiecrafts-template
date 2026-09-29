-- Legal re-acceptance: the policy version the user last accepted (current state; the
-- append-only proof stays in consent_events, consent_type = 'legal_reaccept'). Forward-only
-- (D1 has no down-migration). NULL = never accepted. Written by POST /v1/consent/legal;
-- read by GET /v1/consent/legal so the "policies updated" banner follows a signed-in user
-- across website · app · mobile — accept on one, cleared on all.
ALTER TABLE user_profiles ADD COLUMN legal_acked_version TEXT;
