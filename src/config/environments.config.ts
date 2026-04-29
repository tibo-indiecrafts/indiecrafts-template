/**
 * Environment helpers — typed, reading from standard Next.js env vars.
 *
 * - `Environment` is the explicit set of deploy stages we recognize.
 * - `getCurrentEnvironment()` resolves from NEXT_PUBLIC_ENVIRONMENT then NODE_ENV.
 * - `isProductionLike()` / `isDevelopmentLike()` give two-state helpers for flags.
 * - `getCSPConnectSources(env)` returns a per-env allow-list for
 *   `connect-src` headers.
 *
 * Pattern inspired by wahio/front/src/config/environments.config.ts.
 */

export type Environment = "development" | "test" | "staging" | "production";

export function getCurrentEnvironment(): Environment {
  const explicit = process.env.NEXT_PUBLIC_ENVIRONMENT;
  if (explicit === "staging") return "staging";
  if (explicit === "test") return "test";

  switch (process.env.NODE_ENV) {
    case "production":
      return "production";
    case "test":
      return "test";
    default:
      return "development";
  }
}

export function isProductionLike(env: Environment = getCurrentEnvironment()): boolean {
  return env === "production" || env === "staging";
}

export function isDevelopmentLike(env: Environment = getCurrentEnvironment()): boolean {
  return env === "development" || env === "test";
}

/**
 * Per-environment list of hosts allowed for `connect-src` CSP directive.
 *
 * Local + dev get wildcards for common Next.js/Vercel internals.
 * Production stays tight — extend with your API/analytics hosts.
 */
export function getCSPConnectSources(env: Environment): string[] {
  const common = ["'self'"];
  switch (env) {
    case "development":
    case "test":
      return [
        ...common,
        "ws://localhost:*",
        "http://localhost:*",
        // Next.js dev/HMR + Vercel previews
        "https://*.vercel.app",
      ];
    case "staging":
    case "production":
      return [
        ...common,
        // Add per-project production hosts here (APIs, analytics, CDNs).
      ];
  }
}
