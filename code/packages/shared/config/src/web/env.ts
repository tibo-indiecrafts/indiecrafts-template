/**
 * Environment detection + the CSP connect-src allowlist — the only functions that
 * read `process.env`, isolated in one file. `getCurrentEnvironment` gates robots +
 * CSP + the logger; `getCSPConnectSources` is consumed by `@indiecrafts/packages-shared-security`.
 */

import type { Environment } from "../shared/types";

const ENVIRONMENTS: readonly Environment[] = [
  "development",
  "staging",
  "test",
  "production",
];

/**
 * Validate an explicit `NEXT_PUBLIC_ENVIRONMENT` against the union. An unknown
 * non-empty value is a config mistake (typo, wrong CI var) — warn loudly instead
 * of silently degrading to `development`, then fall back to `NODE_ENV`.
 */
export function parseEnvironment(
  raw: string | undefined,
): Environment | undefined {
  if (!raw) return undefined;
  if ((ENVIRONMENTS as readonly string[]).includes(raw))
    return raw as Environment;
  console.warn(
    `[config] Ignoring unknown NEXT_PUBLIC_ENVIRONMENT="${raw}" (expected ${ENVIRONMENTS.join(" | ")}); falling back to NODE_ENV.`,
  );
  return undefined;
}

export function getCurrentEnvironment(): Environment {
  const explicit = parseEnvironment(process.env.NEXT_PUBLIC_ENVIRONMENT);
  if (explicit) return explicit;
  switch (process.env.NODE_ENV) {
    case "production":
      return "production";
    case "test":
      return "test";
    default:
      return "development";
  }
}

export function getCSPConnectSources(env: Environment): readonly string[] {
  // Sanity Studio at /studio needs to reach the project API + CDN.
  // Safe to leave in prod CSP: the wildcard is locked to *.sanity.io.
  //
  // `registry.npmjs.org` — the embedded Studio polls npm for its own
  // package version ("you're running an outdated Studio" check). Not
  // critical, but without this entry the dev console fills with
  // `TypeError: Failed to fetch` from CSP blocking the request.
  const sanity = ["https://*.sanity.io", "wss://*.api.sanity.io"];
  const npm = ["https://registry.npmjs.org"];
  // The AI agent Worker — the browser fetches it cross-origin (ContentResearchAgent), so
  // its origin must be allowed in prod too (dev is covered by `http://localhost:*` below).
  const agent = process.env.NEXT_PUBLIC_AGENT_URL
    ? [process.env.NEXT_PUBLIC_AGENT_URL]
    : [];
  const common = ["'self'", ...sanity, ...npm, ...agent];
  if (env === "development" || env === "test") {
    return [
      ...common,
      "ws://localhost:*",
      "http://localhost:*",
      "https://*.vercel.app",
    ];
  }
  return common;
}
