/**
 * The copy contracts for the shared account sections + pure builders that assemble
 * them from a namespace-scoped translator. Lives in `shared` (no React) so the
 * `web`/`native` section components AND the builders reference one type. Each surface
 * passes a `t` already scoped to `account.delete` / `account.export`, so `t("heading")`
 * resolves the right string regardless of its i18n runtime (next-intl / react-intl).
 */

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
