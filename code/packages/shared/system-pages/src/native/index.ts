/**
 * `@indiecrafts/packages-shared-system-pages/native` — the React Native status
 * pages (Maintenance · 404 · 500). Same copy contracts as `../web`; the app owns
 * navigation (`onGoHome`/`onRetry`) and themes them at the shell.
 */
export { Maintenance } from "./Maintenance";
export { NotFoundContent, type NotFoundContentProps } from "./NotFoundContent";
export { ErrorContent, type ErrorContentProps } from "./ErrorContent";
export { OfflineContent, type OfflineContentProps } from "./OfflineContent";
export * from "../shared";
