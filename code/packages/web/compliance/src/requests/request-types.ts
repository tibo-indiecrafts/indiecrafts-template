/**
 * The data-subject rights a visitor can exercise via the request form (GDPR
 * Art. 15–21 + consent withdrawal, Art. 7). Fixed by law — this is the single
 * list the Sanity schema (radio options), the submit validator (allowed set),
 * and the owner-alert email all read.
 *
 * Client-safe: no `server-only`, no Sanity import — the form receives its
 * localized option labels as props from the app, but the KEY set lives here so
 * the record, the validator, and the alert never drift apart.
 */
export const DATA_REQUEST_TYPES = [
  "access",
  "rectification",
  "erasure",
  "restriction",
  "portability",
  "objection",
  "withdraw-consent",
] as const;

export type DataRequestType = (typeof DATA_REQUEST_TYPES)[number];

/** Studio labels (French — the Studio's editor copy) and the French owner alert. */
export const REQUEST_TYPE_LABELS_FR: Record<DataRequestType, string> = {
  access: "Accès",
  rectification: "Rectification",
  erasure: "Effacement",
  restriction: "Limitation du traitement",
  portability: "Portabilité",
  objection: "Opposition",
  "withdraw-consent": "Retrait du consentement",
};

/** Owner-alert labels per locale (the alert follows the site's locale; English otherwise). */
const REQUEST_TYPE_LABELS: Record<string, Record<DataRequestType, string>> = {
  en: {
    access: "Access",
    rectification: "Rectification",
    erasure: "Erasure",
    restriction: "Restriction of processing",
    portability: "Portability",
    objection: "Objection",
    "withdraw-consent": "Consent withdrawal",
  },
  fr: REQUEST_TYPE_LABELS_FR,
};

/** The request-type label for `locale` (English when there is none). */
export function requestTypeLabel(
  type: DataRequestType,
  locale: string,
): string {
  return (REQUEST_TYPE_LABELS[locale] ?? REQUEST_TYPE_LABELS.en!)[type];
}

/** Type guard — is `value` one of the allowed request types? */
export function isDataRequestType(value: unknown): value is DataRequestType {
  return (
    typeof value === "string" &&
    (DATA_REQUEST_TYPES as readonly string[]).includes(value)
  );
}
