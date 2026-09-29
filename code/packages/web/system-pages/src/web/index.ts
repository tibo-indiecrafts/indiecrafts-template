/**
 * `@indiecrafts/packages-web-system-pages/web` — the DOM status pages
 * (Maintenance · 404 · 500). **Next-agnostic** (the 404 home link is injected),
 * so these serve the Next website.
 */
export { Maintenance } from "./Maintenance";
export { NotFoundContent, type NotFoundContentProps } from "./NotFoundContent";
export { ErrorContent, type ErrorContentProps } from "./ErrorContent";
export { OfflineContent, type OfflineContentProps } from "./OfflineContent";
export { OfflineBanner } from "./OfflineBanner";
export { useOnlineStatus } from "./useOnlineStatus";
export * from "../shared";
