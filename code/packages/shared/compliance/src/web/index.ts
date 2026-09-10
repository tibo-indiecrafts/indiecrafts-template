/**
 * `@indiecrafts/packages-shared-compliance/web` — the DOM (shadcn) compliance UI +
 * the `localStorage` store adapter. Next-free, so the `app` web surface AND the
 * so the `app` web surface consumes it. The pure core is in `../shared`.
 */

export { ConsentBanner } from "./ConsentBanner";
export { ConsentPreferences } from "./ConsentPreferences";
export { LegalReacceptancePrompt } from "./LegalReacceptancePrompt";
export { createWebStore } from "./store";
export { browserSignalsDeny, signalsDeny } from "./signals";
export {
  DeleteAccountSection,
  submitAccountErasure,
} from "./DeleteAccountSection";
export type {
  DeleteAccountSectionProps,
  ErasureSelfResult,
} from "./DeleteAccountSection";
export {
  rawErasureFetch,
  mapErasureResponse,
  type ErasureFetchOutcome,
  type ChurnSurveyInput,
} from "../shared/erasure-self";
export { ExportSection } from "./ExportSection";
export type { ExportSectionProps } from "./ExportSection";
export {
  buildDeleteAccountCopy,
  buildExportCopy,
  CHURN_REASON_CODES,
  type ChurnReasonCode,
  type DeleteAccountCopy,
  type DeleteAccountSurveyCopy,
  type ExportCopy,
} from "../shared/account-copy";
export { AccountDataTab, type AccountDataTabProps } from "./AccountDataTab";
export {
  AccountConsentTab,
  type AccountConsentTabProps,
} from "./AccountConsentTab";
export {
  MarketingEmailToggle,
  type MarketingEmailToggleProps,
} from "./MarketingEmailToggle";
export {
  MarketingNudge,
  type MarketingNudgeProps,
  type MarketingNudgeCopy,
} from "./MarketingNudge";
export type { AccountAuth } from "../shared/account-port";
