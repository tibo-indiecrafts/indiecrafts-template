/**
 * `@indiecrafts/packages-shared-compliance/shared` — the PLATFORM-AGNOSTIC compliance
 * core: the consent decision math + store contract + default taxonomy, the consent
 * signal constants/types, and the legal-route contract. Pure TS, zero DOM/Sanity/next
 * coupling — safe to import from web or Expo. The forked UI lives in
 * `../web` (shadcn DOM) and `../native` (React Native).
 */

export {
  CONSENT_SIGNALS,
  type ConsentSignal,
  type ConsentCategory,
  type CookieRow,
  type CookieConsent,
} from "./consent-signals";

export {
  type ConsentRecord,
  type Store,
  type ConsentStore,
  type ConsentCategoryDef,
  type ConsentBannerCopy,
  grantedKeys,
  consentUpdate,
  DEFAULT_CONSENT_CATEGORIES,
  resolveCategories,
  acceptAllChoices,
  rejectAllChoices,
} from "./consent";

export {
  LEGAL_PAGES,
  LEGAL_PAGE_KEYS,
  type LegalPageKey,
  legalUrl,
  type LegalAcceptanceRecord,
  type LegalReacceptanceCopy,
  needsReacceptance,
} from "./legal";

export {
  type ConsentMode,
  type Regulation,
  type ConsentConfig,
  REGULATIONS,
  CONSENT_REGIONS,
  TERRITORIES,
  resolveRegulation,
  resolveConsentMode,
} from "./regions";

export {
  runErasure,
  runExport,
  type ErasureAdapter,
  type AdapterMatch,
  type AdapterPreview,
  type AdapterResult,
  type ErasureMode,
  type ErasureReceipt,
  type ExportBundle,
} from "./erasure";

export {
  submitAccountErasure,
  rawErasureFetch,
  mapErasureResponse,
  type ErasureSelfResult,
  type ErasureFetchOutcome,
} from "./erasure-self";

export { requestExport, type ExportResult } from "./export-self";

export {
  buildDeleteAccountCopy,
  buildExportCopy,
  type DeleteAccountCopy,
  type ExportCopy,
} from "./account-copy";
