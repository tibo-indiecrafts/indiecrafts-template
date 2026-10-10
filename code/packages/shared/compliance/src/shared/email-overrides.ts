/**
 * The admin email-override contract: the reason codes, and the visitor consent a category withdraws.
 *
 * @see docs/reference/packages/shared/compliance/src/shared/email-overrides.md
 */

/** Why an admin turned email off or changed a sign-in email. Fixed codes, so the audit trail —
 *  kept through an erasure — holds no personal data. Shared by the admin app and the api. */
export const OVERRIDE_REASONS = [
  "request_email",
  "request_phone",
  "complaint",
  "bounce",
  "other",
] as const;
export type OverrideReason = (typeof OVERRIDE_REASONS)[number];

export const isOverrideReason = (value: unknown): value is OverrideReason =>
  OVERRIDE_REASONS.includes(value as OverrideReason);

/** The visitor consent a category's withdrawal also closes: a newsletter sign-up granted
 *  `newsletter`, a waitlist join granted `waitlist` (the General topic). Turning `news` or
 *  `general` off writes a `granted = 0` row of that type too, so the consent ledger agrees. */
export const VISITOR_CONSENT_TYPE: Readonly<Record<string, string>> = {
  news: "newsletter",
  general: "waitlist",
};
