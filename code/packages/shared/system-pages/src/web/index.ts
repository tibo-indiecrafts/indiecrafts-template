/**
 * `@indiecrafts/packages-shared-system-pages/web` — the DOM status pages
 * (Maintenance · 404 · 500). **Next-agnostic** (the 404 home link is injected),
 * so these serve the Next website AND a plain-React host (the Electron renderer).
 */
export { Maintenance } from "./Maintenance";
export { NotFoundContent, type NotFoundContentProps } from "./NotFoundContent";
export { ErrorContent, type ErrorContentProps } from "./ErrorContent";
export { OfflineContent, type OfflineContentProps } from "./OfflineContent";
export * from "../shared";
