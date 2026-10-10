/**
 * The reason codes for an admin email override — shared by the panel, the actions and the reader.
 *
 * @see docs/reference/projects/web/admin/src/lib/override-reasons.md
 */

/** Why an admin turned email off. Fixed codes, so the audit trail (kept through an erasure)
 *  holds no personal data; the api accepts exactly these. */
export const OVERRIDE_REASONS = [
  "request_email",
  "request_phone",
  "complaint",
  "bounce",
  "other",
] as const;
export type OverrideReason = (typeof OVERRIDE_REASONS)[number];
