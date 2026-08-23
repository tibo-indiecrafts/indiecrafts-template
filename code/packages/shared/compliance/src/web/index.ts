/**
 * `@indiecrafts/packages-shared-compliance/web` — the DOM (shadcn) compliance UI +
 * the `localStorage` store adapter. Next-free, so the `app` web surface AND the
 * Electron renderer both consume it. The pure core is in `../shared`.
 */

export { ConsentBanner } from "./ConsentBanner";
export { ConsentPreferences } from "./ConsentPreferences";
export { LegalReacceptancePrompt } from "./LegalReacceptancePrompt";
export { createWebStore } from "./store";
export { browserSignalsDeny } from "./signals";
