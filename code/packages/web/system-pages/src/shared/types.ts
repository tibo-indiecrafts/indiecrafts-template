/**
 * The platform-agnostic **copy contracts** for the status pages — the props an app
 * resolves (from `messages`/Sanity) and passes in. No React/DOM here; the `../web`
 * renderers extend these with their own nav.
 */

export type MaintenanceProps = {
  statusLabel: string;
  title: string;
  body: string;
  contactLabel: string;
  name: string;
  email?: string;
};

export type NotFoundContentProps = {
  eyebrow: string;
  title: string;
  description: string;
  homeLabel: string;
};

export type ErrorContentProps = {
  title: string;
  description: string;
  retryLabel: string;
  /** Retry callback (platform-agnostic). */
  onRetry?: () => void;
};

export type OfflineContentProps = {
  title: string;
  description: string;
  retryLabel: string;
  /** Retry callback — the app re-checks connectivity / refetches. */
  onRetry?: () => void;
};
