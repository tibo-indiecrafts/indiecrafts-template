/**
 * The copy contracts for the shared account sections + pure builders that assemble
 * them from a namespace-scoped translator. Lives in `shared` (no React) so the
 * `web`/`native` section components AND the builders reference one type. Each surface
 * passes a `t` already scoped to `account.delete` / `account.export`, so `t("heading")`
 * resolves the right string regardless of its i18n runtime (next-intl / react-intl).
 */

/** Preset reason codes — MUST mirror `CHURN_REASONS` in the api's `consent/churn-store`. */
export const CHURN_REASON_CODES = [
  "too_expensive",
  "not_using",
  "missing_feature",
  "found_alternative",
  "too_hard",
  "privacy",
  "other",
] as const;
export type ChurnReasonCode = (typeof CHURN_REASON_CODES)[number];

export interface DeleteAccountSurveyCopy {
  legend: string;
  reasonLabel: string;
  reasons: Record<ChurnReasonCode, string>;
  feedbackLabel: string;
  feedbackPlaceholder: string;
  competitorLabel: string;
  competitorPlaceholder: string;
}

export interface DeleteAccountCopy {
  heading: string;
  body: string;
  emailLabel: string;
  emailPlaceholder: string;
  confirmButton: string;
  pending: string;
  success: string;
  partial: string;
  error: string;
  mismatch: string;
  /** The optional churn exit-survey, rendered above the confirm control. */
  survey: DeleteAccountSurveyCopy;
}

export interface ExportCopy {
  heading: string;
  body: string;
  button: string;
  pending: string;
  success: string;
  error: string;
}

export function buildDeleteAccountCopy(
  t: (key: string) => string,
): DeleteAccountCopy {
  return {
    heading: t("heading"),
    body: t("body"),
    emailLabel: t("emailLabel"),
    emailPlaceholder: t("emailPlaceholder"),
    confirmButton: t("confirmButton"),
    pending: t("pending"),
    success: t("success"),
    partial: t("partial"),
    error: t("error"),
    mismatch: t("mismatch"),
    survey: {
      legend: t("survey.legend"),
      reasonLabel: t("survey.reasonLabel"),
      reasons: Object.fromEntries(
        CHURN_REASON_CODES.map((code) => [code, t(`survey.reasons.${code}`)]),
      ) as Record<ChurnReasonCode, string>,
      feedbackLabel: t("survey.feedbackLabel"),
      feedbackPlaceholder: t("survey.feedbackPlaceholder"),
      competitorLabel: t("survey.competitorLabel"),
      competitorPlaceholder: t("survey.competitorPlaceholder"),
    },
  };
}

export function buildExportCopy(t: (key: string) => string): ExportCopy {
  return {
    heading: t("heading"),
    body: t("body"),
    button: t("button"),
    pending: t("pending"),
    success: t("success"),
    error: t("error"),
  };
}
